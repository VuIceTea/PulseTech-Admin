"use client";

import React, { useEffect, useState } from "react";
import { MoreHorizontal, CheckCircle2, XCircle, Clock } from "lucide-react";
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

  useEffect(() => {
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
  }, []);

  const getStatusDisplay = (status: number) => {
    switch(status) {
      case 1:
        return { text: "Chờ xác nhận", icon: <Clock className="h-4 w-4 text-amber-500" />, progress: 20, color: "bg-amber-500" };
      case 2:
        return { text: "Đang xử lý", icon: <Clock className="h-4 w-4 text-blue-500" />, progress: 50, color: "bg-blue-500" };
      case 3:
        return { text: "Đang giao", icon: <Clock className="h-4 w-4 text-purple-500" />, progress: 80, color: "bg-purple-500" };
      case 4:
        return { text: "Đã giao", icon: <CheckCircle2 className="h-4 w-4 text-[#05CD99]" />, progress: 100, color: "bg-[#05CD99]" };
      default:
        return { text: "Đã hủy", icon: <XCircle className="h-4 w-4 text-red-500" />, progress: 100, color: "bg-red-500" };
    }
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

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/10">
                <th className="py-4 px-2 text-xs font-bold text-horizon-gray dark:text-horizon-dark-gray uppercase tracking-wider">Mã Đơn Hàng</th>
                <th className="py-4 px-2 text-xs font-bold text-horizon-gray dark:text-horizon-dark-gray uppercase tracking-wider">Trạng Thái</th>
                <th className="py-4 px-2 text-xs font-bold text-horizon-gray dark:text-horizon-dark-gray uppercase tracking-wider">Ngày Đặt</th>
                <th className="py-4 px-2 text-xs font-bold text-horizon-gray dark:text-horizon-dark-gray uppercase tracking-wider">Tiến Độ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-horizon-gray dark:text-horizon-dark-gray">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : orders.map((order) => {
                const statusInfo = getStatusDisplay(order.status);
                return (
                  <tr key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="py-4 px-2">
                      <div className="font-bold text-sm text-horizon-dark dark:text-white">#{order.id}</div>
                      <div className="text-xs font-medium text-horizon-gray dark:text-horizon-dark-gray mt-0.5">{order.customerName}</div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-2">
                        {statusInfo.icon}
                        <span className="text-sm font-bold text-horizon-dark dark:text-white">{statusInfo.text}</span>
                      </div>
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
                            className={`h-full rounded-full ${statusInfo.color}`} 
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
