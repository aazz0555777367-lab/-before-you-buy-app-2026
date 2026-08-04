import { useState, FormEvent } from "react";
import { motion } from "motion/react";
import {
  Search,
  Sparkles,
  TrendingUp,
  Tag,
  ArrowLeft,
  ArrowRight,
  GraduationCap,
  Bell,
  Check,
} from "lucide-react";
import { translations } from "../translations";
import { mockProducts } from "../data/mockProducts";
import { ProductAnalysis, UserProfile, AiStatus } from "../types";

interface HomeViewProps {
  onSearch: (query: string) => void;
  onSelectItem: (product: ProductAnalysis) => void;
  locale: "ar" | "en";
  userProfile: UserProfile;
  aiStatus?: AiStatus | null;
}

export default function HomeView({
  onSearch,
  onSelectItem,
  locale,
  userProfile,
  aiStatus,
}: HomeViewProps) {
  const t = translations[locale];
  const isRtl = locale === "ar";

  const [query, setQuery] = useState("");

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  const trendings = Object.values(mockProducts);

  return (
    <div className="space-y-8 max-w-2xl mx-auto px-4 font-sans text-right pb-12 animate-fade-in">
      {/* Personalized Greeting */}
      <div className="flex justify-end items-start">
        <div className="space-y-1 text-right">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center justify-end gap-2">
            <span>{isRtl ? `مرحباً، ${userProfile.name} 👋` : `Hello, ${userProfile.name} 👋`}</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            {t.tagline}
          </p>
        </div>
      </div>

      {/* Main Search Bar Form */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full bg-white border border-slate-200/80 rounded-2xl py-4.5 pr-12 pl-16 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-right font-medium shadow-md"
        />
        <Search className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
        
        {/* Search Action Button inside search input */}
        <button
          type="submit"
          className="absolute left-3 top-1/2 -translate-y-1/2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-sm"
        >
          {t.searchBtn}
        </button>
      </form>

      {/* Trending / Recommended Products Carousel */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-slate-400 font-mono tracking-widest uppercase">
            {isRtl ? "اختر وجرب الآن" : "Tap to analyze"}
          </span>
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-1.5">
            <span>{t.trendingProducts}</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trendings.map((prod) => (
            <div
              key={prod.name}
              onClick={() => onSelectItem(prod)}
              className="p-4 rounded-3xl bg-white border border-slate-200/80 hover:border-blue-400 hover:shadow-md transition-all text-right flex gap-4 cursor-pointer relative overflow-hidden shadow-sm group"
            >
              {/* Score label badge */}
              <div className="absolute top-3 left-3 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-xl text-[10px] font-bold text-blue-600 font-mono">
                {prod.score} / 100
              </div>

              <div className="flex-1 text-right self-center">
                <h4 className="font-extrabold text-sm text-slate-800 group-hover:text-blue-600 transition-colors">
                  {prod.name.split("|")[0]}
                </h4>
                <p className="text-[10px] text-slate-500 line-clamp-1 mt-1">{prod.scoreReason}</p>
                <span className="font-mono text-xs font-black text-slate-600 mt-2 block">
                  {prod.price.current} {prod.price.currency}
                </span>
              </div>

              {prod.imageUrl && (
                <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-100 shrink-0">
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Active Deals / Promotions Banner */}
      <div className="rounded-3xl bg-blue-50/50 border border-blue-100/60 p-5 space-y-3">
        <h4 className="font-bold text-xs text-blue-700 flex items-center justify-end gap-1.5">
          <span>{isRtl ? "مراقبة التخفيضات النشطة" : "Active Smart Tracking"}</span>
          <Tag className="w-4 h-4" />
        </h4>
        <p className="text-xs text-slate-600 leading-relaxed">
          {isRtl
            ? "يقوم التطبيق حالياً بمراقبة عروض الجمعة البيضاء وتصفية عروض نون وأمازون بشكل مباشر للتأكد من حصولك على أفضل كوبون حقيقي غير مضلل."
            : "The app is actively filtering Amazon & Noon seasonal sales to verify real discounts versus misleading pre-inflated listings."}
        </p>
      </div>
    </div>
  );
}
