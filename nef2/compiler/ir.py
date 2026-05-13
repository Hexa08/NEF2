class Node:
    """NEFGraph IR Node representing a single operation."""
    def __init__(self, graph, name, op, target, args, kwargs):
        self.graph = graph
        self.name = name
        self.op = op          # 'placeholder', 'call_function', 'call_method', 'call_module', 'output'
        self.target = target  # The actual function, method name, or module reference
        self.args = args      # Tuple of arguments (can contain other Nodes)
        self.kwargs = kwargs  # Dict of kwargs

    def __repr__(self):
        target_name = self.target.__name__ if hasattr(self.target, '__name__') else self.target
        args_repr = ", ".join(f"%{a.name}" if isinstance(a, Node) else str(a) for a in self.args)
        kw_repr = ", ".join(f"{k}={v.name if isinstance(v, Node) else v}" for k, v in self.kwargs.items())
        all_args = ", ".join(filter(None, [args_repr, kw_repr]))
        
        if self.op == 'placeholder':
            return f"%{self.name} = [input]"
        if self.op == 'output':
            return f"return {all_args}"
            
        return f"%{self.name} = {self.op}[{target_name}]({all_args})"

class Graph:
    """NEFGraph IR: Unified intermediate representation for models."""
    def __init__(self):
        self.nodes = []

    def create_node(self, op, target, args=(), kwargs=None, name=None):
        if kwargs is None: kwargs = {}
        if name is None: name = f"n{len(self.nodes)}"
        node = Node(self, name, op, target, args, kwargs)
        self.nodes.append(node)
        return node

    def print_tabular(self):
        """Prints the IR Graph for debugging and inspection."""
        print("--- NEFGraph IR ---")
        for node in self.nodes:
            print(node)
        print("-------------------")
