"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Ban, Eye, Lock, MoreHorizontal, Unlock, X } from "lucide-react";
import Select from "react-select";
import { toast } from "sonner";
import AdminPageSkeleton from "../AdminPageSkeleton";
import { adminFetch, readApiError } from "../../lib/adminAuth";

interface User {
  id: string;
  name: string;
  email: string;
  roles?: string[];
  rewardPoints?: number;
  verified?: boolean;
  locked?: boolean;
  createdAt?: string;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  totalPrice: number;
  status: number;
  createdAt: string;
  items?: Array<{ productName: string; qty: number; color?: string; storage?: string; price: number; image?: string }>;
}

export default function CustomersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    Promise.all([
      adminFetch("/backend-api/auth/admin/users").then(res => res.ok ? res.json() : []),
      fetch("/backend-api/orders/all").then(res => res.ok ? res.json() : []),
    ])
      .then(([userData, orderData]) => {
        setUsers(Array.isArray(userData) ? userData : []);
        setOrders(Array.isArray(orderData) ? orderData : []);
      })
      .catch(err => {
        console.error(err);
        toast.error("Lỗi khi tải dữ liệu khách hàng");
      })
      .finally(() => setLoading(false));
  }, []);

  const selectedOrders = useMemo(() => {
    if (!selectedUser?.email) return [];
    const email = selectedUser.email.trim().toLowerCase();
    return orders.filter(order => order.customerEmail?.trim().toLowerCase() === email);
  }, [orders, selectedUser]);

  const statusText = (status: number) => {
    switch (status) {
      case 0: return "Chờ xác nhận";
      case 1: return "Đã xác nhận";
      case 2: return "Đang giao";
      case 3: return "Đã giao";
      case 4: return "Đã hủy";
      default: return "Không xác định";
    }
  };

  const formatDate = (value?: string) => {
    if (!value) return "Chưa có dữ liệu";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  };

  const updateUserInState = (updated: User) => {
    setUsers(current => current.map(user => user.id === updated.id ? updated : user));
    setSelectedUser(current => current?.id === updated.id ? updated : current);
  };

  const handleAccountLockClick = async (user: User) => {
    try {
      const response = await adminFetch(`/backend-api/auth/admin/users/${encodeURIComponent(user.id)}/locked`, {
        method: "PATCH", body: JSON.stringify({ locked: !user.locked }),
      });
      if (!response.ok) throw new Error(await readApiError(response));
      updateUserInState(await response.json());
      toast.success(user.locked ? "Đã mở khóa tài khoản" : "Đã khóa tài khoản");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Không thể cập nhật tài khoản"); }
  };

  const handleRoleChange = async (user: User, role: string) => {
    try {
      const response = await adminFetch(`/backend-api/auth/admin/users/${encodeURIComponent(user.id)}/roles`, {
        method: "PATCH", body: JSON.stringify({ roles: [role] }),
      });
      if (!response.ok) throw new Error(await readApiError(response));
      updateUserInState(await response.json());
      toast.success("Đã cập nhật quyền tài khoản");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Không thể cập nhật phân quyền"); }
  };

  if (loading) return <AdminPageSkeleton variant="table" />;

  return (
    <div className="w-full">
      <div className="bg-white dark:bg-horizon-dark-card rounded-[20px] p-6 shadow-[0_4px_12px_rgba(0,0,0,0.02)] w-full">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-horizon-dark dark:text-white">Danh sách Khách hàng</h2>
          <button className="h-9 w-9 rounded-xl bg-[#F4F7FE] dark:bg-horizon-dark-bg flex items-center justify-center text-horizon-brand hover:bg-[#E9EDF7] transition-colors">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/10">
                <th className="py-4 px-2 text-xs font-bold text-horizon-gray dark:text-horizon-dark-gray uppercase tracking-wider">Tên Khách Hàng</th>
                <th className="py-4 px-2 text-xs font-bold text-horizon-gray dark:text-horizon-dark-gray uppercase tracking-wider">Email</th>
                <th className="py-4 px-2 text-xs font-bold text-horizon-gray dark:text-horizon-dark-gray uppercase tracking-wider">Phân Quyền</th>
                <th className="py-4 px-2 text-xs font-bold text-horizon-gray dark:text-horizon-dark-gray uppercase tracking-wider">Ngày Tham Gia</th>
                <th className="py-4 px-2 text-xs font-bold text-horizon-gray dark:text-horizon-dark-gray uppercase tracking-wider">Trạng thái</th>
                <th className="py-4 px-2 text-xs font-bold text-horizon-gray dark:text-horizon-dark-gray uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {users.map((user, idx) => (
                <tr key={user.id || idx} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                  <td className="py-4 px-2">
                    <span className="text-sm font-bold text-horizon-dark dark:text-white">{user.name || "Chưa cập nhật"}</span>
                  </td>
                  <td className="py-4 px-2 text-sm font-bold text-horizon-dark dark:text-white">{user.email}</td>
                  <td className="py-4 px-2">
                    <span className="text-sm font-bold text-horizon-dark dark:text-white">{user.roles?.join(", ") || "USER"}</span>
                  </td>
                  <td className="py-4 px-2 text-sm font-bold text-horizon-dark dark:text-white">{formatDate(user.createdAt)}</td>
                  <td className="py-4 px-2">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${user.locked ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
                      {user.locked ? "Đã khóa" : "Đang hoạt động"}
                    </span>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setSelectedUser(user)} className="rounded-xl bg-[#F4F7FE] p-2 text-horizon-brand hover:bg-[#E9EDF7]" title="Xem chi tiết">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleAccountLockClick(user)} className="rounded-xl bg-[#F4F7FE] p-2 text-horizon-gray hover:bg-[#E9EDF7]" title={user.locked ? "Mở khóa" : "Khóa tài khoản"}>
                        {user.locked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[24px] bg-white p-6 shadow-2xl dark:bg-horizon-dark-card">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-horizon-dark dark:text-white">Chi tiết khách hàng</h3>
                <p className="mt-1 text-sm font-medium text-horizon-gray">{selectedUser.email}</p>
              </div>
              <button onClick={() => setSelectedUser(null)} className="rounded-full bg-[#F4F7FE] p-2 text-horizon-gray hover:bg-[#E9EDF7]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-[#F8FAFF] p-4 dark:bg-horizon-dark-bg">
                <p className="text-xs font-bold uppercase text-horizon-gray">Họ tên</p>
                <p className="mt-2 font-bold text-horizon-dark dark:text-white">{selectedUser.name || "Chưa cập nhật"}</p>
              </div>
              <div className="rounded-2xl bg-[#F8FAFF] p-4 dark:bg-horizon-dark-bg">
                <p className="text-xs font-bold uppercase text-horizon-gray">Ngày tham gia</p>
                <p className="mt-2 font-bold text-horizon-dark dark:text-white">{formatDate(selectedUser.createdAt)}</p>
              </div>
              <div className="rounded-2xl bg-[#F8FAFF] p-4 dark:bg-horizon-dark-bg">
                <p className="text-xs font-bold uppercase text-horizon-gray">Điểm thưởng</p>
                <p className="mt-2 font-bold text-red-500 font-bold">{(selectedUser.rewardPoints ?? 0).toLocaleString("vi-VN")}</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl bg-[#F8FAFF] p-4 dark:bg-horizon-dark-bg">
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${selectedUser.locked ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
                {selectedUser.locked ? "Đã khóa" : "Đang hoạt động"}
              </span>
              <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
                {selectedUser.verified ? "Đã xác thực email" : "Chưa xác thực email"}
              </span>
              <label className="flex items-center gap-2 text-sm font-bold text-horizon-dark dark:text-white">
                Phân quyền
                <div className="w-[180px]">
                  <Select
                    options={[
                      { value: "USER", label: "Khách hàng" },
                      { value: "STAFF", label: "Nhân viên" },
                      { value: "ADMIN", label: "Quản trị viên" }
                    ]}
                    value={
                      selectedUser.roles?.includes("ADMIN") ? { value: "ADMIN", label: "Quản trị viên" } :
                      selectedUser.roles?.includes("STAFF") ? { value: "STAFF", label: "Nhân viên" } :
                      { value: "USER", label: "Khách hàng" }
                    }
                    onChange={(option: any) => handleRoleChange(selectedUser, option ? option.value : "USER")}
                    placeholder="Chọn quyền"
                    isSearchable={false}
                    styles={{
                      control: (base: any, state: any) => ({
                        ...base,
                        border: state.isFocused ? '1px solid rgba(67, 24, 255, 0.5)' : '1px solid #e5e7eb',
                        boxShadow: 'none',
                        borderRadius: '0.75rem',
                        padding: '0.15rem 0.25rem',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        backgroundColor: 'white',
                      }),
                      option: (base: any, state: any) => ({
                        ...base,
                        backgroundColor: state.isSelected ? '#4318FF' : state.isFocused ? '#eef2ff' : 'white',
                        color: state.isSelected ? 'white' : state.isFocused ? '#4318FF' : '#1f2937',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        borderRadius: '0.5rem',
                        margin: '0.2rem 0.4rem',
                        width: 'auto',
                      }),
                      menu: (base: any) => ({
                        ...base,
                        borderRadius: '0.75rem',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        border: '1px solid #f3f4f6',
                        zIndex: 50
                      })
                    }}
                  />
                </div>
              </label>
              <button onClick={() => handleAccountLockClick(selectedUser)} className="ml-auto inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-100">
                <Ban className="h-4 w-4" />
                {selectedUser.locked ? "Mở khóa tài khoản" : "Khóa tài khoản"}
              </button>
            </div>

            <div className="mt-6">
              <h4 className="mb-3 text-sm font-bold uppercase text-horizon-gray">Đơn hàng của khách</h4>
              <div className="space-y-3">
                {selectedOrders.length > 0 ? selectedOrders.map(order => (
                  <div key={order.id} className="rounded-2xl border border-gray-100 p-4 dark:border-white/10">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-bold text-horizon-dark dark:text-white">#{order.id}</p>
                        <p className="text-sm text-horizon-gray">{formatDate(order.createdAt)} • {statusText(order.status)}</p>
                      </div>
                      <p className="font-bold text-red-500 font-bold">{order.totalPrice?.toLocaleString("vi-VN")} đ</p>
                    </div>
                    <div className="mt-3 space-y-2">
                      {(order.items || []).map((item, index) => (
                        <div key={index} className="flex items-center justify-between rounded-xl bg-[#F8FAFF] px-3 py-2 text-sm dark:bg-horizon-dark-bg">
                          <span className="font-semibold text-horizon-dark dark:text-white">
                            {item.productName} {[item.color, item.storage].filter(Boolean).join(" | ")}
                          </span>
                          <span className="font-bold text-horizon-gray">x{item.qty}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )) : (
                  <div className="rounded-2xl bg-[#F8FAFF] p-6 text-center text-sm font-semibold text-horizon-gray">
                    Khách hàng này chưa có đơn hàng.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
