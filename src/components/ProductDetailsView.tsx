import { useState } from "react";
import { motion } from "motion/react";
import {
  Heart,
  TrendingDown,
  ArrowRightLeft,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Award,
  AlertTriangle,
  ExternalLink,
  ShieldAlert,
  ThumbsUp,
  ThumbsDown,
  BookOpen,
  DollarSign,
  Calendar,
  X,
  MessageSquare,
  Send,
  Loader2,
} from "lucide-react";
import { translations } from "../translations";
import { ProductAnalysis, WishlistItem, UserProfile } from "../types";

const resolveStoreUrl = (storeName: string, originalUrl: string, productName: string) => {
  const cleanName = productName.split("|")[0].trim(); // Get the Arabic/main name
  const nameToSearch = encodeURIComponent(cleanName);
  
  const normalizedStore = storeName.toLowerCase();
  
  if (normalizedStore.includes("أمازون") || normalizedStore.includes("amazon")) {
    return `https://www.amazon.sa/s?k=${nameToSearch}`;
  }
  if (normalizedStore.includes("نون") || normalizedStore.includes("noon")) {
    return `https://www.noon.com/saudi-ar/search/?q=${nameToSearch}`;
  }
  if (normalizedStore.includes("جرير") || normalizedStore.includes("jarir")) {
    return `https://www.jarir.com/catalogsearch/result/?q=${nameToSearch}`;
  }
  if (normalizedStore.includes("اكسترا") || normalizedStore.includes("extra")) {
    return `https://www.extra.com/ar-sa/search?text=${nameToSearch}`;
  }
  
  // Fallback: If it's a generic link, turn it into a direct Google search link or return original
  if (originalUrl === "https://amazon.sa" || originalUrl === "https://jarir.com" || originalUrl === "https://noon.com" || originalUrl === "https://extra.com" || originalUrl === "https://dyson.sa") {
    return `https://www.google.com/search?q=${encodeURIComponent(storeName + " " + cleanName)}`;
  }

  return originalUrl;
};

interface ProductDetailsViewProps {
  product: ProductAnalysis;
  onClose: () => void;
  onAddToWishlist: (product: ProductAnalysis) => void;
  wishlistItems: WishlistItem[];
  onRemoveFromWishlist: (id: string) => void;
  onOpenCompare: (product: ProductAnalysis) => void;
  onSelectItem: (product: ProductAnalysis) => void;
  locale: "ar" | "en";
  userProfile: UserProfile;
}

export default function ProductDetailsView({
  product,
  onClose,
  onAddToWishlist,
  wishlistItems,
  onRemoveFromWishlist,
  onOpenCompare,
  onSelectItem,
  locale,
  userProfile,
}: ProductDetailsViewProps) {
  const t = translations[locale];
  const isRtl = locale === "ar";

  const isFavorited = wishlistItems.some((item) => item.product.name === product.name);
  const favoriteItem = wishlistItems.find((item) => item.product.name === product.name);

  const handleFavoriteToggle = () => {
    if (isFavorited && favoriteItem) {
      onRemoveFromWishlist(favoriteItem.id);
    } else {
      onAddToWishlist(product);
    }
  };



  // Extract the highest, lowest and current prices for percentage calculation in history graph
  const maxPrice = Math.max(...product.priceHistory.map((h) => h.price), product.price.high);
  const minPrice = Math.min(...product.priceHistory.map((h) => h.price), product.price.low);
  const priceRange = maxPrice - minPrice || 1;

  return (
    <div className="space-y-6 font-sans text-right animate-fade-in px-4 pb-12">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Actions Card */}
      <div className="bg-white border border-slate-100/85 rounded-2xl p-4 flex justify-between items-center shadow-xs">
        <button
          onClick={onClose}
          className="px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-950 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-extrabold shadow-2xs border border-slate-200/50"
        >
          {isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          <span>{t.backBtn}</span>
        </button>

        <div className="flex gap-2">
          {/* Comparison */}
          <button
            onClick={() => onOpenCompare(product)}
            className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-500 hover:text-slate-800 cursor-pointer"
            title={t.compareBtn}
          >
            <ArrowRightLeft className="w-5 h-5" />
          </button>

          {/* Wishlist toggle */}
          <button
            onClick={handleFavoriteToggle}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              isFavorited
                ? "bg-red-50 text-red-600 hover:bg-red-100"
                : "bg-white border border-slate-200 text-slate-500 hover:text-slate-800"
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorited ? "fill-red-500" : ""}`} />
          </button>
        </div>
      </div>

      {/* Main product details workspace */}
      <div className="space-y-6">
        
        {/* If product analysis was fallback mock info */}
        {product._isSimulated && (
          <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4 text-xs font-semibold text-blue-600 leading-relaxed text-center shadow-xs">
            {t.simulatedSuccess}
          </div>
        )}

        {/* Newer Version Alert */}
        {product.hasNewerVersion && product.newerVersionName && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-3xl bg-blue-50 border border-blue-100 p-5 flex flex-col md:flex-row gap-4 items-center justify-between text-right shadow-sm"
          >
            <div className="flex-1 space-y-1">
              <h4 className="font-extrabold text-sm text-blue-600 flex items-center justify-end gap-1.5">
                <span>{t.newerVersionAlert}</span>
                <AlertTriangle className="w-4 h-4 shrink-0" />
              </h4>
              <p className="text-xs text-slate-600">
                {isRtl
                  ? `أطلق الصانع إصداراً أحدث وهو (${product.newerVersionName}). من المفضل التأكد من سعره ومواصفاته أولاً قبل اتخاذ قرار نهائي.`
                  : `A newer generation (${product.newerVersionName}) has been launched. Compare its features & price points before proceeding.`}
              </p>
            </div>
          </motion.div>
        )}

        {/* Top Product Showcase Card */}
        <div className="rounded-3xl bg-white border border-slate-200/80 p-6 md:p-8 flex flex-col md:flex-row-reverse gap-6 items-center shadow-sm">
          {/* Image */}
          {product.imageUrl && (
            <div className="w-32 h-32 md:w-44 md:h-44 rounded-3xl overflow-hidden border border-slate-100 shrink-0 shadow-xs">
              <img
                src={product.imageUrl}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Core Info & Score */}
          <div className="flex-1 space-y-4 w-full">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-400 tracking-widest uppercase block">
                {isRtl ? "مستند التحليل الذكي" : "Smart Report Document"}
              </span>
              <h3 className="text-xl md:text-2xl font-black text-slate-900">{product.name}</h3>
            </div>

            {/* Score Ring / Block */}
            <div className="flex items-center justify-end gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-150">
              <div className="text-right flex-1">
                <span className="text-xs font-bold text-slate-500 block">{t.scoreLabel}</span>
                <span className="text-[11px] text-slate-600 block leading-tight mt-0.5">{product.scoreReason}</span>
              </div>
              
              <div className="w-16 h-16 rounded-full border-4 border-blue-600/10 flex items-center justify-center relative">
                <div className="absolute inset-1 rounded-full border-2 border-blue-600 flex items-center justify-center bg-blue-600/10">
                  <span className="font-mono font-black text-lg text-blue-600">{product.score}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* HEL ASHTARI AL-AN Section (Decision block) */}
        <div className="rounded-3xl bg-white border border-slate-200/80 p-6 md:p-8 space-y-4 shadow-sm">
          <h4 className="font-bold text-sm text-slate-700 border-b border-slate-100 pb-2 flex items-center justify-end gap-1.5">
            <span>{isRtl ? "توصية مستشار الشراء: هل أشتري الآن؟" : "Shopping Recommendation: Buy Now?"}</span>
            <Sparkles className="w-4 h-4 text-blue-600" />
          </h4>

          <div className="flex flex-col md:flex-row-reverse gap-6 items-center">
            {/* Recommendation badge */}
            <div className="shrink-0 w-full md:w-auto">
              <div
                className={`py-4 px-8 rounded-2xl text-center font-black text-lg shadow-xs border ${
                  product.priceAdvice === "buy_now"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : product.priceAdvice === "wait"
                    ? "bg-amber-50 text-amber-750 border-amber-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }`}
              >
                {product.priceAdvice === "buy_now"
                  ? t.buyNow
                  : product.priceAdvice === "wait"
                  ? t.waitDrop
                  : t.dontBuy}
              </div>
            </div>

            {/* Recommendation reasoning */}
            <div className="flex-1 text-right">
              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                {product.priceAdviceReason}
              </p>
            </div>
          </div>
        </div>

        {/* Price indexes comparisons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200/80 p-4 rounded-2xl text-center shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">{t.currentPrice}</span>
            <span className="text-lg font-black text-blue-600 mt-1 block font-mono">
              {product.price.current} {product.price.currency}
            </span>
          </div>

          <div className="bg-white border border-slate-200/80 p-4 rounded-2xl text-center shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">{t.avgPrice}</span>
            <span className="text-lg font-bold text-slate-700 mt-1 block font-mono">
              {product.price.average} {product.price.currency}
            </span>
          </div>

          <div className="bg-white border border-slate-200/80 p-4 rounded-2xl text-center shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">{t.highestPrice}</span>
            <span className="text-lg font-semibold text-red-650 mt-1 block font-mono">
              {product.price.high} {product.price.currency}
            </span>
          </div>

          <div className="bg-white border border-slate-200/80 p-4 rounded-2xl text-center shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">{t.lowestPrice}</span>
            <span className="text-lg font-semibold text-emerald-600 mt-1 block font-mono">
              {product.price.low} {product.price.currency}
            </span>
          </div>
        </div>

        {/* Personalized Analysis block */}
        <div className="rounded-3xl bg-white border border-slate-200/80 p-6 space-y-3 relative overflow-hidden shadow-sm">
          {/* Subtle user badge in corner */}
          <div className="absolute top-4 left-4 bg-blue-50 text-blue-600 text-[10px] font-black px-2.5 py-1 rounded-full border border-blue-100 flex items-center gap-1 font-sans">
            <span>{userProfile.usage === "gaming" ? "لاعب" : userProfile.usage === "photography" ? "تصوير" : userProfile.usage === "work" ? "عمل" : "عام"}</span>
            {userProfile.isStudent && <span>• طالب</span>}
          </div>

          <h4 className="font-bold text-sm text-slate-700 pb-2 border-b border-slate-100 flex items-center justify-end gap-1.5">
            <span>{t.personalizedAdvice}</span>
            <Award className="w-4 h-4 text-blue-600" />
          </h4>
          <p className="text-xs md:text-sm text-slate-600 leading-relaxed pt-1">
            {product.personalizedAdvice}
          </p>
        </div>



        {/* Pros & Cons Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pros */}
          <div className="rounded-3xl bg-white border border-slate-200/80 p-6 space-y-4 shadow-sm">
            <h4 className="font-bold text-sm text-slate-700 pb-2 border-b border-slate-100 flex items-center justify-end gap-1.5">
              <span>{t.features}</span>
              <ThumbsUp className="w-4 h-4 text-emerald-500" />
            </h4>
            <ul className="space-y-2.5">
              {product.features.map((feat, i) => (
                <li key={i} className="flex justify-end items-start gap-2 text-xs text-slate-600 leading-relaxed">
                  <span>{feat}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-2" />
                </li>
              ))}
            </ul>
          </div>

          {/* Cons */}
          <div className="rounded-3xl bg-white border border-slate-200/80 p-6 space-y-4 shadow-sm">
            <h4 className="font-bold text-sm text-slate-700 pb-2 border-b border-slate-100 flex items-center justify-end gap-1.5">
              <span>{t.drawbacks}</span>
              <ThumbsDown className="w-4 h-4 text-red-500" />
            </h4>
            <ul className="space-y-2.5">
              {product.drawbacks.map((draw, i) => (
                <li key={i} className="flex justify-end items-start gap-2 text-xs text-slate-600 leading-relaxed">
                  <span>{draw}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-2" />
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Smart Reviews trustworthiness Analysis */}
        <div className="rounded-3xl bg-white border border-slate-200/80 p-6 space-y-3 shadow-sm">
          <h4 className="font-bold text-sm text-slate-700 pb-2 border-b border-slate-100 flex items-center justify-end gap-1.5">
            <span>{t.reviewsAnalysis}</span>
            <ShieldAlert className="w-4 h-4 text-slate-500" />
          </h4>

          <div className="flex gap-3 items-start justify-between flex-row-reverse">
            <div className={`px-3 py-1.5 rounded-xl text-xs font-black shrink-0 ${
              product.isMisleadingReviews
                ? "bg-red-50 text-red-600 border border-red-100"
                : "bg-emerald-50 text-emerald-600 border border-emerald-100"
            }`}>
              {product.isMisleadingReviews ? "⚠️ تقييمات مشبوهة" : "✅ تقييمات موثوقة"}
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed flex-1 text-right">
              {product.misleadingReviewsExplanation}
            </p>
          </div>
        </div>

        {/* Price History Timeline Graph */}
        <div className="rounded-3xl bg-white border border-slate-200/80 p-6 space-y-4 shadow-sm">
          <h4 className="font-bold text-sm text-slate-700 pb-2 border-b border-slate-100 flex items-center justify-end gap-1.5">
            <span>{t.priceHistory}</span>
            <Calendar className="w-4 h-4 text-slate-500" />
          </h4>

          {/* Sparkline list */}
          <div className="flex flex-row-reverse justify-between items-end h-32 pt-6 pb-2 px-4 bg-slate-50 border border-slate-150 rounded-2xl relative">
            <div className="absolute top-2 right-4 text-[9px] font-mono text-slate-400">
              {isRtl ? "مخطط اتجاه السعر (SAR)" : "Price trend graph (SAR)"}
            </div>

            {product.priceHistory.map((pt, i) => {
              // Calculate relative height percentage
              const heightPct = Math.max(15, Math.min(100, ((pt.price - minPrice) / priceRange) * 100));

              return (
                <div key={i} className="flex flex-col items-center flex-1 h-full justify-end group">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 absolute bottom-24 bg-slate-800 border border-slate-750 text-[10px] font-bold text-white px-2 py-1 rounded-lg pointer-events-none transition-opacity font-mono shadow-xl z-20">
                    {pt.price} SAR
                  </div>

                  {/* Vertical bar */}
                  <div
                    style={{ height: `${heightPct}%` }}
                    className="w-4 rounded-t-md bg-gradient-to-t from-blue-500/20 to-blue-600 group-hover:to-blue-500 transition-all duration-300"
                  />

                  {/* Date name */}
                  <span className="text-[9px] text-slate-400 font-bold mt-2 font-sans text-center truncate w-full">
                    {pt.date}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Predictions block */}
          <div className="pt-2">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 text-right space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                {t.pricePrediction}
              </span>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {product.pricePrediction}
              </p>
            </div>
          </div>
        </div>

        {/* Specs list */}
        <div className="rounded-3xl bg-white border border-slate-200/80 p-6 space-y-3 shadow-sm">
          <h4 className="font-bold text-sm text-slate-700 pb-2 border-b border-slate-100 flex items-center justify-end gap-1.5">
            <span>{isRtl ? "المواصفات التقنية" : "Technical Specifications"}</span>
            <BookOpen className="w-4 h-4 text-slate-500" />
          </h4>

          <div className="divide-y divide-slate-100">
            {product.specs.map((spec, i) => (
              <div key={i} className="flex justify-between items-center py-2.5 text-xs text-right">
                <span className="font-semibold text-slate-800">{spec.value}</span>
                <span className="text-slate-400 font-bold">{spec.key}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Purchase Locations (stores) */}
        <div className="rounded-3xl bg-white border border-slate-200/80 p-6 space-y-3 shadow-sm">
          <h4 className="font-bold text-sm text-slate-700 pb-2 border-b border-slate-100 flex items-center justify-end gap-1.5">
            <span>{t.purchaseLocations}</span>
            <DollarSign className="w-4 h-4 text-slate-500" />
          </h4>

          <div className="space-y-2">
            {product.purchaseLocations.map((loc, i) => (
              <div
                key={i}
                className="p-3.5 bg-slate-50 rounded-2xl border border-slate-150 flex items-center justify-between text-right hover:border-slate-300 transition-colors"
              >
                <a
                  href={resolveStoreUrl(loc.store, loc.url, product.name)}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>{isRtl ? "زيارة المتجر" : "Visit Store"}</span>
                </a>

                <div>
                  <span className="font-bold text-xs text-slate-850 block">{loc.store}</span>
                  <span className="font-mono text-xs font-black text-blue-600 mt-0.5 block">
                    {loc.price} {product.price.currency}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Better Alternatives block */}
        <div className="rounded-3xl bg-white border border-slate-200/80 p-6 space-y-3 shadow-sm">
          <h4 className="font-bold text-sm text-slate-700 pb-2 border-b border-slate-100 flex items-center justify-end gap-1.5">
            <span>{t.alternatives}</span>
            <Award className="w-4 h-4 text-blue-600" />
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.alternatives.map((alt, i) => (
              <div
                key={i}
                className="p-4 bg-slate-50 rounded-2xl border border-slate-150 text-right flex flex-col justify-between hover:border-blue-100 transition-colors shadow-xs"
              >
                <div>
                  <h5 className="font-bold text-xs text-slate-800">{alt.name}</h5>
                  <span className="font-mono text-[11px] font-black text-blue-600 block mt-1">
                    {alt.price} SAR
                  </span>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-2">{alt.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
