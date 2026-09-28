"use client";

import React, { useState, useEffect } from "react";
import { History, ArrowUpRight, ArrowDownRight, RefreshCw, Package } from "lucide-react";
import { toast } from "sonner";

interface InventoryLog {
  id: string;
  productId: string;
  productName: string;
  storageVariant: string;
  previousStock: number;
  newStock: number;
  changeQuantity: number;
  reason: string;
  performedBy: string;
  createdAt: string;
}

export default function InventoryLogsPage() {
  const [logs, setLogs] = useState<InventoryLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/backend-api/products/inventory-logs");
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch {
      toast.error("Không thể tải nhật ký tồn kho");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getReasonLabel = (reason: string) => {
    switch (reason) {
      case "EXPORT": return "Bán Hàng / Xuất Kho";
      case "IMPORT": return "Nhập Hàng Mới";
      case "RETURN_RESTOCK": return "Hoàn Tồn Từ Đổi Trả";
      case "UNPAID_CANCEL": return "Hoàn Tồn Hủy Đơn Quá Hạn";
      default: return "Điều Chỉnh Thủ Công";
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-horizon-dark-card p-6 rounded-3xl shadow-sm">
        <h2 className="text-xl font-bold text-horizon-dark dark:text-white flex items-center gap-2">
          <History className="w-6 h-6 text-horizon-brand" /> Nhật Ký Tồn Kho & Biến Động
        </h2>
        <p className="text-sm text-horizon-gray dark:text-horizon-dark-gray mt-1">
          Theo dõi toàn bộ lịch sử xuất kho, nhập kho, tự động hoàn tồn kho khi hủy đơn hoặc đổi trả
        </p>
      </div>

      <div className="bg-white dark:bg-horizon-dark-card rounded-3xl p-6 shadow-sm">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Đang tải nhật ký...</div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Chưa có biến động kho nào được ghi nhận</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/10 text-xs font-bold uppercase text-horizon-gray dark:text-horizon-dark-gray pb-4">
                  <th className="py-3 px-4">THỜI GIAN</th>
                  <th className="py-3 px-4">SẢN PHẨM & BIẾN THỂ</th>
                  <th className="py-3 px-4">LÝ DO BIẾN ĐỘNG</th>
                  <th className="py-3 px-4 text-center">BIẾN ĐỘNG</th>
                  <th className="py-3 px-4 text-center">KHO TRƯỚC → SAU</th>
                  <th className="py-3 px-4 text-right">NGƯỜI THỰC HIỆN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-sm">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 text-xs font-mono text-gray-400">
                      {new Date(log.createdAt).toLocaleString("vi-VN")}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-horizon-dark dark:text-white">{log.productName}</div>
                      <div className="text-xs text-horizon-brand font-semibold">{log.storageVariant}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300">
                        {getReasonLabel(log.reason)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      {log.changeQuantity > 0 ? (
                        <span className="inline-flex items-center text-green-600 font-bold text-sm">
                          <ArrowUpRight className="w-4 h-4 mr-0.5" /> +{log.changeQuantity}
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-red-500 font-bold text-sm">
                          <ArrowDownRight className="w-4 h-4 mr-0.5" /> {log.changeQuantity}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center font-mono text-xs">
                      <span className="text-gray-400">{log.previousStock}</span>
                      <span className="mx-1 text-gray-300">→</span>
                      <span className="font-bold text-horizon-dark dark:text-white">{log.newStock}</span>
                    </td>
                    <td className="py-4 px-4 text-right text-xs font-semibold text-gray-500">
                      {log.performedBy || "Hệ Thống Auto"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
