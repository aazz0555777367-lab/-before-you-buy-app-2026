import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRightLeft, Check, AlertCircle, X, Sparkles, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { translations } from "../translations";
import { ProductAnalysis } from "../types";
import { mockProducts } from "../data/mockProducts";

interface ComparisonViewProps {
  primaryProduct: ProductAnalysis;
  secondaryProduct: ProductAnalysis | null;
  onSelectSecondary: (product: ProductAnalysis) => void;
  onClose: () => void;
  locale: "ar" | "en";
}

export default function ComparisonView({
  primaryProduct,
  secondaryProduct,
  onSelectSecondary,
  onClose,
  locale,
}: ComparisonViewProps) {
  const t = translations[locale];
  const isRtl = locale === "ar";

  const [searchQuery, setSearchQuery] = useState("");

  const availableOptions = Object.values(mockProducts).filter(
    (p) => p.name !== primaryProduct.name
  );

  const filteredOptions = availableOptions.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans text-right animate-fade-in px-4 pb-12">
      {/* Header bar */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 flex justify-between items-center shadow-xs">
        <button
          onClick={onClose}
          className="px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-950 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-extrabold shadow-2xs border border-slate-200/50"
        >
          {isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          <span>{locale === "ar" ? "الرجوع للتقرير" : "Back to report"}</span>
        </button>
        <span className="font-extrabold text-sm text-slate-900">
          {locale === "ar" ? "المقارنة الذكية" : "Smart Comparison"}
        </span>
        <div className="w-6 h-6" />
      </div>

      {/* Comparison Workspace */}
      <div className="space-y-6">
        {/* Step 1: Select secondary product if not chosen */}
        {!secondaryProduct ? (
          <div className="space-y-6 text-right">
            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-slate-900">
                {locale === "ar" ? "قارن مع بديل ذكي" : "Compare with a Smart Alternative"}
              </h3>
              <p className="text-xs text-slate-500">
                {locale === "ar"
                  ? `اختر منتجاً آخر لتقارنه وجهاً لوجه مع (${primaryProduct.name.split("|")[0]})`
                  : `Choose another product to compare side-by-side with (${primaryProduct.name.split("|")[0]})`}
              </p>
            </div>

            {/* Selector list of trending mock items */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableOptions.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => onSelectSecondary(p)}
                    className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 transition-all text-right flex gap-4 cursor-pointer shadow-xs"
                  >
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-slate-800">{p.name}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">{p.scoreReason}</p>
                      <div className="flex justify-end gap-2 mt-2 items-center">
                        <span className="text-xs font-bold text-blue-600 font-mono">
                          {p.price.current} {p.price.currency}
                        </span>
                        <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-mono">
                          {p.score}/100
                        </span>
                      </div>
                    </div>
                    {p.imageUrl && (
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-xl object-cover border border-slate-100"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Step 2: Render Comparison Matrix */
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4 text-center items-center">
              {/* Product 1 details */}
              <div className="rounded-2xl bg-white border border-slate-200/80 p-4 space-y-2 shadow-sm">
                {primaryProduct.imageUrl && (
                  <img
                    src={primaryProduct.imageUrl}
                    alt={primaryProduct.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl object-cover mx-auto mb-2 border border-slate-100"
                  />
                )}
                <h4 className="font-bold text-xs text-slate-800 line-clamp-2">
                  {primaryProduct.name.split("|")[0]}
                </h4>
              </div>

              {/* Versus separator */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100/80 flex items-center justify-center text-blue-600 font-black text-xs font-mono shadow-xs">
                  VS
                </div>
              </div>

              {/* Product 2 details */}
              <div className="rounded-2xl bg-white border border-slate-200/80 p-4 space-y-2 relative shadow-sm">
                <button
                  onClick={() => onSelectSecondary(null as any)}
                  className="absolute top-2 right-2 p-1 bg-slate-100 rounded-full hover:text-red-500 hover:bg-slate-200 cursor-pointer text-slate-400"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                {secondaryProduct.imageUrl && (
                  <img
                    src={secondaryProduct.imageUrl}
                    alt={secondaryProduct.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl object-cover mx-auto mb-2 border border-slate-100"
                  />
                )}
                <h4 className="font-bold text-xs text-slate-800 line-clamp-2">
                  {secondaryProduct.name.split("|")[0]}
                </h4>
              </div>
            </div>

            {/* Matrix comparison table */}
            <div className="rounded-3xl bg-white border border-slate-200/80 overflow-hidden font-sans shadow-sm">
              <div className="divide-y divide-slate-100">
                {/* Row 1: Score */}
                <div className="grid grid-cols-3 p-4 items-center">
                  <div className="text-center font-bold text-base text-blue-600">
                    {primaryProduct.score} <span className="text-[10px] text-slate-400">/100</span>
                  </div>
                  <div className="text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {locale === "ar" ? "درجة التقييم" : "Purchase Score"}
                  </div>
                  <div className="text-center font-bold text-base text-blue-600">
                    {secondaryProduct.score} <span className="text-[10px] text-slate-400">/100</span>
                  </div>
                </div>

                {/* Row 2: Price */}
                <div className="grid grid-cols-3 p-4 items-center">
                  <div className="text-center font-bold font-mono text-slate-900">
                    {primaryProduct.price.current} {primaryProduct.price.currency}
                  </div>
                  <div className="text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {locale === "ar" ? "السعر الحالي" : "Current Price"}
                  </div>
                  <div className="text-center font-bold font-mono text-slate-900">
                    {secondaryProduct.price.current} {secondaryProduct.price.currency}
                  </div>
                </div>

                {/* Row 3: Advice */}
                <div className="grid grid-cols-3 p-4 items-center">
                  <div className="text-center font-semibold text-xs text-slate-800">
                    {primaryProduct.priceAdvice === "buy_now"
                      ? t.buyNow
                      : primaryProduct.priceAdvice === "wait"
                      ? t.waitDrop
                      : t.dontBuy}
                  </div>
                  <div className="text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {locale === "ar" ? "توصية الشراء" : "Purchase Advice"}
                  </div>
                  <div className="text-center font-semibold text-xs text-slate-800">
                    {secondaryProduct.priceAdvice === "buy_now"
                      ? t.buyNow
                      : secondaryProduct.priceAdvice === "wait"
                      ? t.waitDrop
                      : t.dontBuy}
                  </div>
                </div>

                {/* Row 4: Score Reason */}
                <div className="grid grid-cols-3 p-4 items-start">
                  <div className="text-center text-xs text-slate-600 leading-relaxed px-1">
                    {primaryProduct.scoreReason}
                  </div>
                  <div className="text-center text-xs font-bold text-slate-500 uppercase tracking-wider pt-1">
                    {locale === "ar" ? "تحليل القيمة" : "Value Summary"}
                  </div>
                  <div className="text-center text-xs text-slate-600 leading-relaxed px-1">
                    {secondaryProduct.scoreReason}
                  </div>
                </div>

                {/* Row 5: Primary Pro */}
                <div className="grid grid-cols-3 p-4 items-start">
                  <div className="text-right text-xs text-slate-600 space-y-1 px-1">
                    {primaryProduct.features.slice(0, 2).map((f, i) => (
                      <div key={i} className="flex justify-end items-start gap-1">
                        <span>{f}</span>
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      </div>
                    ))}
                  </div>
                  <div className="text-center text-xs font-bold text-slate-500 uppercase tracking-wider pt-1">
                    {locale === "ar" ? "ميزة رئيسية" : "Key Advantage"}
                  </div>
                  <div className="text-right text-xs text-slate-600 space-y-1 px-1">
                    {secondaryProduct.features.slice(0, 2).map((f, i) => (
                      <div key={i} className="flex justify-end items-start gap-1">
                        <span>{f}</span>
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic AI final verdict */}
            <div className="rounded-3xl bg-blue-50 border border-blue-100/60 p-5 space-y-2 text-right shadow-xs">
              <h4 className="font-bold text-sm text-blue-700 flex items-center justify-end gap-1.5">
                <span>{locale === "ar" ? "حكم مستشار الشراء الذكي" : "Smart Buying Verdict"}</span>
                <Sparkles className="w-4 h-4 text-blue-600" />
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {locale === "ar"
                  ? `بمقارنة المنتجين، يتفوق (${
                      primaryProduct.score >= secondaryProduct.score ? primaryProduct.name.split("|")[0] : secondaryProduct.name.split("|")[0]
                    }) بمعدل تقييم أعلى ورضا مستخدمين أفضل. ننصح باختيار المنتج الأنسب لميزانيتك واحتياجاتك المحددة.`
                  : `In conclusion, (${
                      primaryProduct.score >= secondaryProduct.score ? primaryProduct.name.split("|")[0] : secondaryProduct.name.split("|")[0]
                    }) shows superior user sentiment, price justification, and features. Select according to your strict budget constraints.`}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
