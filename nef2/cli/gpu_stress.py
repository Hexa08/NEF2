import argparse
import os
import time

from .. import gpu


def main(argv=None):
    parser = argparse.ArgumentParser(description="Keep the NEF2 CUDA backend busy for GPU verification.")
    parser.add_argument("--seconds", type=float, default=60.0)
    parser.add_argument("--elements", type=int, default=50_000_000)
    parser.add_argument("--hold-seconds", type=float, default=10.0)
    parser.add_argument("--device", type=int, default=0)
    args = parser.parse_args(argv)

    with gpu.use_device(args.device):
        print("pid=%s" % os.getpid(), flush=True)
        print("device=%s" % gpu.device_name(), flush=True)
        print("elements=%d approx_tensor_mb=%.1f" % (args.elements, args.elements * 4 / 1024 / 1024), flush=True)
        a = gpu.full((args.elements,), 1.0)
        b = gpu.full((args.elements,), 2.0)
        c = a + b
        if args.hold_seconds > 0:
            print("holding_gpu_memory=%.1fs" % args.hold_seconds, flush=True)
            time.sleep(args.hold_seconds)
        start = time.time()
        loops = 0
        while time.time() - start < args.seconds:
            c = a + b
            loops += 1
            if loops % 100 == 0:
                print("loops=%d elapsed=%.1f" % (loops, time.time() - start), flush=True)
        print("result=%s loops=%d" % (c.head(3), loops), flush=True)


if __name__ == "__main__":
    main()
