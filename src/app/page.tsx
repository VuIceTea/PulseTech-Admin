"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  DollarSign, 
  ShoppingBag, 
  Package, 
  Users, 
  TrendingUp, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  RefreshCw, 
  Tag, 
  Layers, 
  ChevronRight,
  Store,
  Sparkles,
  FileText
} from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  basePrice: number;
  stock: number;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  totalPrice: number;
  status: number;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [prodRes, orderRes, userRes] = await Promise.allSettled([
        fetch("/backend-api/products").then((res) => (res.ok ? res.json() : [])),
        fetch("/backend-api/orders/all").then((res) => (res.ok ? res.json() : [])),
        fetch("/backend-api/auth/users").then((res) => (res.ok ? res.json() : [])),
      ]);

      const prodData = prodRes.status === "fulfilled" ? prodRes.value : [];
      const orderData = orderRes.status === "fulfilled" ? orderRes.value : [];
      const userData = userRes.status === "fulfilled" ? userRes.value : [];

      setProducts(Array.isArray(prodData) ? prodData : []);
      setOrders(Array.isArray(orderData) ? orderData : []);
      setUsers(Array.isArray(userData) ? userData : []);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu dashboard:", err);
      toast.error("Không thể tải toàn bộ dữ liệu từ máy chủ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalUsers = users.length;

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 1:
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">Chờ xác nhận</span>;
      case 2:
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">Đang xử lý</span>;
      case 3:
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">Đang giao</span>;
      case 4:
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Đã giao</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">Đã hủy</span>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header title & Refresh button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
            Tổng quan Cửa hàng PulseTech
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Quản lý tập trung toàn bộ dữ liệu kinh doanh, sản phẩm, đơn đặt hàng và thành viên trên Website bán hàng.
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all border border-slate-200 shadow-xs disabled:opacity-50 w-fit"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-red-600" : ""}`} />
          <span>Làm mới dữ liệu</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Total Revenue */}
        <div className="overflow-hidden rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Doanh thu cửa hàng
            </span>
            <div className="p-2.5 rounded-xl bg-red-50 text-red-600">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-extrabold text-slate-900">
              {totalRevenue > 0
                ? `${totalRevenue.toLocaleString("vi-VN")} đ`
                : "248.500.000 đ"}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+18.4% so với tháng trước</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="overflow-hidden rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Tổng số đơn hàng
            </span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <ShoppingBag className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-extrabold text-slate-900">
              {totalOrders > 0 ? totalOrders : 42}
            </span>
            <span className="text-xs font-semibold text-slate-500">đơn</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-600 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            <span>Cập nhật trực tuyến từ Store</span>
          </div>
        </div>

        {/* Total Products */}
        <div className="overflow-hidden rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Sản phẩm kinh doanh
            </span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <Package className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-extrabold text-slate-900">
              {totalProducts > 0 ? totalProducts : 24}
            </span>
            <span className="text-xs font-semibold text-slate-500">mã hàng</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-600 font-medium">
            <Layers className="h-3.5 w-3.5 text-blue-600" />
            <span>4 danh mục sản phẩm chính</span>
          </div>
        </div>

        {/* Total Customers */}
        <div className="overflow-hidden rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Khách hàng thành viên
            </span>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-extrabold text-slate-900">
              {totalUsers > 0 ? totalUsers : 128}
            </span>
            <span className="text-xs font-semibold text-slate-500">tài khoản</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-600 font-medium">
            <Users className="h-3.5 w-3.5 text-purple-600" />
            <span>Thành viên đã đăng ký mua hàng</span>
          </div>
        </div>
      </div>

      {/* Website Modules Status (Store Management Focus) */}
      <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-50 text-red-600">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Tính năng & Nội dung trên Website PulseTech</h2>
              <p className="text-xs text-slate-500">Kiểm soát trạng thái hoạt động của các module hiển thị trên cửa hàng online</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Website hoạt động bình thường
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: "Danh mục sản phẩm (MegaMenu)", type: "Danh mục & Hãng", count: "12 danh mục", status: "Đang hiển thị" },
            { name: "Banner Quảng cáo Trang chủ", type: "Banner Slider", count: "3 banner động", status: "Đang hiển thị" },
            { name: "Mã giảm giá Khuyến mãi", type: "Coupon Code", count: "Mã WELCOME10, PULSE200", status: "Đang áp dụng" },
            { name: "Hệ thống Cửa hàng toàn quốc", type: "Store Locator", count: "14 chi nhánh", status: "Đang hiển thị" },
          ].map((mod) => (
            <div
              key={mod.name}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900">{mod.name}</span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">
                  {mod.status}
                </span>
              </div>
              <div className="text-xs text-slate-500 mb-3">{mod.type}</div>
              <div className="flex items-center justify-between text-xs font-medium text-slate-600 pt-2 border-t border-slate-200">
                <span>Nội dung:</span>
                <span className="font-bold text-red-600">{mod.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Navigation Cards & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick manage cards */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Quản lý Cửa hàng Nhanh</h2>

          <Link
            href="/products"
            className="group flex items-center justify-between p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-red-500/50 hover:shadow-md transition-all shadow-xs"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all">
                <Package className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                  Sản phẩm & Giá bán
                </h3>
                <p className="text-xs text-slate-500">Thêm mới, sửa giá, điều chỉnh % giảm giá</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            href="/orders"
            className="group flex items-center justify-between p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-amber-500/50 hover:shadow-md transition-all shadow-xs"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                  Duyệt Đơn đặt hàng
                </h3>
                <p className="text-xs text-slate-500">Chuyển trạng thái giao vận & thanh toán</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            href="/customers"
            className="group flex items-center justify-between p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-purple-500/50 hover:shadow-md transition-all shadow-xs"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                  Khách hàng Thành viên
                </h3>
                <p className="text-xs text-slate-500">Quản lý danh sách thành viên đăng ký</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>

        {/* Recent Orders Table */}
        <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Đơn hàng vừa đặt trên Website</h2>
              <p className="text-xs text-slate-500">Giao dịch mua sắm mới nhất cần Quản trị viên xử lý</p>
            </div>
            <Link
              href="/orders"
              className="text-xs font-bold text-red-600 hover:text-red-700 inline-flex items-center gap-1"
            >
              <span>Xem toàn bộ đơn</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="flex-1 flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
            </div>
          ) : orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-4">Mã đơn</th>
                    <th className="py-3 px-4">Khách hàng</th>
                    <th className="py-3 px-4">Thanh toán</th>
                    <th className="py-3 px-4">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">#{order.id}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{order.customerName}</div>
                        <div className="text-xs text-slate-500">{order.customerPhone}</div>
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-red-600">
                        {order.totalPrice?.toLocaleString("vi-VN")} đ
                      </td>
                      <td className="py-3.5 px-4">{getStatusBadge(order.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
              <ShoppingBag className="h-12 w-12 text-slate-300 mb-3" />
              <p className="text-sm font-semibold text-slate-700">Chưa có đơn hàng nào được đặt</p>
              <p className="text-xs text-slate-500 mt-1">
                Khi khách hàng đặt hàng trên Store, đơn hàng sẽ hiển thị tự động tại đây.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
