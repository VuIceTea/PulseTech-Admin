"use client";

import React, { useEffect, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  roles?: string[];
}

export default function CustomersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/backend-api/auth/users")
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setUsers(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error(err);
        toast.error("Lỗi khi tải dữ liệu khách hàng");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full">
      <div className="bg-white dark:bg-horizon-dark-card rounded-[20px] p-6 shadow-[0_4px_12px_rgba(0,0,0,0.02)] w-full">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-horizon-dark dark:text-white">Danh sách Khách hàng (Check Table)</h2>
          <button className="h-9 w-9 rounded-xl bg-[#F4F7FE] dark:bg-horizon-dark-bg flex items-center justify-center text-horizon-brand hover:bg-[#E9EDF7] transition-colors">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/10">
                <th className="py-4 px-2 w-10"></th>
                <th className="py-4 px-2 text-xs font-bold text-horizon-gray dark:text-horizon-dark-gray uppercase tracking-wider">Tên Khách Hàng</th>
                <th className="py-4 px-2 text-xs font-bold text-horizon-gray dark:text-horizon-dark-gray uppercase tracking-wider">Email</th>
                <th className="py-4 px-2 text-xs font-bold text-horizon-gray dark:text-horizon-dark-gray uppercase tracking-wider">Phân Quyền</th>
                <th className="py-4 px-2 text-xs font-bold text-horizon-gray dark:text-horizon-dark-gray uppercase tracking-wider">Ngày Tham Gia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-horizon-gray dark:text-horizon-dark-gray">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : users.map((user, idx) => (
                <tr key={user.id || idx} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                  <td className="py-4 px-2">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-gray-300 text-horizon-brand focus:ring-horizon-brand bg-white dark:bg-[#0B1437] dark:border-white/20 cursor-pointer"
                      defaultChecked={idx % 3 === 0}
                    />
                  </td>
                  <td className="py-4 px-2">
                    <span className="text-sm font-bold text-horizon-dark dark:text-white">{user.name || "Chưa cập nhật"}</span>
                  </td>
                  <td className="py-4 px-2 text-sm font-bold text-horizon-dark dark:text-white">
                    {user.email}
                  </td>
                  <td className="py-4 px-2">
                    <span className="text-sm font-bold text-horizon-dark dark:text-white">
                      {user.roles ? user.roles.join(", ") : "User"}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-sm font-bold text-horizon-dark dark:text-white">
                    24.Oct.2023 {/* Hardcoded for UI visual purposes since API doesn't return createdAt for user */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
