# Developer Guide & Contribution Standards

Thank you for contributing to NEF2. As a framework-independent substrate, we maintain high standards for performance and code clarity.

## 1. Core Principles

- **Performance First**: If a Python implementation is slow, move it to the C++/Rust core (`nef_core` or `nef_rust`).
- **Zero Hidden Dependencies**: Never add a dependency to `pyproject.toml` without explicit approval.
- **Explicit is Better than Implicit**: Hardware placement and memory movements should be clear.

## 2. Project Structure

- `nef2/`: The main Python package.
- `csrc/`: C++ and Rust source code for the NEFCore runtime.
- `nef2/gpu.py`: The entry point for hardware drivers.
- `nef2/compiler/`: IR, Graph capture, and fusion logic.

## 3. Writing Custom Kernels

NEF2 supports raw PTX for NVIDIA and HIP for AMD. Kernels should be placed in `nef2/gpu.py` (or externalized if they grow too large) and launched via the `CudaRuntime`.

### Example Kernel Addition:
1. Define the PTX string in `nef2/gpu.py`.
2. Add a method to `CudaTensor` to wrap the launch.
3. Add a fallback in `nef2/tensor.py` for CPU compatibility.

## 4. Coding Style

- **Python**: Follow PEP 8. Use type hints for all public APIs.
- **C++**: Use C++17 standards. Follow the existing naming convention in `nef_core.cpp`.
- **Rust**: Use idiomatic Rust. Ensure all `unsafe` blocks are heavily documented.

## 5. Testing

Every new feature must include a test case in `tests/`.
Run tests using:
```bash
pytest tests/
```

## 6. PR Process

1. Fork the repo.
2. Create a feature branch.
3. Ensure all tests pass.
4. Open a PR with a clear description of the performance impact.

---

<div align="center">
  <b>NEF2 is built by the community for the future of AI.</b>
</div>
