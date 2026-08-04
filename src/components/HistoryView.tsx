import { motion } from "motion/react";
import { History, Search, Camera, RefreshCw, Trash2, ChevronLeft, ChevronRight, Barcode } from "lucide-react";
import { translations } from "../translations";
import { SearchHistoryItem } from "../types";

interface HistoryViewProps {
  items: SearchHistoryItem[];
  onClear: () => void;
  onSelectItem: (product: any) => void;
  locale: "ar" | "en";
}

export default function HistoryView({ items, onClear, onSelectItem, locale }: HistoryViewProps) {
  const t = translations[locale];
  const isRtl = locale === "ar";

  const getIcon = (type: "text" | "barcode" | "camera") => {
    switch (type) {
      case "barcode":
        return <Barcode className="w-4 h-4 text-blue-600" />;
      case "camera":
        return <Camera className="w-4 h-4 text-emerald-600" />;
      default:
        return <Search className="w-4 h-4 text-indigo-600" />;
    }
  };

  const getTypeName = (type: "text" | "barcode" | "camera") => {
    if (locale === "ar") {
      switch (type) {
        case "barcode":
          return "مسح باركود";
        case "camera":
          return "مسح صورة";
        default:
          return "بحث نصي";
      }
    } else {
      switch (type) {
        case "barcode":
          return "Barcode Scan";
        case "camera":
          return "Photo Scan";
        default:
          return "Text Search";
      }
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto px-4 font-sans text-right">
      {/* Header bar */}
      <div className="flex justify-between items-center">
        {items.length > 0 && (
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-100 bg-red-50 hover:bg-red-100/50 text-red-600 text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t.clearHistory}</span>
          </button>
        )}
        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <span>{t.history}</span>
          <History className="w-6 h-6 text-slate-500" />
        </h2>
      </div>

      {items.length === 0 ? (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-10 rounded-3xl bg-white border border-slate-200/80 text-center space-y-3 shadow-sm"
        >
          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto border border-slate-100">
            <History className="w-6 h-6 text-slate-400" />
          </div>
          <p className="text-sm text-slate-500">{t.historyEmpty}</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => item.product && onSelectItem(item.product)}
              className="group p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-blue-600 transition-colors">
                {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </div>

              <div className="flex-1 px-4 text-right">
                <div className="flex items-center justify-end gap-2 text-[10px] text-slate-400 font-mono">
                  <span>{item.date}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <span>{getTypeName(item.type)}</span>
                    {getIcon(item.type)}
                  </div>
                </div>

                <h4 className="font-bold text-sm text-slate-800 group-hover:text-blue-600 transition-colors mt-1">
                  {item.product ? item.product.name : item.query}
                </h4>

                {item.product && (
                  <div className="flex items-center justify-end gap-2 mt-1">
                    <span className="text-xs font-bold text-blue-600 font-mono">
                      {item.product.price.current} {item.product.price.currency}
                    </span>
                    <span className="text-[10px] bg-slate-50 border border-slate-100 px-2 py-0.5 rounded text-slate-500 font-mono">
                      {item.product.score}/100
                    </span>
                  </div>
                )}
              </div>

              {item.product?.imageUrl ? (
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-xl object-cover border border-slate-100 shrink-0"
                />
              ) : (
                <div className="w-12 h-12 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center shrink-0">
                  {getIcon(item.type)}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
