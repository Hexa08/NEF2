import ctypes
import os
import platform
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

.visible .entry matmul(.param .u64 a, .param .u64 b, .param .u64 out, .param .u32 batch, .param .u32 m, .param .u32 k, .param .u32 n, .param .u32 b_batched)
{
    .reg .pred %p;
    .reg .b32 %r<21>;
    .reg .b64 %rd<6>;
    .reg .f32 %f<4>;

    ld.param.u64 %rd1, [a];
    ld.param.u64 %rd2, [b];
    ld.param.u64 %rd3, [out];
    ld.param.u32 %r4, [batch];
    ld.param.u32 %r5, [m];
    ld.param.u32 %r6, [k];
    ld.param.u32 %r7, [n];
    ld.param.u32 %r8, [b_batched];

    mov.u32 %r1, %tid.x;
    mov.u32 %r2, %ctaid.x;
    mov.u32 %r3, %ntid.x;
    mad.lo.s32 %r9, %r2, %r3, %r1;

    mul.lo.s32 %r10, %r4, %r5;
    mul.lo.s32 %r10, %r10, %r7;
    setp.ge.u32 %p, %r9, %r10;
    @%p bra done_matmul;

    mul.lo.s32 %r11, %r5, %r7;

    div.u32 %r12, %r9, %r11;
    rem.u32 %r13, %r9, %r11;

    div.u32 %r14, %r13, %r7;
    rem.u32 %r15, %r13, %r7;

    mul.lo.s32 %r16, %r12, %r5;
    mul.lo.s32 %r16, %r16, %r6;

    setp.eq.u32 %p, %r8, 0;
    @%p bra b_unbatched;
    mul.lo.s32 %r17, %r12, %r6;
    mul.lo.s32 %r17, %r17, %r7;
    bra b_offset_done;
b_unbatched:
    mov.u32 %r17, 0;
b_offset_done:

    mul.lo.s32 %r18, %r12, %r11;

    mov.f32 %f1, 0f00000000;
    mov.u32 %r19, 0;

loop_kk:
    setp.ge.u32 %p, %r19, %r6;
    @%p bra end_loop_kk;

    mul.lo.s32 %r20, %r14, %r6;
    add.s32 %r20, %r20, %r19;
    add.s32 %r20, %r20, %r16;
    mul.wide.u32 %rd4, %r20, 4;
    add.s64 %rd5, %rd1, %rd4;
    ld.global.f32 %f2, [%rd5];

    mul.lo.s32 %r20, %r19, %r7;
    add.s32 %r20, %r20, %r15;
    add.s32 %r20, %r20, %r17;
    mul.wide.u32 %rd4, %r20, 4;
    add.s64 %rd5, %rd2, %rd4;
    ld.global.f32 %f3, [%rd5];

    fma.rn.f32 %f1, %f2, %f3, %f1;

    add.u32 %r19, %r19, 1;
    bra loop_kk;

end_loop_kk:
    add.s32 %r20, %r18, %r13;
    mul.wide.u32 %rd4, %r20, 4;
    add.s64 %rd5, %rd3, %rd4;
    st.global.f32 [%rd5], %f1;

done_matmul:
    ret;
}

.visible .entry layernorm_fwd(.param .u64 in_ptr, .param .u64 gamma_ptr, .param .u64 beta_ptr, .param .u64 out_ptr, .param .u32 n_rows, .param .u32 n_features, .param .f32 eps)
{
    .reg .pred %p;
    .reg .b32 %r<15>;
    .reg .b64 %rd<10>;
    .reg .f32 %f<12>;

    ld.param.u64 %rd1, [in_ptr];
    ld.param.u64 %rd2, [gamma_ptr];
    ld.param.u64 %rd3, [beta_ptr];
    ld.param.u64 %rd4, [out_ptr];
    ld.param.u32 %r5, [n_rows];
    ld.param.u32 %r6, [n_features];
    ld.param.f32 %f11, [eps];

    mov.u32 %r1, %ctaid.x;
    setp.ge.u32 %p, %r1, %r5;
    @%p bra done_ln;

    // Compute base offset for this row
    mul.lo.s32 %r7, %r1, %r6;
    mul.wide.u32 %rd5, %r7, 4;
    add.s64 %rd6, %rd1, %rd5;
    add.s64 %rd7, %rd4, %rd5;

    // Step 1: compute mean (thread 0 does it for simplicity)
    mov.u32 %r2, %tid.x;
    setp.ne.u32 %p, %r2, 0;
    @%p bra skip_mean;

    mov.f32 %f1, 0f00000000;  // sum = 0
    mov.u32 %r8, 0;
loop_mean:
    setp.ge.u32 %p, %r8, %r6;
    @%p bra end_mean;
    mul.wide.u32 %rd8, %r8, 4;
    add.s64 %rd9, %rd6, %rd8;
    ld.global.f32 %f2, [%rd9];
    add.f32 %f1, %f1, %f2;
    add.u32 %r8, %r8, 1;
    bra loop_mean;
end_mean:
    // Convert n_features to float
    mov.u32 %r9, %r6;
    cvt.rn.f32.u32 %f3, %r9;
    div.rn.f32 %f1, %f1, %f3;  // mean = sum / n_features

    // Step 2: compute variance
    mov.f32 %f4, 0f00000000;  // var_sum = 0
    mov.u32 %r8, 0;
loop_var:
    setp.ge.u32 %p, %r8, %r6;
    @%p bra end_var;
    mul.wide.u32 %rd8, %r8, 4;
    add.s64 %rd9, %rd6, %rd8;
    ld.global.f32 %f2, [%rd9];
    sub.f32 %f5, %f2, %f1;     // x - mean
    mul.f32 %f5, %f5, %f5;     // (x - mean)^2
    add.f32 %f4, %f4, %f5;
    add.u32 %r8, %r8, 1;
    bra loop_var;
end_var:
    div.rn.f32 %f4, %f4, %f3;  // variance = var_sum / n_features
    add.f32 %f6, %f4, %f11;    // var + eps
    sqrt.approx.f32 %f7, %f6;  // std = sqrt(var + eps)

    // Store mean and std in shared memory for other threads
    // For simplicity, recompute in each thread
skip_mean:

    // Barrier: all threads wait for mean/std computation
    bar.sync 0;

    // Recompute mean and std in every thread
    mov.f32 %f1, 0f00000000;
    mov.u32 %r8, 0;
ln_re_mean:
    setp.ge.u32 %p, %r8, %r6;
    @%p bra ln_re_mean_end;
    mul.wide.u32 %rd8, %r8, 4;
    add.s64 %rd9, %rd6, %rd8;
    ld.global.f32 %f2, [%rd9];
    add.f32 %f1, %f1, %f2;
    add.u32 %r8, %r8, 1;
    bra ln_re_mean;
ln_re_mean_end:
    div.rn.f32 %f1, %f1, %f3;

    mov.f32 %f4, 0f00000000;
    mov.u32 %r8, 0;
ln_re_var:
    setp.ge.u32 %p, %r8, %r6;
    @%p bra ln_re_var_end;
    mul.wide.u32 %rd8, %r8, 4;
    add.s64 %rd9, %rd6, %rd8;
    ld.global.f32 %f2, [%rd9];
    sub.f32 %f5, %f2, %f1;
    mul.f32 %f5, %f5, %f5;
    add.f32 %f4, %f4, %f5;
    add.u32 %r8, %r8, 1;
    bra ln_re_var;
ln_re_var_end:
    div.rn.f32 %f4, %f4, %f3;
    add.f32 %f6, %f4, %f11;
    sqrt.approx.f32 %f7, %f6;

    // Each thread normalizes its assigned elements (stride = block size)
    mov.u32 %r10, %ntid.x;
    mov.u32 %r11, %tid.x;
loop_norm:
    setp.ge.u32 %p, %r11, %r6;
    @%p bra done_ln;
    mul.wide.u32 %rd8, %r11, 4;
    add.s64 %rd9, %rd6, %rd8;
    ld.global.f32 %f2, [%rd9];     // x
    sub.f32 %f8, %f2, %f1;        // x - mean
    div.rn.f32 %f8, %f8, %f7;     // (x - mean) / std
    add.s64 %rd9, %rd2, %rd8;
    ld.global.f32 %f9, [%rd9];     // gamma[i]
    add.s64 %rd9, %rd3, %rd8;
    ld.global.f32 %f10, [%rd9];    // beta[i]
    mul.f32 %f8, %f8, %f9;        // * gamma
    add.f32 %f8, %f8, %f10;        // + beta
    add.s64 %rd9, %rd7, %rd8;
    st.global.f32 [%rd9], %f8;
    add.u32 %r11, %r11, %r10;
    bra loop_norm;

done_ln:
    ret;
}

.visible .entry cross_entropy_fwd(.param .u64 logits_ptr, .param .u64 targets_ptr, .param .u64 out_ptr, .param .u32 n_rows, .param .u32 n_classes)
{
    .reg .pred %p;
    .reg .b32 %r<20>;
    .reg .b64 %rd<10>;
    .reg .f32 %f<12>;

    ld.param.u64 %rd1, [logits_ptr];
    ld.param.u64 %rd2, [targets_ptr];
    ld.param.u64 %rd3, [out_ptr];
    ld.param.u32 %r4, [n_rows];
    ld.param.u32 %r5, [n_classes];

    mov.u32 %r1, %ctaid.x;
    setp.ge.u32 %p, %r1, %r4;
    @%p bra done_ce;

    // Row offset in logits
    mul.lo.s32 %r6, %r1, %r5;
    mul.wide.u32 %rd4, %r6, 4;
    add.s64 %rd5, %rd1, %rd4;

    // Step 1: find max logit for numerical stability
    mov.f32 %f1, 0fFF800000;  // -inf
    mov.u32 %r7, 0;
loop_max:
    setp.ge.u32 %p, %r7, %r5;
    @%p bra end_max;
    mul.wide.u32 %rd6, %r7, 4;
    add.s64 %rd7, %rd5, %rd6;
    ld.global.f32 %f2, [%rd7];
    max.f32 %f1, %f1, %f2;
    add.u32 %r7, %r7, 1;
    bra loop_max;
end_max:

    // Step 2: compute log-sum-exp
    mov.f32 %f3, 0f00000000;  // sum = 0
    mov.u32 %r7, 0;
loop_exp:
    setp.ge.u32 %p, %r7, %r5;
    @%p bra end_exp;
    mul.wide.u32 %rd6, %r7, 4;
    add.s64 %rd7, %rd5, %rd6;
    ld.global.f32 %f2, [%rd7];
    sub.f32 %f4, %f2, %f1;     // logit - max
    ex2.approx.f32 %f5, %f4;   // exp(logit - max)  (2^x approximation)
    add.f32 %f3, %f3, %f5;
    add.u32 %r7, %r7, 1;
    bra loop_exp;
end_exp:
    lg2.approx.f32 %f6, %f3;   // log2(sum)
    mul.f32 %f6, %f6, 0f3F317218;  // * ln(2) to get natural log
    add.f32 %f6, %f6, %f1;      // log-sum-exp = max + log(sum(exp shifted))

    // Step 3: get target class
    mul.wide.u32 %rd6, %r1, 4;
    add.s64 %rd7, %rd2, %rd6;
    ld.global.u32 %r8, [%rd7];
    // Convert target to int offset
    mul.lo.s32 %r9, %r8, 4;
    add.s32 %r9, %r9, %r6;
    mul.wide.u32 %rd6, %r9, 4;
    add.s64 %rd7, %rd1, %rd6;
    ld.global.f32 %f7, [%rd7];

    // loss = -log_prob[target] = -(logit_target - log_sum_exp)
    sub.f32 %f8, %f7, %f6;
    neg.f32 %f8, %f8;

    // Store in out (scalar per row)
    mul.wide.u32 %rd6, %r1, 4;
    add.s64 %rd7, %rd3, %rd6;
    st.global.f32 [%rd7], %f8;

done_ce:
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


def _load_cuda_lib():
    system = platform.system()
    if system == "Windows":
        return ctypes.WinDLL("nvcuda.dll")
    elif system == "Linux":
        return ctypes.CDLL("libcuda.so.1")
    elif system == "Darwin":
        raise CudaError("macOS does not support CUDA. Use Metal backend (planned).")
    else:
        raise CudaError("Unsupported platform: %s" % system)


def _get_sm_version(cuda, device):
    major = ctypes.c_int()
    minor = ctypes.c_int()
    _check(cuda.cuDeviceGetAttribute(ctypes.byref(major), 75, device), "cuDeviceGetAttribute(major)")
    _check(cuda.cuDeviceGetAttribute(ctypes.byref(minor), 76, device), "cuDeviceGetAttribute(minor)")
    return major.value, minor.value


class _CudaRuntime:
    def __init__(self, index=0):
        self.index = index
        self.cuda = _load_cuda_lib()
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
        major, minor = _get_sm_version(self.cuda, self.device)
        target = "sm_%d%d" % (major, minor)
        ptx = ctypes.create_string_buffer(_PTX.replace(".target sm_52", ".target " + target).encode("utf-8"))
        _check(self.cuda.cuModuleLoadData(ctypes.byref(self.module), ptx), "cuModuleLoadData")
        self.functions = {}

    def __del__(self):
        try:
            if self.context:
                self.cuda.cuCtxDestroy_v2(self.context)
                self.context = None
        except Exception:
            pass

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


def _try_load(lib_name):
    try:
        if platform.system() == "Windows":
            ctypes.WinDLL(lib_name)
        else:
            ctypes.CDLL(lib_name)
        return True
    except (OSError, ImportError):
        return False


def _detect_backends():
    """Auto-detect available GPU backends on this system."""
    backends = []
    system = platform.system()

    # NVIDIA CUDA
    try:
        _load_cuda_lib()
        backends.append("cuda")
    except CudaError:
        pass

    # AMD HIP/ROCm (Linux only currently)
    if system == "Linux":
        if _try_load("libamdhip64.so"):
            backends.append("hip")

    # Intel Level Zero (Linux + Windows)
    if system == "Linux":
        if _try_load("libze_loader.so"):
            backends.append("level_zero")
    elif system == "Windows":
        if _try_load("ze_loader.dll"):
            backends.append("level_zero")

    # Apple Metal
    if system == "Darwin":
        if _try_load("/System/Library/Frameworks/Metal.framework/Metal"):
            backends.append("metal")

    return backends


# Cache backend detection results
_DETECTED_BACKENDS = None


def available_backends():
    global _DETECTED_BACKENDS
    if _DETECTED_BACKENDS is None:
        _DETECTED_BACKENDS = _detect_backends()
    return _DETECTED_BACKENDS[:]


def preferred_backend():
    """Return the best available backend for this machine, or None."""
    backends = available_backends()
    # Priority: CUDA > HIP > Level Zero > Metal
    for name in ("cuda", "hip", "level_zero", "metal"):
        if name in backends:
            return name
    return None


def require_backend(name):
    if name == "cuda":
        runtime()
        return "cuda"
    if name in available_backends():
        raise UnsupportedGpuBackend(
            "%s was detected on this system but is not yet implemented in NEF2. "
            "This vendor needs a native backend. Contributions welcome." % name
        )
    raise UnsupportedGpuBackend(
        "%s is not available on this system and is not implemented in NEF2 yet. "
        "Vendor GPU support needs a native backend for that vendor API: "
        "CUDA for NVIDIA, HIP/ROCm for AMD, Level Zero/SYCL for Intel, "
        "Metal for Apple, or Vulkan/OpenCL for portable kernels." % name
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

    def copy_from_host(self, data):
        flat = _flatten(data)
        if len(flat) != self.size:
            raise ValueError("size mismatch in copy_from_host: %s vs %s" % (len(flat), self.size))
        self._rt.copy_htod(self.ptr, flat)

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

    @classmethod
    def from_flat(cls, flat, shape, device=None):
        data = _unflatten(list(flat), tuple(shape))
        return cls(data, device)

    def matmul(self, other):
        if not isinstance(other, CudaTensor):
            other = CudaTensor(other, self.device)
        if len(self.shape) < 2 or len(other.shape) < 2:
            raise ValueError("matmul expects rank >= 2")
        batch_a = self.shape[:-2]
        batch_b = other.shape[:-2]
        if batch_b not in ((), batch_a):
            raise ValueError("batched matmul shape mismatch")
        m, k = self.shape[-2], self.shape[-1]
        k2, n = other.shape[-2], other.shape[-1]
        if k != k2:
            raise ValueError("matmul inner dims mismatch: %s vs %s" % (k, k2))
        out_batch = batch_a
        out_shape = out_batch + (m, n)
        out = CudaTensor.empty(out_shape, self.device)
        batch_count = _prod(out_batch) if out_batch else 1
        b_batched = 1 if batch_b else 0
        total = batch_count * m * n
        block = 256
        grid = (total + block - 1) // block
        self._rt.launch(
            "matmul",
            [
                ("u64", self.ptr),
                ("u64", other.ptr),
                ("u64", out.ptr),
                ("u32", batch_count),
                ("u32", m),
                ("u32", k),
                ("u32", n),
                ("u32", b_batched),
            ],
            total,
        )
        return out

    def layernorm(self, gamma, beta, eps=1e-5):
        if not isinstance(gamma, CudaTensor):
            gamma = CudaTensor(gamma, self.device)
        if not isinstance(beta, CudaTensor):
            beta = CudaTensor(beta, self.device)
        if len(self.shape) < 1:
            raise ValueError("layernorm expects rank >= 1")
        n_features = self.shape[-1]
        n_rows = self.size // n_features
        if gamma.size != n_features or beta.size != n_features:
            raise ValueError("layernorm gamma/beta size must match last dimension")
        out = CudaTensor.empty(self.shape, self.device)
        self._rt.launch(
            "layernorm_fwd",
            [
                ("u64", self.ptr),
                ("u64", gamma.ptr),
                ("u64", beta.ptr),
                ("u64", out.ptr),
                ("u32", n_rows),
                ("u32", n_features),
                ("f32", eps),
            ],
            n_rows,
        )
        return out


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


def matmul(a, b, device=None):
    if not isinstance(a, CudaTensor):
        a = CudaTensor(a, device)
    return a.matmul(b)


def layernorm(x, gamma, beta, eps=1e-5, device=None):
    if not isinstance(x, CudaTensor):
        x = CudaTensor(x, device)
    return x.layernorm(gamma, beta, eps)


def cross_entropy(logits, targets, device=None):
    """GPU cross-entropy. logits: (n_rows, n_classes), targets: flat list of int."""
    if not isinstance(logits, CudaTensor):
        logits = CudaTensor(logits, device)
    if len(logits.shape) < 2:
        raise ValueError("cross_entropy expects rank >= 2 logits")
    n_rows = logits.size // logits.shape[-1]
    n_classes = logits.shape[-1]
    targets_flat = [int(t) for t in _flatten(targets)]
    if len(targets_flat) != n_rows:
        raise ValueError("targets length %s != logits rows %s" % (len(targets_flat), n_rows))
    out = CudaTensor.empty((n_rows,), logits.device)
    rt = runtime(logits.device)
    rt.launch(
        "cross_entropy_fwd",
        [
            ("u64", logits.ptr),
            ("u64", CudaTensor(targets_flat, logits.device).ptr),
            ("u64", out.ptr),
            ("u32", n_rows),
            ("u32", n_classes),
        ],
        n_rows,
    )
    return out


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
