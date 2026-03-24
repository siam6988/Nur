import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Product, CartItem, Order, OrderStatus, Review, Category, Banner, Coupon } from '../types';
import { DELIVERY_CHARGE_INSIDE, DELIVERY_CHARGE_OUTSIDE } from '../constants';
import { db, auth } from '../firebase-config';
import { collection, onSnapshot, query, where, addDoc, updateDoc, doc, setDoc, getDoc, runTransaction, orderBy } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { translations } from '../translations';

interface ToastData {
  id: number;
  message: string;
  type: 'success' | 'error';
}

interface StoreContextType {
  user: User | null;
  products: Product[];
  categories: Category[];
  banners: Banner[];
  coupons: Coupon[];
  allReviews: Review[];
  cart: CartItem[];
  wishlist: Product[];
  orders: Order[];
  toast: ToastData | null;
  isLoading: boolean;
  theme: 'light' | 'dark';
  language: 'bn' | 'en';
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (lang: 'bn' | 'en') => void;
  t: (key: string) => string;
  logout: () => void;
  updateProfile: (name: string, avatar: string) => void;
  addToCart: (product: Product, size: string, quantity?: number) => void;
  removeFromCart: (cartId: string) => void;
  updateCartQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  placeOrder: (shippingDetails: any, paymentMethod: any, discountAmount?: number, usedPoints?: number, couponCode?: string) => Promise<boolean>;
  cancelOrder: (orderId: string) => void;
  addReview: (productId: string, rating: number, comment: string) => void;
  cartTotal: number;
  isAuthenticated: boolean;
  recentlyViewed: Product[];
  addToRecentlyViewed: (product: Product) => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
  validateCoupon: (code: string, cartTotal: number) => number;
  getDiscountedPrice: (product: Product) => number;
  calculateAppliedPrice: (product: Product, quantity: number) => number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [toast, setToast] = useState<ToastData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');
  const [language, setLanguageState] = useState<'bn' | 'en'>('bn');

  const t = (key: string): string => {
    // @ts-ignore
    return translations[language][key] || key;
  };

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    localStorage.setItem('nur_theme', newTheme);
    if (newTheme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  const setLanguage = (lang: 'bn' | 'en') => {
    setLanguageState(lang);
    localStorage.setItem('nur_language', lang);
  };

  useEffect(() => {
    const savedCart = localStorage.getItem('nur_cart');
    const savedWishlist = localStorage.getItem('nur_wishlist');
    const savedRecentlyViewed = localStorage.getItem('nur_recently_viewed');
    const savedTheme = localStorage.getItem('nur_theme') as 'light' | 'dark';
    const savedLanguage = localStorage.getItem('nur_language') as 'bn' | 'en';
    
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    if (savedRecentlyViewed) setRecentlyViewed(JSON.parse(savedRecentlyViewed));
    if (savedTheme) setTheme(savedTheme);
    if (savedLanguage) setLanguageState(savedLanguage);
  }, []);

  useEffect(() => {
    if (!auth) return;
    let unsubUser: () => void;
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db!, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          const newUser: User = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'User',
            email: firebaseUser.email || '',
            points: 0,
            avatar: firebaseUser.photoURL || 'https://picsum.photos/seed/user_avatar/100/100',
          };
          await setDoc(userRef, newUser);
        }
        unsubUser = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) setUser({ id: docSnap.id, ...docSnap.data() } as User);
        });
      } else {
        setUser(null);
        if (unsubUser) unsubUser();
      }
    });
    return () => { unsubscribe(); if (unsubUser) unsubUser(); };
  }, []);

  useEffect(() => {
    if (!db) { setIsLoading(false); return; }
    setIsLoading(true);
    
    const unsubProducts = onSnapshot(query(collection(db, "products"), where("isActive", "==", true)), (snapshot) => {
      const data = snapshot.docs.map(doc => {
        const d = doc.data();
        return { id: doc.id, ...d, images: d.images || (d.image ? [d.image] : []) } as Product;
      });
      setProducts(data);
      setIsLoading(false);
    });

    const unsubCategories = onSnapshot(query(collection(db, "categories"), where("isActive", "==", true)), (snapshot) => {
      setCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category)));
    });

    const unsubBanners = onSnapshot(query(collection(db, "banners"), where("isActive", "==", true), orderBy("order", "asc")), (snapshot) => {
      setBanners(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Banner)));
    });

    const unsubCoupons = onSnapshot(query(collection(db, "coupons"), where("isActive", "==", true)), (snapshot) => {
      setCoupons(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Coupon)));
    });

    const unsubReviews = onSnapshot(collection(db, "reviews"), (snapshot) => {
      setAllReviews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review)));
    });

    return () => { unsubProducts(); unsubCategories(); unsubBanners(); unsubCoupons(); unsubReviews(); };
  }, []);

  useEffect(() => {
    if (!user || !db) { setOrders([]); return; }
    const unsubOrders = onSnapshot(query(collection(db, "orders"), where("userId", "==", user.id)), (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      ordersData.sort((a, b) => new Date(b.createdAt?.seconds * 1000 || b.date).getTime() - new Date(a.createdAt?.seconds * 1000 || a.date).getTime());
      setOrders(ordersData);
    });
    return () => unsubOrders();
  }, [user]);

  useEffect(() => { localStorage.setItem('nur_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('nur_wishlist', JSON.stringify(wishlist)); }, [wishlist]);
  useEffect(() => { localStorage.setItem('nur_recently_viewed', JSON.stringify(recentlyViewed)); }, [recentlyViewed]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setToast({ id, message, type });
    setTimeout(() => setToast(prev => prev?.id === id ? null : prev), 3000);
  };

  const logout = async () => { if (auth) await signOut(auth); };

  const getDiscountedPrice = (product: Product) => {
    const discountVal = product.discount !== undefined ? product.discount : (product.discountPercentage || 0);
    if (product.discountType === 'fixed') return Math.max(0, product.price - discountVal);
    return Math.max(0, product.price - (product.price * discountVal / 100));
  };

  const calculateAppliedPrice = (product: Product, quantity: number) => {
    let basePrice = getDiscountedPrice(product);
    if (product.isWholesale && product.tierPricing && product.tierPricing.length > 0) {
      const tier = product.tierPricing.find(t => quantity >= t.min && (t.max === null || quantity <= t.max));
      if (tier) basePrice = tier.price;
      else {
        const sortedTiers = [...product.tierPricing].sort((a, b) => a.min - b.min);
        if (sortedTiers.length > 0) basePrice = sortedTiers[0].price;
      }
    }
    return basePrice;
  };

  const addToCart = (product: Product, size: string, quantity: number = 1) => {
    if (product.isWholesale && product.minimumOrderQuantity && quantity < product.minimumOrderQuantity) {
      showToast(`${t('moqRequired')} ${product.minimumOrderQuantity} ${t('pieces')}`, 'error');
      return;
    }
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.selectedSize === size);
      if (existing) {
        const newQuantity = existing.quantity + quantity;
        return prev.map(item => item.cartId === existing.cartId ? { ...item, quantity: newQuantity, appliedPrice: calculateAppliedPrice(product, newQuantity) } : item);
      }
      return [...prev, { ...product, cartId: `${product.id}-${size}-${Date.now()}`, selectedSize: size, quantity, appliedPrice: calculateAppliedPrice(product, quantity) }];
    });
    showToast(`${language === 'bn' ? product.name_bn : product.name_en} ${t('addedToCart')}`);
  };

  const removeFromCart = (cartId: string) => setCart(prev => prev.filter(item => item.cartId !== cartId));

  const updateCartQuantity = (cartId: string, quantity: number) => {
    setCart(prev => prev.map(item => {
      if (item.cartId === cartId) {
        if (item.isWholesale && item.minimumOrderQuantity && quantity < item.minimumOrderQuantity) {
          showToast(`${t('moqRequired')} ${item.minimumOrderQuantity} ${t('pieces')}`, 'error');
          return item;
        }
        if (quantity < 1) return item;
        return { ...item, quantity, appliedPrice: calculateAppliedPrice(item, quantity) };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) { showToast(t('removedFromWishlist'), 'success'); return prev.filter(p => p.id !== product.id); }
      showToast(t('addedToWishlist'), 'success'); return [...prev, product];
    });
  };

  const addToRecentlyViewed = (product: Product) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      return [product, ...filtered].slice(0, 10);
    });
  };

  const validateCoupon = (code: string, cartTotal: number) => {
    const coupon = coupons.find(c => c.code === code.toUpperCase());
    if (!coupon) return 0;
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return 0;
    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) return 0;
    
    return coupon.discountType === 'percentage' ? (cartTotal * coupon.discountValue) / 100 : coupon.discountValue;
  };

  const placeOrder = async (shippingDetails: any, paymentMethod: any, discountAmount: number = 0, usedPoints: number = 0, couponCode?: string) => {
    if (!user || !db) return false;
    try {
      await runTransaction(db, async (transaction) => {
        // Stock Check
        for (const item of cart) {
          const pDoc = await transaction.get(doc(db!, "products", item.id));
          if (!pDoc.exists() || pDoc.data().stock < item.quantity) throw new Error(`Insufficient stock for ${item.name_en}`);
        }
        const userRef = doc(db!, "users", user.id);
        const userDoc = await transaction.get(userRef);
        const currentPoints = userDoc.data()?.points || 0;
        if (usedPoints > currentPoints) throw new Error("Insufficient points");

        const subTotal = cart.reduce((acc, item) => acc + (calculateAppliedPrice(item, item.quantity) * item.quantity), 0);
        const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
        
        let shippingCost = subTotal <= 5000 ? (shippingDetails.city === 'Sylhet' ? DELIVERY_CHARGE_INSIDE : DELIVERY_CHARGE_OUTSIDE) : 0;
        const finalTotal = Math.max(0, subTotal + shippingCost - discountAmount - usedPoints);

        const newOrder: Order = {
          id: `ORD-${Date.now()}`,
          userId: user.id,
          userEmail: user.email,
          items: [...cart],
          totalAmount: subTotal,
          deliveryCharge: shippingCost,
          discountAmount: discountAmount + usedPoints,
          total: finalTotal,
          finalTotal: finalTotal,
          status: OrderStatus.PENDING,
          paymentMethod,
          shippingAddress: shippingDetails,
          address: shippingDetails.address,
          contactNumber: shippingDetails.phone,
          createdAt: new Date(),
          date: new Date().toISOString()
        };

        transaction.set(doc(db!, "orders", newOrder.id), newOrder);
        
        for (const item of cart) {
          const productRef = doc(db!, "products", item.id);
          const pDoc = await transaction.get(productRef);
          transaction.update(productRef, { stock: pDoc.data()!.stock - item.quantity });
        }

        if (couponCode) {
          const coupon = coupons.find(c => c.code === couponCode.toUpperCase());
          if (coupon) transaction.update(doc(db!, "coupons", coupon.id), { usedCount: coupon.usedCount + 1 });
        }

        const pointsEarned = Math.floor(finalTotal / 100);
        const newPoints = currentPoints - usedPoints + pointsEarned;
        transaction.update(userRef, { points: newPoints });
        setUser({ ...user, points: newPoints });
      });

      clearCart();
      showToast("Order placed successfully!", "success");
      return true;
    } catch (error: any) {
      showToast(error.message || "Failed to place order", "error");
      return false;
    }
  };

  const cancelOrder = async (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order || !user || !db) return;
    try {
        await updateDoc(doc(db, "orders", orderId), { status: OrderStatus.CANCELLED });
        const pointsToDeduct = Math.floor(order.totalAmount / 100);
        await updateDoc(doc(db, "users", user.id), { points: Math.max(0, user.points - pointsToDeduct) });
        setUser({ ...user, points: Math.max(0, user.points - pointsToDeduct) });
    } catch (error) { showToast("Failed to cancel order", "error"); }
  };

  const addReview = async (productId: string, rating: number, comment: string) => {
    if(!user || !db) return;
    const product = products.find(p => p.id === productId);
    try {
        await addDoc(collection(db, "reviews"), {
          userId: user.id,
          userName: user.name,
          productId,
          productName: product?.name_en || 'Unknown Product',
          rating,
          comment,
          createdAt: new Date()
        });
        
        const prodReviews = allReviews.filter(r => r.productId === productId);
        const newAvg = (prodReviews.reduce((sum, r) => sum + r.rating, 0) + rating) / (prodReviews.length + 1);
        await updateDoc(doc(db, "products", productId), { rating: newAvg });
        showToast("Review added successfully!", "success");
    } catch (error) { showToast("Failed to add review", "error"); }
  };

  const updateProfile = async (name: string, avatar: string) => {
    if (!user || !db) return;
    try {
        await updateDoc(doc(db, "users", user.id), { name, avatar });
        setUser({ ...user, name, avatar });
        showToast(t('profileUpdated'));
    } catch (error) { showToast("Failed to update profile", "error"); }
  };

  const cartTotal = cart.reduce((acc, item) => acc + ((item.appliedPrice !== undefined ? item.appliedPrice : getDiscountedPrice(item)) * item.quantity), 0);

  return (
    <StoreContext.Provider value={{
      user, products, categories, banners, coupons, allReviews, cart, wishlist, orders, toast, isLoading, theme, language, setTheme, setLanguage, t, logout, updateProfile, addToCart, removeFromCart, updateCartQuantity, clearCart, toggleWishlist, placeOrder, cancelOrder, addReview, cartTotal, isAuthenticated: !!user, recentlyViewed, addToRecentlyViewed, showToast, validateCoupon, getDiscountedPrice, calculateAppliedPrice
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
