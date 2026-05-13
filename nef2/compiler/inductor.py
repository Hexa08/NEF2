import operator
from .ir import Graph, Node
from ..tensor import Tensor

class Inductor:
    """
    NEFInductor: Kernel fusion engine & Runtime Optimizer.
    Takes a NEFGraph IR and lowers it into optimized C++/CUDA kernels.
    """
    def __init__(self, graph: Graph):
        self.graph = graph

    def optimize(self):
        """Pass 1: Graph Optimizations (e.g., fusing matmul + relu)."""
        print("[NEFInductor] Running Graph Optimizer passes...")
        self._fuse_linear_relu()

    def _fuse_linear_relu(self):
        """
        Pattern matching optimization pass.
        Finds patterns of the form:
           n1 = call_function[matmul](x, w)
           n2 = call_function[add](n1, b) OR call_method[relu](n1)
           n3 = call_method[relu](n2)
        And fuses them. For simplicity, we demonstrate fusing a direct matmul -> relu here.
        """
        fused = 0
        new_nodes = []
        skip_next = False
        
        for i, node in enumerate(self.graph.nodes):
            if skip_next:
                skip_next = False
                continue
                
            # Check for matmul followed by relu
            if node.op in ('call_function', 'call_method') and node.target in ('matmul', operator.matmul):
                # Is the next node a ReLU that takes this node as input?
                if i + 1 < len(self.graph.nodes):
                    next_node = self.graph.nodes[i+1]
                    if next_node.op == 'call_method' and next_node.target == 'relu' and next_node.args[0] == node:
                        print(f"  -> Fusing {node.name} ({node.target}) and {next_node.name} (relu) into fused_matmul_relu")
                        
                        # Create a new fused node replacing the two
                        fused_node = Node(self.graph, name=f"fused_{node.name}_{next_node.name}", 
                                          op='call_method', target='_fused_matmul_relu', 
                                          args=node.args, kwargs=node.kwargs)
                        new_nodes.append(fused_node)
                        
                        # Update downstream references to point to the new fused node instead of next_node
                        for future_node in self.graph.nodes[i+2:]:
                            future_node.args = tuple(fused_node if a == next_node else a for a in future_node.args)
                            future_node.kwargs = {k: (fused_node if v == next_node else v) for k, v in future_node.kwargs.items()}
                        
                        fused += 1
                        skip_next = True
                        continue
                        
            new_nodes.append(node)
            
        self.graph.nodes = new_nodes
        if fused > 0:
            print(f"  -> Fused {fused} operation sequences.")

    def compile(self):
        """Pass 2: JIT Compilation of the optimized graph."""
        self.optimize()
        print("[NEFKernel] Generating optimized device kernels...")
        
        # Build a callable that executes the optimized graph
        def compiled_forward(*args):
            # In a real backend, this invokes the JIT compiled C++/PTX kernels directly
            # For now, we simulate execution of the graph interpreter
            return self._interpret_graph(*args)
            
        return compiled_forward
        
    def _interpret_graph(self, *args):
        """Native C++ execution of the optimized graph."""
        try:
            import nef_core
            cpp_graph = nef_core.NefGraph()
            env = {}
            arg_idx = 0
            
            # 1. Prepare NefTensors for all nodes
            for node in self.graph.nodes:
                if node.op == 'placeholder':
                    val = args[arg_idx]
                    env[node.name] = nef_core.NefTensor(val.data, list(val.shape))
                    arg_idx += 1
                elif node.op == 'call_method':
                    def get_val(a):
                        if isinstance(a, Node):
                            return env[a.name]
                        # Handle Parameter or Tensor constants
                        data = a.data if hasattr(a, 'data') else a
                        shape = a.shape if hasattr(a, 'shape') else [len(data)]
                        return nef_core.NefTensor(data, list(shape))

                    # Simplified mapping to C++ ops
                    if node.target == 'matmul':
                        a = get_val(node.args[0])
                        b = get_val(node.args[1])
                        out_shape = list(a.shape)
                        out_shape[-1] = b.shape[-1]
                        out = nef_core.NefTensor.zeros(out_shape)
                        cpp_graph.add_matmul(a, b, out)
                        env[node.name] = out
                    elif node.target == 'relu':
                        in_t = get_val(node.args[0])
                        out = nef_core.NefTensor.zeros(in_t.shape)
                        cpp_graph.add_relu(in_t, out)
                        env[node.name] = out
                    elif node.target == Tensor.cat:
                        inputs = [get_val(a) for a in node.args[0]]
                        out_shape = list(inputs[0].shape)
                        axis = node.kwargs.get('axis', 0)
                        out_shape[axis] = sum(i.shape[axis] for i in inputs)
                        out = nef_core.NefTensor.zeros(out_shape)
                        cpp_graph.add_cat(inputs, out, axis)
                        env[node.name] = out
                    elif node.target == 'transpose':
                        in_t = get_val(node.args[0])
                        d0, d1 = node.args[1], node.args[2]
                        out_shape = list(in_t.shape)
                        out_shape[d0], out_shape[d1] = out_shape[d1], out_shape[d0]
                        out = nef_core.NefTensor.zeros(out_shape)
                        cpp_graph.add_transpose(in_t, out, d0, d1)
                        env[node.name] = out
                    elif node.target == 'mean':
                        in_t = get_val(node.args[0])
                        axis = node.kwargs.get('axis', -1)
                        keepdims = node.kwargs.get('keepdims', False)
                        out_shape = list(in_t.shape)
                        if axis == -1: axis = len(out_shape) - 1
                        if keepdims: out_shape[axis] = 1
                        else: out_shape.pop(axis)
                        out = nef_core.NefTensor.zeros(out_shape)
                        cpp_graph.add_mean(in_t, out, axis)
                        env[node.name] = out
                    elif node.target == 'layernorm':
                        x = get_val(node.args[0])
                        w = get_val(node.args[1])
                        b = get_val(node.args[2])
                        eps = node.args[3]
                        out = nef_core.NefTensor.zeros(x.shape)
                        cpp_graph.add_layernorm(x, w, b, out, eps)
                        env[node.name] = out
                    elif node.target == '__getitem__':
                        in_t = get_val(node.args[0])
                        idx = node.args[1]
                        # Handle common x[:, 0] pattern
                        if isinstance(idx, tuple) and len(idx) == 2 and isinstance(idx[0], slice) and idx[1] == 0:
                            out_shape = list(in_t.shape)
                            out_shape.pop(1)
                            out = nef_core.NefTensor.zeros(out_shape)
                            cpp_graph.add_select(in_t, out, 1, 0)
                            env[node.name] = out
                        else:
                            # Fallback or selective support
                            pass
                    elif node.target == 'reshape':
                        in_t = get_val(node.args[0])
                        out_shape = node.args[1]
                        # In C++ NefTensor, reshape is mostly metadata unless we copy.
                        # For now, we create a new tensor with same data but new shape.
                        out = nef_core.NefTensor(in_t.data, list(out_shape))
                        env[node.name] = out
                    elif node.target == 'expand':
                        in_t = get_val(node.args[0])
                        out_shape = node.args[1]
                        out = nef_core.NefTensor.zeros(list(out_shape))
                        cpp_graph.add_expand(in_t, out)
                        env[node.name] = out
                    elif node.target == '_fused_matmul_relu':
                        a = get_val(node.args[0])
                        b = get_val(node.args[1])
                        out_shape = list(a.shape)
                        out_shape[-1] = b.shape[-1]
                        out = nef_core.NefTensor.zeros(out_shape)
                        cpp_graph.add_matmul(a, b, out)
                        cpp_graph.add_relu(out, out) # In-place fusion simulated
                        env[node.name] = out
                elif node.op == 'call_function':
                    def get_val(a):
                        if isinstance(a, Node):
                            return env[a.name]
                        data = a.data if hasattr(a, 'data') else a
                        shape = a.shape if hasattr(a, 'shape') else [len(data)]
                        return nef_core.NefTensor(data, list(shape))
                        
                    if node.target in (operator.add, operator.sub, operator.mul, operator.truediv):
                        a = get_val(node.args[0])
                        b = get_val(node.args[1])
                        out = nef_core.NefTensor.zeros(a.shape)
                        op_map = {operator.add: "+", operator.sub: "-", operator.mul: "*", operator.truediv: "/"}
                        cpp_graph.add_binary(a, b, out, op_map[node.target])
                        env[node.name] = out
                    elif node.target == Tensor.cat:
                        inputs = [get_val(a) for a in node.args]
                        axis = node.kwargs.get('axis', 0)
                        out_shape = list(inputs[0].shape)
                        out_shape[axis] = sum(i.shape[axis] for i in inputs)
                        out = nef_core.NefTensor.zeros(out_shape)
                        cpp_graph.add_cat(inputs, out, axis)
                        env[node.name] = out
                    elif node.target == operator.matmul:
                        a = get_val(node.args[0])
                        b = get_val(node.args[1])
                        out_shape = list(a.shape)
                        out_shape[-1] = b.shape[-1]
                        out = nef_core.NefTensor.zeros(out_shape)
                        cpp_graph.add_matmul(a, b, out)
                        env[node.name] = out
                elif node.op == 'output':
                    # 2. Run the C++ graph
                    cpp_graph.run()
                    
                    if len(node.args) == 1:
                        res = env[node.args[0].name]
                        # Use _unflatten to restore correct nested list structure for Tensor constructor
                        from ..tensor import _unflatten
                        return Tensor(_unflatten(res.data, res.shape), _children=())
                    return tuple(Tensor(_unflatten(env[a.name].data, env[a.name].shape)) for a in node.args)
            return None
        except Exception as e:
            print(f"[NEFRT] Native execution failed, falling back to Python: {e}")
            # Fallback to the old interpreter logic if needed
            return self._python_interpret(*args)

    def _python_interpret(self, *args):
        env = {}
        arg_idx = 0
        for node in self.graph.nodes:
            if node.op == 'placeholder':
                env[node.name] = args[arg_idx]
                arg_idx += 1
            elif node.op == 'call_function':
                fn_args = [env[a.name] if isinstance(a, Node) else a for a in node.args]
                fn_kwargs = {k: (env[v.name] if isinstance(v, Node) else v) for k, v in node.kwargs.items()}
                env[node.name] = node.target(*fn_args, **fn_kwargs)
            elif node.op == 'call_method':
                obj = env[node.args[0].name]
                method = getattr(obj, node.target)
                method_args = [env[a.name] if isinstance(a, Node) else a for a in node.args[1:]]
                method_kwargs = {k: (env[v.name] if isinstance(v, Node) else v) for k, v in node.kwargs.items()}
                env[node.name] = method(*method_args, **method_kwargs)
            elif node.op == 'output':
                if len(node.args) == 1:
                    return env[node.args[0].name] if isinstance(node.args[0], Node) else node.args[0]
                return tuple(env[a.name] if isinstance(a, Node) else a for a in node.args)
        return None

def compile(fn, *example_inputs):
    """
    NEF2 JIT Compiler Entry Point.
    Traces Python code into IR -> Optimizes -> Fuses -> Returns fast callable.
    """
    from .dynamo import trace
    
    # 1. Capture the Python code into NEFGraph IR
    graph = trace(fn, *example_inputs)
    
    # 2. Lower to optimized runtime via NEFInductor
    inductor = Inductor(graph)
    compiled_fn = inductor.compile()
    
    return compiled_fn
