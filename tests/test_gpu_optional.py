def test_gpu_module_has_clear_availability_api():
    from nef2 import gpu

    assert callable(gpu.cuda_available)
    assert callable(gpu.device_name)
    assert callable(gpu.device_count)
    assert callable(gpu.list_devices)
    assert callable(gpu.set_device)
    assert callable(gpu.use_device)
