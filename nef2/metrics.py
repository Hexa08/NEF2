class Metric:
    def update(self, *args, **kwargs):
        raise NotImplementedError

    def compute(self):
        raise NotImplementedError

    def reset(self):
        raise NotImplementedError


class Accuracy(Metric):
    def __init__(self, cpp_graph=None):
        self.correct = 0
        self.total = 0
        self.cpp_graph = cpp_graph

    def update(self, logits, targets):
        if self.cpp_graph is not None:
            import nef_core
            l_cpp = nef_core.NefTensor(logits.data, list(logits.shape))
            t_cpp = nef_core.NefTensor(targets.data, list(targets.shape))
            self.cpp_graph.add_accuracy(l_cpp, t_cpp)
            return

        batch_size = targets.shape[0] if targets.shape else 1
        classes = logits.shape[-1]
        
        for i in range(batch_size):
            target = int(targets.data[i])
            start = i * classes
            row = logits.data[start:start+classes]
            pred = row.index(max(row))
            if pred == target:
                self.correct += 1
            self.total += 1

    def compute(self):
        if self.cpp_graph is not None:
            return self.cpp_graph.get_accuracy()
        return self.correct / max(1, self.total)

    def reset(self):
        if self.cpp_graph is not None:
            self.cpp_graph.reset_metrics()
        self.correct = 0
        self.total = 0
