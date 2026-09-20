type AdminPageSkeletonProps = {
  variant: "dashboard" | "products" | "table" | "cards";
};

const pulse = "animate-pulse bg-gray-200 dark:bg-white/10";

export default function AdminPageSkeleton({ variant }: AdminPageSkeletonProps) {
  if (variant === "dashboard") {
    return (
      <div className="space-y-6" role="status" aria-label="Đang tải trang tổng quan">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white dark:bg-horizon-dark-card rounded-[20px] p-[18px] flex items-center gap-4 shadow-sm">
              <div className={`h-14 w-14 rounded-full shrink-0 ${pulse}`} />
              <div className="flex-1 space-y-3">
                <div className={`h-3 w-24 rounded ${pulse}`} />
                <div className={`h-7 w-32 rounded-lg ${pulse}`} />
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="bg-white dark:bg-horizon-dark-card rounded-[20px] p-6 shadow-sm h-[360px]">
              <div className="flex justify-between mb-10">
                <div className={`h-8 w-28 rounded-lg ${pulse}`} />
                <div className={`h-8 w-8 rounded-lg ${pulse}`} />
              </div>
              <div className={`h-9 w-48 rounded-lg mb-8 ${pulse}`} />
              <div className={`h-48 w-full rounded-2xl ${pulse}`} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "products") {
    return (
      <div className="space-y-5" role="status" aria-label="Đang tải trang sản phẩm">
        <div className={`h-[340px] w-full rounded-[20px] ${pulse}`} />
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className={`h-11 w-full sm:w-80 rounded-full ${pulse}`} />
          <div className={`h-11 w-full sm:w-96 rounded-full ${pulse}`} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index} className="bg-white dark:bg-horizon-dark-card rounded-[20px] p-4 h-[320px] shadow-sm space-y-4">
              <div className={`h-40 w-full rounded-2xl ${pulse}`} />
              <div className={`h-5 w-3/4 rounded ${pulse}`} />
              <div className={`h-4 w-1/2 rounded ${pulse}`} />
              <div className="flex gap-3 pt-3">
                <div className={`h-9 flex-1 rounded-xl ${pulse}`} />
                <div className={`h-9 flex-1 rounded-xl ${pulse}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "cards") {
    return (
      <div className="space-y-6" role="status" aria-label="Đang tải trang khuyến mãi">
        <div className="bg-white dark:bg-horizon-dark-card rounded-[20px] p-6 flex justify-between shadow-sm">
          <div className={`h-10 w-64 rounded-xl ${pulse}`} />
          <div className={`h-11 w-48 rounded-full ${pulse}`} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white dark:bg-horizon-dark-card rounded-[20px] p-6 h-64 shadow-sm space-y-4">
              <div className={`h-8 w-1/2 rounded-lg ${pulse}`} />
              <div className={`h-4 w-3/4 rounded ${pulse}`} />
              <div className={`h-4 w-2/3 rounded ${pulse}`} />
              <div className={`h-10 w-full rounded-xl mt-8 ${pulse}`} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-horizon-dark-card rounded-[20px] p-6 shadow-sm" role="status" aria-label="Đang tải dữ liệu">
      <div className="flex justify-between mb-8">
        <div className={`h-7 w-64 rounded-lg ${pulse}`} />
        <div className={`h-9 w-9 rounded-xl ${pulse}`} />
      </div>
      <div className={`h-10 w-full rounded-lg mb-3 ${pulse}`} />
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="grid grid-cols-5 gap-5 py-3">
            {Array.from({ length: 5 }).map((__, cellIndex) => (
              <div key={cellIndex} className={`h-5 rounded ${pulse}`} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
