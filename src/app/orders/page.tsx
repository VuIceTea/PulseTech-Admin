"use client";

import React, { useEffect, useState } from "react";
import { MoreHorizontal, CheckCircle2, XCircle, Clock, ChevronDown } from "lucide-react";
import { toast } from "sonner";

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  totalPrice: number;
  status: number;
  createdAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const loadOrders = () => {
    setLoading(true);
    fetch("/backend-api/orders/all")
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setOrders(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error(err);
        toast.error("Lỗi khi tải dữ liệu đơn hàng");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: number) => {
    setUpdatingId(orderId);
    setOpenDropdownId(null);
    try {
      const res = await fetch(`/backend-api/orders/${orderId}/status?status=${newStatus}`, {
        method: "PATCH"
      });
      if (!res.ok) throw new Error("Failed to update status");
      
      toast.success("Cập nhật trạng thái thành công!");
      // Update local state without full reload
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi cập nhật trạng thái");
    } finally {
      setUpdatingId(null);
    }
  };

  const statusMap = [
    { value: 1, text: "Chờ xác nhận", icon: <Clock className="h-4 w-4 text-amber-500" />, progress: 20, color: "bg-amber-500" },
    { value: 2, text: "Đang xử lý", icon: <Clock className="h-4 w-4 text-blue-500" />, progress: 50, color: "bg-blue-500" },
    { value: 3, text: "Đang giao", icon: <Clock className="h-4 w-4 text-purple-500" />, progress: 80, color: "bg-purple-500" },
    { value: 4, text: "Đã giao", icon: <CheckCircle2 className="h-4 w-4 text-[#05CD99]" />, progress: 100, color: "bg-[#05CD99]" },
    { value: 5, text: "Đã hủy", icon: <XCircle className="h-4 w-4 text-red-500" />, progress: 100, color: "bg-red-500" },
  ];

  const getStatusDisplay = (status: number) => {
    return statusMap.find(s => s.value === status) || statusMap[4];
  }

  return (
    <div className="w-full">
      <div className="bg-white dark:bg-horizon-dark-card rounded-[20px] p-6 shadow-[0_4px_12px_rgba(0,0,0,0.02)] w-full">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-horizon-dark dark:text-white">Quản lý Đơn hàng (Complex Table)</h2>
          <button className="h-9 w-9 rounded-xl bg-[#F4F7FE] dark:bg-horizon-dark-bg flex items-center justify-center text-horizon-brand hover:bg-[#E9EDF7] transition-colors">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/10">
                <th className="py-4 px-2 text-xs font-bold text-horizon-gray dark:text-horizon-dark-gray uppercase tracking-wider">Mã Đơn Hàng</th>
                <th className="py-4 px-2 text-xs font-bold text-horizon-gray dark:text-horizon-dark-gray uppercase tracking-wider">Trạng Thái</th>
                <th className="py-4 px-2 text-xs font-bold text-horizon-gray dark:text-horizon-dark-gray uppercase tracking-wider">Tổng tiền</th>
                <th className="py-4 px-2 text-xs font-bold text-horizon-gray dark:text-horizon-dark-gray uppercase tracking-wider">Ngày Đặt</th>
                <th className="py-4 px-2 text-xs font-bold text-horizon-gray dark:text-horizon-dark-gray uppercase tracking-wider">Tiến Độ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-horizon-gray dark:text-horizon-dark-gray">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : orders.map((order) => {
                const statusInfo = getStatusDisplay(order.status);
                const isDropdownOpen = openDropdownId === order.id;
                
                return (
                  <tr key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="py-4 px-2">
                      <div className="font-bold text-sm text-horizon-dark dark:text-white">#{order.id}</div>
                      <div className="text-xs font-medium text-horizon-gray dark:text-horizon-dark-gray mt-0.5">{order.customerName}</div>
                    </td>
                    
                    {/* Status with Dropdown */}
                    <td className="py-4 px-2 relative">
                      <button 
                        onClick={() => setOpenDropdownId(isDropdownOpen ? null : order.id)}
                        disabled={updatingId === order.id}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-gray-200 dark:hover:border-white/10 ${updatingId === order.id ? 'opacity-50' : ''}`}
                      >
                        {statusInfo.icon}
                        <span className="text-sm font-bold text-horizon-dark dark:text-white">
                          {updatingId === order.id ? 'Đang cập nhật...' : statusInfo.text}
                        </span>
                        <ChevronDown className="h-3 w-3 text-horizon-gray" />
                      </button>

                      {isDropdownOpen && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setOpenDropdownId(null)} />
                          <div className="absolute top-full left-2 mt-1 w-48 bg-white dark:bg-horizon-dark-card border border-gray-100 dark:border-white/10 rounded-xl shadow-lg z-20 py-2">
                            {statusMap.map(s => (
                              <button
                                key={s.value}
                                onClick={() => handleUpdateStatus(order.id, s.value)}
                                className={`w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${order.status === s.value ? 'bg-[#F4F7FE] dark:bg-horizon-dark-bg' : ''}`}
                              >
                                {s.icon}
                                <span className="text-sm font-medium text-horizon-dark dark:text-white">{s.text}</span>
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </td>

                    <td className="py-4 px-2 text-sm font-bold text-horizon-brand dark:text-white">
                      {order.totalPrice?.toLocaleString('vi-VN')} đ
                    </td>

                    <td className="py-4 px-2 text-sm font-bold text-horizon-dark dark:text-white">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString('vi-VN') : "N/A"}
                    </td>

                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-horizon-dark dark:text-white min-w-[32px]">
                          {statusInfo.progress}%
                        </span>
                        <div className="w-24 h-2 bg-[#F4F7FE] dark:bg-horizon-dark-bg rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${statusInfo.color}`} 
                            style={{ width: `${statusInfo.progress}%` }} 
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
