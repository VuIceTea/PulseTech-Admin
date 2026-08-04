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
  Lock, 
  AlertCircle 
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
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Quản lý Khách hàng & Tài khoản</span>
            <span className="text-xs bg-purple-500/20 text-purple-400 font-semibold px-2.5 py-1 rounded-full border border-purple-500/30">
              {users.length} thành viên
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Danh sách người dùng đã đăng ký thành viên trên PulseTech, quản lý từ chối/xóa quyền truy cập.
          </p>
        </div>
        <button
          onClick={fetchUsers}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition-all border border-slate-700 w-fit"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-rose-400" : ""}`} />
          <span>Làm mới danh sách</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Tìm theo tên, địa chỉ email, hoặc ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
          />
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Mã hóa BCrypt • JWT Verification Live</span>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 overflow-hidden shadow-xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-rose-500 border-t-transparent mb-3" />
            <p className="text-sm font-semibold text-slate-300">Đang tải danh sách tài khoản từ Auth Service...</p>
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/60 border-b border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-6">Tài khoản & Tên</th>
                  <th className="py-3.5 px-4">Địa chỉ Email</th>
                  <th className="py-3.5 px-4">Vai trò</th>
                  <th className="py-3.5 px-4">Trạng thái bảo mật</th>
                  <th className="py-3.5 px-6 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-sm">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3.5">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-purple-600 to-rose-500 flex items-center justify-center font-bold text-white shadow-md">
                          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div>
                          <div className="font-bold text-white group-hover:text-purple-400 transition-colors">
                            {user.name || "Khách hàng PulseTech"}
                          </div>
                          <div className="text-xs text-slate-500 font-mono">
                            ID: #{user.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-300">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-slate-500" />
                        <span>{user.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
                        Thành viên
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        <UserCheck className="h-3.5 w-3.5" />
                        <span>Đang hoạt động</span>
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDeleteUser(user.id, user.name)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
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
            <Users className="h-12 w-12 text-slate-600 mb-3" />
            <p className="text-base font-bold text-white">Chưa có tài khoản nào được đăng ký</p>
            <p className="text-xs text-slate-400 mt-1">
              Người dùng mới đăng ký qua /auth/register sẽ hiển thị trực tiếp tại đây.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
