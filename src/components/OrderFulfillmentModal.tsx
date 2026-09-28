import React, { useState, useEffect } from "react";
import { X, CheckCircle2, Package, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

interface OrderFulfillmentModalProps {
  order: any;
  onClose: () => void;
  onSuccess: (orderId: string, assignedImeis: Record<string, string[]>) => void;
}

export default function OrderFulfillmentModal({ order, onClose, onSuccess }: OrderFulfillmentModalProps) {
  const [availableImeis, setAvailableImeis] = useState<Record<string, any[]>>({});
  const [selectedImeis, setSelectedImeis] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchImeis = async () => {
      setLoading(true);
      try {
        const imeiMap: Record<string, any[]> = {};
        for (const item of order.items || []) {
          const res = await fetch(`/backend-api/products/imeis?productId=${item.productId}`);
          if (res.ok) {
            const data = await res.json();
            imeiMap[item.productId] = data.filter((i: any) => i.status === "IN_STOCK" && i.storageVariant === item.storage);
          } else {
            imeiMap[item.productId] = [];
          }
        }
        setAvailableImeis(imeiMap);
        
        // Auto-select if exact match (e.g. qty=1 and only 1 IMEI available)
        const initialSelections: Record<string, string[]> = {};
        for (const item of order.items || []) {
          initialSelections[item.productId] = [];
        }
        setSelectedImeis(initialSelections);
      } catch (err) {
        console.error(err);
        toast.error("Lỗi khi tải danh sách IMEI khả dụng");
      } finally {
        setLoading(false);
      }
    };
    fetchImeis();
  }, [order.items]);

  const toggleImei = (productId: string, imeiNumber: string, maxQty: number) => {
    const current = selectedImeis[productId] || [];
    if (current.includes(imeiNumber)) {
      setSelectedImeis({ ...selectedImeis, [productId]: current.filter(i => i !== imeiNumber) });
    } else {
      if (current.length >= maxQty) {
        toast.error(`Chỉ được chọn tối đa ${maxQty} IMEI cho sản phẩm này`);
        return;
      }
      setSelectedImeis({ ...selectedImeis, [productId]: [...current, imeiNumber] });
    }
  };

  const isReadyToFulfill = (order.items || []).every((item: any) => {
    const selected = selectedImeis[item.productId] || [];
    return selected.length === item.qty;
  });

  const handleSubmit = async () => {
    if (!isReadyToFulfill) return;
    setSubmitting(true);
    try {
      // 1. Mark IMEIs as SOLD in product-service
      const allSelectedImeis = Object.values(selectedImeis).flat();
      if (allSelectedImeis.length > 0) {
        const sellRes = await fetch(`/backend-api/products/imeis/sell`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: order.id, imeis: allSelectedImeis })
        });
        if (!sellRes.ok) throw new Error("Không thể cập nhật trạng thái IMEI");
      }

      // 2. Assign IMEIs to Order in order-service
      const assignRes = await fetch(`/backend-api/orders/${order.id}/imeis`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedImeis)
      });
      if (!assignRes.ok) throw new Error("Không thể gán IMEI vào đơn hàng");

      // 3. Change order status to "Đang giao" (2)
      const statusRes = await fetch(`/backend-api/orders/${order.id}/status?status=2`, {
        method: "PATCH"
      });
      if (!statusRes.ok) throw new Error("Không thể cập nhật trạng thái đơn hàng");

      toast.success("Đã xuất kho và bắt đầu giao hàng!");
      onSuccess(order.id, selectedImeis);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Đã xảy ra lỗi khi xuất kho");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-horizon-dark-card w-full max-w-3xl rounded-[24px] shadow-2xl flex flex-col overflow-hidden max-h-[85vh]">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/10 bg-[#F4F7FE] dark:bg-horizon-dark-bg">
          <div>
            <h2 className="text-xl font-bold text-black dark:text-white flex items-center gap-2">
              <Package className="text-horizon-brand h-6 w-6" /> Xuất kho & Giao hàng
            </h2>
            <p className="text-sm text-horizon-gray mt-1">Đơn hàng #{order.id} - Chọn IMEI để xuất kho</p>
          </div>
          <button onClick={onClose} disabled={submitting} className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          {loading ? (
            <div className="text-center py-10 text-gray-500 font-medium">Đang tải dữ liệu kho...</div>
          ) : (
            (order.items || []).map((item: any, idx: number) => {
              const imeis = availableImeis[item.productId] || [];
              const selected = selectedImeis[item.productId] || [];
              const isFulfilled = selected.length === item.qty;

              return (
                <div key={idx} className="bg-gray-50 dark:bg-[#0B1437] p-5 rounded-2xl border border-gray-100 dark:border-white/10">
                  <div className="flex items-start gap-4 mb-4">
                    <img src={item.image || "/placeholder.png"} alt={item.productName} className="w-16 h-16 object-contain rounded-xl bg-white p-1" />
                    <div className="flex-1">
                      <h4 className="font-bold text-black dark:text-white text-base">{item.productName}</h4>
                      <p className="text-sm text-gray-500 mt-1">{item.storage} | {item.color}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-gray-500 uppercase">Cần xuất</div>
                      <div className="text-xl font-black text-horizon-brand mt-1">{item.qty}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-green-500" /> Chọn mã IMEI xuất kho ({selected.length}/{item.qty}):
                      </label>
                      {isFulfilled && <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-md">Đã đủ IMEI</span>}
                    </div>
                    
                    {imeis.length === 0 ? (
                      <div className="p-4 border border-red-200 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
                        Kho không còn mã IMEI nào cho biến thể này! Vui lòng nhập thêm hàng.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                        {imeis.map(i => {
                          const isSelected = selected.includes(i.imeiNumber);
                          return (
                            <button
                              key={i.id}
                              type="button"
                              onClick={() => toggleImei(item.productId, i.imeiNumber, item.qty)}
                              className={`flex items-center gap-2 p-2.5 rounded-xl border text-sm font-mono font-medium transition-all ${isSelected ? 'border-horizon-brand bg-horizon-brand/10 text-horizon-brand dark:bg-horizon-brand/20 dark:text-white shadow-sm' : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-white/20 hover:bg-white dark:hover:bg-white/5'}`}
                            >
                              <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${isSelected ? 'bg-horizon-brand text-white' : 'border-2 border-gray-300 dark:border-gray-600'}`}>
                                {isSelected && <CheckCircle2 className="w-3 h-3" />}
                              </div>
                              {i.imeiNumber}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="p-6 border-t border-gray-100 dark:border-white/10 bg-white dark:bg-horizon-dark-card flex justify-end gap-3">
          <button onClick={onClose} disabled={submitting} className="px-5 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-colors">
            Hủy bỏ
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isReadyToFulfill || submitting}
            className="px-6 py-2.5 bg-horizon-brand text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {submitting ? "Đang xử lý..." : "Xác nhận & Xuất kho"}
          </button>
        </div>
      </div>
    </div>
  );
}
