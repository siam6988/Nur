import { Product, Banner } from './types';

export const APP_NAME = "NUR";
export const DELIVERY_CHARGE = 120; // Default/Max charge for display fallbacks
export const DELIVERY_CHARGE_INSIDE = 80; // Sylhet
export const DELIVERY_CHARGE_OUTSIDE = 120; // Rest of Bangladesh
export const POINTS_CONVERSION_RATE = 100; // 100 TK = 1 Point

// Mock Banners
export const BANNERS: Banner[] = [
  {
    id: '1',
    imageUrl: 'https://picsum.photos/seed/nur_banner1/1200/400',
    title: 'ঝলক অফার - ৫০% পর্যন্ত ছাড়',
    link: '/shop'
  },
  {
    id: '2',
    imageUrl: 'https://picsum.photos/seed/nur_banner2/1200/400',
    title: 'ঈদ কালেকশন ২০২৪',
    link: '/shop'
  },
  {
    id: '3',
    imageUrl: 'https://picsum.photos/seed/nur_banner3/1200/400',
    title: 'গ্যাজেট ফেস্ট - পাওয়ার ডিল',
    link: '/shop'
  }
];

// Mock Products
export const MOCK_PRODUCTS: Product[] = [];

export const CATEGORIES = [];