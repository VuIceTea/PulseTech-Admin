"use client";

import React, { useEffect, useState } from "react";
import { 
  ShoppingBag, 
  Search, 
  CheckCircle2, 
  Clock, 
  Truck, 
  XCircle, 
  RefreshCw, 
  PhoneCall, 
  MapPin, 
  CreditCard,
  Calendar
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
    { label: "Tất cả đơn", value: "ALL" as const },
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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="h-3.5 w-3.5" />
            <span>Chờ xác nhận</span>
          </span>
        );
      case 2:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Đang xử lý</span>
          </span>
        );
      case 3:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <Truck className="h-3.5 w-3.5" />
            <span>Đang giao hàng</span>
          </span>
        );
      case 4:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Đã giao thành công</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
            <XCircle className="h-3.5 w-3.5" />
            <span>Đã hủy đơn</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Quản lý Đơn hàng & Giao vận</span>
            <span className="text-xs bg-red-50 text-red-600 font-bold px-2.5 py-1 rounded-full border border-red-200">
              {orders.length} đơn
            </span>
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Duyệt đơn, cập nhật trạng thái giao nhận và kiểm tra phương thức thanh toán VNPay/COD trên Website.
          </p>
        </div>
        <button
          onClick={fetchOrders}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all border border-slate-200 shadow-xs w-fit"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-red-600" : ""}`} />
          <span>Làm mới danh sách</span>
        </button>
      </div>

      {/* Filter Tabs and Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          {statusTabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                statusFilter === tab.value
                  ? "bg-red-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo mã đơn, sđt, tên khách..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
          />
        </div>
      </div>

      {/* Orders Cards */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-red-600 border-t-transparent mb-3" />
            <p className="text-sm font-semibold text-slate-700">Đang tải danh sách đơn hàng từ máy chủ...</p>
          </div>
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-slate-300 transition-all shadow-xs hover:shadow-md"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="font-mono text-lg font-black text-slate-900">#{order.id}</div>
                  {getStatusBadge(order.status)}
                  <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{order.createdAt ? new Date(order.createdAt).toLocaleString("vi-VN") : "Hôm nay"}</span>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-600">Cập nhật trạng thái:</span>
                  <select
                    disabled={updatingId === order.id}
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, Number(e.target.value))}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 disabled:opacity-50"
                  >
                    <option value={1}>1: Chờ xác nhận</option>
                    <option value={2}>2: Đang xử lý</option>
                    <option value={3}>3: Đang giao hàng</option>
                    <option value={4}>4: Đã giao thành công</option>
                    <option value={5}>5: Đã hủy đơn</option>
                  </select>
                </div>
              </div>

              {/* Customer detail & summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 text-sm">
                <div className="space-y-1.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Khách hàng đặt mua
                  </div>
                  <div className="font-bold text-slate-900 text-base">{order.customerName}</div>
                  <div className="flex items-center gap-2 text-slate-700 text-xs">
                    <PhoneCall className="h-3.5 w-3.5 text-red-600" />
                    <span>{order.customerPhone}</span>
                  </div>
                  <div className="text-xs text-slate-500">{order.customerEmail}</div>
                </div>

                <div className="space-y-1.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Giao hàng & Thanh toán
                  </div>
                  <div className="flex items-start gap-2 text-slate-700 text-xs">
                    <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{order.shippingAddress || "Khách nhận tại Cửa hàng"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 text-xs pt-1">
                    <CreditCard className="h-3.5 w-3.5 text-blue-600" />
                    <span className="font-semibold">{order.paymentMethod || "Thanh toán khi nhận hàng (COD)"}</span>
                  </div>
                </div>

                <div className="space-y-1.5 md:text-right">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Tổng giá trị thanh toán
                  </div>
                  <div className="text-xl md:text-2xl font-black text-red-600">
                    {order.totalPrice?.toLocaleString("vi-VN")} đ
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    Đã bao gồm thuế & phí vận chuyển
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <ShoppingBag className="h-12 w-12 text-slate-300 mb-3" />
            <p className="text-base font-bold text-slate-900">Chưa có đơn hàng nào khớp bộ lọc</p>
            <p className="text-xs text-slate-500 mt-1">
              Thử chọn trạng thái &quot;Tất cả đơn&quot; hoặc đợi khách hàng đặt mua trên Website.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
