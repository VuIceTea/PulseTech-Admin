"use client";

import React, { useEffect, useState } from "react";
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Truck, 
  XCircle, 
  AlertCircle, 
  RefreshCw, 
  PhoneCall, 
  MapPin, 
  CreditCard,
  ChevronDown
} from "lucide-react";
import { toast } from "sonner";

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  paymentMethod: string;
  totalPrice: number;
  status: number;
  createdAt: string;
  items?: Array<{
    productId: string;
    productName: string;
    price: number;
    quantity: number;
  }>;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<number | "ALL">("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/backend-api/orders/all");
      if (res.ok) {
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } else {
        toast.error("Không thể tải danh sách đơn hàng");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi kết nối tới máy chủ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: number) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/backend-api/orders/${orderId}/status?status=${newStatus}`, {
        method: "PATCH",
      });
      if (res.ok) {
        toast.success("Đã cập nhật trạng thái đơn hàng thành công");
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      } else {
        toast.error("Không thể thay đổi trạng thái đơn hàng");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi kết nối API");
    } finally {
      setUpdatingId(null);
    }
  };

  const statusTabs = [
    { label: "Tất cả", value: "ALL" as const },
    { label: "Chờ xác nhận", value: 1 },
    { label: "Đang xử lý", value: 2 },
    { label: "Đang giao", value: 3 },
    { label: "Đã giao", value: 4 },
    { label: "Đã hủy", value: 5 },
  ];

  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      o.id?.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone?.includes(search) ||
      o.customerEmail?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 1:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Clock className="h-3.5 w-3.5" />
            <span>Chờ xác nhận</span>
          </span>
        );
      case 2:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Đang xử lý</span>
          </span>
        );
      case 3:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <Truck className="h-3.5 w-3.5" />
            <span>Đang giao</span>
          </span>
        );
      case 4:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Đã giao</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <XCircle className="h-3.5 w-3.5" />
            <span>Đã hủy</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Quản lý Đơn hàng & Thanh toán</span>
            <span className="text-xs bg-amber-500/20 text-amber-400 font-semibold px-2.5 py-1 rounded-full border border-amber-500/30">
              {orders.length} đơn
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Duyệt đơn, cập nhật trạng thái giao hàng, kiểm tra phương thức thanh toán VNPay/COD.
          </p>
        </div>
        <button
          onClick={fetchOrders}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition-all border border-slate-700 w-fit"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-rose-400" : ""}`} />
          <span>Làm mới đơn hàng</span>
        </button>
      </div>

      {/* Filter Tabs and Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
        <div className="flex flex-wrap items-center gap-1.5">
          {statusTabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                statusFilter === tab.value
                  ? "bg-gradient-to-r from-rose-600 to-rose-500 text-white shadow-md shadow-rose-600/30"
                  : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Tìm theo mã đơn, sđt, tên khách..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
          />
        </div>
      </div>

      {/* Orders List / Cards */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl bg-slate-900/70 border border-slate-800">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-rose-500 border-t-transparent mb-3" />
            <p className="text-sm font-semibold text-slate-300">Đang tải danh sách đơn hàng từ Order Service...</p>
          </div>
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all shadow-lg"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="font-mono text-lg font-black text-white">#{order.id}</div>
                  {getStatusBadge(order.status)}
                  <span className="text-xs text-slate-500 font-mono">
                    {order.createdAt ? new Date(order.createdAt).toLocaleString("vi-VN") : "Hôm nay"}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">Cập nhật trạng thái:</span>
                  <select
                    disabled={updatingId === order.id}
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, Number(e.target.value))}
                    className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-rose-500 disabled:opacity-50"
                  >
                    <option value={1}>1: Chờ xác nhận</option>
                    <option value={2}>2: Đang xử lý</option>
                    <option value={3}>3: Đang giao hàng</option>
                    <option value={4}>4: Đã giao thành công</option>
                    <option value={5}>5: Đã hủy đơn</option>
                  </select>
                </div>
              </div>

              {/* Order customer detail & summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 text-sm">
                <div className="space-y-1.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Khách hàng
                  </div>
                  <div className="font-bold text-white text-base">{order.customerName}</div>
                  <div className="flex items-center gap-2 text-slate-300 text-xs">
                    <PhoneCall className="h-3.5 w-3.5 text-rose-400" />
                    <span>{order.customerPhone}</span>
                  </div>
                  <div className="text-xs text-slate-400">{order.customerEmail}</div>
                </div>

                <div className="space-y-1.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Giao hàng & Thanh toán
                  </div>
                  <div className="flex items-start gap-2 text-slate-300 text-xs">
                    <MapPin className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{order.shippingAddress || "Khách nhận tại nhà"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300 text-xs pt-1">
                    <CreditCard className="h-3.5 w-3.5 text-amber-400" />
                    <span>{order.paymentMethod || "Thanh toán khi nhận hàng (COD)"}</span>
                  </div>
                </div>

                <div className="space-y-1.5 md:text-right">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Tổng giá trị thanh toán
                  </div>
                  <div className="text-xl md:text-2xl font-black text-rose-400">
                    {order.totalPrice?.toLocaleString("vi-VN")} đ
                  </div>
                  <div className="text-xs text-slate-400 font-medium">
                    Đã bao gồm thuế & phí vận chuyển
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl bg-slate-900/70 border border-slate-800">
            <ShoppingBag className="h-12 w-12 text-slate-600 mb-3" />
            <p className="text-base font-bold text-white">Chưa có đơn hàng nào khớp bộ lọc</p>
            <p className="text-xs text-slate-400 mt-1">
              Thử chọn trạng thái &quot;Tất cả&quot; hoặc đợi khách hàng đặt mua trên Website.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
