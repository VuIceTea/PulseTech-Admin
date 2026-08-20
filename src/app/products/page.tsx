"use client";

import React, { useEffect, useState, FormEvent } from "react";
import { Plus, Trash2, Edit2, X, Search, Filter, PlusCircle, MinusCircle } from "lucide-react";
import { toast } from "sonner";

interface ColorVariant {
  name: string;
  hex: string;
  image?: string;
}

interface StorageVariant {
  name: string;
  priceOffset: number;
}

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  basePrice: number;
  stock: number;
  description?: string;
  image?: string;
  colors: ColorVariant[];
  storages: StorageVariant[];
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Tất cả");

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
    image: "",
    description: "",
    colors: [],
    storages: []
  });

  const loadProducts = () => {
    setLoading(true);
    fetch("/backend-api/products")
      .then(res => res.ok ? res.json() : [])
      .then(data => setProducts(Array.isArray(data) ? data : []))
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
    setFormData({ 
      name: "", brand: "", category: "phone", basePrice: 0, stock: 0, image: "", description: "", 
      colors: [], storages: [] 
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({ 
      ...product,
      colors: product.colors || [],
      storages: product.storages || []
    });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'basePrice' || name === 'stock' ? Number(value) : value
    }));
  };

  const addColor = () => setFormData(p => ({ ...p, colors: [...(p.colors || []), { name: "", hex: "#000000" }] }));
  const removeColor = (idx: number) => setFormData(p => ({ ...p, colors: (p.colors || []).filter((_, i) => i !== idx) }));
  const updateColor = (idx: number, field: string, val: string) => {
    const newColors = [...(formData.colors || [])];
    newColors[idx] = { ...newColors[idx], [field]: val };
    setFormData(p => ({ ...p, colors: newColors }));
  };

  const addStorage = () => setFormData(p => ({ ...p, storages: [...(p.storages || []), { name: "", priceOffset: 0 }] }));
  const removeStorage = (idx: number) => setFormData(p => ({ ...p, storages: (p.storages || []).filter((_, i) => i !== idx) }));
  const updateStorage = (idx: number, field: string, val: string | number) => {
    const newStorages = [...(formData.storages || [])];
    newStorages[idx] = { ...newStorages[idx], [field]: val };
    setFormData(p => ({ ...p, storages: newStorages }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const isEditing = !!editingProduct;
      const url = isEditing ? `/backend-api/products/${editingProduct.id}` : `/backend-api/products`;
      const payload = { ...formData, id: isEditing ? editingProduct.id : undefined };
      const res = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success(isEditing ? "Cập nhật sản phẩm thành công!" : "Thêm mới sản phẩm thành công!");
      closeModal();
      loadProducts();
    } catch (err) {
      toast.error("Đã xảy ra lỗi khi lưu sản phẩm");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;
    try {
      const res = await fetch(`/backend-api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      toast.success("Xóa sản phẩm thành công!");
      loadProducts();
    } catch (err) {
      toast.error("Đã xảy ra lỗi khi xóa sản phẩm");
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "Tất cả" || p.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col gap-6 max-w-full relative">
      
      {/* Top Header with Sticky Add Button & Filters */}
      <div className="bg-white dark:bg-horizon-dark-card rounded-[20px] p-6 shadow-[0_4px_12px_rgba(0,0,0,0.02)] sticky top-4 z-20 flex flex-col md:flex-row gap-4 items-center justify-between">
        <h1 className="text-2xl font-bold text-horizon-dark dark:text-white shrink-0">Quản lý Sản Phẩm</h1>
        
        <div className="flex-1 flex flex-col sm:flex-row items-center gap-4 w-full md:max-w-2xl justify-end">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-horizon-gray" />
            <input 
              type="text" 
              placeholder="Tìm tên sản phẩm..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#F4F7FE] dark:bg-[#0B1437] rounded-full pl-10 pr-4 py-2.5 text-sm text-horizon-dark dark:text-white outline-none focus:ring-2 focus:ring-horizon-brand"
            />
          </div>
          
          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto shrink-0 pb-2 sm:pb-0 hide-scrollbar">
            {["Tất cả", "phone", "tablet", "laptop", "accessory", "audio"].map(cat => (
              <button 
                key={cat} 
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${categoryFilter === cat ? 'bg-horizon-brand text-white' : 'bg-[#F4F7FE] dark:bg-white/5 text-horizon-gray hover:bg-gray-200 dark:hover:bg-white/10'}`}
              >
                {cat === 'Tất cả' ? 'Tất cả' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Primary Add Button */}
        <button onClick={openAddModal} className="flex items-center gap-2 bg-horizon-brand text-white font-bold px-6 py-3 rounded-full hover:bg-horizon-brand/90 transition-transform hover:scale-105 shadow-lg shadow-horizon-brand/30 shrink-0 w-full md:w-auto justify-center">
          <Plus className="h-5 w-5" /> THÊM SẢN PHẨM MỚI
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-white dark:bg-horizon-dark-card rounded-[20px] p-4 shadow-[0_4px_12px_rgba(0,0,0,0.02)] h-[340px] animate-pulse">
              <div className="w-full h-48 bg-gray-200 dark:bg-white/10 rounded-xl mb-4" />
              <div className="w-2/3 h-5 bg-gray-200 dark:bg-white/10 rounded mb-2" />
            </div>
          ))
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="bg-white dark:bg-horizon-dark-card rounded-[20px] p-5 shadow-[0_4px_12px_rgba(0,0,0,0.02)] group hover:-translate-y-1 transition-transform relative flex flex-col">
              <div className="w-full aspect-square rounded-xl bg-white dark:bg-white/5 mb-4 relative overflow-hidden flex items-center justify-center p-4">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="w-24 h-24 bg-gray-200 dark:bg-white/10 rounded-lg flex items-center justify-center text-horizon-gray text-xs text-center p-2">Không có ảnh</div>
                )}
                
                {/* Out of stock badge */}
                {product.stock === 0 && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm z-10">
                    HẾT HÀNG
                  </div>
                )}
                
                {/* Action overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 z-10">
                  <button onClick={() => openEditModal(product)} className="flex items-center gap-2 bg-white text-horizon-dark w-28 justify-center py-2 rounded-lg font-bold text-sm hover:bg-gray-100">
                    <Edit2 className="h-4 w-4" /> Sửa
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="flex items-center gap-2 bg-red-500 text-white w-28 justify-center py-2 rounded-lg font-bold text-sm hover:bg-red-600">
                    <Trash2 className="h-4 w-4" /> Xóa
                  </button>
                </div>
              </div>
              
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-horizon-dark dark:text-white line-clamp-2 leading-tight mb-1">
                    {product.name}
                  </h3>
                  <p className="text-xs font-medium text-horizon-gray dark:text-horizon-dark-gray">
                    Hãng: {product.brand}
                  </p>
                </div>

                <div className="mt-4 flex items-end justify-between border-t border-gray-50 dark:border-white/5 pt-3">
                  <div>
                    <span className="block text-xs font-medium text-horizon-gray mb-1">Giá bán</span>
                    <span className="font-bold text-horizon-brand dark:text-white text-base">
                      {product.basePrice.toLocaleString('vi-VN')} ₫
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block text-xs font-medium text-horizon-gray mb-1">Tồn kho</span>
                    <span className={`font-bold text-base ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {product.stock}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 text-horizon-gray dark:text-horizon-dark-gray font-medium bg-white dark:bg-horizon-dark-card rounded-[20px]">
            <div className="text-4xl mb-4">📦</div>
            Không tìm thấy sản phẩm nào. Hãy thử đổi bộ lọc hoặc thêm mới!
          </div>
        )}
      </div>

      {/* Massive Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white dark:bg-horizon-dark-card w-full max-w-3xl rounded-[24px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 my-auto">
            <div className="flex items-center justify-between p-6 md:p-8 border-b border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-black/20">
              <div>
                <h2 className="text-2xl font-extrabold text-horizon-dark dark:text-white">
                  {editingProduct ? "Cập nhật Sản Phẩm" : "Thêm Sản Phẩm Mới"}
                </h2>
                <p className="text-sm text-horizon-gray mt-1">Điền đầy đủ các thông tin và biến thể bên dưới</p>
              </div>
              <button onClick={closeModal} className="h-10 w-10 bg-white dark:bg-white/10 rounded-full flex items-center justify-center text-horizon-gray hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/20 transition-colors shadow-sm">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 md:p-8 max-h-[70vh] overflow-y-auto custom-scrollbar space-y-8">
              
              {/* Section: Thông tin chung */}
              <div>
                <h3 className="text-lg font-bold text-horizon-dark dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-horizon-brand text-white flex items-center justify-center text-sm">1</span> Thông tin cơ bản
                </h3>
                <div className="space-y-5 bg-gray-50 dark:bg-white/5 p-5 rounded-2xl">
                  <div>
                    <label className="block text-sm font-bold text-horizon-dark dark:text-white mb-2">Tên sản phẩm *</label>
                    <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-white dark:bg-[#0B1437] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-base text-horizon-dark dark:text-white outline-none focus:border-horizon-brand transition-colors shadow-sm" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-horizon-dark dark:text-white mb-2">Hãng sản xuất *</label>
                      <input required type="text" name="brand" value={formData.brand} onChange={handleInputChange} className="w-full bg-white dark:bg-[#0B1437] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-base text-horizon-dark dark:text-white outline-none focus:border-horizon-brand transition-colors shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-horizon-dark dark:text-white mb-2">Danh mục *</label>
                      <select required name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-white dark:bg-[#0B1437] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-base text-horizon-dark dark:text-white outline-none focus:border-horizon-brand transition-colors shadow-sm">
                        <option value="phone">Điện thoại (phone)</option>
                        <option value="tablet">Máy tính bảng (tablet)</option>
                        <option value="laptop">Laptop (laptop)</option>
                        <option value="accessory">Phụ kiện (accessory)</option>
                        <option value="audio">Âm thanh (audio)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-horizon-dark dark:text-white mb-2">Giá bán cơ bản (VNĐ) *</label>
                      <input required type="number" min="0" name="basePrice" value={formData.basePrice} onChange={handleInputChange} className="w-full bg-white dark:bg-[#0B1437] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-base font-mono text-horizon-brand dark:text-horizon-brand font-bold outline-none focus:border-horizon-brand transition-colors shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-horizon-dark dark:text-white mb-2">Số lượng Tồn kho *</label>
                      <input required type="number" min="0" name="stock" value={formData.stock} onChange={handleInputChange} className="w-full bg-white dark:bg-[#0B1437] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-base font-bold text-horizon-dark dark:text-white outline-none focus:border-horizon-brand transition-colors shadow-sm" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-horizon-dark dark:text-white mb-2">URL Hình ảnh (Link ảnh online) *</label>
                    <input required type="url" name="image" value={formData.image} onChange={handleInputChange} placeholder="https://..." className="w-full bg-white dark:bg-[#0B1437] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-horizon-dark dark:text-white outline-none focus:border-horizon-brand transition-colors shadow-sm" />
                    <p className="text-xs text-horizon-gray mt-2 italic">Chú ý: Chỉ lưu URL ảnh để hệ thống tải nhẹ và chạy nhanh.</p>
                  </div>
                </div>
              </div>

              {/* Section: Biến thể Màu sắc */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-horizon-dark dark:text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#05CD99] text-white flex items-center justify-center text-sm">2</span> Biến thể Màu sắc
                  </h3>
                  <button type="button" onClick={addColor} className="flex items-center gap-1 text-sm font-bold text-[#05CD99] hover:underline">
                    <PlusCircle className="h-4 w-4" /> Thêm màu
                  </button>
                </div>
                
                <div className="space-y-3">
                  {(!formData.colors || formData.colors.length === 0) && (
                    <div className="text-sm text-horizon-gray text-center py-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-dashed border-gray-200 dark:border-white/10">Chưa có biến thể màu sắc nào</div>
                  )}
                  {formData.colors?.map((c, i) => (
                    <div key={i} className="flex items-center gap-4 bg-gray-50 dark:bg-white/5 p-3 rounded-xl border border-gray-100 dark:border-white/10">
                      <input type="text" placeholder="Tên màu (VD: Đen nhám)" value={c.name} onChange={(e) => updateColor(i, 'name', e.target.value)} className="flex-1 bg-white dark:bg-[#0B1437] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-horizon-dark dark:text-white outline-none" required />
                      <input type="color" value={c.hex} onChange={(e) => updateColor(i, 'hex', e.target.value)} className="w-10 h-10 rounded cursor-pointer shrink-0" />
                      <button type="button" onClick={() => removeColor(i)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/20 p-2 rounded-lg transition-colors shrink-0">
                        <MinusCircle className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section: Biến thể Dung lượng */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-horizon-dark dark:text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm">3</span> Biến thể Dung lượng (Tùy chọn)
                  </h3>
                  <button type="button" onClick={addStorage} className="flex items-center gap-1 text-sm font-bold text-blue-500 hover:underline">
                    <PlusCircle className="h-4 w-4" /> Thêm dung lượng
                  </button>
                </div>
                
                <div className="space-y-3">
                  {(!formData.storages || formData.storages.length === 0) && (
                    <div className="text-sm text-horizon-gray text-center py-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-dashed border-gray-200 dark:border-white/10">Không có biến thể dung lượng</div>
                  )}
                  {formData.storages?.map((s, i) => (
                    <div key={i} className="flex items-center gap-4 bg-gray-50 dark:bg-white/5 p-3 rounded-xl border border-gray-100 dark:border-white/10">
                      <input type="text" placeholder="Tên (VD: 256GB)" value={s.name} onChange={(e) => updateStorage(i, 'name', e.target.value)} className="flex-1 bg-white dark:bg-[#0B1437] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-horizon-dark dark:text-white outline-none" required />
                      <div className="flex-1 relative">
                        <input type="number" placeholder="Cộng thêm giá (đ)" value={s.priceOffset} onChange={(e) => updateStorage(i, 'priceOffset', Number(e.target.value))} className="w-full bg-white dark:bg-[#0B1437] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm font-mono text-horizon-dark dark:text-white outline-none" required />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-horizon-gray font-bold">+ VNĐ</span>
                      </div>
                      <button type="button" onClick={() => removeStorage(i)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/20 p-2 rounded-lg transition-colors shrink-0">
                        <MinusCircle className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </form>
            
            <div className="p-6 md:p-8 border-t border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-black/20 flex gap-4">
              <button type="button" onClick={closeModal} className="flex-1 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-horizon-dark dark:text-white font-bold py-3.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/10 transition-colors shadow-sm text-base">
                Hủy bỏ
              </button>
              <button type="submit" onClick={handleSubmit} disabled={isSubmitting} className="flex-1 bg-horizon-brand text-white font-bold py-3.5 rounded-xl hover:bg-horizon-brand/90 transition-colors shadow-lg shadow-horizon-brand/30 disabled:opacity-70 text-base">
                {isSubmitting ? "Đang lưu hệ thống..." : "Lưu Sản Phẩm & Biến thể"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
