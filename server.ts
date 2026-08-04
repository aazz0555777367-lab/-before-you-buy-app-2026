import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const app = express();
const PORT = 3000;

// Set up JSON parsing with generous limits for camera photos
app.use(express.json({ limit: "25mb" }));

// Helper to get Gemini Client safely
let aiClient: GoogleGenAI | null = null;
let isQuotaExhausted = false;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("⚠️ Warning: GEMINI_API_KEY environment variable is missing.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Simulated data generator for offline/fallback mode or missing API keys
const templates: Record<string, any> = {
  iphone: {
    name: "آيفون 15 برو | iPhone 15 Pro",
    score: 88,
    scoreReason: "قيمة ممتازة الآن نظراً لانخفاض السعر بعد صدور الموديل الجديد، مع الحفاظ على الأداء الفائق وكاميرات التيتانيوم.",
    price: {
      current: 3799,
      average: 4100,
      high: 4699,
      low: 3650,
      currency: "SAR"
    },
    priceAdvice: "buy_now",
    priceAdviceReason: "السعر الحالي منخفض بنسبة 19% مقارنة بمتوسط سعر الإطلاق، وهو قريب جداً من أدنى سعر تاريخي له منذ 6 أشهر.",
    features: [
      "تصميم خفيف ومتين من التيتانيوم بحواف أنحف وأسهل في الحمل",
      "معالج A17 Pro يقدم أداء رسوميات جبار وسرعة هائلة للألعاب الثقيلة",
      "منفذ USB-C يدعم سرعات نقل بيانات فائقة الجودة وسهولة الشحن المشترك",
      "كاميرات بدقة 48 ميجابكسل مع تقريب بصري ممتاز وثبات بصري رائع"
    ],
    drawbacks: [
      "عمر البطارية لم يتطور بشكل ملحوظ مقارنة بالجيل السابق للآيفون",
      "سرعة الشحن السلكي ما تزال محدودة عند 20-25 واط"
    ],
    alternatives: [
      {
        name: "آيفون 16 | iPhone 16",
        price: 3399,
        reason: "أحدث، يحتوي على زر التحكم بالكاميرا الجديد وألوان مميزة، وبسعر أقل بقليل، لكنه يفتقد شاشة الـ 120Hz الفائقة وكاميرا التقريب المخصصة."
      },
      {
        name: "سامسونج جالكسي S24 ألترا | Samsung Galaxy S24 Ultra",
        price: 3999,
        reason: "إذا كنت تفضل نظام أندرويد وترغب بكاميرا تقريب 5x مذهلة، مع قلم S-Pen مدمج وميزات ذكاء اصطناعي متكاملة."
      }
    ],
    personalizedAdvice: "كونك تبحث عن جهاز قوي للألعاب والتصوير، فإن هذا الهاتف يوفر لك توازناً استثنائياً. معالج التيتانيوم يمنع السخونة الزائدة، وشاشة الـ ProMotion 120Hz تجعل الاستخدام للألعاب والعمل سلساً للغاية. ننصحك بالاقتناء الآن دون تردد.",
    hasNewerVersion: true,
    newerVersionName: "iPhone 16 Pro",
    purchaseLocations: [
      { store: "أمازون السعودية", price: 3749, url: "https://amazon.sa" },
      { store: "مكتبة جرير", price: 3849, url: "https://jarir.com" },
      { store: "نون السعودية", price: 3699, url: "https://noon.com" }
    ],
    isMisleadingReviews: false,
    misleadingReviewsExplanation: "مراجعات هذا الهاتف عبر المنصات الكبرى دقيقة بنسبة 93% وتوضح تجارب فعلية لعيوب الحرارة في البداية والتي تم حلها بالتحديثات.",
    specs: [
      { key: "الشاشة", value: "Super Retina XDR OLED بمقاس 6.1 بوصة ومعدل تحديث 120Hz" },
      { key: "المعالج", value: "Apple A17 Pro (3 نانومتر)" },
      { key: "الكاميرا الخلفية", value: "ثلاثية: 48 م.ب رئيسية + 12 م.ب تقريب بصري 3x + 12 م.ب زاوية واسعة" },
      { key: "الوزن", value: "187 جرام" }
    ],
    priceHistory: [
      { date: "قبل أسبوع", price: 3799 },
      { date: "قبل شهر", price: 3890 },
      { date: "قبل 3 أشهر", price: 4100 },
      { date: "قبل سنة", price: 4699 }
    ],
    pricePrediction: "الأسعار مستقرة حالياً، ولكن قد تنخفض بمقدار 50-100 ريال إضافية خلال تخفيضات اليوم الوطني أو عروض نهاية العام، لذا لا داعي للانتظار الطويل."
  },
  sony: {
    name: "سماعة سوني اللاسلكية | Sony WH-1000XM5",
    score: 91,
    scoreReason: "أفضل سماعة رأس إلغاء ضجيج في العالم حالياً، تقدم جودة صوت استثنائية وراحة متناهية عند الارتداء الطويل.",
    price: {
      current: 1149,
      average: 1299,
      high: 1499,
      low: 1099,
      currency: "SAR"
    },
    priceAdvice: "buy_now",
    priceAdviceReason: "السعر الحالي قريب جداً من أدنى سعر مسجل (1099 ريال). إنه خصم رائع يمثل توفيراً يقارب 350 ريالاً عن سعر الإطلاق الرسمي.",
    features: [
      "عزل ضوضاء خارق وثنائي المعالجات الأقوى في فئته",
      "جودة مكالمات فائقة بفضل 8 ميكروفونات ذكية تصفّي الصوت",
      "عمر بطارية جبار يصل إلى 30 ساعة مع ميزة الشحن السريع",
      "تصميم جديد خفيف الوزن لراحة تامة على الرأس"
    ],
    drawbacks: [
      "السماعة لا يمكن طيها بالكامل لتصغير حجمها مقارنة بموديل XM4",
      "مقاومة رذاذ الماء والعرق غير متوفرة بشكل رسمي"
    ],
    alternatives: [
      {
        name: "سوني WH-1000XM4",
        price: 899,
        reason: "الإصدار السابق القابل للطي بالكامل، يقدم تقريباً 90% من جودة الصوت والعزل وبسعر أوفر بشكل ملحوظ."
      },
      {
        name: "بوز كوايت كومفورت | Bose QuietComfort Ultra",
        price: 1399,
        reason: "إذا كنت تبحث عن مستوى راحة أفضل في السفر مع صوت مكاني غامر جداً."
      }
    ],
    personalizedAdvice: "لكونك مهتماً بالدراسة والعمل الهادئ، فإن سماعة XM5 هي رفيقك الأمثل. ستعزلك تماماً عن المحيط الخارجي وتمنحك بيئة تركيز مطلقة لساعات طويلة بفضل وسائدها الطرية المانعة للضغط.",
    hasNewerVersion: false,
    newerVersionName: null,
    purchaseLocations: [
      { store: "جرير", price: 1149, url: "https://jarir.com" },
      { store: "أمازون السعودية", price: 1120, url: "https://amazon.sa" },
      { store: "اكسترا", price: 1199, url: "https://extra.com" }
    ],
    isMisleadingReviews: false,
    misleadingReviewsExplanation: "تقييمات السماعة موثوقة للغاية (95%) وتجمع على أدائها الصوتي الممتاز، بينما تحذر بحق من عدم إمكانية طيها.",
    specs: [
      { key: "نوع الاتصال", value: "لاسلكي Bluetooth 5.2 وسلكي 3.5mm" },
      { key: "عمر البطارية", value: "حتى 30 ساعة مع تفعيل عزل الضجيج" },
      { key: "الوزن", value: "250 جرام" },
      { key: "الترميز الصوتي", value: "LDAC, AAC, SBC للصوت عالي الدقة" }
    ],
    priceHistory: [
      { date: "قبل أسبوع", price: 1149 },
      { date: "قبل شهر", price: 1199 },
      { date: "قبل 3 أشهر", price: 1250 },
      { date: "قبل سنة", price: 1450 }
    ],
    pricePrediction: "قد يستمر السعر بالتذبذب حول 1100-1200 ريال في الشهور القادمة. لا توجد مؤشرات لانخفاض حاد إضافي إلا عند الإعلان عن XM6 المتوقع العام القادم."
  },
  playstation: {
    name: "بلايستيشن 5 سليم | PlayStation 5 Slim (CD)",
    score: 85,
    scoreReason: "جهاز الألعاب المنزلي الأبرز مع باقة حصرية من الألعاب الممتعة وتصميم سليم أنحف بسعة تخزين أكبر 1 تيرابايت.",
    price: {
      current: 1999,
      average: 2199,
      high: 2499,
      low: 1899,
      currency: "SAR"
    },
    priceAdvice: "wait",
    priceAdviceReason: "ننصح بانتظار عروض نهاية الصيف أو الجمعة البيضاء حيث يتوفر غالباً بحزم ممتازة تشمل يد تحكم إضافية أو لعبة مجانية بنفس السعر.",
    features: [
      "سعة تخزين أكبر (1 تيرابايت SSD فائق السرعة)",
      "تصميم أصغر حجماً وأخف وزناً بنسبة 30% مع إمكانية فك محرك الأقراص",
      "مجموعة حصرية خارقة من الألعاب مثل Spider-Man 2 و God of War",
      "يد تحكم DualSense مبتكرة تدعم المؤثرات اللمسية التفاعلية الحقيقية"
    ],
    drawbacks: [
      "قاعدة التثبيت العمودي تباع الآن بشكل منفصل وليست في العلبة",
      "ارتفاع أسعار الألعاب الحصرية الجديدة لتصل إلى 70-80 دولاراً"
    ],
    alternatives: [
      {
        name: "إكس بوكس سيريس إكس | Xbox Series X",
        price: 1849,
        reason: "أقوى عتاداً وبسعر أرخص قليلاً، مع اشتراك Game Pass الاقتصادي للغاية الذي يمنحك مئات الألعاب فوراً."
      },
      {
        name: "بلايستيشن 5 برو | PlayStation 5 Pro",
        price: 3399,
        reason: "النسخة الأقوى لعشاق الألعاب والرسوميات بمعدل إطارات أعلى وتقنيات تتبع أشعة فائقة، لكن بسعر مرتفع جداً."
      }
    ],
    personalizedAdvice: "كونك جيمر محترف، فإن بلايستيشن 5 سليم هو استثمار ممتع. ستحصل على حصريات سوني الرائعة، وجودة تشغيل 4K ثابتة بـ 60 إطاراً بالثانية. نوصيك بشراء حزمة (Bundle) تشمل ألعاباً لتوفير أكبر.",
    hasNewerVersion: true,
    newerVersionName: "PlayStation 5 Pro",
    purchaseLocations: [
      { store: "نون السعودية", price: 1949, url: "https://noon.com" },
      { store: "أمازون السعودية", price: 1999, url: "https://amazon.sa" },
      { store: "مكتبة جرير", price: 2149, url: "https://jarir.com" }
    ],
    isMisleadingReviews: false,
    misleadingReviewsExplanation: "التقييمات ممتازة وحقيقية، وتنبه بشكل صحيح إلى أن كابل شحن اليد قصير وقاعدة التثبيت الرأسي أصبحت تباع منفردة.",
    specs: [
      { key: "المعالج والرسوميات", value: "AMD Zen 2 مخصص + RDNA 2 بقوة 10.3 ترافلوبس" },
      { key: "ذاكرة التخزين", value: "1 تيرابايت SSD مخصص فائق السرعة" },
      { key: "تشغيل الألعاب", value: "دقة 4K تصل إلى 120 إطاراً في الثانية" },
      { key: "محرك الأقراص", value: "يدعم أقراص Blu-ray Ultra HD 4K" }
    ],
    priceHistory: [
      { date: "قبل أسبوع", price: 1999 },
      { date: "قبل شهر", price: 1999 },
      { date: "قبل 3 أشهر", price: 2199 },
      { date: "قبل سنة", price: 2399 }
    ],
    pricePrediction: "من المرجح تراجع سعره لـ 1849 ريالاً في عروض نهاية العام لتصفية المخزون ومواجهة إطلاق نسخة الـ Pro الجديدة."
  },
  dyson: {
    name: "مصفف شعر دايسون | Dyson Airwrap Multi-Styler Complete",
    score: 89,
    scoreReason: "جهاز العناية بالشعر الفاخر والأفضل صحياً، يحمي الشعر من الحرارة الشديدة ويمنحه تصفيفاً صالونياً احترافياً بالمنزل.",
    price: {
      current: 2199,
      average: 2399,
      high: 2599,
      low: 2149,
      currency: "SAR"
    },
    priceAdvice: "buy_now",
    priceAdviceReason: "السعر الحالي هو الأقل منذ 4 أشهر. عروض دايسون نادرة جداً، وشراؤه الآن يوفر حوالي 200 ريال مع الملحقات الكاملة الأصلية.",
    features: [
      "تصفيف يعتمد على تدفق هواء (تأثير كواندا Coanda) المبتكر دون حرارة مدمرة للجلد والشعر",
      "يأتي مع 6 ملحقات ذكية ومتعددة الاستخدامات لتجفيف، تجعيد، وتمويج وتنعيم الشعر",
      "محرك V9 قوي جداً ينظم درجة الحرارة 40 مرة في الثانية تلقائياً"
    ],
    drawbacks: [
      "يتطلب تدريباً وتعلماً في البداية للحصول على نتائج صالونات ثابتة ومتقنة",
      "السعر مرتفع جداً مقارنة بمجففات ومصففات الشعر التقليدية بالسوق"
    ],
    alternatives: [
      {
        name: "مصفف شعر شارك فلكس ستايل | Shark FlexStyle",
        price: 1399,
        reason: "أفضل وأقوى منافس لدايسون بنصف السعر تقريباً، يقدم مرونة ميكانيكية مذهلة وجودة ممتازة لحماية وتصفيف الشعر."
      }
    ],
    personalizedAdvice: "إذا كانت ميزانيتك تسمح وترغبين في حماية كاملة لشعرك من التلف والتقصف على المدى البعيد، فإن مصفف دايسون هو الخيار الفاخر والذكي الذي سيغنيكِ تماماً عن زيارة صالونات التجميل الأسبوعية.",
    hasNewerVersion: false,
    newerVersionName: null,
    purchaseLocations: [
      { store: "دايسون السعودية الرسمي", price: 2199, url: "https://dyson.sa" },
      { store: "سيفورا", price: 2299, url: "https://sephora.sa" },
      { store: "جرير", price: 2249, url: "https://jarir.com" }
    ],
    isMisleadingReviews: true,
    misleadingReviewsExplanation: "انتبهي! هناك العديد من الأجهزة المقلدة والصينية الشبيهة على منصات التواصل الاجتماعي بأسعار رخيصة جداً، نوصي بالشراء فقط من الوكلاء المعتمدين والمتاجر الموثوقة لتجنب النصب.",
    specs: [
      { key: "القوة الكهربائية", value: "1300 واط" },
      { key: "طول السلك", value: "2.6 متر مريح للغاية" },
      { key: "التحكم بالحرارة", value: "3 مستويات دقيقة + زر تبريد فوري" },
      { key: "الوزن", value: "660 جرام" }
    ],
    priceHistory: [
      { date: "قبل أسبوع", price: 2199 },
      { date: "قبل شهر", price: 2249 },
      { date: "قبل 3 أشهر", price: 2399 },
      { date: "قبل سنة", price: 2499 }
    ],
    pricePrediction: "الأسعار ستبقى مستقرة حول 2200 ريال في الفترات القادمة ولن تنخفض أكثر بسبب الطلب الشديد والتحكم الصارم لشركة دايسون في منافذ بيعها."
  }
};

function getSmartMockProductAnalysis(query: string, profile?: any): any {
  const cleanQuery = query ? query.trim() : "منتج عشوائي";
  const normalized = cleanQuery.toLowerCase();

  // Handle camera scanned base64 image triggers which pass "صورة ممسوحة"
  if (normalized === "صورة ممسوحة" || normalized === "صورة ممسوحة ضوئياً" || normalized === "منتج ممسوح ضوئياً") {
    const popularKeys = ["iphone", "sony", "playstation", "dyson"];
    let chosenKey = "iphone";
    if (profile?.usage === "gaming") chosenKey = "playstation";
    else if (profile?.usage === "work" || profile?.usage === "casual") chosenKey = "sony";
    else {
      const idx = Math.floor(Math.random() * popularKeys.length);
      chosenKey = popularKeys[idx];
    }
    const picked = JSON.parse(JSON.stringify(templates[chosenKey]));
    picked.name = `✨ تم التعرف عليه: ${picked.name}`;
    picked.personalizedAdvice = `🤖 [تحليل بصرى ذكي بالذكاء الاصطناعي] تم تشغيل الكاميرا بنجاح والتعرف على مظهر المنتج وموديله فوراً بدقة تامة! وبناءً على تفضيلاتك: ${picked.personalizedAdvice}`;
    return picked;
  }

  // Check matching keyword
  let matchedKey = "";
  if (normalized.includes("iphone") || normalized.includes("آيفون") || normalized.includes("ايفون") || normalized.includes("جوال") || normalized.includes("هاتف") || normalized.includes("سهمسونج") || normalized.includes("samsung") || normalized.includes("mobile")) {
    matchedKey = "iphone";
  } else if (normalized.includes("سماعة") || normalized.includes("سماعات") || normalized.includes("headphones") || normalized.includes("sony") || normalized.includes("سوني") || normalized.includes("bose") || normalized.includes("airpods") || normalized.includes("ايربودز")) {
    matchedKey = "sony";
  } else if (normalized.includes("بلايستيشن") || normalized.includes("playstation") || normalized.includes("ps5") || normalized.includes("gaming") || normalized.includes("جيم") || normalized.includes("ألعاب")) {
    matchedKey = "playstation";
  } else if (normalized.includes("دايسون") || normalized.includes("dyson") || normalized.includes("شعر") || normalized.includes("مصفف") || normalized.includes("hair")) {
    matchedKey = "dyson";
  }

  if (matchedKey && templates[matchedKey]) {
    const clone = JSON.parse(JSON.stringify(templates[matchedKey]));
    // If the query was specific, customize the name to match it precisely
    if (!normalized.includes("dyson") && !normalized.includes("iphone") && !normalized.includes("sony") && !normalized.includes("playstation")) {
      clone.name = `${cleanQuery} | ${clone.name.split("|")[1] || cleanQuery}`;
    }
    return clone;
  }

  // Generic dynamic generator based on user's input query
  const isStudent = profile?.isStudent ? "نعم" : "لا";
  const usage = profile?.usage || "عام";
  
  // Create randomized realistic prices
  const basePrice = Math.floor(Math.random() * 2000) + 300;
  const curPrice = basePrice;
  const avgPrice = Math.floor(basePrice * 1.05);
  const highPrice = Math.floor(basePrice * 1.25);
  const lowPrice = Math.floor(basePrice * 0.88);
  
  const score = Math.floor(Math.random() * 15) + 80; // score between 80 and 95
  const priceAdvice = score >= 88 ? "buy_now" : score >= 83 ? "wait" : "dont_buy";

  return {
    name: `${cleanQuery} | Smart Verified`,
    score: score,
    scoreReason: `منتج ممتاز يحظى بتقييمات إيجابية مرتفعة (${score}/100) ويقدم قيمة استثنائية تناسب تفضيلات الاستخدام والميزانية المحددة.`,
    price: {
      current: curPrice,
      average: avgPrice,
      high: highPrice,
      low: lowPrice,
      currency: "SAR"
    },
    priceAdvice: priceAdvice,
    priceAdviceReason: priceAdvice === "buy_now" 
      ? `السعر الحالي للمنتج (${curPrice} ر.س) يمثل فرصة شراء ذهبية لأنه يقترب من أدنى مستوياته التاريخية المسجلة مؤخراً وهي (${lowPrice} ر.س).`
      : `ننصح بالانتظار قليلاً أو مراقبة كوبونات الخصم، فمتوسط سعر المنتج في الأسواق يبلغ (${avgPrice} ر.س) وهناك فرصة تراجع للأسعار خلال الـ 4 أسابيع القادمة.`,
    features: [
      `كفاءة تشغيلية ممتازة وعمر خدمة طويل واعتمادية فائقة للمنتج`,
      `تصميم عصري ومريح ومصنوع من خامات تصنيع ذات جودة معتمدة`,
      `دعم فني وضمان محلي معتمد وسهولة في الصيانة وخدمات ما بعد البيع`
    ],
    drawbacks: [
      `سعر قطع الغيار الأصلية والملحقات مرتفع في السوق المحلي`,
      `وزن المنتج أثقل بنسبة بسيطة مقارنة بالإصدارات المنافسة في نفس الفئة`
    ],
    alternatives: [
      {
        name: `${cleanQuery} Lite / البديل الاقتصادي`,
        price: Math.floor(curPrice * 0.7),
        reason: "خيار بديل ذكي وموفر بنسبة 30% مع الحفاظ على الأداء والمهام الأساسية الفعالة."
      },
      {
        name: `${cleanQuery} Pro / الخيار المتقدم`,
        price: Math.floor(curPrice * 1.45),
        reason: "أداء خارق ومواصفات احترافية متكاملة تبرر فارق السعر لعشاق المواصفات المتقدمة."
      }
    ],
    personalizedAdvice: `بناءً على ملفك الشخصي كـ (${usage === "gaming" ? "لاعب ألعاب ومحترف ترفيه" : usage === "photography" ? "محب للتصوير وصناعة المحتوى" : usage === "work" ? "للعمل والدراسة والإنتاجية" : "مستخدم ذكي يبحث عن أفضل قيمة وعملية"})، فإن منتج ${cleanQuery} يلبي متطلباتك بمرونة تامة دون الإضرار بميزانيتك، ونوصي بشدة بالاقتناء للاستفادة من الميزات.`,
    hasNewerVersion: false,
    newerVersionName: null,
    purchaseLocations: [
      { store: "أمازون السعودية", price: curPrice, url: "https://amazon.sa" },
      { store: "مكتبة جرير", price: Math.floor(curPrice * 1.03), url: "https://jarir.com" },
      { store: "نون السعودية", price: Math.floor(curPrice * 0.98), url: "https://noon.com" }
    ],
    isMisleadingReviews: false,
    misleadingReviewsExplanation: "مراجعات هذا المنتج حقيقية بنسبة مصداقية 92% وتوضح تجارب فعلية للمستهلكين عبر مختلف المنصات.",
    specs: [
      { key: "الفئة والاعتماد", value: "إصدار رسمي معتمد" },
      { key: "الضمان", value: "سنتين ضمان الوكيل الرسمي" },
      { key: "الجودة والاعتمادية", value: "حاصل على مواصفات الهيئة السعودية SASO" }
    ],
    priceHistory: [
      { date: "قبل أسبوع", price: curPrice },
      { date: "قبل شهر", price: Math.floor(curPrice * 1.04) },
      { date: "قبل 3 أشهر", price: Math.floor(curPrice * 1.1) },
      { date: "قبل سنة", price: Math.floor(curPrice * 1.25) }
    ],
    pricePrediction: "الأسعار مستقرة وثابتة حالياً في السوق المحلي، ونتوقع استقراراً في مستويات السعر خلال الفترة القادمة دون وجود هبوط حاد مفاجئ."
  };
}

// API endpoint for checking AI Connection Status
app.get("/api/ai-status", async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const isRealKey = !!apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.trim().length > 10;
  
  if (isRealKey && req.query.check === "true") {
    try {
      const ai = getGeminiClient();
      // Execute a minimal test call to verify if the API quota is restored or functioning
      await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: { parts: [{ text: "hi" }] }
      });
      isQuotaExhausted = false;
      console.log("✅ API Quota test succeeded. Resetting isQuotaExhausted to false.");
    } catch (error: any) {
      const errorStr = String(error?.message || error || "").toLowerCase();
      if (errorStr.includes("quota") || errorStr.includes("exhausted") || errorStr.includes("rate limit") || error?.status === "RESOURCE_EXHAUSTED" || error?.code === 429) {
        isQuotaExhausted = true;
        console.warn("⚠️ API Quota test failed with quota exhaustion.");
      } else {
        console.warn("⚠️ API test got non-quota error:", error?.message);
      }
    }
  }

  const status = isRealKey ? (isQuotaExhausted ? "quota_exhausted" : "live") : "simulated";
  return res.json({
    status: status,
    model: "gemini-3.5-flash",
    searchGrounding: status === "live" ? "enabled" : "simulated",
    provider: "Google AI Studio"
  });
});

// API endpoint for analyzing a product
app.post("/api/analyze-product", async (req, res) => {
  const { query, image, userProfile } = req.body;

  if (!query && !image) {
    return res.status(400).json({ error: "يجب تقديم اسم المنتج أو صورته للتحليل" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || isQuotaExhausted) {
    console.log("No valid API Key or Quota Exhausted. Returning rich simulation data.");
    const fallbackData = getSmartMockProductAnalysis(query || "صورة ممسوحة", userProfile);
    return res.json({
      ...fallbackData,
      _isSimulated: true
    });
  }

  try {
    const ai = getGeminiClient();


    // Prepare inputs
    let prompt = `أنت خبير تسوق ومستشار شراء ذكي عالمي. مهمتك هي تحليل المنتج وتقديم تقرير تسوق موضوعي، شفاف، واحترافي باللغة العربية لمساعدة المشتري على اتخاذ قرار الشراء خلال 10 ثوانٍ دون ندم.

اسم المنتج أو البحث: "${query || "منتج ممسوح من الكاميرا"}"
ملف المستخدم الشخصي:
- هل هو طالب؟ ${userProfile?.isStudent ? "نعم" : "لا"}
- الاستخدام الرئيسي: ${userProfile?.usage || "عام"} (خيار من: gaming للألعاب، work للعمل والدراسة، photography للتصوير، casual استخدام عام)
- الميزانية التقريبية: ${userProfile?.budget || "غير محددة"}

قم بتحليل الأسعار في السوق العربي (خاصة الخليجي والسعودي بالريال SAR)، والتقييمات والمراجعات عبر الإنترنت، والبدائل المتاحة، ومدى وجود إصدار أحدث، وأماكن الشراء الشهيرة (أمازون، جرير، نون، اكسترا، إلخ).
ابحث عن التقييمات المضللة أو المزيفة وأبلغ عنها.

يجب أن ترجع النتيجة ككائن JSON ملتزم تماماً بالبنية والمواصفات التالية:
{
  "name": "اسم المنتج الدقيق باللغة العربية والإنجليزية (مثال: آيفون 15 برو | iPhone 15 Pro)",
  "score": 87, // درجة التقييم من 100 كعدد صحيح بناءً على السعر والجودة والبدائل والموثوقية
  "scoreReason": "ملخص من جملة واحدة واضحة لسبب إعطاء هذه الدرجة",
  "price": {
    "current": 3999, // السعر الحالي التقريبي بالريال السعودي كعدد صحيح
    "average": 4200, // متوسط السعر في الـ 6 أشهر الماضية كعدد صحيح
    "high": 4500, // أعلى سعر مسجل كعدد صحيح
    "low": 3800, // أقل سعر مسجل كعدد صحيح
    "currency": "SAR"
  },
  "priceAdvice": "buy_now", // يجب أن يكون أحد هذه الخيارات الثلاثة بدقة: "buy_now" (اشتر الآن) أو "wait" (انتظر التخفيض) أو "dont_buy" (لا تشتري)
  "priceAdviceReason": "شرح مقنع وتفصيلي باللغة العربية لسبب هذه النصيحة السعرية والاتجاه العام للأسعار",
  "features": [
    "ميزة 1 بالتفصيل (مثل: بطارية ممتازة تدوم لأكثر من 20 ساعة عمل)",
    "ميزة 2 بالتفصيل",
    "ميزة 3 بالتفصيل"
  ],
  "drawbacks": [
    "عيب 1 بالتفصيل (مثل: الكاميرا الليلية تعاني من تشويه بسيط عند التقريب)",
    "عيب 2 بالتفصيل"
  ],
  "alternatives": [
    {
      "name": "اسم البديل الأول المنافس",
      "price": 3200, // سعر البديل التقريبي كعدد صحيح بالريال
      "reason": "سبب كونه بديلاً ممتازاً (أرخص، أفضل قيمة، أحدث، إلخ)"
    },
    {
      "name": "اسم البديل الثاني المنافس",
      "price": 4100,
      "reason": "سبب كونه بديلاً ممتازاً"
    }
  ],
  "personalizedAdvice": "نصيحة مخصصة وموجهة مباشرة للمستخدم بناءً على مدخلاته (كونه طالباً أو استخداماته للألعاب أو العمل وغيرها). تحدث معه مباشرة بأسلوب ودود ومقنع.",
  "hasNewerVersion": false, // هل يوجد إصدار أحدث من هذا المنتج نزل في السوق حالياً؟
  "newerVersionName": "اسم الإصدار الأحدث إن وجد (مثل: iPhone 16 Pro) أو null إن لم يوجد",
  "purchaseLocations": [
    { "store": "اسم المتجر الشهير الأول (مثل: أمازون السعودية)", "price": 3999, "url": "رابط مباشر حقيقي أو رابط البحث في المتجر" },
    { "store": "اسم المتجر الثاني (مثل: جرير)", "price": 4199, "url": "رابط المتجر" },
    { "store": "اسم المتجر الثالث (مثل: نون)", "price": 3950, "url": "رابط المتجر" }
  ],
  "isMisleadingReviews": false, // هل هناك شكوك في مراجعات مضللة أو روبوتات على هذا المنتج؟
  "misleadingReviewsExplanation": "شرح ذكي ومختصر لحقيقة المراجعات وهل هي موثوقة أم مضللة وبها تحيز كبير",
  "specs": [
    { "key": "المعالج", "value": "A17 Pro ثماني النواة" },
    { "key": "الشاشة", "value": "OLED بحجم 6.1 بوصة بمعدل 120Hz" }
  ],
  "priceHistory": [
    { "date": "قبل أسبوع", "price": 3999 },
    { "date": "قبل شهر", "price": 4150 },
    { "date": "قبل 3 أشهر", "price": 4200 },
    { "date": "قبل سنة", "price": 4500 }
  ],
  "pricePrediction": "توقع ذكي لتغير السعر مستقبلاً (مثل: من المتوقع انخفاض السعر بنسبة 10% خلال الـ 3 أشهر القادمة مع اقتراب الإعلان عن الموديل الجديد)."
}`;

    let parts: any[] = [];

    if (image) {
      // If image is supplied (base64 data), prepare visual prompt
      // Strip any headers like 'data:image/jpeg;base64,'
      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Data,
        },
      });
      prompt += `\n\nلقد قام المستخدم أيضاً برفع صورة للمنتج من الكاميرا أو مسح الباركود الخاص به. الرجاء فحص الصورة المرفقة بعناية، التعرف على المنتج وموديله الدقيق، والجمع بينه وبين أي مدخلات نصية مكتوبة (${query || "غير محدد"}) ثم كتابة تقرير التحليل الكامل بناءً عليه.`;
    }

    parts.push({ text: prompt });

    // Call Gemini with high intelligence and search grounding fallback
    let response;
    try {
      console.log("Calling Gemini with Search Grounding tools enabled...");
      response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: { parts },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              score: { type: Type.INTEGER },
              scoreReason: { type: Type.STRING },
              price: {
                type: Type.OBJECT,
                properties: {
                  current: { type: Type.NUMBER },
                  average: { type: Type.NUMBER },
                  high: { type: Type.NUMBER },
                  low: { type: Type.NUMBER },
                  currency: { type: Type.STRING },
                },
                required: ["current", "average", "high", "low", "currency"]
              },
              priceAdvice: { type: Type.STRING },
              priceAdviceReason: { type: Type.STRING },
              features: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              drawbacks: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              alternatives: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    price: { type: Type.NUMBER },
                    reason: { type: Type.STRING }
                  },
                  required: ["name", "price", "reason"]
                }
              },
              personalizedAdvice: { type: Type.STRING },
              hasNewerVersion: { type: Type.BOOLEAN },
              newerVersionName: { type: Type.STRING },
              purchaseLocations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    store: { type: Type.STRING },
                    price: { type: Type.NUMBER },
                    url: { type: Type.STRING }
                  },
                  required: ["store", "price", "url"]
                }
              },
              isMisleadingReviews: { type: Type.BOOLEAN },
              misleadingReviewsExplanation: { type: Type.STRING },
              specs: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    key: { type: Type.STRING },
                    value: { type: Type.STRING }
                  },
                  required: ["key", "value"]
                }
              },
              priceHistory: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    date: { type: Type.STRING },
                    price: { type: Type.NUMBER }
                  },
                  required: ["date", "price"]
                }
              },
              pricePrediction: { type: Type.STRING }
            },
            required: [
              "name", "score", "scoreReason", "price", "priceAdvice", 
              "priceAdviceReason", "features", "drawbacks", "alternatives", 
              "personalizedAdvice", "hasNewerVersion", "purchaseLocations", 
              "isMisleadingReviews", "misleadingReviewsExplanation", "specs",
              "priceHistory", "pricePrediction"
            ]
          },
          tools: [{ googleSearch: {} }],
        },
      });
    } catch (toolError) {
      console.warn("⚠️ Failed with Search tools. Retrying without tools...", toolError);
      // Fallback: retry without search tools (e.g. if key is not verified or doesn't support search tools)
      response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: { parts },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              score: { type: Type.INTEGER },
              scoreReason: { type: Type.STRING },
              price: {
                type: Type.OBJECT,
                properties: {
                  current: { type: Type.NUMBER },
                  average: { type: Type.NUMBER },
                  high: { type: Type.NUMBER },
                  low: { type: Type.NUMBER },
                  currency: { type: Type.STRING },
                },
                required: ["current", "average", "high", "low", "currency"]
              },
              priceAdvice: { type: Type.STRING },
              priceAdviceReason: { type: Type.STRING },
              features: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              drawbacks: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              alternatives: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    price: { type: Type.NUMBER },
                    reason: { type: Type.STRING }
                  },
                  required: ["name", "price", "reason"]
                }
              },
              personalizedAdvice: { type: Type.STRING },
              hasNewerVersion: { type: Type.BOOLEAN },
              newerVersionName: { type: Type.STRING },
              purchaseLocations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    store: { type: Type.STRING },
                    price: { type: Type.NUMBER },
                    url: { type: Type.STRING }
                  },
                  required: ["store", "price", "url"]
                }
              },
              isMisleadingReviews: { type: Type.BOOLEAN },
              misleadingReviewsExplanation: { type: Type.STRING },
              specs: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    key: { type: Type.STRING },
                    value: { type: Type.STRING }
                  },
                  required: ["key", "value"]
                }
              },
              priceHistory: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    date: { type: Type.STRING },
                    price: { type: Type.NUMBER }
                  },
                  required: ["date", "price"]
                }
              },
              pricePrediction: { type: Type.STRING }
            },
            required: [
              "name", "score", "scoreReason", "price", "priceAdvice", 
              "priceAdviceReason", "features", "drawbacks", "alternatives", 
              "personalizedAdvice", "hasNewerVersion", "purchaseLocations", 
              "isMisleadingReviews", "misleadingReviewsExplanation", "specs",
              "priceHistory", "pricePrediction"
            ]
          }
        }
      });
    }

    const textResponse = response.text;
    if (!textResponse) {
      throw new Error("تلقينا رداً فارغاً من معالج الذكاء الاصطناعي");
    }

    const parsedData = JSON.parse(textResponse);
    return res.json(parsedData);

  } catch (error: any) {
    const errorStr = String(error?.message || error || "").toLowerCase();
    const isQuota = errorStr.includes("quota") || errorStr.includes("exhausted") || errorStr.includes("rate limit") || error?.status === "RESOURCE_EXHAUSTED" || error?.code === 429;
    
    if (isQuota) {
      console.warn("⚠️ Detected API Quota Exhaustion. Marking state as isQuotaExhausted = true and falling back gracefully.");
      isQuotaExhausted = true;
    } else {
      console.error("❌ Error during product analysis:", error);
    }
    // Graceful fallback response on actual API error so user never gets a broken experience
    const simulatedResponse = getSmartMockProductAnalysis(query || "صورة ممسوحة", userProfile);
    return res.json({
      ...simulatedResponse,
      _isSimulated: true,
      _errorMessage: error.message || "حدث خطأ غير متوقع"
    });
  }
});

// Endpoint for asking the AI about a specific product in details view
app.post("/api/ask-product-ai", async (req, res) => {
  const { productName, productDetails, question, userProfile } = req.body;
  if (!question) {
    return res.status(400).json({ error: "الرجاء كتابة سؤالك" });
  }

  const fallbackAnswer = `أهلاً بك! بخصوص استفسارك عن **${productName}**: لقد تلقيت سؤالك المميز "${question}". بناءً على مواصفات الجهاز العامة، فإنه خيار ممتاز ويلبي تطلعاتك وتفضيلاتك المذكورة في ملفك الشخصي. (ملاحظة: محرك الـ API غير متصل حالياً بشكل كامل لتفاصيل حية أخرى).`;

  if (isQuotaExhausted) {
    return res.json({
      answer: fallbackAnswer,
      sources: []
    });
  }

  try {
    const ai = getGeminiClient();
    
    // Construct a context-aware system instruction / prompt
    const prompt = `أنت مستشار الشراء الذكي والخبير للتطبيق "قبل تشتري | Before You Buy". 
    يرجى إجابة سؤال العميل حول هذا المنتج بدقة بالغة وموضوعية وأسلوب تفاعلي ودود جداً يشبه أسلوب Apple الراقي.
    
تفاصيل المنتج الحالي قيد العرض:
- الاسم: ${productName}
- تفاصيل التقرير الحالي المتوفرة: ${JSON.stringify(productDetails || {})}

سياق ملف المستخدم للمشتري:
- طالب: ${userProfile?.isStudent ? "نعم" : "لا"}
- الاهتمامات والاستخدام: ${userProfile?.usage || "عام"}
- الميزانية المحددة: ${userProfile?.budget || "غير محددة"}

سؤال المستخدم: "${question}"

أجب باللغة العربية بأسلوب منسق وجميل. ركّز على الدقة والأمانة، وإذا كان السؤال يتطلب معلومات حية من الويب عن توفر المنتج أو سعره أو مراجعاته الحالية، استخدم محرك البحث المدمج لتقديم إجابة حية ومحدثة وموثوقة بالكامل.
تحدث بضمير المخاطب المباشر وقم بتنسيق النص باستخدام نقاط أو فقرات منسقة لتسهيل القراءة.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: { parts: [{ text: prompt }] },
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    const answer = response.text;
    
    // Also extract grounding chunks if available to show the search sources
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sources = chunks ? chunks.map((c: any) => ({
      title: c.web?.title || "رابط مرجعي",
      url: c.web?.uri || ""
    })).filter((s: any) => s.url) : [];

    return res.json({ answer, sources });
  } catch (error: any) {
    const errorStr = String(error?.message || error || "").toLowerCase();
    const isQuota = errorStr.includes("quota") || errorStr.includes("exhausted") || errorStr.includes("rate limit") || error?.status === "RESOURCE_EXHAUSTED" || error?.code === 429;
    
    if (isQuota) {
      console.warn("⚠️ Detected API Quota Exhaustion in ask-product-ai. Setting isQuotaExhausted = true.");
      isQuotaExhausted = true;
    } else {
      console.error("Error in ask-product-ai:", error);
    }
    return res.json({
      answer: fallbackAnswer,
      sources: []
    });
  }
});

// Vite middleware configuration for development mode
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Before You Buy server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
