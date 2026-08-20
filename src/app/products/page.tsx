"use client";

import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  basePrice: number;
  stock: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/backend-api/products")
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setProducts(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error(err);
        toast.error("Lỗi khi tải dữ liệu sản phẩm");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col xl:flex-row gap-5 max-w-full">
      {/* Main Left Content */}
      <div className="flex-1 flex flex-col gap-5 min-w-0">
        
        {/* Banner */}
        <div className="w-full bg-gradient-to-br from-[#868CFF] to-[#4318FF] rounded-[20px] p-10 flex flex-col justify-center relative overflow-hidden min-h-[340px]">
          <div className="relative z-10 max-w-md">
            <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight mb-4">
              Khám phá và Kinh doanh Thiết bị đỉnh cao
            </h1>
            <p className="text-white/90 text-sm font-medium mb-8">
              Tham gia vào thế giới công nghệ. Bắt đầu tìm kiếm những sản phẩm mới nhất hoặc quản lý kho hàng của riêng bạn!
            </p>
            <div className="flex items-center gap-4">
              <button className="bg-white text-horizon-dark hover:bg-gray-50 transition-colors font-bold text-sm px-6 py-2.5 rounded-xl">
                Khám phá ngay
              </button>
              <button className="text-white hover:text-white/80 transition-colors font-bold text-sm">
                Xem Video
              </button>
            </div>
          </div>
          
          {/* Abstract 3D shape decorative element */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-64 md:w-96 md:h-96 opacity-50 md:opacity-100 pointer-events-none">
            <div className="w-full h-full bg-white/10 rounded-full blur-3xl absolute" />
            <div className="w-48 h-48 bg-gradient-to-tr from-white/20 to-transparent rounded-2xl absolute right-10 top-10 rotate-12 backdrop-blur-sm border border-white/20" />
            <div className="w-32 h-32 bg-gradient-to-bl from-white/20 to-transparent rounded-full absolute right-40 bottom-20 -rotate-12 backdrop-blur-sm border border-white/20" />
          </div>
        </div>

        {/* Trending Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-horizon-dark dark:text-white">Sản phẩm Nổi bật</h2>
            <div className="flex items-center gap-4 text-sm font-medium text-horizon-brand dark:text-white">
              <button className="text-horizon-brand font-bold">Tất cả</button>
              <button className="text-horizon-gray hover:text-horizon-dark dark:hover:text-white transition-colors">Thiết bị</button>
              <button className="text-horizon-gray hover:text-horizon-dark dark:hover:text-white transition-colors">Phụ kiện</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="bg-white dark:bg-horizon-dark-card rounded-[20px] p-4 shadow-[0_4px_12px_rgba(0,0,0,0.02)] h-[320px] animate-pulse">
                  <div className="w-full h-48 bg-gray-200 dark:bg-white/10 rounded-xl mb-4" />
                  <div className="w-2/3 h-5 bg-gray-200 dark:bg-white/10 rounded mb-2" />
                  <div className="w-1/3 h-4 bg-gray-200 dark:bg-white/10 rounded" />
                </div>
              ))
            ) : products.slice(0, 6).map((product, i) => (
              <div key={product.id} className="bg-white dark:bg-horizon-dark-card rounded-[20px] p-4 shadow-[0_4px_12px_rgba(0,0,0,0.02)] group hover:-translate-y-1 transition-transform">
                <div className="w-full h-48 rounded-xl bg-gradient-to-br from-[#868CFF]/20 to-[#4318FF]/20 dark:from-[#868CFF]/10 dark:to-[#4318FF]/10 mb-4 relative overflow-hidden flex items-center justify-center">
                  <div className="absolute top-3 right-3 bg-white dark:bg-horizon-dark-bg p-2 rounded-full shadow-sm text-horizon-gray hover:text-red-500 cursor-pointer transition-colors z-10">
                    <Heart className="h-4 w-4" />
                  </div>
                  {/* Mock Image Placeholder */}
                  <div className="w-32 h-32 bg-gradient-to-tr from-[#868CFF] to-[#4318FF] rounded-lg shadow-lg rotate-12 group-hover:scale-110 transition-transform duration-500" />
                </div>
                
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-horizon-dark dark:text-white mb-1 truncate max-w-[150px]">
                      {product.name}
                    </h3>
                    <p className="text-sm font-medium text-horizon-gray dark:text-horizon-dark-gray">
                      Bởi {product.brand}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="font-bold text-horizon-dark dark:text-white">
                    {product.basePrice.toLocaleString('vi-VN')} đ
                  </span>
                  <button className="bg-horizon-dark dark:bg-white text-white dark:text-horizon-dark text-xs font-bold px-4 py-2 rounded-full hover:bg-horizon-brand dark:hover:bg-gray-200 transition-colors">
                    Sửa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-full xl:w-[350px] flex flex-col gap-5 shrink-0">
        <div className="bg-white dark:bg-horizon-dark-card rounded-[20px] p-6 shadow-[0_4px_12px_rgba(0,0,0,0.02)] flex-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-horizon-dark dark:text-white">Kho hàng Top</h2>
            <button className="text-horizon-brand bg-[#F4F7FE] dark:bg-horizon-dark-bg px-4 py-1.5 rounded-full text-xs font-bold hover:bg-[#E9EDF7] transition-colors">
              Xem tất cả
            </button>
          </div>

          <div className="space-y-4">
            {products.slice(0, 5).map((p, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#868CFF] to-[#4318FF] shrink-0" />
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-horizon-dark dark:text-white truncate">{p.name}</h3>
                    <p className="text-xs font-medium text-horizon-gray dark:text-horizon-dark-gray truncate">{p.brand}</p>
                  </div>
                </div>
                <div className="text-sm font-bold text-horizon-dark dark:text-white shrink-0 ml-4">
                  {p.stock} <span className="text-horizon-gray text-xs">cái</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
