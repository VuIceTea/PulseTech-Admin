"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Geist } from "next/font/google";
import { 
  Home, 
  Package, 
  ShoppingCart, 
  Users, 
  Search, 
  Bell, 
  Info, 
  Moon, 
  Menu,
  X
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
    { name: "Main Dashboard", href: "/", icon: Home },
    { name: "Products", href: "/products", icon: Package },
    { name: "Orders", href: "/orders", icon: ShoppingCart },
    { name: "Customers", href: "/customers", icon: Users },
  ];

  const getPageTitle = () => {
    switch (pathname) {
      case "/": return "Main Dashboard";
      case "/products": return "Products";
      case "/orders": return "Orders";
      case "/customers": return "Customers";
      default: return "Main Dashboard";
    }
  };

  return (
    <html lang="en" className={`${geist.variable} h-full w-full scroll-smooth`}>
      <head>
        <title>PulseTech Admin — Horizon UI</title>
        <meta name="description" content="Horizon UI Admin Dashboard for PulseTech." />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-horizon-bg text-horizon-dark flex font-sans antialiased">
        <Toaster position="top-right" richColors />

        {/* Mobile Header (Hidden on Desktop) */}
        <div className="md:hidden fixed top-0 w-full flex items-center justify-between px-4 py-4 bg-horizon-bg z-40">
          <div className="font-bold text-horizon-dark tracking-tight">PULSETECH <span className="font-normal">ADMIN</span></div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-horizon-dark">
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white transform transition-transform duration-300 md:relative md:translate-x-0 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
          {/* Logo */}
          <div className="flex items-center justify-center h-24 border-b border-gray-100/50">
            <h1 className="text-2xl font-bold text-horizon-dark tracking-tighter uppercase">
              PulseTech <span className="font-normal text-horizon-gray">ADMIN</span>
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
                    active ? "text-horizon-brand font-bold" : "text-horizon-gray font-medium hover:text-horizon-dark"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${active ? "text-horizon-brand" : "text-horizon-gray"}`} />
                  <span className="text-[15px]">{item.name}</span>
                  {active && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-horizon-brand rounded-l-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Upgrade Card (Bottom) */}
          <div className="absolute bottom-8 left-6 right-6">
            <div className="relative rounded-3xl bg-gradient-to-br from-[#868CFF] to-[#4318FF] p-6 text-center shadow-lg shadow-horizon-brand/30 overflow-hidden">
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-white/10 rounded-full blur-xl" />
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl" />
              
              <div className="mx-auto w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4 ring-4 ring-white/10 backdrop-blur-sm">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Need help?</h3>
              <p className="text-white/80 text-xs mb-4">
                Please check our docs or contact PulseTech support for assistance.
              </p>
              <button className="w-full bg-white/20 hover:bg-white/30 transition-colors text-white text-sm font-bold py-2.5 rounded-xl backdrop-blur-sm">
                DOCUMENTATION
              </button>
            </div>
          </div>
        </aside>

        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-horizon-dark/20 backdrop-blur-sm z-40 md:hidden" onClick={() => setMobileMenuOpen(false)} />
        )}

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 md:h-screen md:overflow-y-auto">
          {/* Header */}
          <header className="px-4 py-6 md:px-8 md:py-8 mt-12 md:mt-0 sticky top-0 z-30 flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur-md bg-horizon-bg/80">
            <div>
              <div className="text-sm font-medium text-horizon-gray mb-1 flex items-center gap-1.5">
                Pages <span className="text-horizon-gray/50">/</span> <span className="text-horizon-dark">{getPageTitle()}</span>
              </div>
              <h1 className="text-[34px] font-bold text-horizon-dark leading-tight tracking-tight">
                {getPageTitle()}
              </h1>
            </div>

            <div className="flex items-center gap-4 bg-white rounded-full p-2.5 shadow-sm">
              <div className="relative bg-horizon-bg rounded-full px-4 py-2.5 flex items-center gap-2 w-full md:w-64">
                <Search className="h-4 w-4 text-horizon-dark" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent border-none outline-none text-sm text-horizon-dark placeholder:text-horizon-gray w-full"
                />
              </div>
              <button className="text-horizon-gray hover:text-horizon-dark transition-colors p-1">
                <Bell className="h-5 w-5" />
              </button>
              <button className="text-horizon-gray hover:text-horizon-dark transition-colors p-1">
                <Info className="h-5 w-5" />
              </button>
              <button className="text-horizon-gray hover:text-horizon-dark transition-colors p-1">
                <Moon className="h-5 w-5" />
              </button>
              <div className="h-10 w-10 shrink-0 rounded-full bg-horizon-brand flex items-center justify-center text-white font-bold shadow-md cursor-pointer ml-1 overflow-hidden">
                <img src="https://i.pravatar.cc/150?img=68" alt="User" className="w-full h-full object-cover" />
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="px-4 md:px-8 pb-8 flex-1">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
