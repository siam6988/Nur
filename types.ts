export enum OrderStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  SHIPPED = 'Shipped',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled'
}

export enum PaymentMethod {
  COD = 'Cash on Delivery',
  SSL = 'Online Payment (SSLCommerz)'
}

export interface User {
  id: string;
  name: string;
  email: string;
  points: number;
  avatar?: string;
  phone?: string;
  address?: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  productId: string;
  productName: string;
  rating: number;
  comment: string;
  createdAt: any;
  date?: string;
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
  discountPercentage?: number;
  discount?: number;
  discountType?: "percentage" | "fixed";
  stock: number;
  sizes: string[];
  images: string[];
  image?: string;
  categoryId: string;
  category?: string;
  isActive: boolean;
  createdAt: any;
  rating: number;
  totalSales: number;
  isFreeShipping: boolean;
  isWholesale?: boolean;
  minimumOrderQuantity?: number;
  tierPricing?: TierPrice[];
  name?: string;
  description?: string;
}

export interface Category {
  id: string;
  name_en: string;
  name_bn: string;
  image: string;
  isVisible?: boolean;
  isActive?: boolean;
  createdAt: any;
  name?: string;
}

export interface CartItem extends Product {
  cartId: string;
  selectedSize: string;
  quantity: number;
  appliedPrice: number;
}

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  items: CartItem[];
  totalAmount: number;
  deliveryCharge: number;
  discountAmount: number;
  total: number;
  finalTotal: number;
  status: OrderStatus | string;
  paymentMethod: PaymentMethod | string;
  shippingAddress: any;
  address: string;
  contactNumber: string;
  createdAt: any;
  date: string;
}

export interface Banner {
  id: string;
  imageUrl: string;
  title: string;
  link: string;
  isActive?: boolean;
  offerText?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
}
