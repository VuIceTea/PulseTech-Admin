"use client";

import React, { useState, useEffect } from "react";
import { Zap, Plus, Trash2, Edit, Calendar, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface FlashSaleItem {
  productId: string;
  productName: string;
  variantName: string;
  originalPrice: number;
  flashPrice: number;
  limitQuantity: number;
  soldQuantity: number;
  image: string;
}

interface FlashSale {
  id?: string;
  title: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  items: FlashSaleItem[];
}

export default function FlashSalesPage() {
  const [sales, setSales] = useState<FlashSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [form, setForm] = useState<FlashSale>({
    title: "Flash Sale Giờ Vàng",
    startTime: new Date().toISOString().slice(0, 16),
    endTime: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
    isActive: true,
    items: []
  });

  const fetchSales = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/products/flash-sales");
      if (res.ok) {
        const data = await res.json();
        setSales(data);
      }
    } catch {
      toast.error("Không thể tải danh sách Flash Sale");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isEdit = !!form.id;
      const url = isEdit ? `http://localhost:8080/api/products/flash-sales/${form.id}` : `http://localhost:8080/api/products/flash-sales`;
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        toast.success("Lưu chiến dịch Flash Sale thành công");
        setModalOpen(false);
        fetchSales();
      }
    } catch {
      toast.error("Có lỗi xảy ra");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa chiến dịch Flash Sale này?")) return;
    try {
      const res = await fetch(`http://localhost:8080/api/products/flash-sales/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Xóa Flash Sale thành công");
        fetchSales();
      }
    } catch {
      toast.error("Có lỗi xảy ra");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-horizon-dark-card p-6 rounded-3xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-horizon-dark dark:text-white flex items-center gap-2">
            <Zap className="w-6 h-6 text-amber-500 fill-amber-500" /> Quản Lý Flash Sale Giờ Vàng
          </h2>
          <p className="text-sm text-horizon-gray dark:text-horizon-dark-gray mt-1">
            Tạo chiến dịch Flash Sale theo khung giờ, đặt giá sốc và giới hạn số lượng bán
          </p>
        </div>
        <button
          onClick={() => {
            setForm({
              title: "Flash Sale Giờ Vàng - " + new Date().toLocaleDateString("vi-VN"),
              startTime: new Date().toISOString().slice(0, 16),
              endTime: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
              isActive: true,
              items: []
            });
            setModalOpen(true);
          }}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-5 py-3 rounded-2xl transition-all shadow-md shadow-amber-500/20 cursor-pointer"
        >
          <Plus className="w-5 h-5" /> Tạo Flash Sale Mới
        </button>
      </div>

      <div className="bg-white dark:bg-horizon-dark-card rounded-3xl p-6 shadow-sm">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Đang tải chiến dịch...</div>
        ) : sales.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Chưa có chiến dịch Flash Sale nào</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sales.map((sale) => (
              <div key={sale.id} className="border border-gray-100 dark:border-white/10 rounded-2xl p-5 hover:border-amber-500/40 transition-all space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                    <h3 className="font-bold text-horizon-dark dark:text-white text-base">{sale.title}</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    sale.isActive ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400" : "bg-gray-100 text-gray-700"
                  }`}>
                    {sale.isActive ? "Đang Hoạt Động" : "Đã Dừng"}
                  </span>
                </div>

                <div className="text-xs text-gray-500 space-y-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>Bắt đầu: <strong className="text-gray-700 dark:text-gray-300">{new Date(sale.startTime).toLocaleString("vi-VN")}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>Kết thúc: <strong className="text-gray-700 dark:text-gray-300">{new Date(sale.endTime).toLocaleString("vi-VN")}</strong></span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => handleDelete(sale.id!)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0B1437] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-xl font-bold text-horizon-dark dark:text-white flex items-center gap-2">
              <Zap className="w-6 h-6 text-amber-500 fill-amber-500" /> {form.id ? "Sửa Flash Sale" : "Tạo Flash Sale Mới"}
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Tên chiến dịch</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#F4F7FE] dark:bg-horizon-dark-card border-none rounded-xl text-sm outline-none font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Thời gian bắt đầu</label>
                  <input
                    type="datetime-local"
                    required
                    value={form.startTime}
                    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F4F7FE] dark:bg-horizon-dark-card border-none rounded-xl text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Thời gian kết thúc</label>
                  <input
                    type="datetime-local"
                    required
                    value={form.endTime}
                    onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F4F7FE] dark:bg-horizon-dark-card border-none rounded-xl text-xs outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
                />
                <label htmlFor="isActive" className="text-sm font-bold text-horizon-dark dark:text-white cursor-pointer">Kích hoạt chiến dịch ngay</label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-bold bg-gray-100 dark:bg-white/10 hover:bg-gray-200 transition-all text-sm"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-bold bg-amber-500 text-white hover:bg-amber-600 transition-all text-sm shadow-md shadow-amber-500/20"
                >
                  Lưu Chiến Dịch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
