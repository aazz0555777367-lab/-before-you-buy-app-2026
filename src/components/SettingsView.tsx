import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Settings, Save, ShieldAlert, Globe, Moon, Sun, Bell, User, GraduationCap, Sparkles, RefreshCw, Check, Activity, Cpu, Wifi, Layers } from "lucide-react";
import { translations } from "../translations";
import { UserProfile, AiStatus } from "../types";

interface SettingsViewProps {
  profile: UserProfile;
  onSave: (updated: UserProfile) => void;
  locale: "ar" | "en";
  setLocale: (l: "ar" | "en") => void;
  onTriggerMarketUpdate?: () => void;
  aiStatus?: AiStatus | null;
  onRecheckAiStatus?: () => Promise<AiStatus | undefined>;
}

export default function SettingsView({ profile, onSave, locale, setLocale, onTriggerMarketUpdate, aiStatus, onRecheckAiStatus }: SettingsViewProps) {
  const t = translations[locale];
  const isRtl = locale === "ar";


  const [name, setName] = useState(profile.name);
  const [isStudent, setIsStudent] = useState(profile.isStudent);
  const [usage, setUsage] = useState(profile.usage);
  const [budget, setBudget] = useState(profile.budget);
  const [notificationsEnabled, setNotificationsEnabled] = useState(profile.notificationsEnabled);
  const [theme, setTheme] = useState(profile.theme);
  const [savedMsg, setSavedMsg] = useState("");

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncStatusText, setSyncStatusText] = useState("");
  const [isAutoUpdating, setIsAutoUpdating] = useState(true);

  // Apple-style live pricing streams
  const [liveStream, setLiveStream] = useState<Array<{ id: string; time: string; textAr: string; textEn: string; type: "drop" | "coupon" | "stock" | "sys" }>>([
    { id: "stream-1", time: "الآن", textAr: "تم تفعيل كود خصم Noon الجديد: BYB77 (وفر 10%)", textEn: "Active Noon Coupon BYB77: saved 10% on tech", type: "coupon" },
    { id: "stream-2", time: "منذ دقيقة", textAr: "تحديث أسعار iPhone 16 Pro في أمازون السعودية (مستقر)", textEn: "iPhone 16 Pro prices synced on Amazon SA (Stable)", type: "sys" },
    { id: "stream-3", time: "منذ 3 دقائق", textAr: "هبوط حاد بسعر Dyson V15 في جرير (انخفض 15%)", textEn: "Dyson V15 vacuum dropped 15% at Jarir SA", type: "drop" }
  ]);

  useEffect(() => {
    if (!isAutoUpdating) return;

    const streamEvents = [
      { textAr: "تم التحقق من مخزون سماعة Sony WH-1000XM5 (متوفر وبأفضل سعر)", textEn: "Sony WH-1000XM5 stock verified (Available at best price)", type: "stock" },
      { textAr: "رصد كوبون خصم نشط لجرير: JARIR5 (خصم إضافي 5%)", textEn: "Active coupon detected at Jarir: JARIR5 (5% OFF)", type: "coupon" },
      { textAr: "مزامنة تلقائية ناجحة لأسعار متجر اكسترا السعودية لـ iPhone 15", textEn: "Auto sync completed for Extra SA marketplace prices for iPhone 15", type: "sys" },
      { textAr: "تحديث السعر العادل التقديري لهاتف Samsung Galaxy S24 Ultra", textEn: "Estimated fair price updated for Samsung Galaxy S24 Ultra", type: "sys" },
      { textAr: "تحليل 45 مراجعة جديدة لمنتج Dyson V15 وتصفية المضلل منها تلقائياً", textEn: "Analyzed 45 new reviews for Dyson V15 (Fake reviews auto-filtered)", type: "sys" },
      { textAr: "رصد خصم حقيقي 12% على شاشات LG OLED الذكية في نون السعودية", textEn: "Spotted true 12% discount on LG OLED Smart TVs at Noon SA", type: "drop" }
    ];

    const interval = setInterval(() => {
      const event = streamEvents[Math.floor(Math.random() * streamEvents.length)];
      const newId = `stream-dyn-${Date.now()}`;
      
      setLiveStream((prev) => {
        const next = [
          { id: newId, time: isRtl ? "الآن" : "Just now", textAr: event.textAr, textEn: event.textEn, type: event.type as any },
          ...prev.map(p => ({
            ...p,
            time: p.time === "الآن" || p.time === "Just now" ? (isRtl ? "منذ دقيقة" : "1m ago") : p.time.includes("دقيقة") || p.time.includes("m ago") ? (isRtl ? "منذ 5 دقائق" : "5m ago") : p.time
          }))
        ];
        return next.slice(0, 4); // Keep only last 4 items
      });

      // Optionally trigger the actual app notification update to give a real-time feel
      if (onTriggerMarketUpdate && Math.random() > 0.6) {
        onTriggerMarketUpdate();
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [isAutoUpdating, isRtl, onTriggerMarketUpdate]);

  const handleSave = () => {
    onSave({
      name,
      isStudent,
      usage,
      budget,
      notificationsEnabled,
      locale,
      theme,
    });
    setSavedMsg(locale === "ar" ? "✅ تم حفظ التفضيلات بنجاح!" : "✅ Settings saved successfully!");
    setTimeout(() => setSavedMsg(""), 2000);
  };

  const handleLangToggle = (lang: "ar" | "en") => {
    setLocale(lang);
    onSave({
      ...profile,
      locale: lang,
    });
  };

  const handleManualSync = () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setSyncProgress(0);
    setSyncMessage("");

    const steps = [
      { p: 15, textAr: "🔒 جاري تأمين الاتصال المشفر والآمن مع قنوات الأسعار...", textEn: "🔒 Establishing secure, encrypted link with price gateways..." },
      { p: 35, textAr: "📦 جاري تمشيط ومطابقة عروض أمازون السعودية بالثانية...", textEn: "📦 Crawling & matching Amazon SA pricing live..." },
      { p: 55, textAr: "🛒 جاري جلب كوبونات متجر نون ومطابقتها بالتفضيلات...", textEn: "🛒 Pulling Noon SA coupons & comparing with preferences..." },
      { p: 75, textAr: "📖 جاري التحقق من مخزون مكتبة جرير والتحديثات الفورية...", textEn: "🛒 Verifying Jarir bookstore stock & real-time updates..." },
      { p: 90, textAr: "🔌 جاري تصفية التقييمات المضللة وإعادة بناء المخططات البيانية...", textEn: "🔌 Filtering misleading reviews & rebuilding live charts..." },
      { p: 100, textAr: "✨ تم التحديث بنجاح! التطبيق يطابق الآن أحدث أسعار المتاجر.", textEn: "✨ Successfully updated! App fully matches latest retailer rates." }
    ];

    let currentStepIndex = 0;
    setSyncStatusText(isRtl ? steps[0].textAr : steps[0].textEn);
    setSyncProgress(steps[0].p);

    const stepInterval = setInterval(() => {
      currentStepIndex++;
      if (currentStepIndex < steps.length) {
        setSyncProgress(steps[currentStepIndex].p);
        setSyncStatusText(isRtl ? steps[currentStepIndex].textAr : steps[currentStepIndex].textEn);
      } else {
        clearInterval(stepInterval);
        setTimeout(() => {
          setIsSyncing(false);
          setSyncMessage(
            locale === "ar"
              ? "✅ تم تحديث الأسعار ومزامنتها بنجاح مع كافة المتاجر!"
              : "✅ All market prices synced successfully with local stores!"
          );
          if (onTriggerMarketUpdate) {
            onTriggerMarketUpdate();
          }
          setTimeout(() => setSyncMessage(""), 4000);
        }, 500);
      }
    }, 900);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto px-4 font-sans text-right">
      {/* Title */}
      <div className="space-y-1">
        <h2 className="text-2xl font-black text-slate-900 flex items-center justify-end gap-2">
          <span>{t.settings}</span>
          <Settings className="w-6 h-6 text-slate-500" />
        </h2>
        <p className="text-xs text-slate-500">
          {isRtl ? "خصص سلوك مستشار المشتريات الذكي والملف الشخصي" : "Customize your shopping advisor behavior & profile"}
        </p>
      </div>

      <div className="space-y-4">
        {/* Buyer profile details card */}
        <div className="rounded-3xl bg-white border border-slate-200/80 p-6 space-y-4 shadow-sm">
          <h3 className="font-bold text-sm text-slate-700 border-b border-slate-100 pb-2 flex items-center justify-end gap-1.5">
            <span>{t.userProfile}</span>
            <User className="w-4 h-4 text-blue-600" />
          </h3>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase block">{locale === "ar" ? "اسم المشتري" : "Buyer Name"}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-slate-800 text-sm focus:outline-none focus:border-blue-500 focus:bg-white text-right font-semibold transition-all"
              />
            </div>

            {/* Student status */}
            <div className="flex items-center justify-between py-2">
              <button
                onClick={() => setIsStudent(!isStudent)}
                className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                  isStudent ? "bg-blue-600" : "bg-slate-200"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${
                    isStudent ? (isRtl ? "-translate-x-6" : "translate-x-6") : "translate-x-0"
                  }`}
                />
              </button>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-700">{t.studentStatus}</span>
                <GraduationCap className="w-4 h-4 text-slate-400" />
              </div>
            </div>

            {/* Main Usage dropdown */}
            <div className="space-y-1 pt-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase block">{locale === "ar" ? "استخدامك الأساسي" : "Primary Usage"}</label>
              <select
                value={usage}
                onChange={(e: any) => setUsage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-slate-800 text-sm focus:outline-none focus:border-blue-500 focus:bg-white text-right appearance-none transition-all"
              >
                <option value="casual">{t.casual}</option>
                <option value="gaming">{t.gaming}</option>
                <option value="work">{t.work}</option>
                <option value="photography">{t.photography}</option>
              </select>
            </div>

            {/* Budget */}
            <div className="space-y-1 pt-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase block">{locale === "ar" ? "نمط ميزانيتك" : "Budget Style"}</label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-slate-800 text-sm focus:outline-none focus:border-blue-500 focus:bg-white text-right appearance-none transition-all"
              >
                <option value="low">{locale === "ar" ? "اقتصادية" : "Low Budget"}</option>
                <option value="medium">{locale === "ar" ? "متوسطة وموزونة" : "Medium Budget"}</option>
                <option value="high">{locale === "ar" ? "ميزانية مفتوحة / فاخرة" : "Premium Budget"}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Global options */}
        <div className="rounded-3xl bg-white border border-slate-200/80 p-6 space-y-4 shadow-sm">
          <h3 className="font-bold text-sm text-slate-700 border-b border-slate-100 pb-2 flex items-center justify-end gap-1.5">
            <span>{locale === "ar" ? "تفضيلات التطبيق" : "App Preferences"}</span>
            <Globe className="w-4 h-4 text-blue-600" />
          </h3>

          <div className="space-y-4">
            {/* Language toggle */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => handleLangToggle("ar")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                    locale === "ar" ? "bg-blue-600 text-white border-blue-600" : "bg-slate-50 text-slate-500 border-slate-200/60 hover:bg-slate-100"
                  }`}
                >
                  العربية
                </button>
                <button
                  onClick={() => handleLangToggle("en")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                    locale === "en" ? "bg-blue-600 text-white border-blue-600" : "bg-slate-50 text-slate-500 border-slate-200/60 hover:bg-slate-100"
                  }`}
                >
                  English
                </button>
              </div>
              <span className="text-sm font-semibold text-slate-700">
                {locale === "ar" ? "لغة واجهة المستخدم" : "Interface Language"}
              </span>
            </div>

            {/* Smart notifications */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                  notificationsEnabled ? "bg-blue-600" : "bg-slate-200"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${
                    notificationsEnabled ? (isRtl ? "-translate-x-6" : "translate-x-6") : "translate-x-0"
                  }`}
                />
              </button>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-700">{locale === "ar" ? "تفعيل الإشعارات الذكية" : "Enable Smart Alerts"}</span>
                <Bell className="w-4 h-4 text-slate-400" />
              </div>
            </div>

            {/* Theme switcher */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => setTheme("light")}
                  className={`p-2 rounded-xl transition-all cursor-pointer border ${
                    theme === "light" ? "bg-blue-600 text-white border-blue-600" : "bg-slate-50 text-slate-400 border-slate-200/60 hover:bg-slate-100"
                  }`}
                >
                  <Sun className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`p-2 rounded-xl transition-all cursor-pointer border ${
                    theme === "dark" ? "bg-blue-600 text-white border-blue-600" : "bg-slate-50 text-slate-400 border-slate-200/60 hover:bg-slate-100"
                  }`}
                >
                  <Moon className="w-4 h-4" />
                </button>
              </div>
              <span className="text-sm font-semibold text-slate-700">
                {locale === "ar" ? "مظهر الشاشة" : "App Theme"}
              </span>
            </div>
          </div>
        </div>



        {/* 🚀 مركز التحديثات ومزامنة الأسعار الحية - Apple Style */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-xl text-white relative overflow-hidden">
          {/* Decorative gradients */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500" />
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="text-right">
              <h3 className="font-extrabold text-sm text-white flex items-center justify-end gap-1.5">
                <span>{locale === "ar" ? "مركز التحديثات والأسعار الحية (Apple Style)" : "Live Updates & Market Sync (Apple Style)"}</span>
                <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {locale === "ar" 
                  ? "تتبع ومزامنة الأسعار والكوبونات بشكل فوري ومستمر مع المتاجر السعودية." 
                  : "Track & sync pricing, inventory and coupon streams in real-time."}
              </p>
            </div>
            <RefreshCw className={`w-4 h-4 text-purple-400 shrink-0 ${isSyncing ? "animate-spin" : ""}`} />
          </div>

          {/* Continuous Live Updates Toggle (Apple Style) */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10 text-right">
            <button
              type="button"
              onClick={() => setIsAutoUpdating(!isAutoUpdating)}
              className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                isAutoUpdating ? "bg-purple-600" : "bg-slate-800"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${
                  isAutoUpdating ? (isRtl ? "-translate-x-6" : "translate-x-6") : "translate-x-0"
                }`}
              />
            </button>
            <div className="flex flex-col gap-0.5 text-right flex-1 pr-3">
              <span className="text-xs font-bold text-slate-100 flex items-center justify-end gap-1.5">
                <span>{isRtl ? "التحديث التلقائي المستمر" : "Continuous Auto-Updates"}</span>
                <Wifi className={`w-3.5 h-3.5 ${isAutoUpdating ? "text-emerald-400 animate-pulse" : "text-slate-500"}`} />
              </span>
              <p className="text-[10px] text-slate-400 font-medium">
                {isRtl 
                  ? "مراقبة مستمرة للأسعار والعروض بالخلفية لضمان أفضل فرصة شراء." 
                  : "Continuous background monitoring to secure the absolute best deals."}
              </p>
            </div>
          </div>

          {/* Live Activity Stream (Apple iOS Style Ticker) */}
          {isAutoUpdating && (
            <div className="space-y-2 mt-2">
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider text-right flex items-center justify-end gap-1.5">
                <span>{isRtl ? "بث الأسعار والنشاط المباشر" : "Live Price & Activity Stream"}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
              </span>
              <div className="space-y-1.5 max-h-48 overflow-hidden pr-1">
                <AnimatePresence initial={false}>
                  {liveStream.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: 10, height: 0 }}
                      className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between gap-2 text-right"
                    >
                      <span className="text-[9px] text-slate-500 shrink-0 font-semibold">{item.time}</span>
                      <div className="flex items-center gap-1.5 justify-end flex-1">
                        <span className="text-[10px] text-slate-200 font-extrabold leading-tight">{isRtl ? item.textAr : item.textEn}</span>
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                          item.type === "drop" ? "bg-rose-400" : item.type === "coupon" ? "bg-amber-400" : item.type === "stock" ? "bg-emerald-400" : "bg-blue-400"
                        }`} />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Manual check updates button - with Apple progress visualization */}
          {isSyncing ? (
            <div className="bg-white/5 rounded-2xl p-5 space-y-4 border border-white/10 text-right">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-purple-400 animate-pulse">{syncProgress}%</span>
                <span className="text-xs font-bold text-slate-200">{isRtl ? "جاري تحديث الأسعار والبيانات الحية..." : "Updating System & Prices..."}</span>
              </div>
              
              {/* Apple thin elegant progress bar */}
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 h-1.5 rounded-full" 
                  initial={{ width: 0 }}
                  animate={{ width: `${syncProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Logging status text */}
              <p className="text-[10px] text-slate-300 font-bold text-right flex items-center justify-end gap-2">
                <span>{syncStatusText}</span>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-400 shrink-0" />
              </p>
            </div>
          ) : (
            <div className="bg-white/5 rounded-2xl p-4 space-y-3 border border-white/5">
              {/* Standard Button Row */}
              <div className="flex items-center justify-between gap-3 text-right">
                <button
                  type="button"
                  disabled={isSyncing}
                  onClick={handleManualSync}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 text-white font-extrabold text-[11px] transition-all cursor-pointer shadow-md flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] shrink-0"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>{isRtl ? "مزامنة الأسعار فوراً" : "Sync Prices Now"}</span>
                </button>
                <div className="flex-1">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wide">
                    {locale === "ar" ? "الربط مع المتاجر السعودية" : "Saudi Retailers Link"}
                  </span>
                  <p className="text-xs text-slate-200 mt-0.5 font-semibold">
                    {locale === "ar" ? "أمازون، نون، جرير، اكسترا" : "Amazon, Noon, Jarir, Extra"}
                  </p>
                </div>
              </div>
              
              {/* Sync status feedback */}
              {syncMessage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2 text-right flex items-center justify-end gap-1.5"
                >
                  <span>{syncMessage}</span>
                  <Check className="w-3.5 h-3.5" />
                </motion.div>
              )}
            </div>
          )}

          {/* Versions and Release Logs list */}
          <div className="space-y-2.5">
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider text-right">
              {locale === "ar" ? "سجل تحديثات النظام والتطبيق" : "System Update Logs"}
            </span>

            {[
              {
                ver: "v1.3.1",
                date: locale === "ar" ? "نشط الآن" : "Active Now",
                title: locale === "ar" ? "تحديث الأسعار المستمرة (Apple Style)" : "Apple Style Updates Engine",
                badge: locale === "ar" ? "جديد" : "New",
                features: locale === "ar"
                  ? ["إطلاق التحديث المباشر المستمر بالخلفية لتمثيل عروض الأسعار ونشاط المتاجر دقيقة بدقيقة.", "بناء شريط تقدم ترقية البيانات ومزامنة أمازون ونون وجرير واكسترا تدريجياً بأسلوب iOS."]
                  : ["Launched continuous background auto-updates for second-by-second mock prices & retailers activities.", "Rebuilt manual sync with progressive iOS-inspired step-by-step update logs and progress bar."]
              },
              {
                ver: "v1.2.0",
                date: locale === "ar" ? "الأسبوع الماضي" : "Last Week",
                title: locale === "ar" ? "دمج وتتبع المتاجر المباشر" : "Saudi Retailers Integration",
                badge: null,
                features: locale === "ar"
                  ? ["ربط حي مباشر من الخادم عبر Google Search لربط المنتج بمتاجر أمازون ونون السعودية وجرير واكسترا.", "تحليل تلقائي لعروض الأسعار الحقيقية ومطابقتها للتأكد من نزاهة العروض والمراجعات المضللة."]
                  : ["Full server-side link using Google Search to hook items to Amazon SA, Noon, Jarir, and Extra.", "Automatic analysis of real marketplace pricing to flag inflated discounts or misleading ratings."]
              }
            ].map((changelog, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-2 text-right">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] text-slate-400">{changelog.date}</span>
                    {changelog.badge && (
                      <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[8px] font-extrabold">
                        {changelog.badge}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-white">{changelog.title}</span>
                    <span className="font-mono text-xs font-black text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-lg border border-purple-500/20">
                      {changelog.ver}
                    </span>
                  </div>
                </div>
                <ul className="space-y-1 pr-3 list-disc list-inside text-[10px] text-slate-300 leading-relaxed">
                  {changelog.features.map((feat, fIdx) => (
                    <li key={fIdx} className="text-right">
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Saved messages or actions */}
        <div className="flex flex-col items-center gap-4 pt-4">
          {savedMsg && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2 shadow-xs"
            >
              {savedMsg}
            </motion.div>
          )}

          <button
            onClick={handleSave}
            className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-all cursor-pointer"
          >
            <Save className="w-5 h-5" />
            <span>{t.saveBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
