import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, ShieldCheck, Tag } from "lucide-react";
import { toast } from "sonner";
import Select from "react-select";

interface ImeiManagerModalProps {
  product: any;
  onClose: () => void;
}

export default function ImeiManagerModal({ product, onClose }: ImeiManagerModalProps) {
  const [imeis, setImeis] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<string>(product.storages[0]?.name || "");
  const [newImei, setNewImei] = useState("");

  const loadImeis = () => {
    setLoading(true);
    fetch(`/backend-api/products/imeis?productId=${product.id}`)
      .then(async res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const text = await res.text();
        return text ? JSON.parse(text) : [];
      })
      .then(data => setImeis(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error("Lỗi fetch IMEIs:", err);
        toast.error("Không thể tải danh sách IMEI");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadImeis();
  }, [product.id]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImei.trim()) return;
    if (!selectedVariant) {
      toast.error("Vui lòng chọn biến thể!");
      return;
    }
    
    try {
      const res = await fetch(`/backend-api/products/imeis`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imeiNumber: newImei.trim(),
          productId: product.id,
          productName: product.name,
          storageVariant: selectedVariant,
        })
      });
      if (!res.ok) {
        const errText = await res.text();
        toast.error(errText || "Lỗi khi thêm IMEI");
        return;
      }
      toast.success("Đã thêm IMEI thành công");
      setNewImei("");
      loadImeis();
    } catch (error) {
      toast.error("Lỗi mạng khi thêm IMEI");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xóa IMEI này?")) return;
    try {
      const res = await fetch(`/backend-api/products/imeis/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Đã xóa IMEI");
      loadImeis();
    } catch (error) {
      toast.error("Lỗi khi xóa IMEI");
    }
  };

  const variantOptions = product.storages.map((s: any) => ({
    value: s.name,
    label: s.name
  }));

  const filteredImeis = imeis.filter(i => i.storageVariant === selectedVariant);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-horizon-dark-card w-full max-w-2xl rounded-[24px] shadow-2xl flex flex-col overflow-hidden max-h-[85vh]">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/10">
          <div>
            <h2 className="text-xl font-bold text-black dark:text-white flex items-center gap-2">
              <ShieldCheck className="text-horizon-brand h-6 w-6" /> Quản lý IMEI / Serial
            </h2>
            <p className="text-sm text-horizon-gray mt-1">Sản phẩm: {product.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors cursor-pointer">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="mb-6 bg-gray-50 dark:bg-[#0B1437] p-4 rounded-xl border border-gray-100 dark:border-white/10">
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2 dark:text-white"><Tag className="h-4 w-4" /> Thêm IMEI mới</h3>
            <form onSubmit={handleAdd} className="flex gap-3">
              <div className="w-[180px]">
                <Select
                  options={variantOptions}
                  value={variantOptions.find((o: any) => o.value === selectedVariant)}
                  onChange={(option: any) => setSelectedVariant(option ? option.value : "")}
                  placeholder="Chọn biến thể"
                  className="text-sm text-black"
                />
              </div>
              <input
                type="text"
                placeholder="Nhập mã IMEI hoặc Serial..."
                value={newImei}
                onChange={e => setNewImei(e.target.value)}
                className="flex-1 border border-gray-200 dark:border-white/10 rounded-xl px-4 text-sm dark:bg-[#0B1437] dark:text-white outline-none focus:border-horizon-brand"
              />
              <button type="button" onClick={() => {
                let imei = "";
                for (let i = 0; i < 15; i++) imei += Math.floor(Math.random() * 10);
                setNewImei(imei);
              }} className="px-3 text-xs bg-gray-200 dark:bg-white/10 dark:text-white rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-white/20 transition-colors shrink-0 whitespace-nowrap">
                Tạo ngẫu nhiên
              </button>
              <button type="submit" disabled={!newImei.trim()} className="bg-horizon-brand text-white px-5 rounded-xl font-bold text-sm hover:opacity-90 disabled:opacity-50 flex items-center gap-2 shrink-0">
                <Plus className="h-4 w-4" /> Thêm
              </button>
            </form>
          </div>

          <h3 className="text-sm font-bold mb-3 dark:text-white">Danh sách IMEI (Biến thể {selectedVariant})</h3>
          
          {loading ? (
            <div className="text-center py-8 text-gray-500 text-sm">Đang tải dữ liệu...</div>
          ) : filteredImeis.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 dark:bg-white/5 rounded-xl border border-dashed border-gray-200 dark:border-white/10 text-gray-500 text-sm">
              Chưa có mã IMEI nào cho biến thể này
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredImeis.map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl shadow-sm">
                  <div>
                    <div className="font-mono font-bold text-sm dark:text-white">{item.imeiNumber}</div>
                    <div className="text-[10px] font-bold mt-1 uppercase text-gray-500 flex items-center gap-1">
                      <span className={`w-2 h-2 rounded-full ${item.status === 'IN_STOCK' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                      {item.status === 'IN_STOCK' ? 'TỒN KHO' : item.status}
                    </div>
                  </div>
                  <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
