export enum OrderStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  SHIPPED = 'Shipped',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled'
}

export enum PaymentMethod {
  COD = 'Cash on Delivery',
  SSL = 'Online Payment (SSLCommerz)',
  BKASH = 'bKash',
  NAGAD = 'Nagad',
  ROCKET = 'Rocket'
}

export enum Currency {
  BDT = 'BDT',
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  INR = 'INR'
}

export interface User {
  id: string;
  name: string;
  email: string;
  points: number;
  avatar?: string;
  phone?: string;
  address?: string;
  role?: 'admin' | 'user' | 'reseller';
  resellerStatus?: 'none' | 'pending' | 'approved' | 'rejected';
}

export interface ResellerApplication {
  userId: string;
  shopName: string;
  description: string;
  phone: string;
  address: string;
  visitingCardImage: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface TierPrice {
  min: number;
  max: number | null;
  price: number;
}

export interface Product {
  id: string;
  name_en: string;
  name_bn: string;
  description_en: string;
  description_bn: string;
  price: number;
  discountPercentage: number;
  stock: number;
  sizes: string[];
  images: string[];
  categoryId: string;
  isActive: boolean;
  createdAt: string;
  reviews: Review[];
  rating: number;
  totalSales: number;
  isFreeShipping: boolean;
  // Wholesale features
  isWholesale?: boolean;
  minimumOrderQuantity?: number;
  tierPricing?: TierPrice[];
  // Legacy fields for compatibility (optional)
  name?: string;
  description?: string;
  category?: string; 
}

export interface Category {
  id: string;
  name_en: string;
  name_bn: string;
  image: string;
  isVisible: boolean;
  createdAt: string;
  // Legacy
  name?: string;
}

export interface CartItem extends Product {
  cartId: string; // Unique ID for cart entry (to handle same product different sizes)
  selectedSize: string;
  quantity: number;
  appliedPrice: number; // The price applied after tier calculation or discount
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  deliveryCharge: number;
  discountAmount: number;
  finalTotal: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  shippingAddress: string;
  contactNumber: string;
  date: string;
  transactionId?: string;
  paymentPhone?: string;
  pointsUsed?: number;
  pointsEarned?: number;
}

export interface Banner {
  id: string;
  imageUrl: string;
  title: string;
  link: string;
}

export interface BlogComment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  date: string;
}

export interface SupportReply {
  sender: 'user' | 'admin';
  message: string;
  createdAt: string;
}

export interface SupportTicket {
  id?: string;
  subject: string;
  message: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: string; // 'Pending', 'Open', 'Closed', etc.
  createdAt: any;
  replies?: SupportReply[];
}

export interface Notification {
  id?: string;
  title: string;
  message: string;
  date: string;
  target: 'all' | 'customers' | string; // target could be user id
  createdAt?: any;
}

export interface GeneralSettings {
  storeName?: string;
  supportPhone?: string;
  supportEmail?: string;
  address?: string;
  facebookUrl?: string;
  shippingPolicy?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  date: string;
  image: string;
  excerpt: string;
  content: string;
  createdAt: string;
  isActive?: boolean;
  likes?: number;
  likedBy?: string[];
  comments?: BlogComment[];
  ratings?: { userId: string, rating: number }[];
  averageRating?: number;
}