import operator
from .ir import Graph
from ..tensor import Tensor, _prod

class ProxyTensor:
    """
    A fake Tensor that records operations into the NEFGraph IR 
    instead of computing them. Used by NEFDynamo for tracing.
    """
    def __init__(self, node, shape=None):
        self.node = node
        self.shape = shape or ()

    def _binary_op(self, other, op_func, op_name):
        other_node = other.node if isinstance(other, ProxyTensor) else other
        
        # Simple shape inference for binary ops
        out_shape = self.shape
        if isinstance(other, ProxyTensor):
            # Very simple broadcast-ish inference
            if len(other.shape) > len(out_shape):
                out_shape = other.shape
        
        new_node = self.node.graph.create_node('call_function', op_func, (self.node, other_node))
        return ProxyTensor(new_node, shape=out_shape)

    def __add__(self, other): return self._binary_op(other, operator.add, "+")
    def __sub__(self, other): return self._binary_op(other, operator.sub, "-")
    def __mul__(self, other): return self._binary_op(other, operator.mul, "*")
    def __truediv__(self, other): return self._binary_op(other, operator.truediv, "/")
    def __matmul__(self, other): 
        # (B, M, K) @ (B, K, N) -> (B, M, N)
        other_shape = other.shape if isinstance(other, ProxyTensor) else getattr(other, 'shape', ())
        out_shape = list(self.shape)
        if len(out_shape) >= 2 and len(other_shape) >= 2:
            out_shape[-1] = other_shape[-1]
        new_node = self.node.graph.create_node('call_function', operator.matmul, (self.node, other.node if isinstance(other, ProxyTensor) else other))
        return ProxyTensor(new_node, shape=tuple(out_shape))
    
    def matmul(self, other):
        return self.__matmul__(other)

    def relu(self):
        new_node = self.node.graph.create_node('call_method', 'relu', (self.node,))
        return ProxyTensor(new_node, shape=self.shape)
        
    def sum(self, axis=None, keepdims=False):
        # Shape inference for sum
        if axis is None:
            out_shape = (1,) if keepdims else ()
        else:
            out_shape = list(self.shape)
            if keepdims:
                out_shape[axis] = 1
            else:
                out_shape.pop(axis)
        new_node = self.node.graph.create_node('call_method', 'sum', (self.node,), {'axis': axis, 'keepdims': keepdims})
        return ProxyTensor(new_node, shape=tuple(out_shape))
        
    def reshape(self, shape):
        shape = list(shape)
        if -1 in shape:
            idx = shape.index(-1)
            total = _prod(self.shape)
            other = _prod([s for s in shape if s != -1])
            shape[idx] = total // other
        new_node = self.node.graph.create_node('call_method', 'reshape', (self.node, tuple(shape)))
        return ProxyTensor(new_node, shape=tuple(shape))

    def mean(self, axis=None, keepdims=False):
        # Shape inference for mean
        if axis is None:
            out_shape = (1,) if keepdims else ()
        else:
            out_shape = list(self.shape)
            if keepdims:
                out_shape[axis] = 1
            else:
                out_shape.pop(axis)
        new_node = self.node.graph.create_node('call_method', 'mean', (self.node,), {'axis': axis, 'keepdims': keepdims})
        return ProxyTensor(new_node, shape=tuple(out_shape))

    @property
    def data(self):
        # Return a dummy list of same size for tracing loops
        return [0.0] * _prod(self.shape)

    def __getitem__(self, idx):
        # Record indexing
        new_node = self.node.graph.create_node('call_method', '__getitem__', (self.node, idx))
        # Simplified shape inference for indexing
        return ProxyTensor(new_node, shape=()) 

    def expand(self, shape):
        shape = list(shape)
        if -1 in shape:
            idx = shape.index(-1)
            total = _prod(self.shape) # This might be wrong for expand, but let's assume total items?
            # Actually for expand, -1 means keep original dim size
            for i, s in enumerate(shape):
                if s == -1:
                    shape[i] = self.shape[i + (len(self.shape) - len(shape))]
        new_node = self.node.graph.create_node('call_method', 'expand', (self.node, tuple(shape)))
        return ProxyTensor(new_node, shape=tuple(shape))

class Tracer:
    """NEFDynamo: The graph capture system."""
    def __init__(self):
        self.graph = Graph()

    def create_proxy(self, op, target, args=(), kwargs=None, name=None, shape=None):
        node = self.graph.create_node(op, target, args, kwargs, name)
        return ProxyTensor(node, shape=shape)

    def trace(self, fn, *example_inputs):
        """Traces a function or module into a NEFGraph IR."""
        print(f"[NEFDynamo] Capturing execution graph for {fn.__class__.__name__ if hasattr(fn, '__class__') else fn.__name__}...")
        
        # 1. Create placeholders for inputs
        proxy_args = []
        for i, arg in enumerate(example_inputs):
            name = f'arg_{i}'
            shape = arg.shape if isinstance(arg, Tensor) else None
            proxy_args.append(self.create_proxy('placeholder', 'input', name=name, kwargs={'shape': shape}, shape=shape))
            
        # 2. Execute the function with ProxyTensors
        out = fn(*proxy_args)
        
        # 3. Register outputs
        if isinstance(out, ProxyTensor):
            self.graph.create_node('output', 'output', (out.node,))
        elif isinstance(out, (list, tuple)):
            out_nodes = tuple(o.node if isinstance(o, ProxyTensor) else o for o in out)
            self.graph.create_node('output', 'output', (out_nodes,))
            
        print("[NEFDynamo] Graph capture complete.")
        return self.graph

def trace(fn, *example_inputs):
    """Entry point for NEFDynamo capture."""
    tracer = Tracer()
    return tracer.trace(fn, *example_inputs)
