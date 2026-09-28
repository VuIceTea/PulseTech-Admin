"use client";

import React, { useEffect, useState } from "react";
import { MoreHorizontal, CheckCircle2, XCircle, Clock, ChevronDown, X, Filter } from "lucide-react";
import { toast } from "sonner";
import AdminPageSkeleton from "../AdminPageSkeleton";
import OrderFulfillmentModal from "../../components/OrderFulfillmentModal";

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address?: string;
  paymentMethod?: string;
  totalPrice: number;
  status: number;
  createdAt: string;
  items?: Array<{
    productId: string;
    productName: string;
    price: number;
    qty: number;
    image?: string;
    color?: string;
    storage?: string;
    imeis?: string[];
  }>;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [fulfillingOrder, setFulfillingOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<number | null>(null);
  const [openFilter, setOpenFilter] = useState(false);

  const loadOrders = () => {
    setLoading(true);
    fetch("/backend-api/orders/all")
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setOrders(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error(err);
        toast.error("Lỗi khi tải dữ liệu đơn hàng");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: number) => {
    const order = orders.find(item => item.id === orderId);
    if (order && !canChangeStatus(order.status, newStatus)) {
      toast.error("Trạng thái này không hợp lệ với tiến trình hiện tại của đơn hàng");
      return;
    }

    if (newStatus === 2 && (order?.items || []).length > 0) {
      setFulfillingOrder(order);
      setOpenDropdownId(null);
      return;
    }

    setUpdatingId(orderId);
    setOpenDropdownId(null);
    try {
      const res = await fetch(`/backend-api/orders/${orderId}/status?status=${newStatus}`, {
        method: "PATCH"
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to update status");
      }

      toast.success("Cập nhật trạng thái thành công!");
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Lỗi khi cập nhật trạng thái");
    } finally {
      setUpdatingId(null);
    }
  };

  const statusMap = [
    { value: 0, text: "Chờ xác nhận", icon: <Clock className="h-4 w-4 text-amber-500" />, progress: 20, color: "bg-amber-500" },
    { value: 1, text: "Đã xác nhận", icon: <CheckCircle2 className="h-4 w-4 text-blue-500" />, progress: 50, color: "bg-blue-500" },
    { value: 2, text: "Đang giao", icon: <Clock className="h-4 w-4 text-purple-500" />, progress: 80, color: "bg-purple-500" },
    { value: 3, text: "Đã giao", icon: <CheckCircle2 className="h-4 w-4 text-[#05CD99]" />, progress: 100, color: "bg-[#05CD99]" },
    { value: 4, text: "Đã hủy", icon: <XCircle className="h-4 w-4 text-red-500" />, progress: 100, color: "bg-red-500" },
  ];

  const getStatusDisplay = (status: number) => {
    return statusMap.find(s => s.value === status) || statusMap[4];
  }

  const canChangeStatus = (currentStatus: number, nextStatus: number) => {
    if (currentStatus === nextStatus) return false;
    if (currentStatus === 3 || currentStatus === 4) return false;
    if (nextStatus === 4) return currentStatus <= 1;
    return nextStatus === currentStatus + 1;
  };

  const formatDate = (dateValue: any) => {
    if (!dateValue) return "N/A";

    if (typeof dateValue === 'string' && dateValue.includes('/')) {
      return dateValue;
    }

    if (Array.isArray(dateValue)) {
      const [year, month, day, hour = 0, min = 0, sec = 0] = dateValue;
      return new Date(year, month - 1, day, hour, min, sec).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    }
    const date = new Date(dateValue);
    return isNaN(date.getTime()) ? dateValue : date.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  }

  if (loading) return <AdminPageSkeleton variant="table" />;

  const filteredOrders = orders.filter(o => 
    (filterStatus === null || o.status === filterStatus) &&
    (
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (o.customerName || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
      (o.customerPhone || "").includes(searchTerm)
    )
  );

  return (
    <div className="w-full">
      <div className="bg-white dark:bg-horizon-dark-card rounded-[20px] p-6 shadow-[0_4px_12px_rgba(0,0,0,0.02)] w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h2 className="text-xl font-bold text-horizon-dark dark:text-white shrink-0">Quản lý Đơn hàng</h2>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <input 
              type="text" 
              placeholder="Tìm mã đơn, tên, SĐT..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-gray-50 dark:bg-[#0B1437] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-horizon-brand w-full md:w-64 text-black dark:text-white"
            />
            
            <div className="relative">
              <button 
                onClick={() => setOpenFilter(!openFilter)}
                className={`h-9 px-3 rounded-xl flex items-center justify-center gap-2 transition-colors shrink-0 ${filterStatus !== null ? 'bg-horizon-brand text-white' : 'bg-[#F4F7FE] dark:bg-horizon-dark-bg text-horizon-brand hover:bg-[#E9EDF7]'}`}
              >
                <Filter className="h-4 w-4" />
                <span className="text-sm font-bold hidden sm:inline">Lọc</span>
              </button>
              
              {openFilter && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setOpenFilter(false)} />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-horizon-dark-card border border-gray-100 dark:border-white/10 rounded-xl shadow-lg z-20 py-2">
                    <button
                      onClick={() => { setFilterStatus(null); setOpenFilter(false); }}
                      className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors ${filterStatus === null ? 'bg-[#F4F7FE] dark:bg-horizon-dark-bg text-horizon-brand' : 'text-horizon-dark dark:text-white hover:bg-gray-50 dark:hover:bg-white/5'}`}
                    >
                      Tất cả trạng thái
                    </button>
                    {statusMap.map(s => (
                      <button
                        key={s.value}
                        onClick={() => { setFilterStatus(s.value); setOpenFilter(false); }}
                        className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors ${filterStatus === s.value ? 'bg-[#F4F7FE] dark:bg-horizon-dark-bg text-horizon-brand' : 'text-horizon-dark dark:text-white hover:bg-gray-50 dark:hover:bg-white/5'}`}
                      >
                        {s.text}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <button className="h-9 w-9 rounded-xl bg-[#F4F7FE] dark:bg-horizon-dark-bg flex items-center justify-center text-horizon-brand hover:bg-[#E9EDF7] transition-colors shrink-0">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/10">
                <th className="py-4 px-2 text-xs font-bold text-horizon-gray dark:text-horizon-dark-gray uppercase tracking-wider">Mã Đơn Hàng</th>
                <th className="py-4 px-2 text-xs font-bold text-horizon-gray dark:text-horizon-dark-gray uppercase tracking-wider">Trạng Thái</th>
                <th className="py-4 px-2 text-xs font-bold text-horizon-gray dark:text-horizon-dark-gray uppercase tracking-wider">Tổng tiền</th>
                <th className="py-4 px-2 text-xs font-bold text-horizon-gray dark:text-horizon-dark-gray uppercase tracking-wider">Ngày Đặt</th>
                <th className="py-4 px-2 text-xs font-bold text-horizon-gray dark:text-horizon-dark-gray uppercase tracking-wider">Tiến Độ</th>
                <th className="py-4 px-2 text-xs font-bold text-horizon-gray dark:text-horizon-dark-gray uppercase tracking-wider">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-horizon-gray dark:text-horizon-dark-gray">
                    Không tìm thấy đơn hàng nào phù hợp.
                  </td>
                </tr>
              ) : filteredOrders.map((order) => {
                const statusInfo = getStatusDisplay(order.status);
                const isDropdownOpen = openDropdownId === order.id;

                return (
                  <tr key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="py-4 px-2">
                      <div className="font-bold text-sm text-horizon-dark dark:text-white">#{order.id}</div>
                      <div className="text-xs font-medium text-horizon-gray dark:text-horizon-dark-gray mt-0.5">{order.customerName}</div>
                    </td>

                    <td className="py-4 px-2 relative">
                      <button
                        onClick={() => setOpenDropdownId(isDropdownOpen ? null : order.id)}
                        disabled={updatingId === order.id}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-gray-200 dark:hover:border-white/10 ${updatingId === order.id ? 'opacity-50' : ''}`}
                      >
                        {statusInfo.icon}
                        <span className="text-sm font-bold text-horizon-dark dark:text-white">
                          {updatingId === order.id ? 'Đang cập nhật...' : statusInfo.text}
                        </span>
                        <ChevronDown className="h-3 w-3 text-horizon-gray" />
                      </button>

                      {isDropdownOpen && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setOpenDropdownId(null)} />
                          <div className="absolute top-full left-2 mt-1 w-48 bg-white dark:bg-horizon-dark-card border border-gray-100 dark:border-white/10 rounded-xl shadow-lg z-20 py-2">
                            {statusMap.map(s => {
                              const disabled = !canChangeStatus(order.status, s.value);
                              return (
                              <button
                                key={s.value}
                                onClick={() => handleUpdateStatus(order.id, s.value)}
                                disabled={disabled}
                                className={`w-full text-left flex items-center gap-2 px-4 py-2 transition-colors ${order.status === s.value ? 'bg-[#F4F7FE] dark:bg-horizon-dark-bg' : ''} ${disabled ? 'cursor-not-allowed opacity-40' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}
                              >
                                {s.icon}
                                <span className="text-sm font-medium text-horizon-dark dark:text-white">{s.text}</span>
                              </button>
                            )})}
                          </div>
                        </>
                      )}
                    </td>

                    <td className="py-4 px-2 text-sm font-bold text-red-500 dark:text-red-400">
                      {order.totalPrice?.toLocaleString('vi-VN')} đ
                    </td>

                    <td className="py-4 px-2 text-sm font-bold text-horizon-dark dark:text-white">
                      {formatDate(order.createdAt)}
                    </td>

                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-horizon-dark dark:text-white min-w-[32px]">
                          {statusInfo.progress}%
                        </span>
                        <div className="w-24 h-2 bg-[#F4F7FE] dark:bg-horizon-dark-bg rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${statusInfo.color}`}
                            style={{ width: `${statusInfo.progress}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="rounded-xl bg-[#F4F7FE] px-4 py-2 text-sm font-bold text-horizon-brand transition-colors hover:bg-[#E9EDF7] dark:bg-horizon-dark-bg dark:hover:bg-white/10"
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[24px] bg-white p-6 shadow-2xl dark:bg-horizon-dark-card">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-horizon-dark dark:text-white">Chi tiết đơn hàng #{selectedOrder.id}</h3>
                <p className="mt-1 text-sm font-medium text-horizon-gray">Đặt ngày: {formatDate(selectedOrder.createdAt)}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="rounded-full bg-[#F4F7FE] p-2 text-horizon-gray hover:bg-[#E9EDF7]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-[#F8FAFF] p-4 dark:bg-horizon-dark-bg">
                <h4 className="mb-3 text-sm font-bold uppercase text-horizon-gray">Thông tin khách hàng</h4>
                <div className="space-y-2 text-sm font-semibold text-horizon-dark dark:text-white">
                  <p>Người nhận: {selectedOrder.customerName || "Chưa cập nhật"}</p>
                  <p>Email: {selectedOrder.customerEmail || "Chưa cập nhật"}</p>
                  <p>Số điện thoại: {selectedOrder.customerPhone || "Chưa cập nhật"}</p>
                  <p>Địa chỉ: {selectedOrder.address || "Chưa cập nhật"}</p>
                </div>
              </div>
              <div className="rounded-2xl bg-[#F8FAFF] p-4 dark:bg-horizon-dark-bg">
                <h4 className="mb-3 text-sm font-bold uppercase text-horizon-gray">Thanh toán & trạng thái</h4>
                <div className="space-y-2 text-sm font-semibold text-horizon-dark dark:text-white">
                  <p>Thanh toán: {selectedOrder.paymentMethod || "Chưa cập nhật"}</p>
                  <p>Trạng thái: {getStatusDisplay(selectedOrder.status).text}</p>
                  <p>Tổng tiền: <span className="text-red-500 font-bold">{selectedOrder.totalPrice?.toLocaleString('vi-VN')} đ</span></p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="mb-3 text-sm font-bold uppercase text-horizon-gray">Sản phẩm đã đặt</h4>
              <div className="space-y-3">
                {(selectedOrder.items || []).length > 0 ? selectedOrder.items!.map((item, index) => (
                  <div key={`${item.productId}-${index}`} className="flex flex-col gap-2 rounded-2xl border border-gray-100 p-4 dark:border-white/10">
                    <div className="flex items-center gap-4">
                      <img src={item.image || "/placeholder.png"} alt={item.productName} className="h-16 w-16 rounded-xl object-contain bg-[#F8FAFF]" />
                      <div className="flex-1">
                        <p className="font-bold text-horizon-dark dark:text-white">{item.productName}</p>
                        <p className="mt-1 text-sm text-horizon-gray">{[item.color, item.storage].filter(Boolean).join(" | ") || "Không có biến thể"}</p>
                        <p className="mt-1 text-sm font-semibold text-horizon-dark dark:text-white">x{item.qty}</p>
                      </div>
                      <div className="text-right font-bold text-red-500">{item.price?.toLocaleString('vi-VN')} đ</div>
                    </div>
                    {item.imeis && item.imeis.length > 0 && (
                      <div className="mt-2 bg-gray-50 dark:bg-black/20 p-3 rounded-xl">
                        <p className="text-xs font-bold text-gray-500 mb-2">MÃ IMEI / SERIAL XUẤT KHO:</p>
                        <div className="flex flex-wrap gap-2">
                          {item.imeis.map(imei => (
                            <span key={imei} className="px-2.5 py-1 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-xs font-mono font-medium dark:text-white">
                              {imei}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )) : (
                  <div className="rounded-2xl bg-[#F8FAFF] p-6 text-center text-sm font-semibold text-horizon-gray">
                    Đơn hàng này chưa có dữ liệu sản phẩm chi tiết.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {fulfillingOrder && (
        <OrderFulfillmentModal
          order={fulfillingOrder}
          onClose={() => setFulfillingOrder(null)}
          onSuccess={() => {
            setFulfillingOrder(null);
            loadOrders();
          }}
        />
      )}
    </div>
  );
}
