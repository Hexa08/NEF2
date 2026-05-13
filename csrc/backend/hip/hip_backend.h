#pragma once
#include "../core/backend_api.h"
#include <iostream>

namespace nef {

// Forward declare ROCm/HIP specific context if needed
struct HIPContext;

class HIPStream : public Stream {
public:
    HIPStream(); // Creates hipStream_t
    ~HIPStream() override;
    void synchronize() override;
private:
    void* stream_; // hipStream_t
};

class HIPDevice : public Device {
    int index_;
public:
    HIPDevice(int idx) : index_(idx) {}
    DeviceType type() const override { return DeviceType::HIP; }
    int index() const override { return index_; }
    void synchronize() override; // hipDeviceSynchronize
};

class HIPBackend : public Backend {
    // Internally manages hipBLAS, MIOpen, and RCCL handles
    HIPContext* ctx_;
public:
    HIPBackend();
    ~HIPBackend() override;

    int device_count() override;
    std::shared_ptr<Device> get_device(int index) override;

    std::shared_ptr<Stream> create_stream(std::shared_ptr<Device> device) override;
    std::shared_ptr<Event> create_event(std::shared_ptr<Device> device) override;

    void* malloc(size_t size, std::shared_ptr<Device> device) override; // hipMalloc
    void free(void* ptr, std::shared_ptr<Device> device) override; // hipFree
    void memcpy_h2d_async(void* dst, const void* src, size_t size, std::shared_ptr<Stream> stream) override; // hipMemcpyAsync
    void memcpy_d2h_async(void* dst, const void* src, size_t size, std::shared_ptr<Stream> stream) override;
    void memcpy_d2d_async(void* dst, const void* src, size_t size, std::shared_ptr<Stream> stream) override;

    void launch_kernel(std::shared_ptr<Kernel> kernel, const std::vector<std::shared_ptr<Tensor>>& args, std::shared_ptr<Stream> stream) override;

    // RCCL Collectives for AMD distributed training
    void all_reduce(std::shared_ptr<Tensor> sendbuf, std::shared_ptr<Tensor> recvbuf, ReduceOp op, std::shared_ptr<Stream> stream) override;
    void broadcast(std::shared_ptr<Tensor> buffer, int root, std::shared_ptr<Stream> stream) override;
    void all_gather(std::shared_ptr<Tensor> sendbuf, std::shared_ptr<Tensor> recvbuf, std::shared_ptr<Stream> stream) override;
    void reduce_scatter(std::shared_ptr<Tensor> sendbuf, std::shared_ptr<Tensor> recvbuf, ReduceOp op, std::shared_ptr<Stream> stream) override;
};

} // namespace nef
