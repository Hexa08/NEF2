import nef2
from nef2.nn import Module, Parameter
import nef_core
from .models import VisionTransformer, TransformerBlock

class Conv2d(Module):
    def __init__(self, in_channels, out_channels, kernel_size, stride=1, padding=0):
        super().__init__()
        self.in_channels = in_channels
        self.out_channels = out_channels
        self.kernel_size = kernel_size if isinstance(kernel_size, tuple) else (kernel_size, kernel_size)
        self.stride = stride
        self.padding = padding
        self.weight = Parameter(nef2.Tensor.randn((out_channels, in_channels, *self.kernel_size)))
        self.bias = Parameter(nef2.Tensor.zeros((out_channels,)))

    def forward(self, x):
        # x: (B, C, H, W)
        res = nef_core.fast_conv2d(x.data, x.shape, self.weight.data, self.weight.shape, self.stride, self.padding)
        out_h = (x.shape[2] + 2 * self.padding - self.kernel_size[0]) // self.stride + 1
        out_w = (x.shape[3] + 2 * self.padding - self.kernel_size[1]) // self.stride + 1
        out_shape = (x.shape[0], self.out_channels, out_h, out_w)
        return nef2.Tensor(res).reshape(out_shape)

class MaxPool2d(Module):
    def __init__(self, kernel_size, stride=None):
        super().__init__()
        self.kernel_size = kernel_size if isinstance(kernel_size, tuple) else (kernel_size, kernel_size)
        self.stride = stride if stride is not None else self.kernel_size[0]

    def forward(self, x):
        res = nef_core.fast_maxpool2d(x.data, x.shape, self.kernel_size[0], self.kernel_size[1], self.stride)
        out_h = (x.shape[2] - self.kernel_size[0]) // self.stride + 1
        out_w = (x.shape[3] - self.kernel_size[1]) // self.stride + 1
        out_shape = (x.shape[0], x.shape[1], out_h, out_w)
        return nef2.Tensor(res).reshape(out_shape)

class ResNetBlock(Module):
    def __init__(self, channels):
        super().__init__()
        self.conv1 = Conv2d(channels, channels, 3, padding=1)
        self.conv2 = Conv2d(channels, channels, 3, padding=1)

    def forward(self, x):
        identity = x
        out = self.conv1(x).relu()
        out = self.conv2(out)
        return (out + identity).relu()

__all__ = ["Conv2d", "MaxPool2d", "ResNetBlock", "VisionTransformer", "TransformerBlock"]
