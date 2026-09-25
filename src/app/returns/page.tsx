"use client";

import React, { useState, useEffect } from "react";
import { RefreshCw, Check, X, PackageCheck, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface ReturnRequest {
  id: string;
  orderId: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  reason: string;
  description: string;
  imageUrl?: string;
  status: string;
  refundAmount: number;
  createdAt: string;
}

export default function ReturnRequestsPage() {
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReturns = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/orders/returns");
      if (res.ok) {
        const data = await res.json();
        setReturns(data);
      }
    } catch {
      toast.error("Không thể tải danh sách đổi trả");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`http://localhost:8080/api/orders/returns/${id}/status?status=${status}`, {
        method: "PATCH"
      });
      if (res.ok) {
        toast.success(`Cập nhật trạng thái thành ${status}`);
        fetchReturns();
      }
    } catch {
      toast.error("Có lỗi xảy ra");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-horizon-dark-card p-6 rounded-3xl shadow-sm">
        <h2 className="text-xl font-bold text-horizon-dark dark:text-white flex items-center gap-2">
          <RefreshCw className="w-6 h-6 text-horizon-brand" /> Quản Lý Đổi Trả & Hoàn Tiền
        </h2>
        <p className="text-sm text-horizon-gray dark:text-horizon-dark-gray mt-1">
          Duyệt yêu cầu đổi trả sản phẩm từ khách hàng và tự động cập nhật lại tồn kho sản phẩm khi duyệt
        </p>
      </div>

      <div className="bg-white dark:bg-horizon-dark-card rounded-3xl p-6 shadow-sm">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Đang tải dữ liệu yêu cầu đổi trả...</div>
        ) : returns.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Chưa có yêu cầu đổi trả nào</div>
        ) : (
          <div className="space-y-4">
            {returns.map((req) => (
              <div key={req.id} className="border border-gray-100 dark:border-white/10 rounded-2xl p-5 hover:border-horizon-brand/30 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-white/10 pb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-horizon-brand">Đơn hàng #{req.orderId}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        req.status === "APPROVED" || req.status === "RESTOCKED"
                          ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                          : req.status === "REJECTED"
                          ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
                      }`}>
                        {req.status === "PENDING" ? "Chờ Duyệt" : req.status === "APPROVED" || req.status === "RESTOCKED" ? "Đã Duyệt & Nhập Kho" : "Từ Chối"}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Khách hàng: <span className="font-semibold text-gray-700 dark:text-gray-300">{req.customerName}</span> ({req.customerPhone}) - {req.customerEmail}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-gray-400">Số tiền hoàn ước tính</div>
                    <div className="text-lg font-bold text-red-500">
                      {req.refundAmount ? req.refundAmount.toLocaleString("vi-VN") : 0} đ
                    </div>
                  </div>
                </div>

                <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-bold text-gray-400 uppercase mb-1">Lý do yêu cầu đổi trả</div>
                    <div className="font-semibold text-sm text-horizon-dark dark:text-white mb-2">{req.reason}</div>
                    <p className="text-xs text-gray-500 bg-gray-50 dark:bg-white/5 p-3 rounded-xl">{req.description}</p>
                  </div>

                  {req.imageUrl && (
                    <div>
                      <div className="text-xs font-bold text-gray-400 uppercase mb-1">Hình ảnh lỗi sản phẩm</div>
                      <img src={req.imageUrl} alt="Lỗi sản phẩm" className="w-24 h-24 object-cover rounded-xl border" />
                    </div>
                  )}
                </div>

                {req.status === "PENDING" && (
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/10 flex justify-end gap-3">
                    <button
                      onClick={() => handleUpdateStatus(req.id, "REJECTED")}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                    >
                      <X className="w-4 h-4" /> Từ Chối Yêu Cầu
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(req.id, "RESTOCKED")}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-horizon-brand hover:bg-horizon-brand/90 transition-colors"
                    >
                      <PackageCheck className="w-4 h-4" /> Duyệt & Hoàn Tồn Kho Auto
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
