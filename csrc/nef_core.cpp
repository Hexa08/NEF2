#include <pybind11/pybind11.h>
#include <pybind11/stl.h>
#include <vector>
#include <string>
#include <memory>
#include <stdexcept>
#include <cmath>
#include <algorithm>
#include <numeric>
#include <random>

namespace py = pybind11;

/**
 * NefTensor: The core C++ tensor representation.
 */
class NefTensor {
public:
    std::vector<double> data;
    std::vector<int> shape;
    std::vector<int> strides;
    std::string device;

    NefTensor(std::vector<double> d, std::vector<int> s, std::string dev = "cpu")
        : data(std::move(d)), shape(std::move(s)), device(std::move(dev)) {
        compute_strides();
    }

    void compute_strides() {
        strides.resize(shape.size());
        int s = 1;
        for (int i = (int)shape.size() - 1; i >= 0; --i) {
            strides[i] = s;
            s *= shape[i];
        }
    }

    int size() const {
        int s = 1;
        for (int d : shape) s *= d;
        return s;
    }

    static std::shared_ptr<NefTensor> zeros(std::vector<int> shape, std::string device = "cpu") {
        int s = 1;
        for (int d : shape) s *= d;
        return std::make_shared<NefTensor>(std::vector<double>(s, 0.0), shape, device);
    }

    static std::shared_ptr<NefTensor> randn(std::vector<int> shape, double scale = 1.0, std::string device = "cpu") {
        int s = 1;
        for (int d : shape) s *= d;
        std::vector<double> d(s);
        std::random_device rd;
        std::mt19937 gen(rd());
        std::normal_distribution<> dist(0, scale);
        for (int i = 0; i < s; ++i) d[i] = dist(gen);
        return std::make_shared<NefTensor>(d, shape, device);
    }
};

/**
 * NefOp: Base class for graph operations.
 */
class NefOp {
public:
    virtual ~NefOp() = default;
    virtual void execute() = 0;
};

class MatMulOp : public NefOp {
    std::shared_ptr<NefTensor> a, b, out;
public:
    MatMulOp(std::shared_ptr<NefTensor> a, std::shared_ptr<NefTensor> b, std::shared_ptr<NefTensor> out)
        : a(a), b(b), out(out) {}
    void execute() override {
        int m = a->shape[a->shape.size()-2];
        int k = a->shape[a->shape.size()-1];
        int n = b->shape[b->shape.size()-1];
        int batch = a->size() / (m * k);

        for (int b_idx = 0; b_idx < batch; ++b_idx) {
            const double* a_ptr = a->data.data() + b_idx * m * k;
            const double* b_ptr = b->data.data() + (b->shape.size() > 2 ? b_idx * k * n : 0);
            double* out_ptr = out->data.data() + b_idx * m * n;

            for (int i = 0; i < m; ++i) {
                for (int j = 0; j < n; ++j) {
                    double sum = 0.0;
                    for (int p = 0; p < k; ++p) {
                        sum += a_ptr[i * k + p] * b_ptr[p * n + j];
                    }
                    out_ptr[i * n + j] = sum;
                }
            }
        }
    }
};

class BinaryOp : public NefOp {
    std::shared_ptr<NefTensor> a, b, out;
    std::string op;
public:
    BinaryOp(std::shared_ptr<NefTensor> a, std::shared_ptr<NefTensor> b, std::shared_ptr<NefTensor> out, std::string op)
        : a(a), b(b), out(out), op(op) {}
    
    void execute() override {
        int size = out->size();
        std::vector<int> idx(out->shape.size(), 0);
        for (int i = 0; i < size; ++i) {
            int temp = i;
            for (int j = (int)out->shape.size() - 1; j >= 0; --j) {
                idx[j] = temp % out->shape[j];
                temp /= out->shape[j];
            }

            int a_idx = 0;
            for (size_t j = 0; j < a->shape.size(); ++j) {
                int dim = a->shape[j];
                a_idx += (dim == 1 ? 0 : idx[j + (out->shape.size() - a->shape.size())]) * a->strides[j];
            }

            int b_idx = 0;
            for (size_t j = 0; j < b->shape.size(); ++j) {
                int dim = b->shape[j];
                b_idx += (dim == 1 ? 0 : idx[j + (out->shape.size() - b->shape.size())]) * b->strides[j];
            }

            if (op == "+") out->data[i] = a->data[a_idx] + b->data[b_idx];
            else if (op == "-") out->data[i] = a->data[a_idx] - b->data[b_idx];
            else if (op == "*") out->data[i] = a->data[a_idx] * b->data[b_idx];
            else if (op == "/") {
                double bv = b->data[b_idx];
                out->data[i] = a->data[a_idx] / (bv == 0.0 ? 1e-10 : bv);
            }
        }
    }
};

class ReLUOp : public NefOp {
    std::shared_ptr<NefTensor> in, out;
public:
    ReLUOp(std::shared_ptr<NefTensor> in, std::shared_ptr<NefTensor> out) : in(in), out(out) {}
    void execute() override {
        for (size_t i = 0; i < in->data.size(); ++i) {
            out->data[i] = in->data[i] > 0.0 ? in->data[i] : 0.0;
        }
    }
};

class CatOp : public NefOp {
    std::vector<std::shared_ptr<NefTensor>> inputs;
    std::shared_ptr<NefTensor> out;
    int axis;
public:
    CatOp(std::vector<std::shared_ptr<NefTensor>> in, std::shared_ptr<NefTensor> out, int ax)
        : inputs(std::move(in)), out(std::move(out)), axis(ax) {}
    
    void execute() override {
        int ax = axis;
        if (ax < 0) ax += (int)out->shape.size();
        int offset = 0;
        int outer_size = 1;
        for (int i = 0; i < ax; ++i) outer_size *= out->shape[i];
        int inner_size = 1;
        for (int i = ax + 1; i < (int)out->shape.size(); ++i) inner_size *= out->shape[i];

        for (auto& in_t : inputs) {
            int axis_size = in_t->shape[ax];
            for (int i = 0; i < outer_size; ++i) {
                const double* src = in_t->data.data() + i * axis_size * inner_size;
                double* dst = out->data.data() + (i * out->shape[ax] + offset) * inner_size;
                std::copy(src, src + axis_size * inner_size, dst);
            }
            offset += axis_size;
        }
    }
};

class TransposeOp : public NefOp {
    std::shared_ptr<NefTensor> in, out;
    int dim0, dim1;
public:
    TransposeOp(std::shared_ptr<NefTensor> in, std::shared_ptr<NefTensor> out, int d0, int d1)
        : in(in), out(out), dim0(d0), dim1(d1) {}
    
    void execute() override {
        int size = in->size();
        int d0 = dim0 < 0 ? (int)in->shape.size() + dim0 : dim0;
        int d1 = dim1 < 0 ? (int)in->shape.size() + dim1 : dim1;
        std::vector<int> idx(in->shape.size(), 0);
        for (int i = 0; i < size; ++i) {
            int temp = i;
            for (int j = (int)in->shape.size() - 1; j >= 0; --j) {
                idx[j] = temp % in->shape[j];
                temp /= in->shape[j];
            }
            std::swap(idx[d0], idx[d1]);
            int out_idx = 0;
            for (size_t j = 0; j < out->shape.size(); ++j) {
                out_idx += idx[j] * out->strides[j];
            }
            out->data[out_idx] = in->data[i];
            std::swap(idx[d0], idx[d1]); 
        }
    }
};

class SelectOp : public NefOp {
    std::shared_ptr<NefTensor> in, out;
    int axis, index;
public:
    SelectOp(std::shared_ptr<NefTensor> in, std::shared_ptr<NefTensor> out, int ax, int idx)
        : in(in), out(out), axis(ax), index(idx) {}
    
    void execute() override {
        int ax = axis;
        if (ax < 0) ax += (int)in->shape.size();
        int outer = 1;
        for (int i = 0; i < ax; ++i) outer *= in->shape[i];
        int inner = 1;
        for (int i = ax + 1; i < (int)in->shape.size(); ++i) inner *= in->shape[i];
        int ax_size = in->shape[ax];

        for (int i = 0; i < outer; ++i) {
            const double* src = in->data.data() + (i * ax_size + index) * inner;
            double* dst = out->data.data() + i * inner;
            std::copy(src, src + inner, dst);
        }
    }
};

class ExpandOp : public NefOp {
    std::shared_ptr<NefTensor> in, out;
public:
    ExpandOp(std::shared_ptr<NefTensor> in, std::shared_ptr<NefTensor> out)
        : in(in), out(out) {}
    
    void execute() override {
        int size = out->size();
        std::vector<int> idx(out->shape.size(), 0);
        for (int i = 0; i < size; ++i) {
            int temp = i;
            for (int j = (int)out->shape.size() - 1; j >= 0; --j) {
                idx[j] = temp % out->shape[j];
                temp /= out->shape[j];
            }

            int in_idx = 0;
            for (size_t j = 0; j < in->shape.size(); ++j) {
                int dim = in->shape[j];
                in_idx += (dim == 1 ? 0 : idx[j + (out->shape.size() - in->shape.size())]) * in->strides[j];
            }
            out->data[i] = in->data[in_idx];
        }
    }
};

class LogSoftmaxOp : public NefOp {
    std::shared_ptr<NefTensor> in, out;
    int axis;
public:
    LogSoftmaxOp(std::shared_ptr<NefTensor> in, std::shared_ptr<NefTensor> out, int ax)
        : in(in), out(out), axis(ax) {}
    
    void execute() override {
        int ax = axis;
        if (ax < 0) ax += (int)in->shape.size();
        int outer = 1;
        for (int i = 0; i < ax; ++i) outer *= in->shape[i];
        int inner = 1;
        for (int i = ax + 1; i < (int)in->shape.size(); ++i) inner *= in->shape[i];
        int ax_size = in->shape[ax];

        for (int i = 0; i < outer; ++i) {
            for (int j = 0; j < inner; ++j) {
                double max_val = -1e18;
                for (int k = 0; k < ax_size; ++k) {
                    max_val = std::max(max_val, in->data[(i * ax_size + k) * inner + j]);
                }
                double sum_exp = 0.0;
                for (int k = 0; k < ax_size; ++k) {
                    sum_exp += std::exp(in->data[(i * ax_size + k) * inner + j] - max_val);
                }
                double log_sum_exp = max_val + std::log(sum_exp);
                for (int k = 0; k < ax_size; ++k) {
                    out->data[(i * ax_size + k) * inner + j] = in->data[(i * ax_size + k) * inner + j] - log_sum_exp;
                }
            }
        }
    }
};

class AccuracyOp : public NefOp {
    std::shared_ptr<NefTensor> logits, targets;
    int& correct;
    int& total;
public:
    AccuracyOp(std::shared_ptr<NefTensor> l, std::shared_ptr<NefTensor> t, int& c, int& tot)
        : logits(l), targets(t), correct(c), total(tot) {}
    
    void execute() override {
        int classes = logits->shape.back();
        int batch = logits->size() / classes;
        for (int i = 0; i < batch; ++i) {
            int target = (int)targets->data[i];
            const double* row = logits->data.data() + i * classes;
            int pred = 0;
            double max_val = row[0];
            for (int c = 1; c < classes; ++c) {
                if (row[c] > max_val) {
                    max_val = row[c];
                    pred = c;
                }
            }
            if (pred == target) correct++;
            total++;
        }
    }
};

class MeanOp : public NefOp {
    std::shared_ptr<NefTensor> in, out;
    int axis;
public:
    MeanOp(std::shared_ptr<NefTensor> in, std::shared_ptr<NefTensor> out, int ax)
        : in(in), out(out), axis(ax) {}
    void execute() override {
        int ax = axis;
        if (ax < 0) ax += (int)in->shape.size();
        int denom = in->shape[ax];
        if (denom == 0) denom = 1;
        out->data.assign(out->data.size(), 0.0);
        int outer = 1;
        for (int i = 0; i < ax; ++i) outer *= in->shape[i];
        int inner = 1;
        for (int i = ax + 1; i < (int)in->shape.size(); ++i) inner *= in->shape[i];

        for (int i = 0; i < outer; ++i) {
            for (int k = 0; k < denom; ++k) {
                for (int j = 0; j < inner; ++j) {
                    double val = in->data[(i * denom + k) * inner + j];
                    out->data[i * inner + j] += val / denom;
                }
            }
        }
    }
};

class LayerNormOp : public NefOp {
    std::shared_ptr<NefTensor> x, gamma, beta, out;
    double eps;
public:
    LayerNormOp(std::shared_ptr<NefTensor> x, std::shared_ptr<NefTensor> g, std::shared_ptr<NefTensor> b, std::shared_ptr<NefTensor> o, double e)
        : x(x), gamma(g), beta(b), out(o), eps(e) {}
    
    void execute() override {
        int n_features = x->shape.back();
        if (n_features == 0) return;
        int n_rows = x->size() / n_features;
        for (int r = 0; r < n_rows; ++r) {
            const double* in_ptr = x->data.data() + r * n_features;
            double* row_out = out->data.data() + r * n_features;
            double sum = 0.0;
            for (int f = 0; f < n_features; ++f) sum += in_ptr[f];
            double mean = sum / n_features;
            double var_sum = 0.0;
            for (int f = 0; f < n_features; ++f) {
                double diff = in_ptr[f] - mean;
                var_sum += diff * diff;
            }
            double var = var_sum / n_features;
            double std = std::sqrt(var + eps);
            for (int f = 0; f < n_features; ++f) {
                row_out[f] = ((in_ptr[f] - mean) / std) * gamma->data[f] + beta->data[f];
            }
        }
    }
};

/**
 * NefGraph: The C++ execution engine for AI graphs.
 */
class NefGraph {
    std::vector<std::unique_ptr<NefOp>> ops;
    int correct = 0;
    int total = 0;
public:
    void add_matmul(std::shared_ptr<NefTensor> a, std::shared_ptr<NefTensor> b, std::shared_ptr<NefTensor> out) {
        ops.push_back(std::make_unique<MatMulOp>(a, b, out));
    }
    void add_binary(std::shared_ptr<NefTensor> a, std::shared_ptr<NefTensor> b, std::shared_ptr<NefTensor> out, std::string op) {
        ops.push_back(std::make_unique<BinaryOp>(a, b, out, op));
    }
    void add_relu(std::shared_ptr<NefTensor> in, std::shared_ptr<NefTensor> out) {
        ops.push_back(std::make_unique<ReLUOp>(in, out));
    }
    void add_cat(std::vector<std::shared_ptr<NefTensor>> in, std::shared_ptr<NefTensor> out, int axis) {
        ops.push_back(std::make_unique<CatOp>(std::move(in), std::move(out), axis));
    }
    void add_transpose(std::shared_ptr<NefTensor> in, std::shared_ptr<NefTensor> out, int d0, int d1) {
        ops.push_back(std::make_unique<TransposeOp>(in, out, d0, d1));
    }
    void add_select(std::shared_ptr<NefTensor> in, std::shared_ptr<NefTensor> out, int axis, int index) {
        ops.push_back(std::make_unique<SelectOp>(in, out, axis, index));
    }
    void add_expand(std::shared_ptr<NefTensor> in, std::shared_ptr<NefTensor> out) {
        ops.push_back(std::make_unique<ExpandOp>(in, out));
    }
    void add_log_softmax(std::shared_ptr<NefTensor> in, std::shared_ptr<NefTensor> out, int axis) {
        ops.push_back(std::make_unique<LogSoftmaxOp>(in, out, axis));
    }
    void add_accuracy(std::shared_ptr<NefTensor> logits, std::shared_ptr<NefTensor> targets) {
        ops.push_back(std::make_unique<AccuracyOp>(logits, targets, correct, total));
    }
    void add_mean(std::shared_ptr<NefTensor> in, std::shared_ptr<NefTensor> out, int axis) {
        ops.push_back(std::make_unique<MeanOp>(in, out, axis));
    }
    void add_layernorm(std::shared_ptr<NefTensor> x, std::shared_ptr<NefTensor> g, std::shared_ptr<NefTensor> b, std::shared_ptr<NefTensor> out, double eps) {
        ops.push_back(std::make_unique<LayerNormOp>(x, g, b, out, eps));
    }
    void run() {
        for (auto& op : ops) op->execute();
    }
    double get_accuracy() {
        return total > 0 ? (double)correct / total : 0.0;
    }
    void reset_metrics() { correct = 0; total = 0; }
    void clear() {
        ops.clear();
        reset_metrics();
    }
};

// Legacy compatibility
std::vector<double> fast_matmul(const std::vector<double>& a, const std::vector<int>& a_shape,
                                const std::vector<double>& b, const std::vector<int>& b_shape) {
    auto ta = std::make_shared<NefTensor>(a, a_shape);
    auto tb = std::make_shared<NefTensor>(b, b_shape);
    std::vector<int> out_shape = a_shape;
    out_shape.back() = b_shape.back();
    auto out = NefTensor::zeros(out_shape);
    MatMulOp(ta, tb, out).execute();
    return out->data;
}

std::vector<double> fast_add(const std::vector<double>& a, const std::vector<double>& b) {
    std::vector<double> out(a.size());
    for (size_t i = 0; i < a.size(); ++i) out[i] = a[i] + b[i];
    return out;
}

std::vector<double> fast_relu(const std::vector<double>& a) {
    std::vector<double> out(a.size());
    for (size_t i = 0; i < a.size(); ++i) out[i] = a[i] > 0.0 ? a[i] : 0.0;
    return out;
}

double fast_sum(const std::vector<double>& a) {
    return std::accumulate(a.begin(), a.end(), 0.0);
}

std::vector<double> fast_layernorm(const std::vector<double>& x, const std::vector<double>& gamma, const std::vector<double>& beta, int n_rows, int n_features, double eps) {
    std::vector<double> out(x.size());
    for (int r = 0; r < n_rows; ++r) {
        const double* row_in = x.data() + r * n_features;
        double* row_out = out.data() + r * n_features;
        double sum = 0.0;
        for (int f = 0; f < n_features; ++f) sum += row_in[f];
        double mean = sum / n_features;
        double var_sum = 0.0;
        for (int f = 0; f < n_features; ++f) {
            double diff = row_in[f] - mean;
            var_sum += diff * diff;
        }
        double var = var_sum / n_features;
        double std = std::sqrt(var + eps);
        for (int f = 0; f < n_features; ++f) {
            row_out[f] = ((row_in[f] - mean) / std) * gamma[f] + beta[f];
        }
    }
    return out;
}

std::vector<double> fast_embedding(const std::vector<double>& indices, const std::vector<double>& weight, int vocab_size, int embed_dim) {
    int n_indices = (int)indices.size();
    std::vector<double> out(n_indices * embed_dim);
    for (int i = 0; i < n_indices; ++i) {
        int idx = (int)indices[i];
        if (idx < 0 || idx >= vocab_size) continue;
        const double* w_row = weight.data() + idx * embed_dim;
        double* out_row = out.data() + i * embed_dim;
        std::copy(w_row, w_row + embed_dim, out_row);
    }
    return out;
}

PYBIND11_MODULE(nef_core, m) {
    m.doc() = "NEF2 C++ core backend";

    py::class_<NefTensor, std::shared_ptr<NefTensor>>(m, "NefTensor")
        .def(py::init<std::vector<double>, std::vector<int>, std::string>(), 
             py::arg("data"), py::arg("shape"), py::arg("device") = "cpu")
        .def_readwrite("data", &NefTensor::data)
        .def_readwrite("shape", &NefTensor::shape)
        .def_readwrite("device", &NefTensor::device)
        .def("size", &NefTensor::size)
        .def_static("zeros", &NefTensor::zeros, py::arg("shape"), py::arg("device") = "cpu")
        .def_static("randn", &NefTensor::randn, py::arg("shape"), py::arg("scale") = 1.0, py::arg("device") = "cpu")
        .def("tolist", [](NefTensor& self) { return self.data; });

    py::class_<NefGraph>(m, "NefGraph")
        .def(py::init<>())
        .def("add_matmul", &NefGraph::add_matmul)
        .def("add_binary", &NefGraph::add_binary)
        .def("add_relu", &NefGraph::add_relu)
        .def("add_cat", &NefGraph::add_cat)
        .def("add_transpose", &NefGraph::add_transpose)
        .def("add_select", &NefGraph::add_select)
        .def("add_expand", &NefGraph::add_expand)
        .def("add_log_softmax", &NefGraph::add_log_softmax)
        .def("add_accuracy", &NefGraph::add_accuracy)
        .def("add_mean", &NefGraph::add_mean)
        .def("add_layernorm", &NefGraph::add_layernorm)
        .def("run", &NefGraph::run)
        .def("get_accuracy", &NefGraph::get_accuracy)
        .def("reset_metrics", &NefGraph::reset_metrics)
        .def("clear", &NefGraph::clear);

    m.def("fast_matmul", &fast_matmul, "High-performance CPU matrix multiplication");
    m.def("fast_add", &fast_add, "High-performance CPU addition");
    m.def("fast_relu", &fast_relu, "High-performance CPU ReLU");
    m.def("fast_sum", &fast_sum, "High-performance CPU sum");
    m.def("fast_layernorm", &fast_layernorm, "High-performance CPU LayerNorm");
    m.def("fast_embedding", &fast_embedding, "High-performance CPU Embedding lookup");
    m.def("fast_log_softmax", [](const std::vector<double>& in, const std::vector<int>& shape, int axis) {
        auto tin = std::make_shared<NefTensor>(in, shape);
        auto tout = NefTensor::zeros(shape);
        LogSoftmaxOp(tin, tout, axis).execute();
        return tout->data;
    });
}
