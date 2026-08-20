"use client";

import React, { useEffect, useState, FormEvent } from "react";
import { Heart, Plus, Trash2, Edit2, X, PlusCircle, MinusCircle } from "lucide-react";
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

interface ProductSpec {
  screen?: string;
  os?: string;
  camera?: string;
  frontCamera?: string;
  cpu?: string;
  ram?: string;
  storage?: string;
  battery?: string;
  accessoryType?: string;
  headphoneType?: string;
  audioFeature?: string;
  connectionType?: string;
  cableLength?: string;
  chargingPower?: string;
  chargingPorts?: string;
  caseMaterial?: string;
  caseFeature?: string;
}

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  basePrice: number;
  originalPrice?: number;
  discount?: number;
  stock: number;
  description?: string;
  image?: string;
  colors: ColorVariant[];
  storages: StorageVariant[];
  specs?: ProductSpec;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showBrandSuggestions, setShowBrandSuggestions] = useState(false);

  const categoryMap: Record<string, string> = {
    'phone': 'Điện thoại',
    'tablet': 'Máy tính bảng',
    'laptop': 'Laptop',
    'accessory': 'Phụ kiện',
    'audio': 'Âm thanh'
  };

  const getImageUrl = (url?: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `http://localhost:3000${url.startsWith('/') ? '' : '/'}${url}`;
  };

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    brand: "",
    category: "",
    basePrice: 0,
    originalPrice: 0,
    discount: 0,
    stock: 0,
    image: "",
    description: "",
    colors: [],
    storages: [],
    specs: {}
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
    setFormData({ name: "", brand: "", category: "phone", basePrice: 0, originalPrice: 0, discount: 0, stock: 0, image: "", description: "", colors: [], storages: [], specs: {} });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({ 
      ...product,
      colors: product.colors || [],
      storages: product.storages || [],
      specs: product.specs || {}
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'basePrice' || name === 'originalPrice' || name === 'discount' || name === 'stock' ? Number(value) : value
    }));
  };

  const handleBrandSelect = (brand: string) => {
    setFormData(prev => ({ ...prev, brand }));
    setShowBrandSuggestions(false);
  };

  const handleSpecChange = (field: keyof ProductSpec, value: string) => {
    setFormData(prev => ({
      ...prev,
      specs: { ...(prev.specs || {}), [field]: value }
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

  const handleFileUpload = async (file: File, callback: (url: string) => void) => {
    setIsUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      callback(data.url);
    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi tải ảnh lên');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const isEditing = !!editingProduct;
      const url = isEditing ? `/backend-api/products/${editingProduct.id}` : `/backend-api/products`;
      const method = isEditing ? "PUT" : "POST";
      
      const computedBasePrice = formData.originalPrice 
        ? Math.round(formData.originalPrice * (1 - (formData.discount || 0) / 100))
        : (formData.basePrice || 0);

      const payload = {
        ...formData,
        basePrice: computedBasePrice,
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
              <button onClick={openAddModal} className="flex items-center gap-2 bg-white text-black hover:bg-gray-50 transition-colors font-bold text-sm px-6 py-2.5 rounded-xl shadow-lg cursor-pointer">
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
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
            <h2 className="text-2xl font-bold text-black dark:text-white">Sản phẩm Nổi bật</h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
              <div className="relative w-full sm:w-64">
                <input 
                  type="text" 
                  placeholder="Tìm kiếm sản phẩm, hãng..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white dark:bg-horizon-dark-card border border-gray-100 dark:border-white/10 rounded-full px-4 py-2 text-sm text-black dark:text-white outline-none focus:ring-2 focus:ring-horizon-brand"
                />
              </div>
              <div className="relative flex items-center bg-gray-100 dark:bg-white/5 p-1 rounded-full overflow-hidden text-sm font-medium shrink-0">
                {/* Sliding indicator */}
                <div 
                  className="absolute top-1 bottom-1 bg-white dark:bg-horizon-dark-card rounded-full shadow-sm transition-all duration-300 ease-out"
                  style={{
                    width: selectedFilter === 'all' ? '60px' : selectedFilter === 'phone' ? '90px' : selectedFilter === 'tablet' ? '65px' : selectedFilter === 'laptop' ? '70px' : '85px',
                    left: selectedFilter === 'all' ? '4px' : selectedFilter === 'phone' ? '64px' : selectedFilter === 'tablet' ? '154px' : selectedFilter === 'laptop' ? '219px' : '289px'
                  }}
                />
                
                <button onClick={() => setSelectedFilter('all')} className={`relative z-10 px-4 py-1.5 transition-colors cursor-pointer rounded-full w-[60px] whitespace-nowrap ${selectedFilter === 'all' ? 'text-black font-bold' : 'text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white'}`}>Tất cả</button>
                <button onClick={() => setSelectedFilter('phone')} className={`relative z-10 px-4 py-1.5 transition-colors cursor-pointer rounded-full w-[90px] whitespace-nowrap ${selectedFilter === 'phone' ? 'text-black font-bold' : 'text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white'}`}>Điện thoại</button>
                <button onClick={() => setSelectedFilter('tablet')} className={`relative z-10 px-4 py-1.5 transition-colors cursor-pointer rounded-full w-[65px] whitespace-nowrap ${selectedFilter === 'tablet' ? 'text-black font-bold' : 'text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white'}`}>Tablet</button>
                <button onClick={() => setSelectedFilter('laptop')} className={`relative z-10 px-4 py-1.5 transition-colors cursor-pointer rounded-full w-[70px] whitespace-nowrap ${selectedFilter === 'laptop' ? 'text-black font-bold' : 'text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white'}`}>Laptop</button>
                <button onClick={() => setSelectedFilter('accessory')} className={`relative z-10 px-4 py-1.5 transition-colors cursor-pointer rounded-full w-[85px] whitespace-nowrap ${selectedFilter === 'accessory' ? 'text-black font-bold' : 'text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white'}`}>Phụ kiện</button>
              </div>
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
            ) : (() => {
              const filteredProducts = products.filter(p => {
                const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesFilter = selectedFilter === 'all' ? true : p.category === selectedFilter;
                return matchesSearch && matchesFilter;
              });
              
              if (filteredProducts.length === 0) {
                return (
                  <div className="col-span-full text-center py-12 text-horizon-gray dark:text-black-gray font-medium">
                    Không tìm thấy sản phẩm nào!
                  </div>
                );
              }

              return filteredProducts.map((product) => (
                <div key={product.id} className="bg-white dark:bg-horizon-dark-card rounded-[20px] p-4 shadow-[0_4px_12px_rgba(0,0,0,0.02)] group hover:-translate-y-1 transition-transform relative cursor-pointer">
                  <div className="w-full h-48 rounded-xl bg-gray-50 dark:bg-horizon-dark-bg mb-4 relative overflow-hidden flex items-center justify-center p-2">
                    {product.image ? (
                      <img src={getImageUrl(product.imageUrl || product.image)} alt={product.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-32 h-32 bg-gradient-to-tr from-[#868CFF] to-[#4318FF] rounded-lg shadow-lg rotate-12 group-hover:scale-110 transition-transform duration-500" />
                    )}
                    
                    {/* Out of stock badge */}
                    {product.stock === 0 && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm z-10">
                        HẾT HÀNG
                      </div>
                    )}
                    
                    {/* Action overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 z-20">
                      <button onClick={() => openEditModal(product)} className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-100">
                        <Edit2 className="h-4 w-4" /> Sửa
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-red-600">
                        <Trash2 className="h-4 w-4" /> Xóa
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-start justify-between">
                    <div className="w-full">
                      <h3 className="text-lg font-bold text-black dark:text-white mb-1 truncate">
                        {product.name}
                      </h3>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-1">
                    {(product.originalPrice && product.originalPrice > product.basePrice) ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 line-through font-medium">
                          {product.originalPrice.toLocaleString('vi-VN')} đ
                        </span>
                        {product.discount && product.discount > 0 && (
                          <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">
                            -{product.discount}%
                          </span>
                        )}
                      </div>
                    ) : null}
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-red-500 text-lg">
                        {product.basePrice.toLocaleString('vi-VN')} đ
                      </span>
                      <button className="bg-[#F4F7FE] dark:bg-white/10 text-horizon-brand dark:text-white text-xs font-bold px-4 py-2 rounded-full cursor-pointer hover:bg-gray-100 transition-colors">
                        {categoryMap[product.category] || product.category}
                      </button>
                    </div>
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-full xl:w-[350px] flex flex-col gap-5 shrink-0">
        <div className="bg-white dark:bg-horizon-dark-card rounded-[20px] p-6 shadow-[0_4px_12px_rgba(0,0,0,0.02)] flex-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-black dark:text-white">Kho hàng Top</h2>
            <button className="text-horizon-brand bg-[#F4F7FE] dark:bg-horizon-dark-bg px-4 py-1.5 rounded-full text-xs font-bold hover:bg-[#E9EDF7] transition-colors cursor-pointer">
              Xem tất cả
            </button>
          </div>

          <div className="space-y-4">
            {[...products].sort((a, b) => a.stock - b.stock).slice(0, 8).map((p, i) => (
              <div key={p.id || i} className="relative flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer">
                {i < 3 && (
                  <div className={`absolute -top-2 -left-2 w-6 h-6 flex items-center justify-center rounded-full text-white text-[11px] font-extrabold shadow-sm z-10 ${i === 0 ? 'bg-yellow-400' : i === 1 ? 'bg-gray-400' : 'bg-amber-600'}`}>
                    {i + 1}
                  </div>
                )}
                <div className="flex items-center gap-3 min-w-0 pt-1">
                  <div className="w-12 h-12 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shrink-0 overflow-hidden flex items-center justify-center p-1">
                    {p.image ? <img src={getImageUrl(p.image)} alt={p.name} className="w-full h-full object-contain" /> : <div className="w-full h-full bg-gradient-to-br from-[#868CFF] to-[#4318FF]" />}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-black dark:text-white truncate">{p.name}</h3>
                    <p className="text-xs font-medium text-horizon-gray dark:text-black-gray truncate">{p.brand} - {p.basePrice.toLocaleString('vi-VN')}đ</p>
                  </div>
                </div>
                <div className="text-sm font-bold text-black dark:text-white shrink-0 ml-4 text-right">
                  {p.stock} <span className="block text-horizon-gray text-xs">tồn kho</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Massive Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white dark:bg-horizon-dark-card w-full max-w-3xl rounded-[24px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 my-auto">
            <div className="flex items-center justify-between p-6 md:p-8 border-b border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-black/20">
              <div>
                <h2 className="text-2xl font-extrabold text-black dark:text-white">
                  {editingProduct ? "Cập nhật Sản Phẩm" : "Thêm Sản Phẩm Mới"}
                </h2>
                <p className="text-sm text-horizon-gray mt-1">Điền đầy đủ các thông tin và biến thể bên dưới</p>
              </div>
              <button onClick={closeModal} className="h-10 w-10 bg-white dark:bg-white/10 rounded-full flex items-center justify-center text-horizon-gray hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/20 transition-colors shadow-sm cursor-pointer">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 md:p-8 max-h-[70vh] overflow-y-auto custom-scrollbar space-y-8">
              
              {/* Section: Thông tin chung */}
              <div>
                <h3 className="text-lg font-bold text-black dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-horizon-brand text-white flex items-center justify-center text-sm">1</span> Thông tin cơ bản
                </h3>
                <div className="space-y-5 bg-gray-50 dark:bg-white/5 p-5 rounded-2xl">
                  <div>
                    <label className="block text-sm font-bold text-black dark:text-white mb-2">
                      Tên sản phẩm <span className="text-red-500">*</span>
                    </label>
                    <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-white dark:bg-[#0B1437] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-base text-black dark:text-white outline-none focus:border-horizon-brand transition-colors shadow-sm" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="relative">
                      <label className="block text-sm font-bold text-black dark:text-white mb-2">
                        Hãng sản xuất <span className="text-red-500">*</span>
                      </label>
                      <input 
                        required 
                        type="text" 
                        name="brand" 
                        value={formData.brand} 
                        onChange={(e) => {
                          handleInputChange(e);
                          setShowBrandSuggestions(true);
                        }} 
                        onFocus={() => setShowBrandSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowBrandSuggestions(false), 200)}
                        className="w-full bg-white dark:bg-[#0B1437] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-base text-black dark:text-white outline-none focus:border-horizon-brand transition-colors shadow-sm" 
                        autoComplete="off"
                      />
                      {showBrandSuggestions && (() => {
                        const uniqueBrands = Array.from(new Set(products.map(p => p.brand).filter(Boolean)));
                        const filteredBrands = uniqueBrands.filter(b => b.toLowerCase().includes((formData.brand || "").toLowerCase()));
                        if (filteredBrands.length > 0) {
                          return (
                            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-horizon-dark-card border border-gray-100 dark:border-white/10 rounded-xl shadow-lg max-h-48 overflow-y-auto custom-scrollbar">
                              {filteredBrands.map((b, idx) => (
                                <div 
                                  key={idx} 
                                  className="px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors"
                                  onClick={() => handleBrandSelect(b)}
                                >
                                  {b}
                                </div>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-black dark:text-white mb-2">
                        Danh mục <span className="text-red-500">*</span>
                      </label>
                      <select required name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-white dark:bg-[#0B1437] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-base text-black dark:text-white outline-none focus:border-horizon-brand transition-colors shadow-sm">
                        <option value="phone">Điện thoại</option>
                        <option value="tablet">Máy tính bảng</option>
                        <option value="laptop">Laptop</option>
                        <option value="accessory">Phụ kiện</option>
                        <option value="audio">Âm thanh</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-black dark:text-white mb-2 whitespace-nowrap">
                        Giá gốc (VNĐ) <span className="text-red-500">*</span>
                      </label>
                      <input required type="number" min="0" name="originalPrice" value={formData.originalPrice} onChange={handleInputChange} className="w-full bg-white dark:bg-[#0B1437] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-base font-mono text-black dark:text-white outline-none focus:border-horizon-brand transition-colors shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-black dark:text-white mb-2 whitespace-nowrap">
                        Giảm giá (%)
                      </label>
                      <input type="number" min="0" max="100" name="discount" value={formData.discount} onChange={handleInputChange} className="w-full bg-white dark:bg-[#0B1437] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-base font-bold text-black dark:text-white outline-none focus:border-horizon-brand transition-colors shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-black dark:text-white mb-2 whitespace-nowrap">
                        Số lượng Tồn kho <span className="text-red-500">*</span>
                      </label>
                      <input required type="number" min="0" name="stock" value={formData.stock} onChange={handleInputChange} className="w-full bg-white dark:bg-[#0B1437] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-base font-bold text-black dark:text-white outline-none focus:border-horizon-brand transition-colors shadow-sm" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-black dark:text-white mb-2">
                      Hình ảnh Sản phẩm <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-4 bg-white dark:bg-[#0B1437] border border-gray-200 dark:border-white/10 rounded-xl p-2 shadow-sm">
                      {formData.image ? (
                        <img src={getImageUrl(formData.image)} alt="Preview" className="w-12 h-12 rounded-lg object-contain bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-horizon-gray text-xs text-center border border-dashed border-gray-200 dark:border-white/10">Ảnh</div>
                      )}
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleFileUpload(e.target.files[0], (url) => setFormData(p => ({ ...p, image: url })));
                          }
                        }}
                        className="flex-1 text-sm text-horizon-gray file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#F4F7FE] dark:file:bg-white/10 file:text-horizon-brand dark:file:text-white hover:file:bg-gray-100 dark:hover:file:bg-white/20 transition-colors cursor-pointer" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section: Biến thể Màu sắc */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-black dark:text-white flex items-center gap-2">
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
                      <input type="text" placeholder="Tên màu (VD: Đen nhám)" value={c.name} onChange={(e) => updateColor(i, 'name', e.target.value)} className="flex-1 bg-white dark:bg-[#0B1437] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-black dark:text-white outline-none" required />
                      <input type="color" value={c.hex} onChange={(e) => updateColor(i, 'hex', e.target.value)} className="w-10 h-10 rounded cursor-pointer shrink-0" title="Mã màu" />
                      
                      <div className="relative shrink-0">
                        <label className="flex items-center justify-center w-10 h-10 rounded-lg bg-white dark:bg-[#0B1437] border border-gray-200 dark:border-white/10 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/10 transition-colors overflow-hidden" title="Tải ảnh cho màu này">
                          {c.image ? <img src={getImageUrl(c.image)} alt="Color img" className="w-full h-full object-contain" /> : <span className="text-[10px] font-bold text-horizon-gray">Ảnh</span>}
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleFileUpload(e.target.files[0], (url) => updateColor(i, 'image', url));
                            }
                          }} />
                        </label>
                      </div>

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
                  <h3 className="text-lg font-bold text-black dark:text-white flex items-center gap-2">
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
                      <input type="text" placeholder="Tên (VD: 256GB)" value={s.name} onChange={(e) => updateStorage(i, 'name', e.target.value)} className="flex-1 bg-white dark:bg-[#0B1437] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-black dark:text-white outline-none" required />
                      <div className="flex-1 relative">
                        <input type="number" placeholder="Cộng thêm giá (đ)" value={s.priceOffset} onChange={(e) => updateStorage(i, 'priceOffset', Number(e.target.value))} className="w-full bg-white dark:bg-[#0B1437] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm font-mono text-black dark:text-white outline-none" required />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-horizon-gray font-bold">+ VNĐ</span>
                      </div>
                      <button type="button" onClick={() => removeStorage(i)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/20 p-2 rounded-lg transition-colors shrink-0">
                        <MinusCircle className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section: Thông số kỹ thuật */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-black dark:text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm">4</span> Thông số kỹ thuật (Tùy chọn)
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-white/5 p-5 rounded-2xl border border-gray-100 dark:border-white/10">
                  {/* Phone/Tablet/Laptop specifics */}
                  {(formData.category === 'phone' || formData.category === 'tablet' || formData.category === 'laptop') && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-black dark:text-white mb-1">Màn hình (Screen)</label>
                        <input type="text" value={formData.specs?.screen || ""} onChange={(e) => handleSpecChange('screen', e.target.value)} className="w-full bg-white dark:bg-[#0B1437] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-black dark:text-white outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-black dark:text-white mb-1">Hệ điều hành (OS)</label>
                        <input type="text" value={formData.specs?.os || ""} onChange={(e) => handleSpecChange('os', e.target.value)} className="w-full bg-white dark:bg-[#0B1437] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-black dark:text-white outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-black dark:text-white mb-1">Camera chính</label>
                        <input type="text" value={formData.specs?.camera || ""} onChange={(e) => handleSpecChange('camera', e.target.value)} className="w-full bg-white dark:bg-[#0B1437] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-black dark:text-white outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-black dark:text-white mb-1">Camera trước</label>
                        <input type="text" value={formData.specs?.frontCamera || ""} onChange={(e) => handleSpecChange('frontCamera', e.target.value)} className="w-full bg-white dark:bg-[#0B1437] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-black dark:text-white outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-black dark:text-white mb-1">Vi xử lý (CPU)</label>
                        <input type="text" value={formData.specs?.cpu || ""} onChange={(e) => handleSpecChange('cpu', e.target.value)} className="w-full bg-white dark:bg-[#0B1437] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-black dark:text-white outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-black dark:text-white mb-1">RAM</label>
                        <input type="text" value={formData.specs?.ram || ""} onChange={(e) => handleSpecChange('ram', e.target.value)} className="w-full bg-white dark:bg-[#0B1437] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-black dark:text-white outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-black dark:text-white mb-1">Lưu trữ gốc (Storage)</label>
                        <input type="text" value={formData.specs?.storage || ""} onChange={(e) => handleSpecChange('storage', e.target.value)} className="w-full bg-white dark:bg-[#0B1437] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-black dark:text-white outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-black dark:text-white mb-1">Pin (Battery)</label>
                        <input type="text" value={formData.specs?.battery || ""} onChange={(e) => handleSpecChange('battery', e.target.value)} className="w-full bg-white dark:bg-[#0B1437] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-black dark:text-white outline-none" />
                      </div>
                    </>
                  )}
                  {/* Accessory specifics */}
                  {formData.category === 'accessory' && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-black dark:text-white mb-1">Loại phụ kiện</label>
                        <input type="text" value={formData.specs?.accessoryType || ""} onChange={(e) => handleSpecChange('accessoryType', e.target.value)} className="w-full bg-white dark:bg-[#0B1437] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-black dark:text-white outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-black dark:text-white mb-1">Chuẩn kết nối</label>
                        <input type="text" value={formData.specs?.connectionType || ""} onChange={(e) => handleSpecChange('connectionType', e.target.value)} className="w-full bg-white dark:bg-[#0B1437] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-black dark:text-white outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-black dark:text-white mb-1">Công suất sạc</label>
                        <input type="text" value={formData.specs?.chargingPower || ""} onChange={(e) => handleSpecChange('chargingPower', e.target.value)} className="w-full bg-white dark:bg-[#0B1437] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-black dark:text-white outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-black dark:text-white mb-1">Chất liệu ốp</label>
                        <input type="text" value={formData.specs?.caseMaterial || ""} onChange={(e) => handleSpecChange('caseMaterial', e.target.value)} className="w-full bg-white dark:bg-[#0B1437] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-black dark:text-white outline-none" />
                      </div>
                    </>
                  )}
                  {/* Audio specifics */}
                  {formData.category === 'audio' && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-black dark:text-white mb-1">Loại tai nghe</label>
                        <input type="text" value={formData.specs?.headphoneType || ""} onChange={(e) => handleSpecChange('headphoneType', e.target.value)} className="w-full bg-white dark:bg-[#0B1437] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-black dark:text-white outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-black dark:text-white mb-1">Tính năng âm thanh</label>
                        <input type="text" value={formData.specs?.audioFeature || ""} onChange={(e) => handleSpecChange('audioFeature', e.target.value)} className="w-full bg-white dark:bg-[#0B1437] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-black dark:text-white outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-black dark:text-white mb-1">Thời lượng pin</label>
                        <input type="text" value={formData.specs?.battery || ""} onChange={(e) => handleSpecChange('battery', e.target.value)} className="w-full bg-white dark:bg-[#0B1437] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-black dark:text-white outline-none" />
                      </div>
                    </>
                  )}
                </div>
              </div>

            </form>
            
            <div className="p-6 md:p-8 border-t border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-black/20 flex gap-4">
              <button type="button" onClick={closeModal} className="flex-1 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-black dark:text-white font-bold py-3.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/10 transition-colors shadow-sm text-base cursor-pointer">
                Hủy bỏ
              </button>
              <button type="submit" onClick={handleSubmit} disabled={isSubmitting || isUploading} className="flex-1 bg-horizon-brand text-white font-bold py-3.5 rounded-xl hover:bg-horizon-brand/90 transition-colors shadow-lg shadow-horizon-brand/30 disabled:opacity-70 text-base cursor-pointer">
                {isSubmitting ? "Đang lưu hệ thống..." : isUploading ? "Đang tải ảnh..." : "Lưu Sản Phẩm & Biến thể"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
