"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Store, 
  ChevronRight, 
  ShieldCheck, 
  Menu, 
  X, 
  ExternalLink,
  Activity
} from "lucide-react";
import "./globals.css";
import { Toaster } from "sonner";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      name: "Tổng quan (Dashboard)",
      href: "/",
      icon: LayoutDashboard,
      badge: "Live",
    },
    {
      name: "Quản lý Sản phẩm",
      href: "/products",
      icon: Package,
    },
    {
      name: "Quản lý Đơn hàng",
      href: "/orders",
      icon: ShoppingCart,
      badge: "Mới",
    },
    {
      name: "Khách hàng & Tài khoản",
      href: "/customers",
      icon: Users,
    },
  ];

  return (
    <html lang="vi" className="h-full w-full scroll-smooth">
      <head>
        <title>PulseTech Admin - Hệ thống Quản trị Cửa hàng</title>
        <meta name="description" content="Trung tâm điều hành cửa hàng PulseTech, kết nối trực tiếp API Gateway và Microservices." />
      </head>
      <body className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans antialiased selection:bg-rose-500 selection:text-white">
        <Toaster position="top-center" richColors />

        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center font-bold text-white shadow-lg shadow-rose-500/20">
              PT
            </div>
            <div>
              <span className="font-bold text-lg text-white">PulseTech</span>
              <span className="text-xs bg-rose-500/20 text-rose-400 font-semibold px-2 py-0.5 rounded-full ml-2">
                ADMIN
              </span>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 py-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? "bg-gradient-to-r from-rose-600 to-rose-500 text-white shadow-lg shadow-rose-600/30 font-semibold"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${active ? "text-white" : "text-slate-400"}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-md ${
                      active ? "bg-white/20 text-white" : "bg-rose-500/20 text-rose-400"
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
            <div className="pt-3 border-t border-slate-800 mt-2">
              <a
                href="https://pulse-tech-beryl.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-slate-800/60"
              >
                <div className="flex items-center gap-3">
                  <Store className="h-5 w-5 text-emerald-400" />
                  <span>Quay về Website Cửa hàng</span>
                </div>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        )}

        {/* Sidebar (Desktop) */}
        <aside className="hidden md:flex flex-col w-72 bg-slate-900/90 border-r border-slate-800/80 backdrop-blur-xl shrink-0">
          {/* Brand */}
          <div className="p-6 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-rose-500/30">
                P
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                    PulseTech
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    ADMIN
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium">Store Control Center</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Menu Quản Trị
            </div>
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? "bg-gradient-to-r from-rose-600 to-rose-500 text-white shadow-lg shadow-rose-600/30 font-semibold"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 transition-transform group-hover:scale-110 ${active ? "text-white" : "text-slate-400 group-hover:text-rose-400"}`} />
                    <span>{item.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        active ? "bg-white/20 text-white" : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className={`h-4 w-4 transition-transform ${active ? "opacity-100 translate-x-0.5" : "opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"}`} />
                  </div>
                </Link>
              );
            })}

            <div className="pt-6 mt-6 border-t border-slate-800/80">
              <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Liên kết nhanh
              </div>
              <a
                href="https://pulse-tech-beryl.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between px-3.5 py-3 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Store className="h-5 w-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span>Xem Website Cửa hàng</span>
                </div>
                <ExternalLink className="h-4 w-4 text-slate-500 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Footer info card */}
          <div className="p-4 m-4 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-400">Microservice Live</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              Hệ thống quản lý thời gian thực qua API Gateway và 4 Microservices.
            </p>
            <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-700/50 pt-2 font-mono">
              <span>STANDALONE PROJECT</span>
              <span className="text-rose-400 font-bold">D:\admin</span>
            </div>
          </div>
        </aside>

        {/* Main content area */}
        <main className="flex-1 flex flex-col min-w-0 bg-slate-950">
          {/* Top banner / bar */}
          <header className="hidden md:flex items-center justify-between px-8 py-4 border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700/50">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Chế độ Quản Trị Viên (Administrator)</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700/50">
                <Activity className="h-4 w-4 text-rose-400 animate-pulse" />
                <span>API Gateway: <code className="text-rose-300 font-mono">/backend-api</code></span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="https://pulse-tech-beryl.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3.5 py-2 rounded-xl transition-all border border-slate-700"
              >
                <Store className="h-3.5 w-3.5 text-emerald-400" />
                <span>Mở Store Front</span>
              </a>
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center font-bold text-xs text-white ring-2 ring-slate-800">
                AD
              </div>
            </div>
          </header>

          {/* Page body */}
          <div className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
