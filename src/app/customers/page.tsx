"use client";

import React, { useEffect, useState } from "react";
import { 
  Users, 
  Search, 
  Trash2, 
  Mail, 
  ShieldCheck, 
  UserCheck, 
  RefreshCw, 
  UserPlus
} from "lucide-react";
import { toast } from "sonner";

interface AppUser {
  id: string;
  name: string;
  email: string;
}

export default function AdminCustomersPage() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/backend-api/auth/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      } else {
        toast.error("Không thể tải danh sách tài khoản");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi kết nối tới Auth Service");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa tài khoản "${name}" khỏi hệ thống không?`)) return;
    try {
      const res = await fetch(`/backend-api/auth/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Đã xóa tài khoản thành công");
        setUsers((prev) => prev.filter((u) => u.id !== id));
      } else {
        toast.error("Lỗi không thể xóa tài khoản này");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi kết nối tới máy chủ");
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.id?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Quản lý Khách hàng & Tài khoản</span>
            <span className="text-xs bg-red-50 text-red-600 font-bold px-2.5 py-1 rounded-full border border-red-200">
              {users.length} thành viên
            </span>
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Danh sách người dùng đã đăng ký thành viên trên Website PulseTech, kiểm soát quyền truy cập.
          </p>
        </div>
        <button
          onClick={fetchUsers}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all border border-slate-200 shadow-xs w-fit"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-red-600" : ""}`} />
          <span>Làm mới danh sách</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên, địa chỉ email, hoặc ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
          />
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-slate-600">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Tài khoản khách hàng được xác thực qua JWT</span>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl bg-white border border-slate-200/80 overflow-hidden shadow-xs">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-red-600 border-t-transparent mb-3" />
            <p className="text-sm font-semibold text-slate-700">Đang tải danh sách tài khoản từ máy chủ...</p>
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-6">Khách hàng & Tên hiển thị</th>
                  <th className="py-3.5 px-4">Địa chỉ Email</th>
                  <th className="py-3.5 px-4">Vai trò</th>
                  <th className="py-3.5 px-4">Trạng thái tài khoản</th>
                  <th className="py-3.5 px-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3.5">
                        <div className="h-10 w-10 rounded-xl bg-red-600 flex items-center justify-center font-bold text-white shadow-xs">
                          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                            {user.name || "Khách hàng PulseTech"}
                          </div>
                          <div className="text-xs text-slate-400 font-mono">
                            ID: #{user.id?.slice(0, 10)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-700">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-slate-400" />
                        <span>{user.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        Thành viên
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <UserCheck className="h-3.5 w-3.5" />
                        <span>Đang hoạt động</span>
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDeleteUser(user.id, user.name)}
                        className="p-2 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 transition-colors"
                        title="Xóa tài khoản"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Users className="h-12 w-12 text-slate-300 mb-3" />
            <p className="text-base font-bold text-slate-900">Chưa có tài khoản nào được đăng ký</p>
            <p className="text-xs text-slate-500 mt-1">
              Người dùng mới đăng ký qua Website sẽ hiển thị tự động tại đây.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
