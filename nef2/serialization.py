import struct


FORMAT_VERSION = 1
FORMAT_MAGIC = b"NEF2"


def _encode_str(s):
    b = s.encode("utf-8")
    return struct.pack("<I", len(b)) + b


def _decode_str(f):
    length = struct.unpack("<I", f.read(4))[0]
    return f.read(length).decode("utf-8")


def save_model(model, path, metadata=None):
    params = list(model.named_parameters())
    with open(path, "wb") as f:
        f.write(FORMAT_MAGIC)
        f.write(struct.pack("<H", FORMAT_VERSION))
        f.write(struct.pack("<I", len(params)))
        for name, param in params:
            f.write(_encode_str(name))
            f.write(struct.pack("<I", len(param.shape)))
            f.write(struct.pack("<" + "I" * len(param.shape), *param.shape))
            data_bytes = struct.pack("<" + "f" * len(param.data), *param.data)
            f.write(struct.pack("<I", len(data_bytes)))
            f.write(data_bytes)


def load_model(model, path):
    with open(path, "rb") as f:
        magic = f.read(4)
        if magic != FORMAT_MAGIC:
            raise ValueError("not a NEF2 model file (bad magic)")
        version = struct.unpack("<H", f.read(2))[0]
        if version != FORMAT_VERSION:
            raise ValueError("unsupported NEF2 format version: %s" % version)
        num_params = struct.unpack("<I", f.read(4))[0]
        incoming = {}
        for _ in range(num_params):
            name = _decode_str(f)
            rank = struct.unpack("<I", f.read(4))[0]
            shape = struct.unpack("<" + "I" * rank, f.read(4 * rank))
            data_len = struct.unpack("<I", f.read(4))[0]
            num_floats = data_len // 4
            data = list(struct.unpack("<" + "f" * num_floats, f.read(data_len)))
            incoming[name] = {"shape": shape, "data": data}
    for name, param in model.named_parameters():
        item = incoming.get(name)
        if item is None:
            raise ValueError("missing parameter in file: %s" % name)
        if tuple(item["shape"]) != tuple(param.shape):
            raise ValueError("shape mismatch for %s: %s != %s" % (name, item["shape"], param.shape))
        param.data = [float(value) for value in item["data"]]
        param.grad = [0.0 for _ in param.data]
    return {}
