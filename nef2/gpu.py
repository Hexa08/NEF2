import ctypes
import os
from contextlib import contextmanager


_PTX = r"""
.version 6.4
.target sm_52
.address_size 64

.visible .entry vadd(.param .u64 a, .param .u64 b, .param .u64 out, .param .u32 n)
{
    .reg .pred %p;
    .reg .b32 %r<6>;
    .reg .b64 %rd<8>;
    .reg .f32 %f<4>;
    ld.param.u64 %rd1, [a];
    ld.param.u64 %rd2, [b];
    ld.param.u64 %rd3, [out];
    ld.param.u32 %r4, [n];
    mov.u32 %r1, %tid.x;
    mov.u32 %r2, %ctaid.x;
    mov.u32 %r3, %ntid.x;
    mad.lo.s32 %r5, %r2, %r3, %r1;
    setp.ge.u32 %p, %r5, %r4;
    @%p bra done_add;
    mul.wide.u32 %rd4, %r5, 4;
    add.s64 %rd5, %rd1, %rd4;
    add.s64 %rd6, %rd2, %rd4;
    add.s64 %rd7, %rd3, %rd4;
    ld.global.f32 %f1, [%rd5];
    ld.global.f32 %f2, [%rd6];
    add.f32 %f3, %f1, %f2;
    st.global.f32 [%rd7], %f3;
done_add:
    ret;
}

.visible .entry vmul(.param .u64 a, .param .u64 b, .param .u64 out, .param .u32 n)
{
    .reg .pred %p;
    .reg .b32 %r<6>;
    .reg .b64 %rd<8>;
    .reg .f32 %f<4>;
    ld.param.u64 %rd1, [a];
    ld.param.u64 %rd2, [b];
    ld.param.u64 %rd3, [out];
    ld.param.u32 %r4, [n];
    mov.u32 %r1, %tid.x;
    mov.u32 %r2, %ctaid.x;
    mov.u32 %r3, %ntid.x;
    mad.lo.s32 %r5, %r2, %r3, %r1;
    setp.ge.u32 %p, %r5, %r4;
    @%p bra done_mul;
    mul.wide.u32 %rd4, %r5, 4;
    add.s64 %rd5, %rd1, %rd4;
    add.s64 %rd6, %rd2, %rd4;
    add.s64 %rd7, %rd3, %rd4;
    ld.global.f32 %f1, [%rd5];
    ld.global.f32 %f2, [%rd6];
    mul.f32 %f3, %f1, %f2;
    st.global.f32 [%rd7], %f3;
done_mul:
    ret;
}

.visible .entry vsgd(.param .u64 param, .param .u64 grad, .param .f32 lr, .param .u32 n)
{
    .reg .pred %p;
    .reg .b32 %r<6>;
    .reg .b64 %rd<7>;
    .reg .f32 %f<4>;
    ld.param.u64 %rd1, [param];
    ld.param.u64 %rd2, [grad];
    ld.param.f32 %f1, [lr];
    ld.param.u32 %r4, [n];
    mov.u32 %r1, %tid.x;
    mov.u32 %r2, %ctaid.x;
    mov.u32 %r3, %ntid.x;
    mad.lo.s32 %r5, %r2, %r3, %r1;
    setp.ge.u32 %p, %r5, %r4;
    @%p bra done_sgd;
    mul.wide.u32 %rd3, %r5, 4;
    add.s64 %rd4, %rd1, %rd3;
    add.s64 %rd5, %rd2, %rd3;
    ld.global.f32 %f2, [%rd4];
    ld.global.f32 %f3, [%rd5];
    mul.f32 %f3, %f1, %f3;
    sub.f32 %f2, %f2, %f3;
    st.global.f32 [%rd4], %f2;
done_sgd:
    ret;
}

.visible .entry vfill(.param .u64 out, .param .f32 value, .param .u32 n)
{
    .reg .pred %p;
    .reg .b32 %r<6>;
    .reg .b64 %rd<4>;
    .reg .f32 %f<2>;
    ld.param.u64 %rd1, [out];
    ld.param.f32 %f1, [value];
    ld.param.u32 %r4, [n];
    mov.u32 %r1, %tid.x;
    mov.u32 %r2, %ctaid.x;
    mov.u32 %r3, %ntid.x;
    mad.lo.s32 %r5, %r2, %r3, %r1;
    setp.ge.u32 %p, %r5, %r4;
    @%p bra done_fill;
    mul.wide.u32 %rd2, %r5, 4;
    add.s64 %rd3, %rd1, %rd2;
    st.global.f32 [%rd3], %f1;
done_fill:
    ret;
}
"""


class CudaError(RuntimeError):
    pass


def _check(code, name):
    if code != 0:
        raise CudaError("%s failed with CUDA error code %s" % (name, code))


class UnsupportedGpuBackend(CudaError):
    pass


class _CudaRuntime:
    def __init__(self, index=0):
        self.index = index
        self.cuda = ctypes.WinDLL("nvcuda.dll")
        self.count = ctypes.c_int()
        self.device = ctypes.c_int()
        self.context = ctypes.c_void_p()
        self.module = ctypes.c_void_p()
        _check(self.cuda.cuInit(0), "cuInit")
        _check(self.cuda.cuDeviceGetCount(ctypes.byref(self.count)), "cuDeviceGetCount")
        if index < 0 or index >= self.count.value:
            raise CudaError("CUDA device index %s is out of range" % index)
        _check(self.cuda.cuDeviceGet(ctypes.byref(self.device), index), "cuDeviceGet")
        _check(self.cuda.cuCtxCreate_v2(ctypes.byref(self.context), 0, self.device), "cuCtxCreate")
        ptx = ctypes.create_string_buffer(_PTX.encode("utf-8"))
        _check(self.cuda.cuModuleLoadData(ctypes.byref(self.module), ptx), "cuModuleLoadData")
        self.functions = {}

    def name(self):
        buf = ctypes.create_string_buffer(128)
        _check(self.cuda.cuDeviceGetName(buf, len(buf), self.device), "cuDeviceGetName")
        return buf.value.decode("utf-8")

    def total_memory(self):
        total = ctypes.c_size_t()
        _check(self.cuda.cuDeviceTotalMem_v2(ctypes.byref(total), self.device), "cuDeviceTotalMem")
        return int(total.value)

    def mem_alloc(self, nbytes):
        ptr = ctypes.c_uint64()
        _check(self.cuda.cuMemAlloc_v2(ctypes.byref(ptr), ctypes.c_size_t(nbytes)), "cuMemAlloc")
        return ptr.value

    def mem_free(self, ptr):
        if ptr:
            _check(self.cuda.cuMemFree_v2(ctypes.c_uint64(ptr)), "cuMemFree")

    def copy_htod(self, dst, values):
        arr = (ctypes.c_float * len(values))(*[float(v) for v in values])
        _check(
            self.cuda.cuMemcpyHtoD_v2(ctypes.c_uint64(dst), arr, ctypes.c_size_t(4 * len(values))),
            "cuMemcpyHtoD",
        )

    def copy_dtoh(self, src, n):
        arr = (ctypes.c_float * n)()
        _check(
            self.cuda.cuMemcpyDtoH_v2(arr, ctypes.c_uint64(src), ctypes.c_size_t(4 * n)),
            "cuMemcpyDtoH",
        )
        return [float(arr[i]) for i in range(n)]

    def function(self, name):
        if name not in self.functions:
            fn = ctypes.c_void_p()
            _check(
                self.cuda.cuModuleGetFunction(ctypes.byref(fn), self.module, name.encode("utf-8")),
                "cuModuleGetFunction",
            )
            self.functions[name] = fn
        return self.functions[name]

    def launch(self, name, args, n):
        block = 256
        grid = (n + block - 1) // block
        packed = []
        for kind, value in args:
            if kind == "u64":
                packed.append(ctypes.c_uint64(value))
            elif kind == "u32":
                packed.append(ctypes.c_uint32(value))
            elif kind == "f32":
                packed.append(ctypes.c_float(value))
            else:
                raise ValueError("unknown kernel arg kind: %s" % kind)
        argv = (ctypes.c_void_p * len(packed))(
            *[ctypes.cast(ctypes.byref(item), ctypes.c_void_p) for item in packed]
        )
        _check(
            self.cuda.cuLaunchKernel(
                self.function(name), grid, 1, 1, block, 1, 1, 0, None, argv, None
            ),
            "cuLaunchKernel",
        )
        _check(self.cuda.cuCtxSynchronize(), "cuCtxSynchronize")


_RUNTIMES = {}
_CURRENT_DEVICE = 0


def runtime(index=None):
    if os.name != "nt":
        raise CudaError("NEF2 CUDA backend currently supports Windows nvcuda.dll.")
    if index is None:
        index = _CURRENT_DEVICE
    if index not in _RUNTIMES:
        _RUNTIMES[index] = _CudaRuntime(index)
    return _RUNTIMES[index]


def cuda_available():
    try:
        runtime()
        return True
    except Exception:
        return False


def device_count():
    try:
        return runtime(0).count.value
    except Exception:
        return 0


def list_devices():
    devices = []
    for index in range(device_count()):
        rt = runtime(index)
        devices.append(
            {
                "index": index,
                "name": rt.name(),
                "memory_bytes": rt.total_memory(),
                "backend": "cuda",
            }
        )
    return devices


def current_device():
    return _CURRENT_DEVICE


def set_device(index):
    global _CURRENT_DEVICE
    runtime(index)
    _CURRENT_DEVICE = index


@contextmanager
def use_device(index):
    previous = current_device()
    set_device(index)
    try:
        yield
    finally:
        set_device(previous)


def device_name(index=None):
    return runtime(index).name()


def available_backends():
    backends = []
    if cuda_available():
        backends.append("cuda")
    return backends


def require_backend(name):
    if name == "cuda":
        runtime()
        return "cuda"
    raise UnsupportedGpuBackend(
        "%s is not implemented in NEF2 yet. Vendor GPU support needs a native "
        "backend for that vendor API, for example CUDA for NVIDIA, HIP/ROCm for "
        "AMD, Level Zero/SYCL for Intel, Metal for Apple, or Vulkan/OpenCL for "
        "portable kernels." % name
    )


class CudaTensor:
    def __init__(self, data, device=None):
        self.device = _CURRENT_DEVICE if device is None else device
        self._rt = runtime(self.device)
        flat = _flatten(data)
        self.shape = _shape(data)
        self.size = len(flat)
        self.ptr = self._rt.mem_alloc(4 * self.size)
        self._rt.copy_htod(self.ptr, flat)

    @classmethod
    def empty(cls, shape, device=None):
        obj = cls.__new__(cls)
        obj.device = _CURRENT_DEVICE if device is None else device
        obj._rt = runtime(obj.device)
        obj.shape = tuple(shape)
        obj.size = _prod(obj.shape)
        obj.ptr = obj._rt.mem_alloc(4 * obj.size)
        return obj

    def tolist(self):
        return _unflatten(self._rt.copy_dtoh(self.ptr, self.size), self.shape)

    def head(self, count=10):
        count = min(int(count), self.size)
        return self._rt.copy_dtoh(self.ptr, count)

    def free(self):
        if getattr(self, "ptr", 0):
            self._rt.mem_free(self.ptr)
            self.ptr = 0

    def __del__(self):
        try:
            self.free()
        except Exception:
            pass

    def _binary(self, other, kernel):
        other = other if isinstance(other, CudaTensor) else CudaTensor(_full(self.shape, other), self.device)
        if self.shape != other.shape:
            raise ValueError("CUDA tensor shapes must match")
        if self.device != other.device:
            raise ValueError("CUDA tensors must be on the same device")
        out = CudaTensor.empty(self.shape, self.device)
        self._rt.launch(
            kernel,
            [("u64", self.ptr), ("u64", other.ptr), ("u64", out.ptr), ("u32", self.size)],
            self.size,
        )
        return out

    def __add__(self, other):
        return self._binary(other, "vadd")

    def __mul__(self, other):
        return self._binary(other, "vmul")

    def sgd_(self, grad, lr):
        if self.shape != grad.shape:
            raise ValueError("parameter and gradient shapes must match")
        self._rt.launch(
            "vsgd",
            [("u64", self.ptr), ("u64", grad.ptr), ("f32", lr), ("u32", self.size)],
            self.size,
        )
        return self

    def fill_(self, value):
        self._rt.launch(
            "vfill",
            [("u64", self.ptr), ("f32", value), ("u32", self.size)],
            self.size,
        )
        return self


def tensor(data, device=None):
    return CudaTensor(data, device)


def empty(shape, device=None):
    return CudaTensor.empty(shape, device)


def full(shape, value, device=None):
    out = CudaTensor.empty(shape, device)
    out.fill_(value)
    return out


def zeros(shape, device=None):
    return full(shape, 0.0, device)


def sgd_step_(param, grad, lr):
    return param.sgd_(grad, lr)


def _shape(data):
    if not isinstance(data, list):
        return ()
    if not data:
        return (0,)
    return (len(data),) + _shape(data[0])


def _flatten(data):
    if not isinstance(data, list):
        return [float(data)]
    out = []
    for item in data:
        out.extend(_flatten(item))
    return out


def _prod(shape):
    out = 1
    for size in shape:
        out *= size
    return out


def _unflatten(values, shape):
    values = list(values)

    def build(offset, dims):
        if not dims:
            return values[offset], offset + 1
        arr = []
        for _ in range(dims[0]):
            item, offset = build(offset, dims[1:])
            arr.append(item)
        return arr, offset

    data, _ = build(0, shape)
    return data


def _full(shape, value):
    if not shape:
        return float(value)
    return [_full(shape[1:], value) for _ in range(shape[0])]
