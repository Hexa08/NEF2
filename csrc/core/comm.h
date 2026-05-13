#pragma once
#include "backend_api.h"
#include <memory>

namespace nef {
namespace comm {

// Represents a distributed communication group (e.g., an NCCL or RCCL communicator)
class ProcessGroup {
public:
    virtual ~ProcessGroup() = default;
    virtual int rank() const = 0;
    virtual int size() const = 0;

    virtual void all_reduce(std::shared_ptr<Tensor> sendbuf, std::shared_ptr<Tensor> recvbuf, ReduceOp op) = 0;
    virtual void all_gather(std::shared_ptr<Tensor> sendbuf, std::shared_ptr<Tensor> recvbuf) = 0;
    virtual void broadcast(std::shared_ptr<Tensor> buffer, int root) = 0;
    
    // Asynchronous versions returning an event for synchronization
    virtual std::shared_ptr<Event> all_reduce_async(std::shared_ptr<Tensor> sendbuf, std::shared_ptr<Tensor> recvbuf, ReduceOp op, std::shared_ptr<Stream> stream) = 0;
};

} // namespace comm
} // namespace nef
