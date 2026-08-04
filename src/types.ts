export interface ProductPrice {
  current: number;
  average: number;
  high: number;
  low: number;
  currency: string;
}

export interface AlternativeProduct {
  name: string;
  price: number;
  reason: string;
}

export interface PurchaseLocation {
  store: string;
  price: number;
  url: string;
}

export interface ProductSpec {
  key: string;
  value: string;
}

export interface PriceHistoryPoint {
  date: string;
  price: number;
}

export interface ProductAnalysis {
  name: string;
  score: number;
  scoreReason: string;
  price: ProductPrice;
  priceAdvice: "buy_now" | "wait" | "dont_buy";
  priceAdviceReason: string;
  features: string[];
  drawbacks: string[];
  alternatives: AlternativeProduct[];
  personalizedAdvice: string;
  hasNewerVersion: boolean;
  newerVersionName: string | null;
  purchaseLocations: PurchaseLocation[];
  isMisleadingReviews: boolean;
  misleadingReviewsExplanation: string;
  specs: ProductSpec[];
  priceHistory: PriceHistoryPoint[];
  pricePrediction: string;
  _isSimulated?: boolean;
  _errorMessage?: string;
  imageUrl?: string;
}

export interface UserProfile {
  name: string;
  isStudent: boolean;
  usage: "gaming" | "work" | "photography" | "casual";
  budget: string;
  notificationsEnabled: boolean;
  locale: "ar" | "en";
  theme: "light" | "dark";
}

export interface WishlistItem {
  id: string;
  product: ProductAnalysis;
  alertOnPriceDrop: boolean;
  alertOnStock: boolean;
  alertOnCoupon: boolean;
  dateAdded: string;
  initialPrice: number;
  currentPrice: number;
  hasDrop?: boolean;
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  date: string;
  product?: ProductAnalysis;
  type: "text" | "barcode" | "camera";
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  date: string;
  read: boolean;
  productId?: string;
  type: "drop" | "stock" | "coupon" | "release";
}

export type AppScreen =
  | "splash"
  | "onboarding"
  | "login"
  | "home"
  | "details"
  | "comparison"
  | "wishlist"
  | "history"
  | "notifications"
  | "settings"
  | "help"
  | "about"
  | "barcode"
  | "camera";

export interface AiStatus {
  status: "live" | "simulated" | "quota_exhausted";
  model: string;
  searchGrounding: string;
  provider: string;
}
