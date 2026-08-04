import { motion } from "motion/react";
import { Bell, Sparkles, Check, TrendingDown, Tag, Gift, ShoppingBag } from "lucide-react";
import { translations } from "../translations";
import { AppNotification } from "../types";

interface NotificationsViewProps {
  notifications: AppNotification[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
  locale: "ar" | "en";
}

export default function NotificationsView({
  notifications,
  onMarkAsRead,
  onClearAll,
  locale,
}: NotificationsViewProps) {
  const t = translations[locale];
  const isRtl = locale === "ar";

  const getIcon = (type: "drop" | "stock" | "coupon" | "release") => {
    switch (type) {
      case "drop":
        return (
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
            <TrendingDown className="w-5 h-5 text-emerald-600" />
          </div>
        );
      case "coupon":
        return (
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
            <Gift className="w-5 h-5 text-blue-600" />
          </div>
        );
      case "stock":
        return (
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-5 h-5 text-indigo-600" />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0">
            <Tag className="w-5 h-5 text-purple-600" />
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto px-4 font-sans text-right">
      {/* Title block */}
      <div className="flex justify-between items-center">
        {notifications.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            {isRtl ? "تحديد الكل كمقروء" : "Mark all as read"}
          </button>
        )}
        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <span>{t.notifications}</span>
          <Bell className="w-6 h-6 text-slate-500" />
        </h2>
      </div>

      {notifications.length === 0 ? (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-10 rounded-3xl bg-white border border-slate-200/80 text-center space-y-3 shadow-sm"
        >
          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto border border-slate-100">
            <Bell className="w-6 h-6 text-slate-400" />
          </div>
          <p className="text-sm text-slate-500">{t.notificationsEmpty}</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => onMarkAsRead(notif.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex gap-4 text-right items-start ${
                notif.read
                  ? "bg-white/50 border-slate-100 opacity-60 shadow-xs"
                  : "bg-white border-slate-200 hover:border-blue-300 shadow-sm"
              }`}
            >
              {/* Optional Read indicator dot */}
              {!notif.read && (
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0 self-center" />
              )}

              {/* Alert Meta Description */}
              <div className="flex-1 text-right">
                <span className="text-[9px] font-mono text-slate-400">{notif.date}</span>
                <h4 className="font-bold text-sm text-slate-900 mt-0.5">{notif.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">{notif.body}</p>
              </div>

              {/* Icon Type indicator */}
              {getIcon(notif.type)}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
