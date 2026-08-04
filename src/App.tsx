import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Home,
  Heart,
  History,
  Bell,
  Settings,
  RefreshCw,
  ArrowRightLeft,
  Search,
  Check,
  AlertCircle,
  Lock,
  RotateCw,
  Copy,
  TrendingDown,
  Gift,
  ShoppingBag,
} from "lucide-react";

// Import custom types and translations
import { AppScreen, ProductAnalysis, SearchHistoryItem, WishlistItem, AppNotification, UserProfile, AiStatus } from "./types";
import { translations } from "./translations";
import { mockProducts } from "./data/mockProducts";

// Import modular components
import Splash from "./components/Splash";
import Onboarding from "./components/Onboarding";
import Login from "./components/Login";
import HomeView from "./components/HomeView";
import ProductDetailsView from "./components/ProductDetailsView";
import ComparisonView from "./components/ComparisonView";
import SmartWishlist from "./components/SmartWishlist";
import HistoryView from "./components/HistoryView";
import NotificationsView from "./components/NotificationsView";
import SettingsView from "./components/SettingsView";

const PERIODIC_UPDATES = [
  {
    title_ar: "📉 هبوط حاد بسعر هاتف iPhone 16 Pro Max",
    title_en: "📉 Instant Price Drop on iPhone 16 Pro Max",
    body_ar: "رُصد عرض جديد في أمازون السعودية بسعر 4599 ريال بدلاً من 4999 ريال! متوافق مع ميزانيتك المحددة.",
    body_en: "New price spotted at Amazon Saudi for 4599 SAR instead of 4999 SAR! Highly aligned with your custom budget.",
    type: "drop"
  },
  {
    title_ar: "🎁 تم إطلاق كود خصم جديد لنون: BYB77",
    title_en: "🎁 New Coupon Active at Noon: BYB77",
    body_ar: "استخدم رمز BYB77 الحصري لتوفير 10% إضافية على الأجهزة والملحقات الإلكترونية الذكية عند إتمام الطلب.",
    body_en: "Apply code BYB77 at checkout to get an extra 10% discount on tech products & devices.",
    type: "coupon"
  },
  {
    title_ar: "🚀 تحديث ذكي جديد متوفر للتطبيق (v1.3.0)",
    title_en: "🚀 New AI Algorithm Update Available (v1.3.0)",
    body_ar: "تم تطوير نظام التقييم الذاتي للتقييمات المزيفة وكشف السعر العادل والبدائل الحية فورا بالذكاء الاصطناعي.",
    body_en: "AI core updated: Enhanced verification of fake reviews, fair pricing estimates and live alternative matches.",
    type: "release"
  },
  {
    title_ar: "📉 عرض ساخن: Dyson V15 Detect",
    title_en: "📉 Hot Deal on Dyson V15 Detect",
    body_ar: "انخفض سعر المكنسة الذكية دايسون في جرير لتصل إلى 2199 ريال بخصم 15%. الكمية محدودة جداً!",
    body_en: "Dyson V15 Detect smart vacuum dropped to 2199 SAR at Jarir with a 15% discount. Limited quantities available!",
    type: "drop"
  },
  {
    title_ar: "📦 توفر مخزون: سماعة سوني ULT WEAR",
    title_en: "📦 Stock Alert: Sony ULT WEAR Headphones",
    body_ar: "عادت سماعات سوني الشهيرة للتوفر بالمخزون في أمازون السعودية مع تفعيل كود الخصم الإضافي الخاص بنا.",
    body_en: "Highly-requested Sony ULT WEAR headphones are back in stock on Amazon SA with additional voucher support.",
    type: "stock"
  }
];

export default function App() {
  // Global States
  const [screen, setScreen] = useState<AppScreen>("splash");
  const [locale, setLocale] = useState<"ar" | "en">("ar");
  const [activeProduct, setActiveProduct] = useState<ProductAnalysis | null>(null);
  const [comparingProduct, setComparingProduct] = useState<ProductAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);
  const [liveToast, setLiveToast] = useState<{ id: string; title: string; body: string; type: "drop" | "coupon" | "release" | "stock" } | null>(null);
  const [aiStatus, setAiStatus] = useState<AiStatus | null>(null);

  // Fetch connection status on startup
  useEffect(() => {
    fetch("/api/ai-status")
      .then((res) => res.json())
      .then((data) => setAiStatus(data))
      .catch((err) => console.warn("Could not retrieve AI status:", err));
  }, []);

  const recheckAiStatus = async () => {
    try {
      const res = await fetch("/api/ai-status?check=true");
      const data = await res.json();
      setAiStatus(data);
      return data;
    } catch (err) {
      console.warn("Could not recheck AI status:", err);
    }
  };

  const fallbackCopyText = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      const successful = document.execCommand("copy");
      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Fallback copy failed", err);
    }
    document.body.removeChild(textArea);
  };

  const handleCopyLink = () => {
    const origin = window.location.origin.includes("localhost") || window.location.origin.includes("run.app")
      ? window.location.origin + window.location.pathname
      : "https://ais-pre-gowi6vgmqcdpaqqfs4ouyl-467923095461.europe-west2.run.app/";
      
    let sharedUrl = origin.endsWith("/") ? origin.slice(0, -1) : origin;

    // Check if we are currently viewing a product details page
    if (screen === "details" && activeProduct) {
      // Find if it's one of our mock products to use its clean ID
      const mockKey = Object.keys(mockProducts).find(
        (key) => mockProducts[key].name === activeProduct.name
      );
      if (mockKey) {
        sharedUrl += `?p=${mockKey}`;
      } else {
        sharedUrl += `?q=${encodeURIComponent(activeProduct.name)}`;
      }
    }

    if (locale !== "ar") {
      sharedUrl += (sharedUrl.includes("?") ? "&" : "?") + `lang=${locale}`;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(sharedUrl)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch((err) => {
          console.warn("Async clipboard failed, trying fallback", err);
          fallbackCopyText(sharedUrl);
        });
    } else {
      fallbackCopyText(sharedUrl);
    }
  };

  // Persisted user state
  const [profile, setProfile] = useState<UserProfile>({
    name: "مشتري ذكي",
    isStudent: false,
    usage: "casual",
    budget: "medium",
    notificationsEnabled: true,
    locale: "ar",
    theme: "dark",
  });

  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // Load state from LocalStorage on mount
  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem("byb_profile");
      if (storedProfile) {
        const parsed = JSON.parse(storedProfile);
        setProfile(parsed);
        setLocale(parsed.locale || "ar");
      }

      const storedWishlist = localStorage.getItem("byb_wishlist");
      if (storedWishlist) setWishlist(JSON.parse(storedWishlist));

      const storedHistory = localStorage.getItem("byb_history");
      if (storedHistory) setHistory(JSON.parse(storedHistory));

      const storedNotifications = localStorage.getItem("byb_notifications");
      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      } else {
        // Prepopulate with elegant notifications
        const initialNotifications: AppNotification[] = [
          {
            id: "notif-1",
            title: locale === "ar" ? "📉 هبوط بسعر سماعة سوني WH-1000XM5!" : "📉 Sony WH-1000XM5 Price Drop!",
            body: locale === "ar"
              ? "انخفض سعر السماعة في جرير وأمازون بمقدار 150 ريال سعودي لتصل إلى 1149 ريال بدلاً من 1299 ريال!"
              : "Sony WH-1000XM5 wireless headphones just dropped to 1149 SAR (saved 150 SAR)!",
            date: "اليوم، 10:24 ص",
            read: false,
            type: "drop",
          },
          {
            id: "notif-2",
            title: locale === "ar" ? "🎁 كوبون خصم إضافي نشط لجرير: JARIR5" : "🎁 Extra Coupon Active: JARIR5",
            body: locale === "ar"
              ? "وفر 5% إضافية على الأجهزة الإلكترونية الذكية عند إدخال الرمز الترويجي JARIR5 أثناء الدفع."
              : "Get an extra 5% discount on smart electronics at Jarir with code JARIR5.",
            date: "أمس، 02:15 م",
            read: false,
            type: "coupon",
          },
        ];
        setNotifications(initialNotifications);
        localStorage.setItem("byb_notifications", JSON.stringify(initialNotifications));
      }

      // Check query parameters for deep linking
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const productParam = params.get("p");
        const queryParam = params.get("q");
        const langParam = params.get("lang");

        if (langParam === "en" || langParam === "ar") {
          setLocale(langParam);
        }

        if (productParam && mockProducts[productParam]) {
          setActiveProduct(mockProducts[productParam]);
          setScreen("details");
        } else if (queryParam) {
          // Trigger dynamic search analysis
          handleAnalyzeProduct(queryParam, undefined, false);
        }
      }
    } catch (e) {
      console.warn("Could not read local storage: ", e);
    }
  }, []);

  // Sync to localStorage helpers
  const saveProfile = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    localStorage.setItem("byb_profile", JSON.stringify(updatedProfile));
  };

  const saveWishlist = (updatedWishlist: WishlistItem[]) => {
    setWishlist(updatedWishlist);
    localStorage.setItem("byb_wishlist", JSON.stringify(updatedWishlist));
  };

  const saveHistory = (updatedHistory: SearchHistoryItem[]) => {
    setHistory(updatedHistory);
    localStorage.setItem("byb_history", JSON.stringify(updatedHistory));
  };

  const saveNotifications = (updatedNotifs: AppNotification[]) => {
    setNotifications(updatedNotifs);
    localStorage.setItem("byb_notifications", JSON.stringify(updatedNotifs));
  };

  // Periodic updates checker (to simulate OTA notifications / hot market updates dropping)
  useEffect(() => {
    if (screen === "splash" || screen === "onboarding" || screen === "login") return;
    
    const intervalTime = 30000; // 30 seconds for active demonstration!
    
    const interval = setInterval(() => {
      // Pick a random update
      const updateData = PERIODIC_UPDATES[Math.floor(Math.random() * PERIODIC_UPDATES.length)];
      
      const newNotif: AppNotification = {
        id: `notif-dyn-${Date.now()}`,
        title: locale === "ar" ? updateData.title_ar : updateData.title_en,
        body: locale === "ar" ? updateData.body_ar : updateData.body_en,
        date: locale === "ar" ? "الآن" : "Just now",
        read: false,
        type: updateData.type as any
      };
      
      // Update notifications list
      setNotifications((prev) => {
        // Avoid duplicate titles in the same session or quick list
        if (prev.some(p => p.title === newNotif.title)) return prev;
        
        const updated = [newNotif, ...prev];
        localStorage.setItem("byb_notifications", JSON.stringify(updated));
        
        // Show live top-down toast if alerts enabled
        if (profile.notificationsEnabled) {
          setLiveToast({
            id: newNotif.id,
            title: newNotif.title,
            body: newNotif.body,
            type: newNotif.type as any
          });
          // Auto dismiss after 7 seconds
          setTimeout(() => {
            setLiveToast((current) => current?.id === newNotif.id ? null : current);
          }, 7000);
        }
        
        return updated;
      });
      
    }, intervalTime);
    
    return () => clearInterval(interval);
  }, [screen, locale, profile.notificationsEnabled]);

  const handleTriggerMarketUpdate = () => {
    // Select one of the updates that aren't already in notifications, or just select one
    const unreadUpdate = PERIODIC_UPDATES.find(up => {
      const title = locale === "ar" ? up.title_ar : up.title_en;
      return !notifications.some(n => n.title === title);
    }) || PERIODIC_UPDATES[Math.floor(Math.random() * PERIODIC_UPDATES.length)];
    
    const newNotif: AppNotification = {
      id: `notif-manual-${Date.now()}`,
      title: locale === "ar" ? unreadUpdate.title_ar : unreadUpdate.title_en,
      body: locale === "ar" ? unreadUpdate.body_ar : unreadUpdate.body_en,
      date: locale === "ar" ? "الآن" : "Just now",
      read: false,
      type: unreadUpdate.type as any
    };

    const updated = [newNotif, ...notifications];
    saveNotifications(updated);

    // Show instant toast
    setLiveToast({
      id: newNotif.id,
      title: newNotif.title,
      body: newNotif.body,
      type: newNotif.type as any
    });
    
    // Auto dismiss toast after 7 seconds
    setTimeout(() => {
      setLiveToast((current) => current?.id === newNotif.id ? null : current);
    }, 7000);
  };

  // Trigger Gemini analysis via local server API route
  async function handleAnalyzeProduct(query: string, imageBase64?: string, isBarcode = false) {
    setLoading(true);
    setErrorMsg("");

    try {
      // Find if we have local profile
      let finalProfile = profile;
      try {
        const storedProfile = localStorage.getItem("byb_profile");
        if (storedProfile) {
          finalProfile = JSON.parse(storedProfile);
        }
      } catch (e) {}

      const response = await fetch("/api/analyze-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: query,
          image: imageBase64,
          userProfile: {
            isStudent: finalProfile.isStudent,
            usage: finalProfile.usage,
            budget: finalProfile.budget,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(locale === "ar" ? "حدث خطأ أثناء الاتصال بالخادم" : "Server connection failed");
      }

      const data: ProductAnalysis = await response.json();
      
      // Store custom image url if visual scan
      if (imageBase64) {
        data.imageUrl = imageBase64;
      }

      setActiveProduct(data);

      // Append to Search History
      const newHistoryItem: SearchHistoryItem = {
        id: `hist-${Date.now()}`,
        query: query || data.name,
        date: new Date().toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        product: data,
        type: imageBase64 ? "camera" : isBarcode ? "barcode" : "text",
      };

      const updatedHistory = [newHistoryItem, ...history.slice(0, 19)];
      saveHistory(updatedHistory);

      // Navigate to product details view
      setScreen("details");

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "فشل الاتصال");
    } finally {
      setLoading(false);
    }
  }

  // Bottom Navigation helper
  const renderCurrentView = () => {
    switch (screen) {
      case "home":
        return (
          <HomeView
            onSearch={(q) => handleAnalyzeProduct(q, undefined, false)}
            onSelectItem={(prod) => {
              setActiveProduct(prod);
              setScreen("details");
            }}
            locale={locale}
            userProfile={profile}
            aiStatus={aiStatus}
          />
        );
      case "wishlist":
        return (
          <SmartWishlist
            items={wishlist}
            onRemoveItem={(id) => {
              const updated = wishlist.filter((item) => item.id !== id);
              saveWishlist(updated);
            }}
            onSelectItem={(prod) => {
              setActiveProduct(prod);
              setScreen("details");
            }}
            onToggleSetting={(id, setting) => {
              const updated = wishlist.map((item) =>
                item.id === id ? { ...item, [setting]: !item[setting] } : item
              );
              saveWishlist(updated);
            }}
            onCompare={(prod) => {
              setActiveProduct(prod);
              setComparingProduct(null);
              setScreen("comparison");
            }}
            locale={locale}
          />
        );
      case "history":
        return (
          <HistoryView
            items={history}
            onClear={() => saveHistory([])}
            onSelectItem={(prod) => {
              setActiveProduct(prod);
              setScreen("details");
            }}
            locale={locale}
          />
        );
      case "notifications":
        return (
          <NotificationsView
            notifications={notifications}
            onMarkAsRead={(id) => {
              const updated = notifications.map((notif) =>
                notif.id === id ? { ...notif, read: true } : notif
              );
              saveNotifications(updated);
            }}
            onClearAll={() => {
              const updated = notifications.map((notif) => ({ ...notif, read: true }));
              saveNotifications(updated);
            }}
            locale={locale}
          />
        );
      case "settings":
        return (
          <SettingsView
            profile={profile}
            onSave={(updated) => saveProfile(updated)}
            locale={locale}
            setLocale={setLocale}
            onTriggerMarketUpdate={handleTriggerMarketUpdate}
            aiStatus={aiStatus}
            onRecheckAiStatus={recheckAiStatus}
          />
        );
      case "details":
        return activeProduct ? (
          <ProductDetailsView
            product={activeProduct}
            onClose={() => setScreen("home")}
            locale={locale}
            userProfile={profile}
            wishlistItems={wishlist}
            onAddToWishlist={(prod) => {
              const newItem: WishlistItem = {
                id: `wish-${Date.now()}`,
                product: prod,
                alertOnPriceDrop: true,
                alertOnStock: true,
                alertOnCoupon: true,
                dateAdded: new Date().toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US"),
                initialPrice: prod.price.current,
                currentPrice: prod.price.current,
              };
              saveWishlist([newItem, ...wishlist]);
            }}
            onRemoveFromWishlist={(id) => {
              const updated = wishlist.filter((item) => item.id !== id);
              saveWishlist(updated);
            }}
            onOpenCompare={(prod) => {
              setActiveProduct(prod);
              setComparingProduct(null);
              setScreen("comparison");
            }}
            onSelectItem={(prod) => {
              setActiveProduct(prod);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        ) : null;
      case "comparison":
        return activeProduct ? (
          <ComparisonView
            primaryProduct={activeProduct}
            secondaryProduct={comparingProduct}
            onSelectSecondary={(sec) => setComparingProduct(sec)}
            onClose={() => setScreen("details")}
            locale={locale}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-slate-800 flex flex-col justify-between font-sans selection:bg-blue-500/20 selection:text-blue-800">
      

      
      {/* Live OTA Top-down Toast Updates Banner */}
      <AnimatePresence>
        {liveToast && (
          <motion.div
            initial={{ opacity: 0, y: -100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="fixed top-20 inset-x-4 md:left-auto md:right-4 md:w-96 bg-slate-900 border border-slate-800 text-white p-4 rounded-3xl shadow-2xl z-[100] flex gap-3 text-right"
          >
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
              {liveToast.type === "drop" ? (
                <TrendingDown className="w-5 h-5 text-emerald-400" />
              ) : liveToast.type === "coupon" ? (
                <Gift className="w-5 h-5 text-blue-400" />
              ) : liveToast.type === "release" ? (
                <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
              ) : (
                <ShoppingBag className="w-5 h-5 text-indigo-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h5 className="font-extrabold text-xs text-white flex items-center justify-end gap-1.5">
                <span>{liveToast.title}</span>
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping shrink-0" />
              </h5>
              <p className="text-[11px] text-slate-300 leading-relaxed mt-1 line-clamp-2">
                {liveToast.body}
              </p>
              <div className="flex gap-2 justify-end mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setLiveToast(null);
                  }}
                  className="text-[10px] font-bold text-slate-400 hover:text-white px-2 py-1 rounded hover:bg-white/5 transition-colors cursor-pointer"
                >
                  {locale === "ar" ? "تجاهل" : "Dismiss"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLiveToast(null);
                    setScreen("notifications");
                  }}
                  className="text-[10px] font-black text-blue-400 hover:text-blue-300 px-2 py-1 rounded hover:bg-blue-500/10 transition-colors cursor-pointer"
                >
                  {locale === "ar" ? "عرض التنبيهات" : "View Alerts"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 1. Splash Overlay */}
      <AnimatePresence>
        {screen === "splash" && (
          <Splash
            locale={locale}
            onComplete={() => setScreen("onboarding")}
          />
        )}
      </AnimatePresence>

      {/* 2. Onboarding Setup */}
      <AnimatePresence>
        {screen === "onboarding" && (
          <Onboarding
            locale={locale}
            onComplete={(newProfile) => {
              saveProfile(newProfile);
              setScreen("login");
            }}
          />
        )}
      </AnimatePresence>

      {/* 3. Personalization / Login */}
      <AnimatePresence>
        {screen === "login" && (
          <Login
            locale={locale}
            onLogin={(name, updatedProfile) => {
              saveProfile({ ...updatedProfile, name });
              setScreen("home");
            }}
          />
        )}
      </AnimatePresence>

      {/* 5. Central workspace header for tabs */}
      {["home", "wishlist", "history", "notifications", "settings", "details", "comparison"].includes(screen) && (
        <>
          <header className="p-4 bg-white/90 backdrop-blur-md border-b border-slate-100 sticky top-0 flex justify-between items-center z-20 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xs tracking-widest text-slate-400 font-mono">V1.0</span>
            </div>

            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {translations[locale].appName}
              </h1>
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-sm">
                <Sparkles className="w-4 h-4 text-white fill-white" />
              </div>
            </div>
          </header>

          {/* Main workspace container */}
          <main className="flex-1 py-8 max-w-3xl mx-auto w-full relative">
            {renderCurrentView()}
          </main>

          {/* Luxury bottom native iOS/Android navigation tab bar */}
          <footer className="sticky bottom-0 bg-white/95 backdrop-blur-md border-t border-slate-100 p-3 flex justify-around items-center z-20 shadow-[0_-1px_3px_rgba(0,0,0,0.02)]">
            {/* Tab 1: Home */}
            <button
              onClick={() => setScreen("home")}
              className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
                screen === "home" ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[9px] font-bold">{locale === "ar" ? "الرئيسية" : "Home"}</span>
            </button>

            {/* Tab 2: Wishlist */}
            <button
              onClick={() => setScreen("wishlist")}
              className={`flex flex-col items-center gap-1 cursor-pointer transition-colors relative ${
                screen === "wishlist" ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <Heart className="w-5 h-5" />
              <span className="text-[9px] font-bold">{locale === "ar" ? "الأمنيات" : "Wishlist"}</span>
              {wishlist.length > 0 && (
                <div className="absolute top-0 right-1 w-2 h-2 bg-blue-600 rounded-full" />
              )}
            </button>

            {/* Tab 3: History */}
            <button
              onClick={() => setScreen("history")}
              className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
                screen === "history" ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <History className="w-5 h-5" />
              <span className="text-[9px] font-bold">{locale === "ar" ? "السجل" : "History"}</span>
            </button>

            {/* Tab 4: Notifications */}
            <button
              onClick={() => setScreen("notifications")}
              className={`flex flex-col items-center gap-1 cursor-pointer transition-colors relative ${
                screen === "notifications" ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <Bell className="w-5 h-5" />
              <span className="text-[9px] font-bold">{locale === "ar" ? "التنبيهات" : "Alerts"}</span>
              {notifications.some((n) => !n.read) && (
                <div className="absolute top-0 right-2 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>

            {/* Tab 5: Settings */}
            <button
              onClick={() => setScreen("settings")}
              className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
                screen === "settings" ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="text-[9px] font-bold">{locale === "ar" ? "الإعدادات" : "Settings"}</span>
            </button>
          </footer>
        </>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-white/95 z-50 flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <RefreshCw className="w-12 h-12 text-blue-600 animate-spin" />
            <Sparkles className="w-5 h-5 text-indigo-500 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <div className="text-center space-y-1.5 px-6 max-w-sm">
            <p className="font-extrabold text-base text-slate-900">{translations[locale].analyzingProduct}</p>
            <p className="text-xs text-slate-500 leading-relaxed">
              {locale === "ar"
                ? "نقوم بمسح تقييمات المشترين، ومقارنة عروض المتاجر وتوقع الميزانية المثالية لك بالذكاء الاصطناعي..."
                : "Parsing true user reviews, computing price histories, and personalizing purchase suggestions..."}
            </p>
          </div>
        </div>
      )}

      {/* Network Error Dialog */}
      {errorMsg && (
        <div className="fixed inset-x-6 bottom-24 md:left-auto md:right-6 md:w-96 bg-red-50 border border-red-100 p-4 rounded-2xl shadow-lg z-50 flex items-start gap-3 text-right">
          <div className="w-10 h-10 rounded-xl bg-red-100/50 flex items-center justify-center text-red-600 shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="flex-1 space-y-1">
            <h5 className="font-bold text-xs text-red-900">
              {locale === "ar" ? "فشل الاتصال بالذكاء الاصطناعي" : "AI connection failed"}
            </h5>
            <p className="text-[11px] text-red-600 leading-relaxed">{errorMsg}</p>
            <button
              onClick={() => setErrorMsg("")}
              className="text-[10px] font-bold text-slate-500 hover:text-slate-800 underline pt-1 block cursor-pointer"
            >
              {locale === "ar" ? "حسناً" : "Close"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
