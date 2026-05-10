import json


FORMAT_VERSION = 1


def save_model(model, path, metadata=None):
    payload = {
        "format": "nef2",
        "version": FORMAT_VERSION,
        "metadata": metadata or {},
        "parameters": [
            {
                "name": name,
                "shape": list(param.shape),
                "data": param.data,
            }
            for name, param in model.named_parameters()
        ],
    }
    with open(path, "w", encoding="utf-8") as f:
        json.dump(payload, f)


def load_model(model, path):
    with open(path, "r", encoding="utf-8") as f:
        payload = json.load(f)
    if payload.get("format") != "nef2":
        raise ValueError("not a NEF2 model file")
    incoming = {item["name"]: item for item in payload["parameters"]}
    for name, param in model.named_parameters():
        item = incoming.get(name)
        if item is None:
            raise ValueError("missing parameter in file: %s" % name)
        if tuple(item["shape"]) != tuple(param.shape):
            raise ValueError("shape mismatch for %s: %s != %s" % (name, item["shape"], param.shape))
        param.data = [float(value) for value in item["data"]]
        param.grad = [0.0 for _ in param.data]
    return payload.get("metadata", {})
