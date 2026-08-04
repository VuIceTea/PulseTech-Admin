"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { 
  Package, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Percent, 
  Tag, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Save, 
  RefreshCw,
  Sparkles,
  DollarSign
} from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  basePrice: number;
  originalPrice: number;
  discount: number;
  image: string;
  description: string;
  isFeatured?: boolean;
  isFlashSale?: boolean;
  stock?: number;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Tất cả");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    brand: "Apple",
    category: "Điện thoại",
    basePrice: 20000000,
    originalPrice: 25000000,
    discount: 20,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600",
    description: "Sản phẩm công nghệ chính hãng cao cấp tại PulseTech",
    stock: 50,
    isFeatured: true,
    isFlashSale: false,
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
      toast.error("Lỗi kết nối tới backend");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenAdd = () => {
    setFormData({
      name: "",
      brand: "Apple",
      category: "Điện thoại",
      basePrice: 20000000,
      originalPrice: 25000000,
      discount: 20,
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600",
      description: "Sản phẩm công nghệ chính hãng cao cấp tại PulseTech",
      stock: 50,
      isFeatured: true,
      isFlashSale: false,
    });
    setEditingProduct(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (prod: Product) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name || "",
      brand: prod.brand || "Apple",
      category: prod.category || "Điện thoại",
      basePrice: prod.basePrice || 10000000,
      originalPrice: prod.originalPrice || 12000000,
      discount: prod.discount || 0,
      image: prod.image || "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600",
      description: prod.description || "Sản phẩm chính hãng PulseTech",
      stock: prod.stock ?? 50,
      isFeatured: !!prod.isFeatured,
      isFlashSale: !!prod.isFlashSale,
    });
    setIsAddModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên sản phẩm");
      return;
    }
    setSubmitting(true);
    try {
      const url = editingProduct
        ? `/backend-api/products/${editingProduct.id}`
        : `/backend-api/products`;
      const method = editingProduct ? "PUT" : "POST";

      const payload = {
        ...(editingProduct ? { id: editingProduct.id } : {}),
        ...formData,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(editingProduct ? "Đã cập nhật sản phẩm thành công" : "Đã tạo sản phẩm mới thành công");
        setIsAddModalOpen(false);
        fetchProducts();
      } else {
        toast.error("Lỗi từ máy chủ khi lưu sản phẩm");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi kết nối tới máy chủ");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${name}" không?`)) return;
    try {
      const res = await fetch(`/backend-api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Đã xóa sản phẩm thành công");
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        toast.error("Không thể xóa sản phẩm này");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi gọi API xóa");
    }
  };

  const categories = ["Tất cả", "Điện thoại", "Laptop", "Phụ kiện", "Đồng hồ"];

  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.brand?.toLowerCase().includes(search.toLowerCase()) ||
      p.id?.toLowerCase().includes(search.toLowerCase());
    const matchCat =
      categoryFilter === "Tất cả" ||
      p.category?.toLowerCase() === categoryFilter.toLowerCase();
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Quản lý Kho & Sản phẩm</span>
            <span className="text-xs bg-rose-500/20 text-rose-400 font-semibold px-2.5 py-1 rounded-full border border-rose-500/30">
              {products.length} mã hàng
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Thêm mới, sửa giá, điều chỉnh mã giảm giá và quản lý kho hàng trong Microservice Product Catalog.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchProducts}
            disabled={loading}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all"
            title="Làm mới"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? "animate-spin text-rose-400" : ""}`} />
          </button>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-sm shadow-lg shadow-rose-600/30 transition-all"
          >
            <Plus className="h-5 w-5" />
            <span>Thêm Sản Phẩm Mới</span>
          </button>
        </div>
      </div>

      {/* Filter and search toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
        {/* Category filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                categoryFilter === cat
                  ? "bg-rose-500 text-white shadow-md shadow-rose-500/30"
                  : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Tìm theo tên, hãng hoặc ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 overflow-hidden shadow-xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-rose-500 border-t-transparent mb-3" />
            <p className="text-sm font-semibold text-slate-300">Đang đồng bộ dữ liệu sản phẩm từ máy chủ...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/60 border-b border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-6">Sản phẩm</th>
                  <th className="py-3.5 px-4">Danh mục</th>
                  <th className="py-3.5 px-4">Giá bán (Base Price)</th>
                  <th className="py-3.5 px-4">Giảm giá</th>
                  <th className="py-3.5 px-4">Kho</th>
                  <th className="py-3.5 px-6 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-sm">
                {filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-slate-800 shrink-0 border border-slate-700">
                          <Image
                            src={prod.image || "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300"}
                            alt={prod.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-white group-hover:text-rose-400 transition-colors">
                            {prod.name}
                          </div>
                          <div className="text-xs text-slate-400 font-mono">
                            ID: #{prod.id} • Hãng: {prod.brand}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                        {prod.category}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-rose-400">
                        {prod.basePrice?.toLocaleString("vi-VN")} đ
                      </div>
                      {prod.originalPrice > prod.basePrice && (
                        <div className="text-xs text-slate-500 line-through">
                          {prod.originalPrice?.toLocaleString("vi-VN")} đ
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {prod.discount > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          <Percent className="h-3 w-3" />
                          <span>-{prod.discount}%</span>
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500 font-medium">Không giảm</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {prod.stock ?? 50} trong kho
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(prod)}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="Chỉnh sửa sản phẩm"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(prod.id, prod.name)}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
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
            <Package className="h-12 w-12 text-slate-600 mb-3" />
            <p className="text-base font-bold text-white">Không tìm thấy sản phẩm nào</p>
            <p className="text-xs text-slate-400 mt-1">
              Thử tìm từ khóa khác hoặc bấm phím &quot;Thêm Sản Phẩm Mới&quot; để bổ sung vào kho.
            </p>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 md:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {editingProduct ? "Chỉnh Sửa Sản Phẩm" : "Thêm Sản Phẩm Mới"}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Điền các thông số để lưu trực tiếp vào cơ sở dữ liệu MongoDB Atlas.
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Tên sản phẩm *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ví dụ: iPhone 16 Pro Max 256GB"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                {/* Brand */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Hãng (Brand)
                  </label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="Apple, Samsung, Xiaomi..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Danh mục
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="Điện thoại">Điện thoại</option>
                    <option value="Laptop">Laptop</option>
                    <option value="Phụ kiện">Phụ kiện</option>
                    <option value="Đồng hồ">Đồng hồ</option>
                  </select>
                </div>

                {/* Base Price */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Giá bán (VND)
                  </label>
                  <input
                    type="number"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                {/* Original Price */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Giá gốc niêm yết (VND)
                  </label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                {/* Discount */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Giảm giá (%)
                  </label>
                  <input
                    type="number"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                {/* Stock */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Số lượng trong kho
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                {/* Image URL */}
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    URL hình ảnh chính
                  </label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Mô tả sản phẩm
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800 mt-6">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-sm shadow-lg shadow-rose-600/30 transition-all disabled:opacity-50"
                >
                  {submitting ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>{editingProduct ? "Lưu Thay Đổi" : "Tạo Sản Phẩm"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
