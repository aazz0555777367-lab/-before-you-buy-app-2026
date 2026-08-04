import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, ArrowLeft, ArrowRight, Sparkles, GraduationCap, Gamepad2, Briefcase, Camera, ShieldAlert } from "lucide-react";
import { translations } from "../translations";
import { UserProfile } from "../types";

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
  locale: "ar" | "en";
}

export default function Onboarding({ onComplete, locale }: OnboardingProps) {
  const t = translations[locale];
  const isRtl = locale === "ar";

  const [step, setStep] = useState(1);
  const [isStudent, setIsStudent] = useState<boolean>(false);
  const [usage, setUsage] = useState<"gaming" | "work" | "photography" | "casual">("casual");
  const [budget, setBudget] = useState<string>("medium");

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete({
        name: isStudent ? "طالب ذكي" : "مشتري ذكي",
        isStudent,
        usage,
        budget,
        notificationsEnabled: true,
        locale,
        theme: "dark",
      });
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const usageOptions = [
    { id: "casual", name: t.casual, icon: Sparkles, color: "from-blue-500 to-indigo-600" },
    { id: "gaming", name: t.gaming, icon: Gamepad2, color: "from-red-500 to-pink-600" },
    { id: "work", name: t.work, icon: Briefcase, color: "from-amber-500 to-yellow-600" },
    { id: "photography", name: t.photography, icon: Camera, color: "from-emerald-500 to-teal-600" },
  ];

  return (
    <div className="fixed inset-0 bg-[#F8F9FC] text-slate-800 flex flex-col justify-between z-40 p-6 md:p-12 overflow-y-auto font-sans">
      {/* Background ambient lights */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Header */}
      <div className="flex justify-between items-center relative z-10">
        <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
          {step} / 3 • {t.userProfile}
        </span>
        <button
          onClick={() => {
            onComplete({
              name: "مشتري ذكي",
              isStudent: false,
              usage: "casual",
              budget: "medium",
              notificationsEnabled: true,
              locale,
              theme: "light",
            });
          }}
          className="text-sm text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          {t.skip}
        </button>
      </div>

      {/* Main Content Area */}
      <div className="max-w-md w-full mx-auto my-auto relative z-10 py-8">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ x: isRtl ? -50 : 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: isRtl ? 50 : -50, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md">
                <ShieldAlert className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                تجنب ندم الشراء للأبد!
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                ملايين الأشخاص يشترون منتجات ليكتشفوا لاحقاً أنها غالية، أو توجد نسخة أحدث، أو بدائل أفضل، أو مراجعات مضللة.
                <br />
                <strong className="text-slate-900 mt-2 block font-bold">
                  تطبيق (قبل تشتري) يحل كل ذلك في 10 ثوانٍ!
                </strong>
              </p>

              {/* Student status question */}
              <div className="pt-6 border-t border-slate-200 space-y-4">
                <label className="block text-sm font-medium text-slate-700">
                  {t.studentStatus}
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setIsStudent(true)}
                    className={`flex items-center justify-center gap-2 py-4 px-4 rounded-xl border transition-all cursor-pointer shadow-xs ${
                      isStudent
                        ? "bg-blue-600 text-white border-blue-600 font-semibold"
                        : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <GraduationCap className="w-5 h-5" />
                    <span>نعم، طالب/ة</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsStudent(false)}
                    className={`flex items-center justify-center py-4 px-4 rounded-xl border transition-all cursor-pointer shadow-xs ${
                      !isStudent
                        ? "bg-blue-600 text-white border-blue-600 font-semibold"
                        : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <span>لا، موظف/عام</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ x: isRtl ? -50 : 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: isRtl ? 50 : -50, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
                {t.mainUsage}
              </h2>
              <p className="text-slate-600 text-sm">
                سنقوم بفلترة نصائح وتوصيات المنتجات والبدائل لتناسب اهتماماتك ومجال تركيزك بدقة فائقة.
              </p>

              <div className="space-y-3">
                {usageOptions.map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setUsage(opt.id as any)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer shadow-xs ${
                        usage === opt.id
                          ? "bg-white border-blue-500 text-slate-950"
                          : "bg-white border-slate-200/85 text-slate-500 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${opt.color} flex items-center justify-center text-white`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-slate-800">{opt.name}</span>
                      </div>
                      {usage === opt.id && (
                        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ x: isRtl ? -50 : 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: isRtl ? 50 : -50, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
                ما هو نطاق ميزانيتك للمشتريات التقنية واليومية؟
              </h2>
              <p className="text-slate-600 text-sm">
                لنقترح لك بدائل أرخص أو أعلى تناسب جيبك وقدرتك الشرائية دون إرهاق مالي.
              </p>

              <div className="grid grid-cols-1 gap-4">
                {[
                  { id: "low", title: "ميزانية اقتصادية 📉", desc: "أبحث دائماً عن البدائل الأرخص وأفضل قيمة مقابل السعر" },
                  { id: "medium", title: "ميزانية متوسطة 📊", desc: "أوازن بين الجودة الممتازة والسعر المناسب دون مبالغة" },
                  { id: "high", title: "ميزانية فاخرة 👑", desc: "أفضل الميزات والكماليات وأحدث الموديلات بغض النظر عن السعر" }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setBudget(item.id)}
                    className={`text-right w-full p-5 rounded-2xl border transition-all cursor-pointer shadow-xs ${
                      budget === item.id
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                    }`}
                  >
                    <div className="font-bold text-base mb-1">{item.title}</div>
                    <div className="text-xs opacity-90">{item.desc}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center relative z-10 max-w-md w-full mx-auto">
        {step > 1 ? (
          <button
            onClick={handleBack}
            className="flex items-center gap-2 py-3 px-6 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-all cursor-pointer bg-white shadow-xs"
          >
            {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>السابق</span>
          </button>
        ) : (
          <div />
        )}

        <button
          onClick={handleNext}
          className="flex items-center gap-2 py-4 px-8 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 active:scale-95 transition-all cursor-pointer shadow-sm"
        >
          <span>{step === 3 ? t.getStarted : t.next}</span>
          {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
