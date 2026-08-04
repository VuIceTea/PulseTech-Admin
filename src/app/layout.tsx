"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Geist } from "next/font/google";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Store, 
  ChevronRight, 
  Menu, 
  X, 
  ExternalLink,
  ShieldCheck,
  Bell,
  Search,
  UserCheck
} from "lucide-react";
import "./globals.css";
import { Toaster } from "sonner";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      name: "Tổng quan Cửa hàng",
      href: "/",
      icon: LayoutDashboard,
      badge: "Hôm nay",
    },
    {
      name: "Sản phẩm & Kho hàng",
      href: "/products",
      icon: Package,
    },
    {
      name: "Đơn hàng & Giao vận",
      href: "/orders",
      icon: ShoppingCart,
      badge: "Xử lý",
    },
    {
      name: "Khách hàng & Tài khoản",
      href: "/customers",
      icon: Users,
    },
  ];

  return (
    <html lang="vi" className={`${geist.variable} h-full w-full scroll-smooth`}>
      <head>
        <title>PulseTech Admin — Quản trị Cửa hàng</title>
        <meta name="description" content="Hệ thống quản lý nội dung và đơn hàng PulseTech E-Commerce." />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row font-sans antialiased selection:bg-red-600 selection:text-white">
        <Toaster position="top-right" richColors />

        {/* Mobile Top Header */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-red-600 flex items-center justify-center font-extrabold text-white shadow-sm">
              PT
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900">PulseTech</span>
              <span className="text-[11px] bg-red-50 text-red-700 font-bold px-2 py-0.5 rounded-full border border-red-200 ml-2">
                ADMIN
              </span>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-1.5 shadow-md">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? "bg-red-600 text-white shadow-md shadow-red-600/20"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${active ? "text-white" : "text-slate-500"}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      active ? "bg-white/20 text-white" : "bg-red-50 text-red-600 border border-red-200"
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
            <div className="pt-3 border-t border-slate-200 mt-3">
              <a
                href="https://pulse-tech-beryl.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              >
                <div className="flex items-center gap-3">
                  <Store className="h-5 w-5 text-emerald-600" />
                  <span>Mở Website Cửa hàng</span>
                </div>
                <ExternalLink className="h-4 w-4 text-slate-400" />
              </a>
            </div>
          </div>
        )}

        {/* Desktop Sidebar (Light Theme) */}
        <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-white border-r border-slate-200 shrink-0 shadow-xs">
          {/* Brand Logo */}
          <div className="p-6 border-b border-slate-200/80">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-red-600 flex items-center justify-center font-black text-white text-xl shadow-md shadow-red-600/20">
                P
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg tracking-tight text-slate-900">
                    PulseTech
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-red-50 text-red-600 border border-red-200">
                    ADMIN
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">Hệ thống Quản lý Cửa hàng</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Quản trị cửa hàng
            </div>
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? "bg-red-600 text-white shadow-md shadow-red-600/20"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 transition-transform group-hover:scale-110 ${active ? "text-white" : "text-slate-500 group-hover:text-red-600"}`} />
                    <span>{item.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        active ? "bg-white/20 text-white" : "bg-red-50 text-red-600 border border-red-200"
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className={`h-4 w-4 transition-transform ${active ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"}`} />
                  </div>
                </Link>
              );
            })}

            <div className="pt-6 mt-6 border-t border-slate-200">
              <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Cửa hàng Online
              </div>
              <a
                href="https://pulse-tech-beryl.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Store className="h-5 w-5 text-emerald-600 group-hover:scale-110 transition-transform" />
                  <span>Xem Website Khách hàng</span>
                </div>
                <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
              </a>
            </div>
          </div>

          {/* Admin User Info Card in Sidebar Footer */}
          <div className="p-4 m-4 rounded-2xl bg-slate-100/80 border border-slate-200/80">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                AD
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-900 truncate">Quản lý PulseTech</div>
                <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>Đang trực tuyến</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 bg-slate-50">
          {/* Top Navbar */}
          <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
            <div className="flex items-center gap-4">
              <div className="relative w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm đơn hàng, sản phẩm, khách hàng..."
                  className="w-full bg-slate-100/80 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Quyền Quản Trị Cửa Hàng (CMS Admin)</span>
              </div>

              <a
                href="https://pulse-tech-beryl.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-red-600 bg-white hover:bg-slate-50 px-3.5 py-2 rounded-xl transition-all border border-slate-200 shadow-xs"
              >
                <Store className="h-4 w-4 text-emerald-600" />
                <span>Mở Cửa Hàng</span>
              </a>

              <div className="h-9 w-9 rounded-full bg-red-600 flex items-center justify-center font-bold text-xs text-white ring-2 ring-red-100 shadow-sm cursor-pointer">
                AD
              </div>
            </div>
          </header>

          {/* Page content */}
          <div className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
