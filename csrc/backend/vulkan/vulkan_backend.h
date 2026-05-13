#pragma once
#include "../../core/backend_api.h"

namespace nef {

// Forward declare Vulkan specific objects (e.g. VkDevice, VkQueue)
struct VulkanContext;

class VulkanStream : public Stream {
public:
    VulkanStream(); // Creates VkQueue and VkCommandPool
    ~VulkanStream() override;
    void synchronize() override; // vkQueueWaitIdle
private:
    void* queue_; // VkQueue
};

class VulkanDevice : public Device {
    int index_;
public:
    VulkanDevice(int idx) : index_(idx) {}
    DeviceType type() const override { return DeviceType::VULKAN; }
    int index() const override { return index_; }
    void synchronize() override; 
};

class VulkanBackend : public Backend {
    VulkanContext* ctx_;
public:
    VulkanBackend();
    ~VulkanBackend() override;

    int device_count() override;
    std::shared_ptr<Device> get_device(int index) override;

    std::shared_ptr<Stream> create_stream(std::shared_ptr<Device> device) override;
    std::shared_ptr<Event> create_event(std::shared_ptr<Device> device) override;

    void* malloc(size_t size, std::shared_ptr<Device> device) override; // vkAllocateMemory + vkBindBufferMemory
    void free(void* ptr, std::shared_ptr<Device> device) override;
    void memcpy_h2d_async(void* dst, const void* src, size_t size, std::shared_ptr<Stream> stream) override; // vkCmdCopyBuffer
    void memcpy_d2h_async(void* dst, const void* src, size_t size, std::shared_ptr<Stream> stream) override;
    void memcpy_d2d_async(void* dst, const void* src, size_t size, std::shared_ptr<Stream> stream) override;

    void launch_kernel(std::shared_ptr<Kernel> kernel, const std::vector<std::shared_ptr<Tensor>>& args, std::shared_ptr<Stream> stream) override;

    // Vulkan doesn't have a native cross-node collective library like NCCL. 
    // NEF2 implements these via SPIR-V shaders or CPU-side coordination.
    void all_reduce(std::shared_ptr<Tensor> sendbuf, std::shared_ptr<Tensor> recvbuf, ReduceOp op, std::shared_ptr<Stream> stream) override;
    void broadcast(std::shared_ptr<Tensor> buffer, int root, std::shared_ptr<Stream> stream) override;
    void all_gather(std::shared_ptr<Tensor> sendbuf, std::shared_ptr<Tensor> recvbuf, std::shared_ptr<Stream> stream) override;
    void reduce_scatter(std::shared_ptr<Tensor> sendbuf, std::shared_ptr<Tensor> recvbuf, ReduceOp op, std::shared_ptr<Stream> stream) override;
};

} // namespace nef
