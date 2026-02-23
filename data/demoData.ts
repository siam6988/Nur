import { Product, Category } from '../types';

export const demoCategories: Category[] = [
  {
    id: 'Fashion',
    name_en: 'Fashion',
    name_bn: 'ফ্যাশন',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop',
    isVisible: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'Electronics',
    name_en: 'Electronics',
    name_bn: 'ইলেকট্রনিক্স',
    image: 'https://images.unsplash.com/photo-1498049860654-af1a5c5668ba?q=80&w=800&auto=format&fit=crop',
    isVisible: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'Home',
    name_en: 'Home & Living',
    name_bn: 'হোম ও লিভিং',
    image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=800&auto=format&fit=crop',
    isVisible: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'Beauty',
    name_en: 'Beauty',
    name_bn: 'বিউটি',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?q=80&w=800&auto=format&fit=crop',
    isVisible: true,
    createdAt: new Date().toISOString()
  }
];

export const demoProducts: Product[] = [
  {
    id: 'p1',
    name_en: 'Premium Cotton Panjabi - Navy Blue',
    name_bn: 'প্রিমিয়াম কটন পাঞ্জাবি - নেভি ব্লু',
    description_en: 'High-quality cotton panjabi perfect for any occasion. Comfortable fit and premium stitching.',
    description_bn: 'উচ্চ মানের কটন পাঞ্জাবি যা যেকোনো অনুষ্ঠানের জন্য উপযুক্ত। আরামদায়ক ফিট এবং প্রিমিয়াম সেলাই।',
    price: 2500,
    discountPercentage: 15,
    stock: 50,
    sizes: ['M', 'L', 'XL', 'XXL'],
    images: ['https://picsum.photos/seed/panjabi1/600/600', 'https://picsum.photos/seed/panjabi1_2/600/600'],
    categoryId: 'Fashion',
    isActive: true,
    createdAt: new Date().toISOString(),
    reviews: [],
    rating: 4.5,
    totalSales: 120,
    isFreeShipping: true
  },
  {
    id: 'p2',
    name_en: 'Wireless Noise Cancelling Headphones',
    name_bn: 'ওয়্যারলেস নয়েজ ক্যান্সেলিং হেডফোন',
    description_en: 'Immersive sound with active noise cancellation. 20-hour battery life.',
    description_bn: 'অ্যাক্টিভ নয়েজ ক্যান্সলেশন সহ দুর্দান্ত সাউন্ড। ২০ ঘণ্টা ব্যাটারি লাইফ।',
    price: 4500,
    discountPercentage: 10,
    stock: 20,
    sizes: ['FREE SIZE'],
    images: ['https://picsum.photos/seed/headphone1/600/600'],
    categoryId: 'Electronics',
    isActive: true,
    createdAt: new Date().toISOString(),
    reviews: [
      { id: 'r1', userId: 'u2', userName: 'Rahim K.', rating: 5, comment: 'Excellent bass!', date: '2023-10-12' }
    ],
    rating: 5,
    totalSales: 45,
    isFreeShipping: false
  },
  {
    id: 'p3',
    name_en: 'Silk Georgette Saree - Red',
    name_bn: 'সিল্ক জর্জেট শাড়ি - লাল',
    description_en: 'Elegant silk georgette saree with intricate embroidery work.',
    description_bn: 'নিখুঁত এমব্রয়ডারি কাজ করা এলিগেন্ট সিল্ক জর্জেট শাড়ি।',
    price: 3800,
    discountPercentage: 20,
    stock: 15,
    sizes: ['FREE SIZE'],
    images: ['https://picsum.photos/seed/saree1/600/600'],
    categoryId: 'Fashion',
    isActive: true,
    createdAt: new Date().toISOString(),
    reviews: [],
    rating: 0,
    totalSales: 80,
    isFreeShipping: true
  },
  {
    id: 'p4',
    name_en: 'Smart Watch Series 7',
    name_bn: 'স্মার্ট ওয়াচ সিরিজ ৭',
    description_en: 'Track your fitness goals with this advanced smartwatch. Water-resistant.',
    description_bn: 'আপনার ফিটনেস গোল ট্র্যাক করুন এই উন্নত স্মার্টওয়াচ দিয়ে। ওয়াটার রেজিস্ট্যান্ট।',
    price: 2200,
    discountPercentage: 5,
    stock: 100,
    sizes: ['FREE SIZE'],
    images: ['https://picsum.photos/seed/watch1/600/600'],
    categoryId: 'Electronics',
    isActive: true,
    createdAt: new Date().toISOString(),
    reviews: [],
    rating: 4.2,
    totalSales: 200,
    isFreeShipping: false
  },
  {
    id: 'p5',
    name_en: 'Casual Denim Jacket',
    name_bn: 'ক্যাজুয়াল ডেনিম জ্যাকেট',
    description_en: 'Stylish denim jacket for a cool look.',
    description_bn: 'কুল লুকের জন্য স্টাইলিশ ডেনিম জ্যাকেট।',
    price: 1800,
    discountPercentage: 0,
    stock: 30,
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['https://picsum.photos/seed/denim1/600/600'],
    categoryId: 'Fashion',
    isActive: true,
    createdAt: new Date().toISOString(),
    reviews: [],
    rating: 4.0,
    totalSales: 60,
    isFreeShipping: false
  },
  {
    id: 'p6',
    name_en: 'Professional Gaming Mouse',
    name_bn: 'প্রফেশনাল গেমিং মাউস',
    description_en: 'High precision gaming mouse with RGB lighting.',
    description_bn: 'RGB লাইটিং সহ হাই প্রিসিশন গেমিং মাউস।',
    price: 1200,
    discountPercentage: 25,
    stock: 40,
    sizes: ['FREE SIZE'],
    images: ['https://picsum.photos/seed/mouse1/600/600'],
    categoryId: 'Electronics',
    isActive: true,
    createdAt: new Date().toISOString(),
    reviews: [],
    rating: 4.8,
    totalSales: 150,
    isFreeShipping: false
  }
];
