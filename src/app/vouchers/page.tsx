"use client";

import React, { useEffect, useState, FormEvent } from "react";
import { Plus, Trash2, Edit2, X, Ticket, Calendar, Percent, CircleDollarSign } from "lucide-react";
import { toast } from "sonner";

interface Coupon {
  id: string;
  code: string;
  description: string;
  discountPercent: number;
  discountAmount: number;
  minOrderValue: number;
  maxDiscountValue: number;
  validFrom: string;
  validUntil: string;
  currentUsage: number;
  maxUsage: number;
  isActive: boolean;
}

export default function VouchersPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Default dates
  const today = new Date();
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  const [formData, setFormData] = useState<Partial<Coupon>>({
    code: "",
    description: "",
    discountPercent: 0,
    discountAmount: 0,
    minOrderValue: 0,
    maxDiscountValue: 0,
    validFrom: today.toISOString().slice(0, 16),
    validUntil: nextMonth.toISOString().slice(0, 16),
    currentUsage: 0,
    maxUsage: 100,
    isActive: true,
  });

  const loadCoupons = () => {
    setLoading(true);
    fetch("/backend-api/orders/coupons")
      .then(res => res.ok ? res.json() : [])
      .then(data => setCoupons(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error(err);
        toast.error("Lỗi khi tải dữ liệu mã giảm giá");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const openAddModal = () => {
    setEditingCoupon(null);
    setFormData({
      code: "", description: "", discountPercent: 0, discountAmount: 0,
      minOrderValue: 0, maxDiscountValue: 0, currentUsage: 0, maxUsage: 100, isActive: true,
      validFrom: new Date().toISOString().slice(0, 16),
      validUntil: nextMonth.toISOString().slice(0, 16),
    });
    setIsModalOpen(true);
  };

  const openEditModal = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({ 
      ...coupon,
      validFrom: coupon.validFrom ? new Date(coupon.validFrom).toISOString().slice(0, 16) : "",
      validUntil: coupon.validUntil ? new Date(coupon.validUntil).toISOString().slice(0, 16) : "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    let finalValue = value;
    
    if (type === 'number') {
      finalValue = Number(value);
    } else if (type === 'checkbox') {
      finalValue = e.target.checked;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const isEditing = !!editingCoupon;
      const url = isEditing ? `/backend-api/orders/coupons/${editingCoupon.id}` : `/backend-api/orders/coupons`;
      
      const payload = { 
        ...formData, 
        id: isEditing ? editingCoupon.id : undefined,
        code: formData.code?.toUpperCase()
      };
      
      const res = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error("Failed to save");
      toast.success(isEditing ? "Cập nhật mã giảm giá thành công!" : "Tạo mã giảm giá thành công!");
      closeModal();
      loadCoupons();
    } catch (err) {
      toast.error("Đã xảy ra lỗi khi lưu mã giảm giá");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa mã giảm giá này?")) return;
    try {
      const res = await fetch(`/backend-api/orders/coupons/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      toast.success("Xóa mã giảm giá thành công!");
      loadCoupons();
    } catch (err) {
      toast.error("Đã xảy ra lỗi khi xóa");
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-full">
      
      {/* Header */}
      <div className="bg-white dark:bg-horizon-dark-card rounded-[20px] p-6 shadow-[0_4px_12px_rgba(0,0,0,0.02)] sticky top-4 z-20 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-[#F4F7FE] dark:bg-white/5 rounded-full flex items-center justify-center text-horizon-brand">
            <Ticket className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-bold text-horizon-dark dark:text-white">Khuyến Mãi & Voucher</h1>
        </div>
        
        <button onClick={openAddModal} className="flex items-center gap-2 bg-horizon-brand text-white font-bold px-6 py-3 rounded-full hover:bg-horizon-brand/90 transition-transform hover:scale-105 shadow-lg shadow-horizon-brand/30 w-full sm:w-auto justify-center">
          <Plus className="h-5 w-5" /> TẠO VOUCHER MỚI
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-white dark:bg-horizon-dark-card rounded-[20px] p-6 shadow-[0_4px_12px_rgba(0,0,0,0.02)] h-48 animate-pulse">
              <div className="w-1/2 h-8 bg-gray-200 dark:bg-white/10 rounded-lg mb-4" />
              <div className="w-3/4 h-4 bg-gray-200 dark:bg-white/10 rounded mb-2" />
              <div className="w-1/4 h-4 bg-gray-200 dark:bg-white/10 rounded" />
            </div>
          ))
        ) : coupons.length > 0 ? (
          coupons.map((coupon) => {
            const isValid = coupon.isActive && coupon.currentUsage < coupon.maxUsage && new Date() < new Date(coupon.validUntil);
            return (
              <div key={coupon.id} className="bg-white dark:bg-horizon-dark-card rounded-[20px] p-6 shadow-[0_4px_12px_rgba(0,0,0,0.02)] group relative overflow-hidden flex flex-col border border-transparent hover:border-horizon-brand/20 transition-colors">
                {/* Status Indicator */}
                <div className={`absolute top-0 right-0 w-16 h-16 ${isValid ? 'bg-[#05CD99]' : 'bg-red-500'} flex items-start justify-end p-2 text-white font-bold text-xs`} style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}>
                </div>

                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F4F7FE] dark:bg-white/10 rounded-full text-horizon-brand dark:text-white font-mono font-bold text-lg tracking-wider mb-2 border border-horizon-brand/20 border-dashed">
                      <Ticket className="h-4 w-4" />
                      {coupon.code}
                    </div>
                    <p className="text-sm font-medium text-horizon-gray dark:text-horizon-dark-gray line-clamp-2">
                      {coupon.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mb-6 flex-1">
                  {coupon.discountPercent > 0 && (
                    <div className="flex items-center gap-2 text-sm text-horizon-dark dark:text-white font-medium">
                      <Percent className="h-4 w-4 text-orange-500" />
                      Giảm {coupon.discountPercent}% (Tối đa {coupon.maxDiscountValue.toLocaleString()}đ)
                    </div>
                  )}
                  {coupon.discountAmount > 0 && (
                    <div className="flex items-center gap-2 text-sm text-horizon-dark dark:text-white font-medium">
                      <CircleDollarSign className="h-4 w-4 text-green-500" />
                      Giảm thẳng {coupon.discountAmount.toLocaleString()}đ
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-horizon-gray">
                    <Calendar className="h-3.5 w-3.5" /> HSD: {new Date(coupon.validUntil).toLocaleDateString('vi-VN')}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-50 dark:border-white/5 pt-4">
                  <div className="text-sm">
                    <span className="text-horizon-gray">Đã dùng:</span>
                    <span className="ml-1 font-bold text-horizon-dark dark:text-white">{coupon.currentUsage} / {coupon.maxUsage}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEditModal(coupon)} className="p-2 text-horizon-gray hover:text-horizon-brand hover:bg-[#F4F7FE] dark:hover:bg-white/5 rounded-lg transition-colors">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(coupon.id)} className="p-2 text-horizon-gray hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-20 text-horizon-gray dark:text-horizon-dark-gray font-medium bg-white dark:bg-horizon-dark-card rounded-[20px]">
            <div className="text-4xl mb-4">🎟️</div>
            Chưa có mã giảm giá nào. Hãy tạo mã đầu tiên của bạn!
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-horizon-dark-card w-full max-w-2xl rounded-[24px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/10">
              <h2 className="text-2xl font-bold text-horizon-dark dark:text-white flex items-center gap-2">
                <Ticket className="h-6 w-6 text-horizon-brand" />
                {editingCoupon ? "Cập nhật Voucher" : "Tạo Voucher Mới"}
              </h2>
              <button onClick={closeModal} className="h-10 w-10 bg-[#F4F7FE] dark:bg-white/5 rounded-full flex items-center justify-center text-horizon-gray hover:text-red-500 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-horizon-dark dark:text-white mb-2">Mã Khuyến Mãi (CODE) *</label>
                  <input required type="text" name="code" value={formData.code} onChange={handleInputChange} placeholder="VD: SUMMER2024" className="w-full bg-white dark:bg-[#0B1437] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-base uppercase font-mono font-bold text-horizon-brand outline-none focus:border-horizon-brand transition-colors" />
                </div>
                <div className="flex items-center gap-3 pt-8">
                  <input type="checkbox" id="isActive" name="isActive" checked={formData.isActive} onChange={handleInputChange} className="w-5 h-5 rounded border-gray-300 text-horizon-brand focus:ring-horizon-brand" />
                  <label htmlFor="isActive" className="text-sm font-bold text-horizon-dark dark:text-white cursor-pointer">Kích hoạt ngay (Active)</label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-horizon-dark dark:text-white mb-2">Mô tả chương trình *</label>
                <input required type="text" name="description" value={formData.description} onChange={handleInputChange} placeholder="Giảm giá 10% dịp hè..." className="w-full bg-white dark:bg-[#0B1437] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-horizon-dark dark:text-white outline-none focus:border-horizon-brand transition-colors" />
              </div>

              <div className="bg-orange-50 dark:bg-orange-500/10 p-5 rounded-2xl border border-orange-100 dark:border-orange-500/20">
                <h3 className="text-sm font-bold text-orange-600 dark:text-orange-400 mb-4 flex items-center gap-2">
                  Thiết lập Giảm giá
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-horizon-dark dark:text-white mb-2">Giảm theo %</label>
                    <input type="number" min="0" max="100" name="discountPercent" value={formData.discountPercent} onChange={handleInputChange} className="w-full bg-white dark:bg-[#0B1437] border border-orange-200 dark:border-orange-500/20 rounded-xl px-4 py-2.5 outline-none focus:border-orange-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-horizon-dark dark:text-white mb-2">Trừ thẳng tiền mặt (đ)</label>
                    <input type="number" min="0" name="discountAmount" value={formData.discountAmount} onChange={handleInputChange} className="w-full bg-white dark:bg-[#0B1437] border border-orange-200 dark:border-orange-500/20 rounded-xl px-4 py-2.5 outline-none focus:border-orange-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-horizon-dark dark:text-white mb-2">Giảm tối đa (đ)</label>
                    <input type="number" min="0" name="maxDiscountValue" value={formData.maxDiscountValue} onChange={handleInputChange} className="w-full bg-white dark:bg-[#0B1437] border border-orange-200 dark:border-orange-500/20 rounded-xl px-4 py-2.5 outline-none focus:border-orange-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-horizon-dark dark:text-white mb-2">Đơn tối thiểu (đ) *</label>
                    <input required type="number" min="0" name="minOrderValue" value={formData.minOrderValue} onChange={handleInputChange} className="w-full bg-white dark:bg-[#0B1437] border border-orange-200 dark:border-orange-500/20 rounded-xl px-4 py-2.5 outline-none focus:border-orange-500" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-horizon-dark dark:text-white mb-2">Ngày bắt đầu *</label>
                  <input required type="datetime-local" name="validFrom" value={formData.validFrom} onChange={handleInputChange} className="w-full bg-white dark:bg-[#0B1437] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-horizon-dark dark:text-white outline-none focus:border-horizon-brand" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-horizon-dark dark:text-white mb-2">Ngày kết thúc *</label>
                  <input required type="datetime-local" name="validUntil" value={formData.validUntil} onChange={handleInputChange} className="w-full bg-white dark:bg-[#0B1437] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-horizon-dark dark:text-white outline-none focus:border-horizon-brand" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-horizon-dark dark:text-white mb-2">Giới hạn số lần dùng *</label>
                  <input required type="number" min="1" name="maxUsage" value={formData.maxUsage} onChange={handleInputChange} className="w-full bg-white dark:bg-[#0B1437] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-horizon-dark dark:text-white outline-none focus:border-horizon-brand" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-horizon-dark dark:text-white mb-2">Đã dùng</label>
                  <input type="number" name="currentUsage" value={formData.currentUsage} disabled className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-horizon-gray cursor-not-allowed" />
                </div>
              </div>

            </form>
            
            <div className="p-6 border-t border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-black/20 flex gap-4">
              <button type="button" onClick={closeModal} className="flex-1 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-horizon-dark dark:text-white font-bold py-3.5 rounded-xl hover:bg-gray-50 transition-colors">
                Hủy bỏ
              </button>
              <button type="submit" onClick={handleSubmit} disabled={isSubmitting} className="flex-1 bg-horizon-brand text-white font-bold py-3.5 rounded-xl hover:bg-horizon-brand/90 transition-colors shadow-lg shadow-horizon-brand/30 disabled:opacity-70">
                {isSubmitting ? "Đang lưu..." : "Phát hành Voucher"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
