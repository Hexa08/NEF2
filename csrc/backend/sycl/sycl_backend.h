#pragma once
#include "../../core/backend_api.h"

namespace nef {

// Forward declare SYCL specific objects (e.g. sycl::queue, sycl::device)
struct SYCLContext;

class SYCLStream : public Stream {
public:
    SYCLStream(); // Creates sycl::queue
    ~SYCLStream() override;
    void synchronize() override; // queue.wait()
private:
    void* queue_; // sycl::queue*
};

class SYCLDevice : public Device {
    int index_;
public:
    SYCLDevice(int idx) : index_(idx) {}
    DeviceType type() const override { return DeviceType::SYCL; }
    int index() const override { return index_; }
    void synchronize() override; 
};

class SYCLBackend : public Backend {
    SYCLContext* ctx_;
public:
    SYCLBackend();
    ~SYCLBackend() override;

    int device_count() override;
    std::shared_ptr<Device> get_device(int index) override;

    std::shared_ptr<Stream> create_stream(std::shared_ptr<Device> device) override;
    std::shared_ptr<Event> create_event(std::shared_ptr<Device> device) override;

    void* malloc(size_t size, std::shared_ptr<Device> device) override; // sycl::malloc_device
    void free(void* ptr, std::shared_ptr<Device> device) override; // sycl::free
    void memcpy_h2d_async(void* dst, const void* src, size_t size, std::shared_ptr<Stream> stream) override; // queue.memcpy
    void memcpy_d2h_async(void* dst, const void* src, size_t size, std::shared_ptr<Stream> stream) override;
    void memcpy_d2d_async(void* dst, const void* src, size_t size, std::shared_ptr<Stream> stream) override;

    void launch_kernel(std::shared_ptr<Kernel> kernel, const std::vector<std::shared_ptr<Tensor>>& args, std::shared_ptr<Stream> stream) override;

    // oneCCL Collectives for Intel distributed training
    void all_reduce(std::shared_ptr<Tensor> sendbuf, std::shared_ptr<Tensor> recvbuf, ReduceOp op, std::shared_ptr<Stream> stream) override;
    void broadcast(std::shared_ptr<Tensor> buffer, int root, std::shared_ptr<Stream> stream) override;
    void all_gather(std::shared_ptr<Tensor> sendbuf, std::shared_ptr<Tensor> recvbuf, std::shared_ptr<Stream> stream) override;
    void reduce_scatter(std::shared_ptr<Tensor> sendbuf, std::shared_ptr<Tensor> recvbuf, ReduceOp op, std::shared_ptr<Stream> stream) override;
};

} // namespace nef
