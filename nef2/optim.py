import math


class Optimizer:
    def __init__(self, params):
        self.params = list(params)

    def zero_grad(self):
        for param in self.params:
            param.grad = [0.0 for _ in param.data]


class SGD(Optimizer):
    def __init__(self, params, lr=1e-2):
        super().__init__(params)
        self.lr = lr

    def step(self):
        for param in self.params:
            if param.grad is None:
                continue
            param.data = [value - self.lr * grad for value, grad in zip(param.data, param.grad)]


class AdamW(Optimizer):
    def __init__(self, params, lr=1e-3, betas=(0.9, 0.999), eps=1e-8, weight_decay=0.0):
        super().__init__(params)
        self.lr = lr
        self.beta1, self.beta2 = betas
        self.eps = eps
        self.weight_decay = weight_decay
        self.t = 0
        self.m = [[0.0 for _ in p.data] for p in self.params]
        self.v = [[0.0 for _ in p.data] for p in self.params]

    def step(self):
        self.t += 1
        for i, param in enumerate(self.params):
            if param.grad is None:
                continue
            for j, grad in enumerate(param.grad):
                if self.weight_decay:
                    grad += self.weight_decay * param.data[j]
                self.m[i][j] = self.beta1 * self.m[i][j] + (1.0 - self.beta1) * grad
                self.v[i][j] = self.beta2 * self.v[i][j] + (1.0 - self.beta2) * grad * grad
                mh = self.m[i][j] / (1.0 - self.beta1**self.t)
                vh = self.v[i][j] / (1.0 - self.beta2**self.t)
                param.data[j] -= self.lr * mh / (math.sqrt(vh) + self.eps)


class CudaSGD(Optimizer):
    def __init__(self, params, lr=1e-2):
        super().__init__(params)
        self.lr = lr
        self._device_params = {}

    def step(self):
        from . import gpu

        for param in self.params:
            if param.grad is None:
                continue
            pid = id(param)
            if pid not in self._device_params:
                self._device_params[pid] = gpu.tensor(param.data)
            else:
                self._device_params[pid].copy_from_host(param.data)
            device_grad = gpu.tensor(param.grad)
            gpu.sgd_step_(self._device_params[pid], device_grad, self.lr)
            param.data = self._device_params[pid].tolist()
