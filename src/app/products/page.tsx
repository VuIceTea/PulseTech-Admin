"use client";

import React, { useEffect, useState } from "react";
import { 
  Package, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Tag, 
  DollarSign, 
  Filter, 
  X, 
  Check, 
  RefreshCw, 
  Layers, 
  Sparkles, 
  TrendingDown 
} from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  basePrice: number;
  price: number;
  discountPercentage: number;
  stock: number;
  imageUrl?: string;
  description?: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    brand: "Apple",
    category: "Điện thoại",
    basePrice: 20000000,
    price: 18000000,
    discountPercentage: 10,
    stock: 50,
    imageUrl: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&q=80",
    description: "Sản phẩm chính hãng PulseTech cao cấp, bảo hành 12 tháng.",
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/backend-api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } else {
        toast.error("Không thể tải danh sách sản phẩm");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi kết nối tới máy chủ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      brand: "Apple",
      category: "Điện thoại",
      basePrice: 25000000,
      price: 22500000,
      discountPercentage: 10,
      stock: 50,
      imageUrl: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&q=80",
      description: "Sản phẩm công nghệ chính hãng PulseTech cao cấp.",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || "",
      brand: product.brand || "Apple",
      category: product.category || "Điện thoại",
      basePrice: product.basePrice || product.price || 0,
      price: product.price || 0,
      discountPercentage: product.discountPercentage || 0,
      stock: product.stock || 0,
      imageUrl: product.imageUrl || "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&q=80",
      description: product.description || "Sản phẩm chính hãng PulseTech",
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên sản phẩm");
      return;
    }

    try {
      const url = editingProduct
        ? `/backend-api/products/${editingProduct.id}`
        : "/backend-api/products";
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(
          editingProduct ? "Cập nhật sản phẩm thành công!" : "Đã thêm sản phẩm mới thành công!"
        );
        setIsModalOpen(false);
        fetchProducts();
      } else {
        toast.error("Lỗi khi lưu thông tin sản phẩm");
      }
    } catch (err) {
      console.error(err);
      toast.error("Không thể kết nối API");
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${name}" khỏi cửa hàng không?`)) {
      return;
    }

    try {
      const res = await fetch(`/backend-api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Đã xóa sản phẩm thành công");
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        toast.error("Lỗi khi xóa sản phẩm");
      }
    } catch (err) {
      console.error(err);
      toast.error("Không thể kết nối tới máy chủ");
    }
  };

  const categories = ["ALL", "Điện thoại", "Laptop", "Phụ kiện", "Đồng hồ"];

  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = selectedCategory === "ALL" || p.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Quản lý Danh mục Sản phẩm</span>
            <span className="text-xs bg-red-50 text-red-600 font-bold px-2.5 py-1 rounded-full border border-red-200">
              {products.length} mã hàng
            </span>
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Xem danh sách sản phẩm đang kinh doanh trên website PulseTech, cập nhật giá bán & tồn kho.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchProducts}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all border border-slate-200 shadow-xs"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-red-600" : ""}`} />
            <span>Làm mới</span>
          </button>
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-all shadow-md shadow-red-600/20"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>Thêm sản phẩm mới</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? "bg-red-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
              }`}
            >
              {cat === "ALL" ? "Tất cả danh mục" : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên sản phẩm, hãng, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
          />
        </div>
      </div>

      {/* Product List Cards */}
      <div className="rounded-2xl bg-white border border-slate-200/80 overflow-hidden shadow-xs">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-red-600 border-t-transparent mb-3" />
            <p className="text-sm font-semibold text-slate-700">Đang tải danh sách sản phẩm từ máy chủ...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-6">Sản phẩm & Hãng</th>
                  <th className="py-3.5 px-4">Danh mục</th>
                  <th className="py-3.5 px-4">Giá gốc</th>
                  <th className="py-3.5 px-4">Giá bán ưu đãi</th>
                  <th className="py-3.5 px-4">Giảm giá</th>
                  <th className="py-3.5 px-4">Tồn kho</th>
                  <th className="py-3.5 px-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3.5">
                        <div className="h-12 w-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                          {p.imageUrl ? (
                            <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" />
                          ) : (
                            <Package className="h-6 w-6 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-1">
                            {p.name}
                          </div>
                          <div className="text-xs font-semibold text-slate-500">
                            {p.brand} <span className="text-slate-300">•</span> <span className="font-mono text-slate-400">#{p.id?.slice(0, 8)}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-medium">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-400 line-through">
                      {p.basePrice ? `${p.basePrice.toLocaleString("vi-VN")} đ` : "-"}
                    </td>
                    <td className="py-4 px-4 font-extrabold text-red-600">
                      {p.price ? `${p.price.toLocaleString("vi-VN")} đ` : "-"}
                    </td>
                    <td className="py-4 px-4">
                      {p.discountPercentage > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-200">
                          <TrendingDown className="h-3 w-3" />
                          <span>-{p.discountPercentage}%</span>
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">Không có</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                          p.stock > 10
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : p.stock > 0
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            p.stock > 10 ? "bg-emerald-500" : p.stock > 0 ? "bg-amber-500" : "bg-red-500"
                          }`}
                        />
                        <span>{p.stock > 0 ? `${p.stock} sản phẩm` : "Hết hàng"}</span>
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                          title="Chỉnh sửa sản phẩm"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="p-2 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 transition-colors"
                          title="Xóa sản phẩm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Package className="h-12 w-12 text-slate-300 mb-3" />
            <p className="text-base font-bold text-slate-900">Không tìm thấy sản phẩm nào khớp bộ lọc</p>
            <p className="text-xs text-slate-500 mt-1">
              Thử tìm kiếm với từ khóa khác hoặc bấm nút Thêm sản phẩm mới ở phía trên.
            </p>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-red-600" />
                <span>{editingProduct ? "Chỉnh Sửa Sản Phẩm" : "Thêm Sản Phẩm Mới"}</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                  Tên sản phẩm (*)
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ví dụ: iPhone 16 Pro Max 256GB"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                    Thương hiệu
                  </label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="Apple, Samsung, Xiaomi..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                    Danh mục hàng
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  >
                    <option value="Điện thoại">Điện thoại</option>
                    <option value="Laptop">Laptop</option>
                    <option value="Phụ kiện">Phụ kiện</option>
                    <option value="Đồng hồ">Đồng hồ</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                    Giá gốc (VNĐ)
                  </label>
                  <input
                    type="number"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                    Giá bán khuyến mãi (VNĐ)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-extrabold text-red-600 focus:outline-none focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                    % Giảm giá
                  </label>
                  <input
                    type="number"
                    value={formData.discountPercentage}
                    onChange={(e) => setFormData({ ...formData, discountPercentage: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                    Số lượng trong kho
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                    URL Hình ảnh
                  </label>
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                  Mô tả sản phẩm
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả chi tiết sản phẩm..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-all shadow-md shadow-red-600/20"
                >
                  {editingProduct ? "Lưu thay đổi" : "Tạo sản phẩm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
