"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, Search, Plus, Edit, Trash2, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import Select from "react-select";
import { toast } from "sonner";

interface Warranty {
  id?: string;
  imei: string;
  orderId: string;
  productName: string;
  storageVariant: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  startDate: string;
  endDate: string;
  status: string;
  notes?: string;
}

export default function WarrantiesPage() {
  const [warranties, setWarranties] = useState<Warranty[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingWarranty, setEditingWarranty] = useState<Warranty | null>(null);

  const [form, setForm] = useState<Warranty>({
    imei: "",
    orderId: "",
    productName: "",
    storageVariant: "",
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    status: "ACTIVE",
    notes: ""
  });

  const fetchWarranties = async (query = "") => {
    setLoading(true);
    try {
      const url = query ? `http://localhost:8080/api/warranties/search?query=${encodeURIComponent(query)}` : `http://localhost:8080/api/warranties`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setWarranties(data);
      }
    } catch {
      toast.error("Không thể tải danh sách bảo hành");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarranties();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWarranties(searchQuery);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isEdit = !!editingWarranty?.id;
      const url = isEdit ? `http://localhost:8080/api/warranties/${editingWarranty.id}` : `http://localhost:8080/api/warranties`;
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        toast.success(isEdit ? "Cập nhật bảo hành thành công" : "Tạo phiếu bảo hành thành công");
        setModalOpen(false);
        fetchWarranties();
      }
    } catch {
      toast.error("Có lỗi xảy ra");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"><CheckCircle2 className="w-3.5 h-3.5" /> Con Hạn</span>;
      case "IN_REPAIR":
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"><Clock className="w-3.5 h-3.5" /> Đang Sửa Chữa</span>;
      case "EXPIRED":
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400"><AlertCircle className="w-3.5 h-3.5" /> Hết Hạn</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400">Từ Chối</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-horizon-dark-card p-6 rounded-3xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-horizon-dark dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-horizon-brand" /> Quản Lý Bảo Hành & IMEI
          </h2>
          <p className="text-sm text-horizon-gray dark:text-horizon-dark-gray mt-1">Tra cứu IMEI, quản lý thời hạn bảo hành và nhật ký sửa chữa máy</p>
        </div>
        <button
          onClick={() => {
            setEditingWarranty(null);
            setForm({
              imei: "",
              orderId: "",
              productName: "",
              storageVariant: "",
              customerName: "",
              customerPhone: "",
              customerEmail: "",
              startDate: new Date().toISOString().split("T")[0],
              endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              status: "ACTIVE",
              notes: ""
            });
            setModalOpen(true);
          }}
          className="flex items-center gap-2 bg-horizon-brand hover:bg-horizon-brand/90 text-white font-bold px-5 py-3 rounded-2xl transition-all shadow-md shadow-horizon-brand/20 cursor-pointer"
        >
          <Plus className="w-5 h-5" /> Tạo Phiếu Bảo Hành
        </button>
      </div>

      <div className="bg-white dark:bg-horizon-dark-card rounded-3xl p-6 shadow-sm">
        <form onSubmit={handleSearch} className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Nhập IMEI, Số điện thoại, Email hoặc Mã đơn hàng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#F4F7FE] dark:bg-[#0B1437] border-none rounded-2xl text-sm font-medium outline-none"
            />
          </div>
          <button type="submit" className="bg-horizon-brand text-white px-6 py-3 rounded-2xl font-bold hover:bg-horizon-brand/90 transition-all cursor-pointer">
            Tìm Kiếm
          </button>
        </form>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Đang tải dữ liệu bảo hành...</div>
        ) : warranties.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Chưa tìm thấy phiếu bảo hành nào</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/10 text-xs font-bold uppercase text-horizon-gray dark:text-horizon-dark-gray pb-4">
                  <th className="py-3 px-4">MÃ IMEI</th>
                  <th className="py-3 px-4">SẢN PHẨM</th>
                  <th className="py-3 px-4">KHÁCH HÀNG</th>
                  <th className="py-3 px-4">HẠN BẢO HÀNH</th>
                  <th className="py-3 px-4">TRẠNG THÁI</th>
                  <th className="py-3 px-4 text-right">THAO TÁC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-sm">
                {warranties.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-horizon-brand">{item.imei || "Chưa gắn IMEI"}</td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-horizon-dark dark:text-white">{item.productName}</div>
                      <div className="text-xs text-horizon-gray dark:text-horizon-dark-gray">{item.storageVariant}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold">{item.customerName}</div>
                      <div className="text-xs text-gray-400">{item.customerPhone} - {item.customerEmail}</div>
                    </td>
                    <td className="py-4 px-4 text-xs font-medium">
                      {new Date(item.endDate).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="py-4 px-4">{getStatusBadge(item.status)}</td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => {
                          setEditingWarranty(item);
                          setForm(item);
                          setModalOpen(true);
                        }}
                        className="p-2 text-horizon-brand hover:bg-horizon-brand/10 rounded-xl transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0B1437] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-xl font-bold text-horizon-dark dark:text-white">
              {editingWarranty ? "Cập Nhật Bảo Hành" : "Tạo Phiếu Bảo Hành Mới"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-horizon-gray dark:text-horizon-dark-gray uppercase block mb-1">Mã IMEI máy</label>
                <input
                  type="text"
                  required
                  value={form.imei}
                  onChange={(e) => setForm({ ...form, imei: e.target.value })}
                  placeholder="VD: 356789123456789"
                  className="w-full px-4 py-2.5 bg-[#F4F7FE] dark:bg-horizon-dark-card border-none rounded-xl text-sm outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-horizon-gray dark:text-horizon-dark-gray uppercase block mb-1">Tên sản phẩm</label>
                  <input
                    type="text"
                    required
                    value={form.productName}
                    onChange={(e) => setForm({ ...form, productName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#F4F7FE] dark:bg-horizon-dark-card border-none rounded-xl text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-horizon-gray dark:text-horizon-dark-gray uppercase block mb-1">Biến thể</label>
                  <input
                    type="text"
                    required
                    value={form.storageVariant}
                    onChange={(e) => setForm({ ...form, storageVariant: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#F4F7FE] dark:bg-horizon-dark-card border-none rounded-xl text-sm outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-horizon-gray dark:text-horizon-dark-gray uppercase block mb-1">Tên khách hàng</label>
                  <input
                    type="text"
                    required
                    value={form.customerName}
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#F4F7FE] dark:bg-horizon-dark-card border-none rounded-xl text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-horizon-gray dark:text-horizon-dark-gray uppercase block mb-1">Số điện thoại</label>
                  <input
                    type="text"
                    required
                    value={form.customerPhone}
                    onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#F4F7FE] dark:bg-horizon-dark-card border-none rounded-xl text-sm outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-horizon-gray dark:text-horizon-dark-gray uppercase block mb-1">Trạng thái bảo hành</label>
                <Select
                  options={[
                    { value: "ACTIVE", label: "Còn Hạn (Active)" },
                    { value: "IN_REPAIR", label: "Đang Sửa Chữa (In Repair)" },
                    { value: "EXPIRED", label: "Hết Hạn (Expired)" },
                    { value: "VOID", label: "Từ Chối / Mất Quyền (Void)" }
                  ]}
                  value={[
                    { value: "ACTIVE", label: "Còn Hạn (Active)" },
                    { value: "IN_REPAIR", label: "Đang Sửa Chữa (In Repair)" },
                    { value: "EXPIRED", label: "Hết Hạn (Expired)" },
                    { value: "VOID", label: "Từ Chối / Mất Quyền (Void)" }
                  ].find(o => o.value === form.status) || { value: "ACTIVE", label: "Còn Hạn (Active)" }}
                  onChange={(option: any) => setForm({ ...form, status: option ? option.value : "ACTIVE" })}
                  isSearchable={false}
                  styles={{
                    control: (base: any, state: any) => ({
                      ...base,
                      border: state.isFocused ? '1px solid rgba(67, 24, 255, 0.5)' : 'none',
                      boxShadow: 'none',
                      borderRadius: '0.75rem',
                      padding: '0.15rem',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      backgroundColor: 'transparent',
                    }),
                    option: (base: any, state: any) => ({
                      ...base,
                      backgroundColor: state.isSelected ? '#4318FF' : state.isFocused ? '#eef2ff' : 'white',
                      color: state.isSelected ? 'white' : state.isFocused ? '#4318FF' : '#1f2937',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      borderRadius: '0.5rem',
                      margin: '0.2rem 0.4rem',
                      width: 'auto',
                    }),
                    menu: (base: any) => ({
                      ...base,
                      borderRadius: '0.75rem',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      border: '1px solid #f3f4f6',
                      zIndex: 50
                    }),
                    container: (base: any) => ({
                      ...base,
                      backgroundColor: '#F4F7FE',
                      borderRadius: '0.75rem',
                    })
                  }}
                  className="dark:bg-horizon-dark-card rounded-xl"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-horizon-gray dark:text-horizon-dark-gray uppercase block mb-1">Ghi chú lịch sử sửa chữa</label>
                <textarea
                  rows={3}
                  value={form.notes || ""}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Ghi chú linh kiện đã thay, tình trạng máy..."
                  className="w-full px-4 py-2.5 bg-[#F4F7FE] dark:bg-horizon-dark-card border-none rounded-xl text-sm outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-bold bg-gray-100 dark:bg-white/10 hover:bg-gray-200 transition-all text-sm"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-bold bg-horizon-brand text-white hover:bg-horizon-brand/90 transition-all text-sm"
                >
                  Lưu Thông Tin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
