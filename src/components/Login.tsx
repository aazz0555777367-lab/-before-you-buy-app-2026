import { useState, FormEvent } from "react";
import { motion } from "motion/react";
import { Sparkles, ShieldCheck, Mail, Lock } from "lucide-react";
import { translations } from "../translations";
import { UserProfile } from "../types";

interface LoginProps {
  onLogin: (userName: string, profile: UserProfile) => void;
  locale: "ar" | "en";
}

export default function Login({ onLogin, locale }: LoginProps) {
  const t = translations[locale];
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(locale === "ar" ? "الرجاء إدخال اسمك لتخصيص التجربة" : "Please enter your name to personalize");
      return;
    }

    const defaultProfile: UserProfile = {
      name: name,
      isStudent: false,
      usage: "casual",
      budget: "medium",
      notificationsEnabled: true,
      locale,
      theme: "dark",
    };

    onLogin(name, defaultProfile);
  };

  const handleGuest = () => {
    const defaultProfile: UserProfile = {
      name: locale === "ar" ? "ضيف مميز" : "Special Guest",
      isStudent: false,
      usage: "casual",
      budget: "medium",
      notificationsEnabled: true,
      locale,
      theme: "dark",
    };
    onLogin(defaultProfile.name, defaultProfile);
  };

  return (
    <div className="fixed inset-0 bg-[#F8F9FC] text-slate-800 flex flex-col justify-center items-center z-30 p-6 overflow-y-auto font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,rgba(248,249,252,0)_100%)] pointer-events-none" />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white border border-slate-200/80 p-8 rounded-3xl relative z-10 space-y-6 shadow-md"
      >
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">{t.loginTitle}</h2>
          <p className="text-sm text-slate-500">{t.loginSubtitle}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              {locale === "ar" ? "اسمك الثنائي" : "Full Name"}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              placeholder={locale === "ar" ? "اكتب اسمك لتخاطبك به الذكاء الاصطناعي..." : "Enter your name..."}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-right"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              {locale === "ar" ? "البريد الإلكتروني (اختياري)" : "Email (Optional)"}
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all pl-10"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              {locale === "ar" ? "كلمة المرور (اختياري)" : "Password (Optional)"}
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all pl-10"
              />
            </div>
          </div>

          {error && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg p-3 text-right font-medium">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 active:scale-98 transition-all shadow-sm cursor-pointer"
          >
            {t.loginBtn}
          </button>
        </form>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-100" />
          <span className="flex-shrink mx-4 text-slate-400 text-xs font-mono uppercase tracking-wider">أو</span>
          <div className="flex-grow border-t border-slate-100" />
        </div>

        <button
          onClick={handleGuest}
          className="w-full py-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-medium hover:bg-slate-100 transition-all cursor-pointer"
        >
          {t.guestBtn}
        </button>
      </motion.div>
    </div>
  );
}
