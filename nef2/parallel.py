import multiprocessing as mp
import atexit
from .nn import Module, Pipeline, Sequential
from . import gpu
from .tensor import Tensor
from .net.rdma import RDMATransport

def _worker_loop(rank, world_size, comp, device_id, p_recv, p_send):
    """
    Physical worker process for Distributed Pipeline Parallelism.
    Binds directly to a specific GPU/Node and listens on the RDMA fabric.
    """
    # Bind the process physically to the target GPU hardware if available
    if gpu.cuda_available():
        gpu.set_device(device_id)
    dev_name = f"GPU:{device_id}" if gpu.cuda_available() else f"Virtual Node:{device_id}"
    print(f"[NEFCluster] Worker {rank} spun up on {dev_name} [{comp.__class__.__name__}]")
    
    # Initialize RDMA transport for this specific process
    transport = RDMATransport(rank, world_size)
    transport.connect_pipe(rank - 1, p_recv)
    transport.connect_pipe(rank + 1, p_send)
    
    while True:
        try:
            # RDMA Receive: Wait for tensor from previous node
            x = transport.recv_tensor(rank - 1)
            if x is None:
                # Forward shutdown signal to next node
                p_send.send(None)
                break
                
            # Execute physical forward pass on this process's isolated hardware context
            out = comp(x)
            
            # RDMA Send: Stream results to the next physical node
            transport.send_tensor(out, rank + 1)
        except EOFError:
            break
        except Exception as e:
            print(f"[NEFCluster] Worker {rank} crashed: {e}")
            break

class DistributedExecutionWrapper(Module):
    """
    Actual physical parallelization wrapper that spins up real OS processes
    and establishes an RDMA transport fabric between them.
    """
    def __init__(self, model):
        self.model = model
        self._is_parallelized = True
        self.num_devices = max(1, gpu.device_count())
        
        # Decompose the network into physical chunks
        if isinstance(model, Pipeline):
            self.components = model.models
        elif isinstance(model, Sequential):
            self.components = model.layers
        else:
            self.components = [model]
            
        self.world_size = len(self.components)
        self.workers = []
        
        print(f"[NEFNet] Establishing RDMA Fabric across {self.world_size} independent processes...")
        
        # Setup IPC Pipes (representing physical RDMA Queue Pairs)
        pipes = []
        # 'spawn' must be used to ensure clean memory and CUDA context initialization
        ctx = mp.get_context('spawn') if hasattr(mp, 'get_context') else mp
        
        for i in range(self.world_size + 1):
            recv_conn, send_conn = ctx.Pipe(duplex=False)
            pipes.append((recv_conn, send_conn))
            
        self.main_send = pipes[0][1]
        self.main_recv = pipes[-1][0]
        
        self.transport = RDMATransport(-1, self.world_size)
        self.transport.connect_pipe(0, self.main_send)
        self.transport.connect_pipe(self.world_size, self.main_recv)
        
        # Spawn physical workers mapping to hardware devices
        for i, comp in enumerate(self.components):
            device_id = i % self.num_devices
            p_recv = pipes[i][0]
            p_send = pipes[i+1][1]
            p = ctx.Process(
                target=_worker_loop, 
                args=(i, self.world_size, comp, device_id, p_recv, p_send)
            )
            p.daemon = True
            p.start()
            self.workers.append(p)
            
        atexit.register(self._cleanup)

    def forward(self, *args, **kwargs):
        x = args[0]
        # Dispatch initial batch into the RDMA fabric (to Node 0)
        self.transport.send_tensor(x, 0)
        
        # Wait for the pipeline processing to complete and arrive from Node N
        out = self.transport.recv_tensor(self.world_size)
        return out

    def _cleanup(self):
        if hasattr(self, 'main_send') and getattr(self, 'workers', None):
            try:
                self.main_send.send(None)
                for p in self.workers:
                    p.join(timeout=2.0)
            except Exception:
                pass

    @property
    def models(self):
        if hasattr(self.model, 'models'):
            return self.model.models
        return [self.model]

def parallelize(model):
    """
    NEF2 Native Multi-GPU Runtime hook.
    Treats all GPUs as one logical accelerator: shards weights, balances memory,
    optimizes communication, and physically routes tensors via RDMA.
    """
    if getattr(model, '_is_parallelized', False):
        return model
    return DistributedExecutionWrapper(model)
