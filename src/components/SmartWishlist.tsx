import { motion } from "motion/react";
import { Heart, Bell, Trash2, ArrowRightLeft, Sparkles, TrendingDown, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { translations } from "../translations";
import { WishlistItem } from "../types";

interface SmartWishlistProps {
  items: WishlistItem[];
  onRemoveItem: (id: string) => void;
  onSelectItem: (product: any) => void;
  onToggleSetting: (id: string, setting: "alertOnPriceDrop" | "alertOnStock" | "alertOnCoupon") => void;
  onCompare: (product: any) => void;
  locale: "ar" | "en";
}

export default function SmartWishlist({
  items,
  onRemoveItem,
  onSelectItem,
  onToggleSetting,
  onCompare,
  locale,
}: SmartWishlistProps) {
  const t = translations[locale];
  const isRtl = locale === "ar";

  return (
    <div className="space-y-6 max-w-2xl mx-auto px-4 font-sans text-right">
      {/* Title block */}
      <div className="space-y-1">
        <h2 className="text-2xl font-black text-slate-900 flex items-center justify-end gap-2">
          <span>{t.smartWishlist}</span>
          <Heart className="w-6 h-6 text-red-500 fill-red-500" />
        </h2>
        <p className="text-xs text-slate-500">
          {isRtl
            ? "نراقب المنتجات من أجلك على مدار الساعة وننبهك بالخصومات والكوبونات فوراً"
            : "We monitor prices and deals for you 24/7 and ping you instantly"}
        </p>
      </div>

      {/* Empty State */}
      {items.length === 0 ? (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-10 rounded-3xl bg-white border border-slate-200/80 text-center space-y-4 shadow-sm"
        >
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto border border-slate-100">
            <Sparkles className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
            {t.wishlistEmpty}
          </p>
        </motion.div>
      ) : (
        /* List of items */
        <div className="space-y-4">
          {items.map((item) => {
            const priceDiff = item.initialPrice - item.currentPrice;
            const hasDropped = priceDiff > 0;

            return (
              <motion.div
                key={item.id}
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="rounded-3xl bg-white border border-slate-200/80 p-5 space-y-4 hover:border-blue-300 transition-all shadow-sm overflow-hidden relative"
              >
                {/* Visual badge for lowest price alert */}
                {hasDropped && (
                  <div className={`absolute top-0 ${isRtl ? "left-0 rounded-br-2xl" : "right-0 rounded-bl-2xl"} bg-emerald-50 border-b border-r border-emerald-100 px-3 py-1 text-[10px] font-bold text-emerald-700 flex items-center gap-1 shadow-xs`}>
                    <TrendingDown className="w-3.5 h-3.5 stroke-[3]" />
                    <span>{isRtl ? "انخفض السعر!" : "Price Dropped!"}</span>
                  </div>
                )}

                {/* Main Row */}
                <div className="flex gap-4 items-start justify-between">
                  {/* Remove Button & compare */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="p-2 hover:bg-slate-50 text-slate-400 hover:text-red-500 rounded-xl transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onCompare(item.product)}
                      className="p-2 hover:bg-slate-50 text-slate-400 hover:text-blue-600 rounded-xl transition-all cursor-pointer flex items-center gap-1 text-[10px] font-semibold"
                      title={t.compareBtn}
                    >
                      <ArrowRightLeft className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Product Details Header */}
                  <div className="flex-1 text-right">
                    <h4
                      onClick={() => onSelectItem(item.product)}
                      className="font-bold text-base text-slate-900 hover:text-blue-600 transition-colors cursor-pointer line-clamp-1"
                    >
                      {item.product.name}
                    </h4>

                    {/* Pricing */}
                    <div className="flex items-center justify-end gap-3 mt-1.5">
                      <span className="text-sm font-mono text-slate-400 line-through">
                        {item.initialPrice} {item.product.price.currency}
                      </span>
                      <span className="text-base font-black text-blue-600 font-mono">
                        {item.currentPrice} {item.product.price.currency}
                      </span>
                    </div>

                    {hasDropped && (
                      <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                        📉 {isRtl ? `وفرت ${priceDiff} ريال سعودي!` : `Saved ${priceDiff} SAR!`}
                      </p>
                    )}
                  </div>

                  {/* Thumbnail */}
                  {item.product.imageUrl && (
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-100 shrink-0"
                    />
                  )}
                </div>

                {/* Smart Monitoring Toggles / Switches */}
                <div className="pt-4 border-t border-slate-100 grid grid-cols-3 gap-2">
                  <button
                    onClick={() => onToggleSetting(item.id, "alertOnPriceDrop")}
                    className={`flex flex-col items-center p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      item.alertOnPriceDrop
                        ? "bg-blue-50 border-blue-200 text-blue-600"
                        : "bg-slate-50/50 border-slate-200 text-slate-400 hover:border-slate-300"
                    }`}
                  >
                    <TrendingDown className="w-4 h-4 mb-1" />
                    <span className="text-[9px] font-bold">{t.alertPriceDrop}</span>
                  </button>

                  <button
                    onClick={() => onToggleSetting(item.id, "alertOnStock")}
                    className={`flex flex-col items-center p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      item.alertOnStock
                        ? "bg-blue-50 border-blue-200 text-blue-600"
                        : "bg-slate-50/50 border-slate-200 text-slate-400 hover:border-slate-300"
                    }`}
                  >
                    <RefreshCw className="w-4 h-4 mb-1" />
                    <span className="text-[9px] font-bold">{t.alertStock}</span>
                  </button>

                  <button
                    onClick={() => onToggleSetting(item.id, "alertOnCoupon")}
                    className={`flex flex-col items-center p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      item.alertOnCoupon
                        ? "bg-blue-50 border-blue-200 text-blue-600"
                        : "bg-slate-50/50 border-slate-200 text-slate-400 hover:border-slate-300"
                    }`}
                  >
                    <Bell className="w-4 h-4 mb-1" />
                    <span className="text-[9px] font-bold">{t.alertCoupon}</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
