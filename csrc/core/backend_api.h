#pragma once

#include <memory>
#include <vector>
#include <string>
#include <cstdint>

namespace nef {

enum class DeviceType { CPU, CUDA, HIP, METAL, SYCL, VULKAN };
enum class ReduceOp { SUM, PROD, MIN, MAX, AVG };

class Tensor; // Forward declaration
class Kernel; // Forward declaration

class Stream {
public:
    virtual ~Stream() = default;
    virtual void synchronize() = 0;
};

class Event {
public:
    virtual ~Event() = default;
    virtual void record(Stream* stream) = 0;
    virtual void synchronize() = 0;
};

class Device {
public:
    virtual ~Device() = default;
    virtual DeviceType type() const = 0;
    virtual int index() const = 0;
    virtual void synchronize() = 0;
};

// The core Hardware Abstraction Layer interface
class Backend {
public:
    virtual ~Backend() = default;

    // Device Management
    virtual int device_count() = 0;
    virtual std::shared_ptr<Device> get_device(int index) = 0;

    // Streams & Synchronization
    virtual std::shared_ptr<Stream> create_stream(std::shared_ptr<Device> device) = 0;
    virtual std::shared_ptr<Event> create_event(std::shared_ptr<Device> device) = 0;

    // MemoryOps
    virtual void* malloc(size_t size, std::shared_ptr<Device> device) = 0;
    virtual void free(void* ptr, std::shared_ptr<Device> device) = 0;
    virtual void memcpy_h2d_async(void* dst, const void* src, size_t size, std::shared_ptr<Stream> stream) = 0;
    virtual void memcpy_d2h_async(void* dst, const void* src, size_t size, std::shared_ptr<Stream> stream) = 0;
    virtual void memcpy_d2d_async(void* dst, const void* src, size_t size, std::shared_ptr<Stream> stream) = 0;

    // TensorOps & KernelLaunch
    virtual void launch_kernel(std::shared_ptr<Kernel> kernel, const std::vector<std::shared_ptr<Tensor>>& args, std::shared_ptr<Stream> stream) = 0;

    // Collectives (Crucial for distributed fabric)
    virtual void all_reduce(std::shared_ptr<Tensor> sendbuf, std::shared_ptr<Tensor> recvbuf, ReduceOp op, std::shared_ptr<Stream> stream) = 0;
    virtual void broadcast(std::shared_ptr<Tensor> buffer, int root, std::shared_ptr<Stream> stream) = 0;
    virtual void all_gather(std::shared_ptr<Tensor> sendbuf, std::shared_ptr<Tensor> recvbuf, std::shared_ptr<Stream> stream) = 0;
    virtual void reduce_scatter(std::shared_ptr<Tensor> sendbuf, std::shared_ptr<Tensor> recvbuf, ReduceOp op, std::shared_ptr<Stream> stream) = 0;
};

// Global Backend Registry
class BackendRegistry {
public:
    static void register_backend(DeviceType type, std::shared_ptr<Backend> backend);
    static std::shared_ptr<Backend> get_backend(DeviceType type);
};

} // namespace nef
