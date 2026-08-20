"use client";

import React, { useEffect, useState, FormEvent } from "react";
import { Heart, Plus, Trash2, Edit2, X } from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  basePrice: number;
  stock: number;
  description?: string;
  imageUrl?: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    brand: "",
    category: "",
    basePrice: 0,
    stock: 0,
    imageUrl: "",
    description: "",
  });

  const loadProducts = () => {
    setLoading(true);
    fetch("/backend-api/products")
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setProducts(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error(err);
        toast.error("Lỗi khi tải dữ liệu sản phẩm");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({ name: "", brand: "", category: "", basePrice: 0, stock: 0, imageUrl: "", description: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({ ...product });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'basePrice' || name === 'stock' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const isEditing = !!editingProduct;
      const url = isEditing ? `/backend-api/products/${editingProduct.id}` : `/backend-api/products`;
      const method = isEditing ? "PUT" : "POST";
      
      const payload = {
        ...formData,
        id: isEditing ? editingProduct.id : undefined
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Failed to save product");

      toast.success(isEditing ? "Cập nhật sản phẩm thành công!" : "Thêm mới sản phẩm thành công!");
      closeModal();
      loadProducts();
    } catch (err) {
      console.error(err);
      toast.error("Đã xảy ra lỗi khi lưu sản phẩm");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;
    
    try {
      const res = await fetch(`/backend-api/products/${id}`, {
        method: "DELETE"
      });
      
      if (!res.ok) throw new Error("Failed to delete");
      
      toast.success("Xóa sản phẩm thành công!");
      loadProducts();
    } catch (err) {
      console.error(err);
      toast.error("Đã xảy ra lỗi khi xóa sản phẩm");
    }
  };

  return (
    <div className="flex flex-col xl:flex-row gap-5 max-w-full">
      {/* Main Left Content */}
      <div className="flex-1 flex flex-col gap-5 min-w-0">
        
        {/* Banner */}
        <div className="w-full bg-gradient-to-br from-[#868CFF] to-[#4318FF] rounded-[20px] p-10 flex flex-col justify-center relative overflow-hidden min-h-[340px]">
          <div className="relative z-10 max-w-md">
            <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight mb-4">
              Khám phá và Kinh doanh Thiết bị đỉnh cao
            </h1>
            <p className="text-white/90 text-sm font-medium mb-8">
              Tham gia vào thế giới công nghệ. Bắt đầu tìm kiếm những sản phẩm mới nhất hoặc quản lý kho hàng của riêng bạn!
            </p>
            <div className="flex items-center gap-4">
              <button onClick={openAddModal} className="flex items-center gap-2 bg-white text-horizon-dark hover:bg-gray-50 transition-colors font-bold text-sm px-6 py-2.5 rounded-xl">
                <Plus className="h-4 w-4" /> Tạo Sản Phẩm
              </button>
            </div>
          </div>
          
          {/* Abstract 3D shape decorative element */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-64 md:w-96 md:h-96 opacity-50 md:opacity-100 pointer-events-none">
            <div className="w-full h-full bg-white/10 rounded-full blur-3xl absolute" />
            <div className="w-48 h-48 bg-gradient-to-tr from-white/20 to-transparent rounded-2xl absolute right-10 top-10 rotate-12 backdrop-blur-sm border border-white/20" />
            <div className="w-32 h-32 bg-gradient-to-bl from-white/20 to-transparent rounded-full absolute right-40 bottom-20 -rotate-12 backdrop-blur-sm border border-white/20" />
          </div>
        </div>

        {/* Trending Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-horizon-dark dark:text-white">Sản phẩm Nổi bật</h2>
            <div className="flex items-center gap-4 text-sm font-medium text-horizon-brand dark:text-white">
              <button className="text-horizon-brand font-bold">Tất cả</button>
              <button className="text-horizon-gray hover:text-horizon-dark dark:hover:text-white transition-colors">Thiết bị</button>
              <button className="text-horizon-gray hover:text-horizon-dark dark:hover:text-white transition-colors">Phụ kiện</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="bg-white dark:bg-horizon-dark-card rounded-[20px] p-4 shadow-[0_4px_12px_rgba(0,0,0,0.02)] h-[320px] animate-pulse">
                  <div className="w-full h-48 bg-gray-200 dark:bg-white/10 rounded-xl mb-4" />
                  <div className="w-2/3 h-5 bg-gray-200 dark:bg-white/10 rounded mb-2" />
                  <div className="w-1/3 h-4 bg-gray-200 dark:bg-white/10 rounded" />
                </div>
              ))
            ) : products.length > 0 ? (
              products.map((product) => (
                <div key={product.id} className="bg-white dark:bg-horizon-dark-card rounded-[20px] p-4 shadow-[0_4px_12px_rgba(0,0,0,0.02)] group hover:-translate-y-1 transition-transform relative">
                  <div className="w-full h-48 rounded-xl bg-gray-100 dark:bg-horizon-dark-bg mb-4 relative overflow-hidden flex items-center justify-center">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-32 h-32 bg-gradient-to-tr from-[#868CFF] to-[#4318FF] rounded-lg shadow-lg rotate-12 group-hover:scale-110 transition-transform duration-500" />
                    )}
                    
                    {/* Action overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                      <button onClick={() => openEditModal(product)} className="flex items-center gap-2 bg-white text-horizon-dark px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-100">
                        <Edit2 className="h-4 w-4" /> Sửa
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-red-600">
                        <Trash2 className="h-4 w-4" /> Xóa
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-start justify-between">
                    <div className="w-full">
                      <h3 className="text-lg font-bold text-horizon-dark dark:text-white mb-1 truncate">
                        {product.name}
                      </h3>
                      <p className="text-sm font-medium text-horizon-gray dark:text-horizon-dark-gray truncate">
                        Bởi {product.brand} • Kho: {product.stock}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-bold text-horizon-dark dark:text-white">
                      {product.basePrice.toLocaleString('vi-VN')} đ
                    </span>
                    <button className="bg-[#F4F7FE] dark:bg-white/10 text-horizon-brand dark:text-white text-xs font-bold px-4 py-2 rounded-full">
                      {product.category}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-horizon-gray dark:text-horizon-dark-gray font-medium">
                Chưa có sản phẩm nào. Hãy tạo sản phẩm mới!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-full xl:w-[350px] flex flex-col gap-5 shrink-0">
        <div className="bg-white dark:bg-horizon-dark-card rounded-[20px] p-6 shadow-[0_4px_12px_rgba(0,0,0,0.02)] flex-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-horizon-dark dark:text-white">Kho hàng Top</h2>
            <button className="text-horizon-brand bg-[#F4F7FE] dark:bg-horizon-dark-bg px-4 py-1.5 rounded-full text-xs font-bold hover:bg-[#E9EDF7] transition-colors">
              Xem tất cả
            </button>
          </div>

          <div className="space-y-4">
            {products.slice(0, 8).map((p, i) => (
              <div key={p.id || i} className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#868CFF] to-[#4318FF] shrink-0 overflow-hidden">
                    {p.imageUrl && <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-horizon-dark dark:text-white truncate">{p.name}</h3>
                    <p className="text-xs font-medium text-horizon-gray dark:text-horizon-dark-gray truncate">{p.brand}</p>
                  </div>
                </div>
                <div className="text-sm font-bold text-horizon-dark dark:text-white shrink-0 ml-4 text-right">
                  {p.stock} <span className="block text-horizon-gray text-xs">tồn kho</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-horizon-dark-card w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/10">
              <h2 className="text-xl font-bold text-horizon-dark dark:text-white">
                {editingProduct ? "Cập nhật Sản Phẩm" : "Thêm Sản Phẩm Mới"}
              </h2>
              <button onClick={closeModal} className="text-horizon-gray hover:text-horizon-dark dark:hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-horizon-dark dark:text-white mb-2">Tên sản phẩm *</label>
                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-[#F4F7FE] dark:bg-[#0B1437] border-none rounded-xl px-4 py-3 text-sm text-horizon-dark dark:text-white outline-none focus:ring-2 focus:ring-horizon-brand" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-horizon-dark dark:text-white mb-2">Hãng *</label>
                  <input required type="text" name="brand" value={formData.brand} onChange={handleInputChange} className="w-full bg-[#F4F7FE] dark:bg-[#0B1437] border-none rounded-xl px-4 py-3 text-sm text-horizon-dark dark:text-white outline-none focus:ring-2 focus:ring-horizon-brand" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-horizon-dark dark:text-white mb-2">Danh mục *</label>
                  <input required type="text" name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-[#F4F7FE] dark:bg-[#0B1437] border-none rounded-xl px-4 py-3 text-sm text-horizon-dark dark:text-white outline-none focus:ring-2 focus:ring-horizon-brand" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-horizon-dark dark:text-white mb-2">Giá (đ) *</label>
                  <input required type="number" min="0" name="basePrice" value={formData.basePrice} onChange={handleInputChange} className="w-full bg-[#F4F7FE] dark:bg-[#0B1437] border-none rounded-xl px-4 py-3 text-sm text-horizon-dark dark:text-white outline-none focus:ring-2 focus:ring-horizon-brand" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-horizon-dark dark:text-white mb-2">Tồn kho *</label>
                  <input required type="number" min="0" name="stock" value={formData.stock} onChange={handleInputChange} className="w-full bg-[#F4F7FE] dark:bg-[#0B1437] border-none rounded-xl px-4 py-3 text-sm text-horizon-dark dark:text-white outline-none focus:ring-2 focus:ring-horizon-brand" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-horizon-dark dark:text-white mb-2">URL Hình ảnh</label>
                <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} placeholder="https://..." className="w-full bg-[#F4F7FE] dark:bg-[#0B1437] border-none rounded-xl px-4 py-3 text-sm text-horizon-dark dark:text-white outline-none focus:ring-2 focus:ring-horizon-brand" />
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={closeModal} className="flex-1 bg-gray-100 dark:bg-white/10 text-horizon-dark dark:text-white font-bold py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-white/20 transition-colors">
                  Hủy
                </button>
                <button type="submit" disabled={isSubmitting} className="flex-1 bg-horizon-brand text-white font-bold py-3 rounded-xl hover:bg-horizon-brand/90 transition-colors disabled:opacity-70">
                  {isSubmitting ? "Đang xử lý..." : "Lưu Sản Phẩm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
