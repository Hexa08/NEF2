#pragma once
#include "../core/backend_api.h"

namespace nef {

// Forward declare Metal specific objects
struct MetalContext;

class MetalStream : public Stream {
public:
    MetalStream(); // Creates MTLCommandQueue
    ~MetalStream() override;
    void synchronize() override; // waitUntilCompleted
private:
    void* command_queue_; 
};

class MetalDevice : public Device {
    int index_;
public:
    MetalDevice(int idx) : index_(idx) {}
    DeviceType type() const override { return DeviceType::METAL; }
    int index() const override { return index_; }
    void synchronize() override; 
};

class MetalBackend : public Backend {
    // Internally manages MTLDevice and MPSGraph contexts
    MetalContext* ctx_;
public:
    MetalBackend();
    ~MetalBackend() override;

    int device_count() override;
    std::shared_ptr<Device> get_device(int index) override;

    std::shared_ptr<Stream> create_stream(std::shared_ptr<Device> device) override;
    std::shared_ptr<Event> create_event(std::shared_ptr<Device> device) override;

    void* malloc(size_t size, std::shared_ptr<Device> device) override; // MTLBuffer allocation
    void free(void* ptr, std::shared_ptr<Device> device) override;
    void memcpy_h2d_async(void* dst, const void* src, size_t size, std::shared_ptr<Stream> stream) override;
    void memcpy_d2h_async(void* dst, const void* src, size_t size, std::shared_ptr<Stream> stream) override;
    void memcpy_d2d_async(void* dst, const void* src, size_t size, std::shared_ptr<Stream> stream) override; // MTLBlitCommandEncoder

    // MPS / MPSGraph or Metal Shaders execution
    void launch_kernel(std::shared_ptr<Kernel> kernel, const std::vector<std::shared_ptr<Tensor>>& args, std::shared_ptr<Stream> stream) override;

    // Simulated Collectives for Apple Silicon (mostly single device, but API maintained for consistency)
    void all_reduce(std::shared_ptr<Tensor> sendbuf, std::shared_ptr<Tensor> recvbuf, ReduceOp op, std::shared_ptr<Stream> stream) override;
    void broadcast(std::shared_ptr<Tensor> buffer, int root, std::shared_ptr<Stream> stream) override;
    void all_gather(std::shared_ptr<Tensor> sendbuf, std::shared_ptr<Tensor> recvbuf, std::shared_ptr<Stream> stream) override;
    void reduce_scatter(std::shared_ptr<Tensor> sendbuf, std::shared_ptr<Tensor> recvbuf, ReduceOp op, std::shared_ptr<Stream> stream) override;
};

} // namespace nef
