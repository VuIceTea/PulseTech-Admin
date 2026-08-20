"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen bg-white dark:bg-[#0B1437]">
      {/* Left Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col px-8 md:px-16 lg:px-24 xl:px-32 relative">
        <Link href="/" className="absolute top-8 left-8 md:left-12 flex items-center gap-2 text-sm font-medium text-horizon-gray hover:text-horizon-dark dark:hover:text-white transition-colors">
          <ChevronLeft className="h-4 w-4" /> Quay lại Dashboard
        </Link>
        
        <div className="flex-1 flex flex-col justify-center max-w-[420px] w-full mx-auto">
          <h1 className="text-4xl font-bold text-horizon-dark dark:text-white mb-2">Đăng nhập</h1>
          <p className="text-horizon-gray dark:text-horizon-dark-gray text-sm mb-8">Nhập email và mật khẩu của bạn để đăng nhập!</p>
          
          <button className="flex items-center justify-center gap-3 w-full bg-[#F4F7FE] dark:bg-horizon-dark-card hover:bg-gray-100 dark:hover:bg-white/5 transition-colors py-3.5 rounded-2xl mb-6">
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span className="text-sm font-medium text-horizon-dark dark:text-white">Đăng nhập bằng Google</span>
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="h-px bg-gray-200 dark:bg-white/10 flex-1" />
            <span className="text-sm font-medium text-horizon-gray">hoặc</span>
            <div className="h-px bg-gray-200 dark:bg-white/10 flex-1" />
          </div>

          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-horizon-dark dark:text-white mb-2">Email*</label>
              <input 
                type="email" 
                placeholder="mail@pulsetech.com" 
                className="w-full bg-white dark:bg-[#0B1437] border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3.5 text-sm text-horizon-dark dark:text-white placeholder:text-horizon-gray outline-none focus:border-horizon-brand transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-horizon-dark dark:text-white mb-2">Mật khẩu*</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Tối thiểu 8 ký tự" 
                  className="w-full bg-white dark:bg-[#0B1437] border border-gray-200 dark:border-white/10 rounded-2xl pl-4 pr-12 py-3.5 text-sm text-horizon-dark dark:text-white placeholder:text-horizon-gray outline-none focus:border-horizon-brand transition-colors"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-horizon-gray hover:text-horizon-dark dark:hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-horizon-brand focus:ring-horizon-brand bg-white dark:bg-[#0B1437] dark:border-white/20" />
                <span className="text-sm font-medium text-horizon-dark dark:text-white">Duy trì đăng nhập</span>
              </label>
              <Link href="#" className="text-sm font-medium text-horizon-brand hover:underline">Quên mật khẩu?</Link>
            </div>

            <button type="submit" className="w-full bg-horizon-brand hover:bg-horizon-brand/90 text-white font-bold py-3.5 rounded-2xl transition-colors mt-2">
              Đăng nhập
            </button>
          </form>

          <p className="text-sm font-medium text-horizon-dark dark:text-white mt-6">
            Chưa có tài khoản? <Link href="#" className="text-horizon-brand hover:underline">Tạo tài khoản</Link>
          </p>
        </div>
      </div>

      {/* Right Gradient Banner */}
      <div className="hidden lg:flex w-1/2 p-4">
        <div className="w-full h-full bg-gradient-to-br from-[#868CFF] to-[#4318FF] rounded-[40px] rounded-bl-[120px] flex flex-col items-center justify-center relative overflow-hidden">
          {/* Logo */}
          <div className="w-48 h-48 bg-white rounded-full flex flex-col items-center justify-center mb-8 relative">
            <div className="w-32 h-32 bg-gradient-to-br from-[#868CFF] to-[#4318FF] rounded-full" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' }} />
            <div className="w-32 h-32 bg-white rounded-full absolute bottom-4" />
          </div>
          
          <h2 className="text-white text-5xl font-bold tracking-tight mb-12 flex items-center gap-2">
            PulseTech <span className="text-xl px-2 py-1 border-2 border-white rounded-xl">UI</span>
          </h2>
          
          <div className="absolute bottom-16 border border-white/20 bg-white/10 backdrop-blur-md rounded-2xl px-12 py-6 text-center">
            <p className="text-white/80 text-sm font-medium mb-1">Tìm hiểu thêm về PulseTech UI tại</p>
            <p className="text-white font-bold text-lg">pulsetech.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
