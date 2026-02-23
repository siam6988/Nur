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
  rating: number;
  comment: string;
  date: string;
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
}

export interface Banner {
  id: string;
  imageUrl: string;
  title: string;
  link: string;
}