"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Geist } from "next/font/google";
import { ThemeProvider, useTheme } from "next-themes";
import { 
  Home, 
  Package, 
  ShoppingCart, 
  Users, 
  Search, 
  Bell, 
  Info, 
  Moon, 
  Sun,
  Menu,
  X,
  Settings,
  Mail,
  LogOut
} from "lucide-react";
import "./globals.css";
import { Toaster } from "sonner";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getPageTitle = () => {
    switch (pathname) {
      case "/": return "Tổng Quan";
      case "/products": return "Sản Phẩm";
      case "/orders": return "Đơn Hàng";
      case "/customers": return "Khách Hàng";
      default: return "Bảng Điều Khiển";
    }
  };

  return (
    <header className="px-4 py-6 md:px-8 md:py-8 mt-12 md:mt-0 sticky top-0 z-30 flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur-md bg-white/50 dark:bg-[#0B1437]/50">
      <div>
        <div className="text-sm font-medium text-horizon-gray dark:text-horizon-dark-gray mb-1 flex items-center gap-1.5">
          Trang <span className="opacity-50">/</span> <span className="text-horizon-dark dark:text-white">{getPageTitle()}</span>
        </div>
        <h1 className="text-[34px] font-bold text-horizon-dark dark:text-white leading-tight tracking-tight">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-4 bg-white dark:bg-horizon-dark-card rounded-full p-2.5 shadow-sm">
        <div className="relative bg-[#F4F7FE] dark:bg-[#0B1437] rounded-full px-4 py-2.5 flex items-center gap-2 w-full md:w-64">
          <Search className="h-4 w-4 text-horizon-dark dark:text-white" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="bg-transparent border-none outline-none text-sm text-horizon-dark dark:text-white placeholder:text-horizon-gray dark:placeholder:text-horizon-dark-gray w-full"
          />
        </div>
        <button className="text-horizon-gray dark:text-horizon-dark-gray hover:text-horizon-dark dark:hover:text-white transition-colors p-1">
          <Bell className="h-5 w-5" />
        </button>
        <button className="text-horizon-gray dark:text-horizon-dark-gray hover:text-horizon-dark dark:hover:text-white transition-colors p-1">
          <Info className="h-5 w-5" />
        </button>
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="text-horizon-gray dark:text-horizon-dark-gray hover:text-horizon-dark dark:hover:text-white transition-colors p-1"
        >
          {mounted && theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        
        <div className="relative ml-1">
          <div 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="h-10 w-10 shrink-0 rounded-full bg-horizon-brand flex items-center justify-center text-white font-bold shadow-md cursor-pointer overflow-hidden ring-2 ring-transparent hover:ring-horizon-brand/50 transition-all"
          >
            <img src="https://i.pravatar.cc/150?img=68" alt="User" className="w-full h-full object-cover" />
          </div>

          {/* Profile Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 top-12 mt-2 w-56 bg-white dark:bg-horizon-dark-card rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] dark:shadow-none dark:border dark:border-white/10 p-4 z-50">
              <div className="flex items-center gap-2 mb-4 border-b border-gray-100 dark:border-white/10 pb-4">
                <span className="text-xl">👋</span>
                <span className="font-bold text-horizon-dark dark:text-white text-sm">Xin chào, Quản trị viên</span>
              </div>
              <nav className="flex flex-col gap-1 text-sm font-medium text-horizon-dark dark:text-white">
                <Link href="#" className="flex items-center gap-2 px-2 py-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors">
                  <Settings className="h-4 w-4 text-horizon-gray" />
                  Cài đặt tài khoản
                </Link>
                <Link href="#" className="flex items-center gap-2 px-2 py-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors">
                  <Mail className="h-4 w-4 text-horizon-gray" />
                  Cài đặt thông báo
                </Link>
                <Link href="/login" className="flex items-center gap-2 px-2 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors mt-2">
                  <LogOut className="h-4 w-4" />
                  Đăng xuất
                </Link>
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If login page, don't render sidebar
  if (pathname === '/login') {
    return (
      <html lang="vi" suppressHydrationWarning className={`${geist.variable} h-full w-full scroll-smooth`}>
        <head>
          <title>PulseTech Admin — Horizon UI</title>
          <meta name="description" content="Horizon UI Admin Dashboard for PulseTech." />
          <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet" />
        </head>
        <body className="min-h-screen bg-horizon-bg dark:bg-[#0B1437] text-horizon-dark dark:text-white font-sans antialiased">
          <ThemeProvider attribute="class" defaultTheme="light">
            <Toaster position="top-right" richColors />
            {children}
          </ThemeProvider>
        </body>
      </html>
    );
  }

  const navigationItems = [
    { name: "Tổng Quan", href: "/", icon: Home },
    { name: "Sản Phẩm", href: "/products", icon: Package },
    { name: "Đơn Hàng", href: "/orders", icon: ShoppingCart },
    { name: "Khách Hàng", href: "/customers", icon: Users },
  ];

  return (
    <html lang="vi" suppressHydrationWarning className={`${geist.variable} h-full w-full scroll-smooth`}>
      <head>
        <title>PulseTech Admin — Horizon UI</title>
        <meta name="description" content="Horizon UI Admin Dashboard for PulseTech." />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-horizon-bg dark:bg-horizon-dark-bg text-horizon-dark dark:text-white flex font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="light">
          <Toaster position="top-right" richColors />

          {/* Mobile Header */}
          <div className="md:hidden fixed top-0 w-full flex items-center justify-between px-4 py-4 bg-white dark:bg-[#0B1437] z-40">
            <div className="font-bold text-horizon-dark dark:text-white tracking-tight uppercase">
              PULSETECH <span className="font-normal text-horizon-gray dark:text-horizon-dark-gray">ADMIN</span>
            </div>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-horizon-dark dark:text-white">
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>

          {/* Sidebar */}
          <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-[#0B1437] transform transition-transform duration-300 md:relative md:translate-x-0 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
            {/* Logo */}
            <div className="flex items-center justify-center h-24 border-b border-gray-100/50 dark:border-white/5">
              <h1 className="text-[26px] font-bold text-horizon-dark dark:text-white tracking-tighter uppercase">
                PulseTech <span className="font-normal text-horizon-gray dark:text-horizon-dark-gray">ADMIN</span>
              </h1>
            </div>

            {/* Links */}
            <nav className="flex-1 px-6 py-8 space-y-2">
              {navigationItems.map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      active ? "text-horizon-brand dark:text-white font-bold" : "text-horizon-gray dark:text-horizon-dark-gray font-medium hover:text-horizon-dark dark:hover:text-white"
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${active ? "text-horizon-brand dark:text-white" : "text-horizon-gray dark:text-horizon-dark-gray"}`} />
                    <span className="text-[15px]">{item.name}</span>
                    {active && (
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-horizon-brand rounded-l-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Upgrade Card */}
            <div className="absolute bottom-8 left-6 right-6 hidden md:block">
              <div className="relative rounded-3xl bg-gradient-to-br from-[#868CFF] to-[#4318FF] p-6 text-center shadow-lg shadow-horizon-brand/30 overflow-hidden">
                <div className="absolute -top-6 -left-6 w-16 h-16 bg-white/10 rounded-full blur-xl" />
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl" />
                
                <div className="mx-auto w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4 ring-4 ring-white/10 backdrop-blur-sm">
                  <span className="text-white font-bold text-xl">P</span>
                </div>
                <h3 className="text-white font-bold text-lg mb-1">Cần hỗ trợ?</h3>
                <p className="text-white/80 text-xs mb-4">
                  Tham khảo tài liệu hoặc liên hệ hỗ trợ PulseTech
                </p>
                <button className="w-full bg-white/20 hover:bg-white/30 transition-colors text-white text-sm font-bold py-2.5 rounded-xl backdrop-blur-sm">
                  TÀI LIỆU
                </button>
              </div>
            </div>
          </aside>

          {mobileMenuOpen && (
            <div className="fixed inset-0 bg-horizon-dark/20 dark:bg-black/40 backdrop-blur-sm z-40 md:hidden" onClick={() => setMobileMenuOpen(false)} />
          )}

          {/* Main Content */}
          <main className="flex-1 flex flex-col min-w-0 md:h-screen md:overflow-y-auto">
            <Header />

            {/* Page Content */}
            <div className="px-4 md:px-8 pb-8 flex-1 mt-4 md:mt-0">
              {children}
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
