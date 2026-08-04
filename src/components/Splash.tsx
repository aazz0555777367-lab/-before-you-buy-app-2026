import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { translations } from "../translations";

interface SplashProps {
  onComplete: () => void;
  locale: "ar" | "en";
}

export default function Splash({ onComplete, locale }: SplashProps) {
  const t = translations[locale];

  return (
    <div className="fixed inset-0 bg-[#F8F9FC] text-slate-800 flex flex-col items-center justify-center z-50 overflow-hidden select-none">
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,rgba(248,249,252,0)_100%)] pointer-events-none" />

      <div className="relative flex flex-col items-center max-w-md px-6 text-center">
        {/* Animated Icon Container */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: [0.5, 1.1, 1], opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md mb-8"
        >
          <Sparkles className="w-12 h-12 text-white stroke-[2]" />
        </motion.div>

        {/* App Name */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-4xl font-extrabold tracking-tight bg-gradient-to-b from-slate-900 to-slate-700 bg-clip-text text-transparent font-sans"
        >
          {t.appName}
        </motion.h1>

        {/* App Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="text-sm font-mono mt-2 uppercase tracking-widest text-slate-400"
        >
          {t.appSubtitle}
        </motion.p>

        {/* Tagline */}
        <motion.p
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 0.8 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="text-slate-600 text-sm mt-6 leading-relaxed"
        >
          {t.splashText}
        </motion.p>

        {/* Loader or Start Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="mt-12 w-full"
        >
          <button
            onClick={onComplete}
            className="w-full py-4 px-8 rounded-2xl bg-blue-600 text-white font-medium text-base shadow-sm hover:bg-blue-700 active:scale-98 transition-all duration-300 cursor-pointer"
          >
            {t.getStarted}
          </button>
        </motion.div>
      </div>

      {/* Decorative footer */}
      <div className="absolute bottom-6 text-xs text-slate-400 font-mono">
        © 2026 Before You Buy Global Inc.
      </div>
    </div>
  );
}
