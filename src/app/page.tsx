"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import AdminPageSkeleton from "./AdminPageSkeleton";
import { 
  ChartBar,
  FileText,
  CheckSquareOffset,
  CalendarBlank,
  TrendUp,
  CurrencyCircleDollar,
  ShieldCheck,
  ArrowsCounterClockwise
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { adminFetch } from "../lib/adminAuth";

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

interface ProfitData {
  totalRevenue: number;
  estimatedTotalCost: number;
  netProfit: number;
  completedOrders: number;
}

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [profitData, setProfitData] = useState<ProfitData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [prodRes, orderRes, userRes, profitRes] = await Promise.allSettled([
        fetch("/backend-api/products").then((res) => (res.ok ? res.json() : [])),
        fetch("/backend-api/orders/all").then((res) => (res.ok ? res.json() : [])),
        adminFetch("/backend-api/auth/admin/users").then((res) => (res.ok ? res.json() : [])),
        fetch("/backend-api/orders/analytics/profit").then((res) => (res.ok ? res.json() : null)),
      ]);

      const prodData = prodRes.status === "fulfilled" ? prodRes.value : [];
      const orderData = orderRes.status === "fulfilled" ? orderRes.value : [];
      const userData = userRes.status === "fulfilled" ? userRes.value : [];
      const profitInfo = profitRes.status === "fulfilled" ? profitRes.value : null;

      setProducts(Array.isArray(prodData) ? prodData : []);
      setOrders(Array.isArray(orderData) ? orderData : []);
      setUsers(Array.isArray(userData) ? userData : []);
      if (profitInfo) setProfitData(profitInfo);
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

  const completedOrders = orders.filter(o => o.status === 3);
  const totalRevenue = profitData?.totalRevenue ?? completedOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const estimatedCost = profitData?.estimatedTotalCost ?? Math.round(totalRevenue * 0.7);
  const netProfit = profitData?.netProfit ?? Math.max(0, totalRevenue - estimatedCost);

  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalUsers = users.length;
  const pendingOrders = orders.filter(o => o.status === 0 || o.status === 1).length;

  if (loading) return <AdminPageSkeleton variant="dashboard" />;

  return (
    <div className="space-y-6 max-w-full">
      {/* Financial & Profit Summary Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 bg-gradient-to-r from-[#1B254B] via-[#111C44] to-[#0B1437] text-white p-6 rounded-[24px] shadow-xl border border-white/10">
        <div>
          <div className="text-xs uppercase font-bold text-white mb-1 flex items-center gap-1.5">
            <CurrencyCircleDollar className="w-5 h-5 text-emerald-400" /> Doanh Thu Đơn Hoàn Tất
          </div>
          <div className="text-3xl font-extrabold tracking-tight text-red-500">
            {totalRevenue.toLocaleString("vi-VN")} đ
          </div>
          <p className="text-xs text-white mt-1">Tổng tiền thu được từ đơn giao thành công</p>
        </div>

        <div>
          <div className="text-xs uppercase font-bold text-white mb-1 flex items-center gap-1.5">
            <ChartBar className="w-5 h-5 text-amber-400" /> Tổng Giá Vốn Hàng Bán
          </div>
          <div className="text-3xl font-extrabold tracking-tight text-red-500">
            {estimatedCost.toLocaleString("vi-VN")} đ
          </div>
          <p className="text-xs text-white mt-1">Tổng chi phí nhập kho của sản phẩm đã bán</p>
        </div>

        <div>
          <div className="text-xs uppercase font-bold text-white mb-1 flex items-center gap-1.5">
            <TrendUp className="w-5 h-5 text-emerald-400" /> Lợi Nhuận Ròng (Net Profit)
          </div>
          <div className="text-3xl font-extrabold tracking-tight text-red-500">
            {netProfit.toLocaleString("vi-VN")} đ
          </div>
          <p className="text-xs text-emerald-300 mt-1">Lợi Nhuận Ròng = Doanh Thu - Giá Vốn</p>
        </div>
      </div>

      {/* 5 Distinct Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <Link href="/orders" className="group bg-white dark:bg-horizon-dark-card rounded-[20px] p-[18px] flex items-center gap-4 shadow-sm hover:-translate-y-1 transition-all cursor-pointer">
          <div className="h-14 w-14 rounded-full bg-[#F4F7FE] dark:bg-horizon-dark-bg flex items-center justify-center text-horizon-brand dark:text-white">
            <FileText className="h-7 w-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-horizon-gray dark:text-horizon-dark-gray">Tổng Đơn Hàng</p>
            <p className="text-2xl font-bold text-horizon-dark dark:text-white tracking-tight">
              {totalOrders.toLocaleString('vi-VN')}
            </p>
          </div>
        </Link>

        <Link href="/products" className="group bg-white dark:bg-horizon-dark-card rounded-[20px] p-[18px] flex items-center gap-4 shadow-sm hover:-translate-y-1 transition-all cursor-pointer">
          <div className="h-14 w-14 rounded-full bg-[#F4F7FE] dark:bg-horizon-dark-bg flex items-center justify-center text-horizon-brand dark:text-white">
            <ChartBar className="h-7 w-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-horizon-gray dark:text-horizon-dark-gray">Sản Phẩm Đang Bán</p>
            <p className="text-2xl font-bold text-horizon-dark dark:text-white tracking-tight">
              {totalProducts.toLocaleString('vi-VN')}
            </p>
          </div>
        </Link>

        <Link href="/orders" className="group bg-white dark:bg-horizon-dark-card rounded-[20px] p-[18px] flex items-center gap-4 shadow-sm hover:-translate-y-1 transition-all cursor-pointer">
          <div className="h-14 w-14 rounded-full bg-[#F4F7FE] dark:bg-horizon-dark-bg flex items-center justify-center text-horizon-brand dark:text-white">
            <CheckSquareOffset className="h-7 w-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-horizon-gray dark:text-horizon-dark-gray">Đơn Chờ Xử Lý</p>
            <p className="text-2xl font-bold text-horizon-dark dark:text-white tracking-tight">
              {pendingOrders.toLocaleString('vi-VN')}
            </p>
          </div>
        </Link>

        <Link href="/warranties" className="group bg-white dark:bg-horizon-dark-card rounded-[20px] p-[18px] flex items-center gap-4 shadow-sm hover:-translate-y-1 transition-all cursor-pointer">
          <div className="h-14 w-14 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-horizon-gray dark:text-horizon-dark-gray">Bảo Hành & IMEI</p>
            <p className="text-lg font-bold text-horizon-dark dark:text-white tracking-tight">
              Quản lý IMEI máy
            </p>
          </div>
        </Link>

        <Link href="/returns" className="group bg-white dark:bg-horizon-dark-card rounded-[20px] p-[18px] flex items-center gap-4 shadow-sm hover:-translate-y-1 transition-all cursor-pointer">
          <div className="h-14 w-14 rounded-full bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600">
            <ArrowsCounterClockwise className="h-7 w-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-horizon-gray dark:text-horizon-dark-gray">Đổi Trả & Hoàn Tiền</p>
            <p className="text-lg font-bold text-horizon-dark dark:text-white tracking-tight">
              Tự động hoàn kho
            </p>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5">
        <div className="bg-white dark:bg-horizon-dark-card rounded-[20px] p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-xl font-bold text-horizon-dark dark:text-white">Thống kê doanh số theo tuần</h2>
            <div className="h-8 w-8 rounded-lg bg-[#F4F7FE] dark:bg-horizon-dark-bg flex items-center justify-center text-horizon-brand dark:text-white">
              <ChartBar className="h-4 w-4" />
            </div>
          </div>

          <div className="flex-1 flex items-end justify-between px-2 pb-6 relative">
            {[
              { day: "17", h1: "30%", h2: "30%", h3: "25%" },
              { day: "18", h1: "35%", h2: "25%", h3: "20%" },
              { day: "19", h1: "25%", h2: "20%", h3: "35%" },
              { day: "20", h1: "45%", h2: "20%", h3: "15%" },
              { day: "21", h1: "20%", h2: "15%", h3: "40%" },
              { day: "22", h1: "30%", h2: "25%", h3: "30%" },
              { day: "23", h1: "35%", h2: "30%", h3: "20%" },
              { day: "24", h1: "25%", h2: "20%", h3: "45%" },
              { day: "25", h1: "40%", h2: "25%", h3: "20%" },
            ].map((bar, i) => (
              <div key={i} className="flex flex-col items-center gap-3 w-4">
                <div className="w-full h-48 flex flex-col justify-end gap-1">
                  <div className="w-full bg-[#E9EDF7] dark:bg-white/10 rounded-t-full" style={{ height: bar.h3 }} />
                  <div className="w-full bg-[#4318FF]" style={{ height: bar.h2 }} />
                  <div className="w-full bg-[#6AD2FF] rounded-b-full" style={{ height: bar.h1 }} />
                </div>
                <span className="text-[11px] font-bold text-horizon-gray dark:text-horizon-dark-gray">{bar.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
