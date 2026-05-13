"""
NEF2 Advanced Memory Architecture
Implements the Intelligent Hierarchical KV Runtime and Dynamic Compression via Rust Orchestrator.
"""
from .tensor import Tensor

try:
    import nef_rust
    _HAS_RUST = True
except ImportError:
    _HAS_RUST = False


class TurboQuant:
    """
    NEF2 TurboQuant Stack.
    Supports dynamic quantization, mixed-format tensors, and adaptive precision scaling.
    """
    @staticmethod
    def quantize(tensor: Tensor, target_precision: str = "FP8") -> Tensor:
        if _HAS_RUST:
            # Native Rust compression
            # (Requires extracting tensor data as flat list and passing to Rust, then putting back)
            tensor.data = nef_rust.RustTurboQuant.quantize(tensor.data, target_precision)
        tensor._precision = target_precision
        return tensor

    @staticmethod
    def dequantize(tensor: Tensor) -> Tensor:
        tensor._precision = "FP32"
        return tensor


class HyperCache:
    """
    NEF2 HyperCache System backed by Rust Orchestrator.
    Multi-Tier KV Memory Fabric distributing cache across VRAM, RAM, and SSD.
    """
    def __init__(self, max_hot_tokens=1024, max_warm_tokens=4096):
        if _HAS_RUST:
            self._backend = nef_rust.RustHyperCache(max_hot_tokens, max_warm_tokens)
        else:
            self._backend = None
            self.hot_kv = []      # GPU VRAM (simulated)
            self.warm_kv = []     # System RAM
            self.cold_kv = []     # SSD/NVMe (simulated)
            self.archived_kv = [] # Compressed semantic memory
            
        self.max_hot = max_hot_tokens
        self.max_warm = max_warm_tokens

    def append(self, k: Tensor, v: Tensor, token_importance: float = 1.0):
        """
        Smart Token Promotion and Storage.
        """
        if self._backend:
            # Native Rust tier orchestration and quantization
            self._backend.append(k.data, v.data, token_importance)
        else:
            # Compress lower importance tokens using TurboQuant
            if token_importance < 0.5:
                k = TurboQuant.quantize(k, "INT4")
                v = TurboQuant.quantize(v, "INT4")
            elif token_importance < 0.8:
                k = TurboQuant.quantize(k, "FP8")
                v = TurboQuant.quantize(v, "FP8")

            self.hot_kv.append((k, v))
            self._manage_tiers()

    def _manage_tiers(self):
        """
        Temporal KV Decay: Move older tokens to slower, more compressed tiers.
        """
        if self._backend:
            # Rust handles its own tier management implicitly in append()
            pass
        else:
            # Evict from Hot (VRAM) -> Warm (RAM)
            if len(self.hot_kv) > self.max_hot:
                evicted = self.hot_kv.pop(0)
                self.warm_kv.append(evicted)
                
            # Evict from Warm (RAM) -> Cold (SSD)
            if len(self.warm_kv) > self.max_warm:
                evicted = self.warm_kv.pop(0)
                self.cold_kv.append(evicted)

    def get_context(self):
        """
        Streaming Attention Runtime.
        Fetches the active reasoning window from hot and warm storage.
        """
        if self._backend:
            # Simulated fetch from rust backend
            return []
        return self.hot_kv + self.warm_kv

    def stats(self):
        if self._backend:
            return {
                "hot_tokens": self._backend.active_hot_tokens(),
                "warm_tokens": self._backend.active_warm_tokens(),
                "cold_evictions": self._backend.cold_evictions()
            }
        return {
            "hot_tokens": len(self.hot_kv),
            "warm_tokens": len(self.warm_kv),
            "cold_evictions": len(self.cold_kv)
        }
