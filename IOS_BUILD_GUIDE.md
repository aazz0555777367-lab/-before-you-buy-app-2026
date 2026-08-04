# 📱 دليل بناء ورفع تطبيق "قبل تشتري" إلى Apple App Store

تم تجهيز هذا المشروع بالكامل بأحدث التقنيات (`Capacitor 8` + `iOS Native Configuration`) لتشغيله كتطبيق **iOS أصيل (Native iOS App)** يعتمد على محرك WebKit متكامل بحواشي الأمان (Safe Areas) ودعم النوتش والشريط السفلي لـ iPhone دون الحاجة لتغيير كود التطبيق أو تصميمه الحالي.

---

## ⚙️ البيانات والترخيص الأساسية

- **اسم التطبيق الرسمي (App Name):** `قبل تشتري` | `Before You Buy`
- **معرّف الحزمة (Bundle ID):** `com.beforeyoubuy.app`
- **حساب المطور المعتمد:** Apple Developer Program
- **المنصات المدعومة:** iOS 15.0+ (iPhone, iPad)

---

## 🚀 الطريقة الأولى: البناء والرفع إلى App Store Connect بدون جهاز Mac (Cloud Build)

بفضل ملف **GitHub Actions** المدمج في المشروع داخل المجلد `/.github/workflows/ios-build.yml` والأدوات السحابية المتقدمة، يمكنك رفع التطبيق لـ App Store دون الحاجة لامتلاك Mac:

### الخطوة 1: تصدير المشروع ورَفْعه إلى GitHub
1. قم بتصدير المشروع من AI Studio (عبر خيار Export / GitHub في القائمة).
2. ارفع الكود إلى مستودع جديد على حسابك في **GitHub**.

### الخطوة 2: التشغيل التلقائي عبر GitHub Actions
1. فور رفع الكود إلى فرع `main` أو `master`، سينطلق أمر البناء السحابي تلقائياً في سيرفرات Apple macOS المتوفرة مجاناً في GitHub.
2. انتقل إلى تبويب **Actions** في مستودعك على GitHub.
3. ستجد عمل البناء قيد التشغيل وسيقوم بإنشاء ملف **`App.xcarchive`** أوتوماتيكياً وتجهيزه للرفع.

### الخطوة 3: النشر التلقائي عبر Codemagic (مجاني وسريع)
لرفع التطبيق مباشرة إلى App Store Connect بدون Mac:
1. قم والتسجيل في موقع [Codemagic.io](https://codemagic.io) (يوفر دقائق بناء مجانية لـ iOS).
2. اربط مستودع GitHub الخاص بالمشروع.
3. أضف مفتاح App Store Connect API من حسابك في Apple Developer.
4. اضغط على **Start Build** وستقوم المنصة بإنشاء شهادة التوقيع ورفع الملف تلقائياً إلى **TestFlight** و **App Store Connect**.

---

## 🛠️ الطريقة الثانية: البناء والتصدير باستخدام جهاز Mac و Xcode

إذا كان لديك جهاز Mac أو تريد فتح المشروع وتعديل الشهادات يدوياً:

### الخطوات:
1. **تثبيت التبعيات وبناء الـ Web Bundle:**
   ```bash
   npm install
   npm run build
   ```

2. **إضافة منصة iOS وتنسيقها:**
   ```bash
   npx cap add ios
   npm run cap:sync
   ```

3. **فتح المشروع في Xcode:**
   ```bash
   npm run cap:open
   ```

4. **إعداد الشهادات والنشر في Xcode:**
   - من شريط المشروع الجانبي اختر `App`.
   - في تبويب `Signing & Capabilities`:
     - قم بتحديد فريق التطوير الخاص بك (**Team**).
     - تأكد من أن الـ Bundle Identifier هو: `com.beforeyoubuy.app`.
   - من القائمة العلوية اختر الهدف: **Any iOS Device (arm64)**.
   - اختر **Product** -> **Archive**.
   - عند اكتمال البناء، اضغط **Distribute App** واختر **App Store Connect** ثم **Upload**.

---

## ✨ التحسينات المدمجة لتجربة iOS الأصيلة
- **Safe Area Insets:** معالجة التداخل مع النوتش السفلي والعلوي لـ iPhone باستخدام `viewport-fit=cover`.
- **Status Bar Style:** شريط علوي أنيق بلون أسود شفاف متناسق مع النمط الداكن للتطبيق.
- **Auto Splash Screen:** شاشة دخول سينمائية متوافقة مع معايير Apple.
- **Native Fullscreen:** تجربة تطبيق أصيل كامل الشاشة بدون عناصر متصفح.
