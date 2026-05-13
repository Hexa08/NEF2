from setuptools import setup, Extension, find_packages
import pybind11

ext_modules = [
    Extension(
        "nef_core",
        ["csrc/nef_core.cpp"],
        include_dirs=[pybind11.get_include()],
        language="c++",
        extra_compile_args=["-O3", "-march=native", "-std=c++14"],
    ),
]

setup(
    name="nef2",
    packages=find_packages(exclude=["csrc"]),
    ext_modules=ext_modules,
)
