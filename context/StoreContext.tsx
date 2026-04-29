import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Product, CartItem, Order, OrderStatus, Review, Category, Currency, Banner } from '../types';
import { DELIVERY_CHARGE_INSIDE, DELIVERY_CHARGE_OUTSIDE, BANNERS as DEFAULT_BANNERS } from '../constants';
import { db, auth } from '../firebase-config';
import { collection, onSnapshot, query, where, addDoc, updateDoc, doc, setDoc, getDoc, getDocs, runTransaction } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { translations } from '../translations';
import { demoProducts, demoCategories } from '../data/demoData';

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
  cart: CartItem[];
  wishlist: Product[];
  orders: Order[];
  toast: ToastData | null;
  isLoading: boolean;
  theme: 'light' | 'dark';
  language: 'bn' | 'en';
  currency: Currency;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (lang: 'bn' | 'en') => void;
  setCurrency: (currency: Currency) => void;
  formatPrice: (priceInBDT: number) => string;
  t: (key: string) => string;
  login: (email: string, name?: string) => Promise<void>;
  logout: () => void;
  updateProfile: (name: string, avatar: string) => void;
  addToCart: (product: Product, size: string, quantity?: number) => void;
  removeFromCart: (cartId: string) => void;
  updateCartQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  calculateAppliedPrice: (product: Product, quantity: number) => number;
  placeOrder: (shippingDetails: any, paymentMethod: any, discountAmount?: number, usedPoints?: number) => Promise<boolean>;
  cancelOrder: (orderId: string) => void;
  addReview: (productId: string, rating: number, comment: string) => void;
  cartTotal: number;
  isAuthenticated: boolean;
  recentlyViewed: Product[];
  addToRecentlyViewed: (product: Product) => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
  validateCoupon: (code: string, cartTotal: number) => Promise<number>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[]>(DEFAULT_BANNERS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [toast, setToast] = useState<ToastData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');
  const [language, setLanguageState] = useState<'bn' | 'en'>('bn');
  const [currency, setCurrencyState] = useState<Currency>(Currency.BDT);

  // Translation helper
  const t = (key: string): string => {
    // @ts-ignore
    return translations[language][key] || key;
  };

  // Handle Currency Persistence
  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('nur_currency', newCurrency);
  };

  const formatPrice = (priceInBDT: number): string => {
    const rates: Record<Currency, number> = {
      [Currency.BDT]: 1,
      [Currency.USD]: 0.0091,
      [Currency.EUR]: 0.0084,
      [Currency.GBP]: 0.0072,
      [Currency.INR]: 0.76
    };
    const symbols: Record<Currency, string> = {
      [Currency.BDT]: '৳',
      [Currency.USD]: '$',
      [Currency.EUR]: '€',
      [Currency.GBP]: '£',
      [Currency.INR]: '₹'
    };
    
    const converted = priceInBDT * rates[currency];
    return `${symbols[currency]}${converted.toLocaleString(undefined, { minimumFractionDigits: currency === Currency.BDT ? 0 : 2, maximumFractionDigits: currency === Currency.BDT ? 0 : 2 })}`;
  };

  // Handle Theme Persistence
  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    localStorage.setItem('nur_theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Handle Language Persistence
  const setLanguage = (lang: 'bn' | 'en') => {
    setLanguageState(lang);
    localStorage.setItem('nur_language', lang);
  };

  // Initialize Local Storage Data
  useEffect(() => {
    const savedCart = localStorage.getItem('nur_cart');
    const savedWishlist = localStorage.getItem('nur_wishlist');
    const savedRecentlyViewed = localStorage.getItem('nur_recently_viewed');
    const savedTheme = localStorage.getItem('nur_theme') as 'light' | 'dark';
    const savedLanguage = localStorage.getItem('nur_language') as 'bn' | 'en';
    const savedCurrency = localStorage.getItem('nur_currency') as Currency;
    
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    if (savedRecentlyViewed) setRecentlyViewed(JSON.parse(savedRecentlyViewed));
    if (savedTheme) setTheme(savedTheme);
    if (savedLanguage) setLanguageState(savedLanguage);
    if (savedCurrency) setCurrencyState(savedCurrency);
  }, []);

  // Auth Listener
  useEffect(() => {
    if (!auth) return;
    let unsubUser: () => void;
    let unsubApp: () => void;
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db!, "users", firebaseUser.uid);
        const appRef = doc(db!, "resellerApplications", firebaseUser.uid);
        
        let currentAppStatus: string | null = null;

        try {
          // Check if user exists first
          const userSnap = await getDoc(userRef);
          if (!userSnap.exists()) {
            const newUser: User = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'User',
              email: firebaseUser.email || '',
              points: 0,
              avatar: firebaseUser.photoURL || 'https://picsum.photos/seed/user_avatar/100/100',
              role: 'user'
            };
            await setDoc(userRef, newUser);
          }

          // Listen to reseller application
          unsubApp = onSnapshot(appRef, (appSnap) => {
            if (appSnap.exists()) {
              const status = appSnap.data().status;
              currentAppStatus = status;
              setUser((prev: User | null) => prev ? { ...prev, resellerStatus: status as any } : null);
            } else {
              currentAppStatus = null;
            }
          });

          // Listen to user changes
          unsubUser = onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) {
              setUser((prev: User | null) => {
                const userData = { id: docSnap.id, ...docSnap.data() } as User;
                // Preserve reseller status if fetched from app, otherwise use user's own status
                return currentAppStatus ? { ...userData, resellerStatus: currentAppStatus as any } : userData;
              });
            }
          }, (error) => {
            console.error("User listener error", error);
          });
        } catch (error) {
          console.error("Error fetching user data", error);
          // Set user even if we can't fetch from DB right now
          setUser({
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'User',
            email: firebaseUser.email || '',
            points: 0,
            avatar: firebaseUser.photoURL || 'https://picsum.photos/seed/user_avatar/100/100',
            role: 'user'
          });
        }
      } else {
        setUser(null);
        if (unsubUser) unsubUser();
        if (unsubApp) unsubApp();
      }
    });
    return () => {
      unsubscribe();
      if (unsubUser) unsubUser();
      if (unsubApp) unsubApp();
    };
  }, []);

  // Firestore Listeners
  useEffect(() => {
    if (!db) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    
    // Products Listener
    const qProducts = query(collection(db, "products"), where("isActive", "==", true));
    const unsubProducts = onSnapshot(qProducts, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(productsData);
      setIsLoading(false);
    }, (error) => {
      console.error("Products Listener Error", error);
      setIsLoading(false);
    });

    // Categories Listener
    const qCategories = query(collection(db, "categories"), where("isVisible", "==", true));
    const unsubCategories = onSnapshot(qCategories, (snapshot) => {
      const categoriesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
      setCategories(categoriesData);
    }, (error) => {
      console.error("Categories Listener Error", error);
    });

    // Banners Listener
    const qBanners = query(collection(db, "banners"));
    const unsubBanners = onSnapshot(qBanners, (snapshot) => {
      if (!snapshot.empty) {
        const bannersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Banner));
        setBanners(bannersData);
      } else {
        setBanners(DEFAULT_BANNERS);
      }
    }, (error) => {
      console.error("Banners Listener Error", error);
      setBanners(DEFAULT_BANNERS);
    });

    return () => {
      unsubProducts();
      unsubCategories();
      unsubBanners();
    };
  }, []);

  // Orders Listener (User Specific)
  useEffect(() => {
    if (!user || !db) {
      setOrders([]);
      return;
    }

    const qOrders = query(collection(db, "orders"), where("userId", "==", user.id));
    const unsubOrders = onSnapshot(qOrders, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      // Sort client-side to avoid index requirement
      ordersData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setOrders(ordersData);
    }, (error) => {
      console.error("Orders Listener Error", error);
    });

    return () => unsubOrders();
  }, [user]);

  // Persist Local Data
  useEffect(() => {
    localStorage.setItem('nur_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('nur_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);
  
  useEffect(() => {
    localStorage.setItem('nur_recently_viewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast(prev => prev?.id === id ? null : prev);
    }, 3000);
  };

  useEffect(() => {
    if (!db) {
      showToast("Firebase not configured. Please check .env file.", "error");
    }
  }, []);

  const login = async (email: string, name: string = 'User') => {
    // This is just a placeholder to satisfy the interface if it's called directly.
    // Real login should be handled via Firebase Auth in the Login component.
    console.warn("Use Firebase Auth directly for login.");
  };

  const logout = async () => {
    if (auth) {
      await signOut(auth);
    }
  };

  const calculateAppliedPrice = (product: Product, quantity: number) => {
    const discount = product.discountPercentage || 0;
    let basePrice = product.price - (product.price * discount / 100);
    
    if (product.isWholesale && product.tierPricing && product.tierPricing.length > 0) {
      // Find the applicable tier
      const tier = product.tierPricing.find(t => 
        quantity >= t.min && (t.max === null || quantity <= t.max)
      );
      if (tier) {
        basePrice = tier.price;
      } else {
        // If below MOQ, use the highest tier price (lowest min)
        const sortedTiers = [...product.tierPricing].sort((a, b) => a.min - b.min);
        if (sortedTiers.length > 0) {
          basePrice = sortedTiers[0].price;
        }
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
        const newPrice = calculateAppliedPrice(product, newQuantity);
        return prev.map(item => 
          item.cartId === existing.cartId 
            ? { ...item, quantity: newQuantity, appliedPrice: newPrice } 
            : item
        );
      }
      
      const appliedPrice = calculateAppliedPrice(product, quantity);
      return [...prev, { ...product, cartId: `${product.id}-${size}-${Date.now()}`, selectedSize: size, quantity, appliedPrice }];
    });
    
    const productName = language === 'bn' ? product.name_bn : product.name_en;
    showToast(`${productName} ${t('addedToCart')}`);
  };

  const removeFromCart = (cartId: string) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  const updateCartQuantity = (cartId: string, quantity: number) => {
    setCart(prev => prev.map(item => {
      if (item.cartId === cartId) {
        if (item.isWholesale && item.minimumOrderQuantity && quantity < item.minimumOrderQuantity) {
          showToast(`${t('moqRequired')} ${item.minimumOrderQuantity} ${t('pieces')}`, 'error');
          return item; // Don't update if below MOQ
        }
        if (quantity < 1) return item;
        
        const newPrice = calculateAppliedPrice(item, quantity);
        return { ...item, quantity, appliedPrice: newPrice };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        showToast(t('removedFromWishlist'), 'success');
        return prev.filter(p => p.id !== product.id);
      }
      showToast(t('addedToWishlist'), 'success');
      return [...prev, product];
    });
  };

  const addToRecentlyViewed = (product: Product) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      const updated = [product, ...filtered].slice(0, 10);
      localStorage.setItem('nur_recently_viewed', JSON.stringify(updated));
      return updated;
    });
  };

  const validateCoupon = async (code: string, cartTotal: number) => {
    // Mock coupon validation
    // In a real app, you would query the 'coupons' collection in Firestore
    if (code.toUpperCase() === 'NUR10') {
      return cartTotal * 0.1; // 10% discount
    }
    if (code.toUpperCase() === 'NUR50') {
      return 50; // Flat 50 BDT discount
    }
    return 0;
  };

  const placeOrder = async (shippingDetails: any, paymentMethod: any, discountAmount: number = 0, usedPoints: number = 0) => {
    if (!user || !db) return false;
    
    try {
      await runTransaction(db, async (transaction) => {
        // 1. Check stock for all items
        for (const item of cart) {
          const productRef = doc(db!, "products", item.id);
          const productDoc = await transaction.get(productRef);
          
          if (!productDoc.exists()) {
            throw new Error(`Product ${item.name} does not exist!`);
          }
          
          const currentStock = productDoc.data().stock;
          if (currentStock < item.quantity) {
            throw new Error(`Insufficient stock for ${item.name}. Available: ${currentStock}`);
          }
        }

        // Check points if used
        const userRef = doc(db!, "users", user.id);
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists()) throw new Error("User not found");
        const currentPoints = userDoc.data().points || 0;
        if (usedPoints > currentPoints) {
          throw new Error("Insufficient points");
        }

        // 2. Calculate totals
        const subTotal = cart.reduce((acc, item) => {
          const price = calculateAppliedPrice(item, item.quantity);
          return acc + (price * item.quantity);
        }, 0);
        
        const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
        
        let shippingCost = 0;
        if (subTotal <= 5000) {
          if (totalItems >= 100) {
            shippingCost = 300;
          } else if (totalItems >= 51) {
            shippingCost = 200;
          } else {
            shippingCost = shippingDetails.city === 'Sylhet' ? DELIVERY_CHARGE_INSIDE : DELIVERY_CHARGE_OUTSIDE;
          }
        }

        const pointsDiscount = usedPoints; // 1 point = 1 BDT discount (or whatever rule)
        const finalTotal = Math.max(0, subTotal + shippingCost - discountAmount - pointsDiscount);

        const pointsEarned = Math.floor(finalTotal / 100);

        const newOrder: Order = {
          id: `ORD-${Date.now()}`,
          userId: user.id,
          items: [...cart],
          totalAmount: subTotal,
          deliveryCharge: shippingCost,
          discountAmount: discountAmount + pointsDiscount,
          finalTotal: finalTotal,
          status: OrderStatus.PENDING,
          paymentMethod,
          shippingAddress: shippingDetails.address,
          contactNumber: shippingDetails.phone,
          date: new Date().toISOString(),
          transactionId: shippingDetails.transactionId,
          paymentPhone: shippingDetails.paymentPhone,
          pointsUsed: usedPoints,
          pointsEarned: pointsEarned
        };

        // 3. Perform updates
        const orderRef = doc(db!, "orders", newOrder.id);
        transaction.set(orderRef, newOrder);

        for (const item of cart) {
          const productRef = doc(db!, "products", item.id);
          const productDoc = await transaction.get(productRef); 
          const newStock = productDoc.data()!.stock - item.quantity;
          transaction.update(productRef, { stock: newStock });
        }

        // Update User Points (Earned - Used)
        const newPoints = currentPoints - usedPoints + pointsEarned;
        transaction.update(userRef, { points: newPoints });
        
        const updatedUser = { ...user, points: newPoints };
        setUser(updatedUser);
      });

      clearCart();
      showToast("Order placed successfully!", "success");
      return true;
    } catch (error: any) {
      console.error("Error placing order:", error);
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
        const updatedUser = { ...user, points: Math.max(0, user.points - pointsToDeduct) };
        
        await updateDoc(doc(db, "users", user.id), { points: updatedUser.points });
        
        setUser(updatedUser);
        localStorage.setItem('nur_user', JSON.stringify(updatedUser));
    } catch (error) {
        console.error("Error cancelling order:", error);
        showToast("Failed to cancel order", "error");
    }
  };

  const addReview = async (productId: string, rating: number, comment: string) => {
    if(!user || !db) return;
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      rating,
      comment,
      date: new Date().toISOString().split('T')[0]
    };
    
    try {
        const productRef = doc(db, "products", productId);
        const product = products.find(p => p.id === productId);
        if (product) {
            const currentReviews = product.reviews || [];
            const updatedReviews = [...currentReviews, newReview];
            const avgRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
            
            await updateDoc(productRef, {
                reviews: updatedReviews,
                rating: avgRating
            });
            showToast("Review added successfully!", "success");
        }
    } catch (error) {
        console.error("Error adding review:", error);
        showToast("Failed to add review", "error");
    }
  };

  const updateProfile = async (name: string, avatar: string) => {
    if (!user || !db) return;
    const updatedUser = { ...user, name, avatar };
    
    try {
        await updateDoc(doc(db, "users", user.id), { name, avatar });
        setUser(updatedUser);
        localStorage.setItem('nur_user', JSON.stringify(updatedUser));
        showToast(t('profileUpdated'));
    } catch (error) {
        console.error("Error updating profile:", error);
        showToast("Failed to update profile", "error");
    }
  };

  const cartTotal = cart.reduce((acc, item) => {
    const discount = item.discountPercentage || 0;
    const price = item.appliedPrice !== undefined ? item.appliedPrice : (item.price - (item.price * discount / 100));
    return acc + (price * item.quantity);
  }, 0);

  return (
    <StoreContext.Provider value={{
      user, products, categories, banners, cart, wishlist, orders, toast, isLoading, theme, language, currency, setTheme, setLanguage, setCurrency, formatPrice, t, login, logout, updateProfile, addToCart, removeFromCart, updateCartQuantity, clearCart, toggleWishlist, placeOrder, cancelOrder, addReview, cartTotal, isAuthenticated: !!user, recentlyViewed, addToRecentlyViewed, showToast, validateCoupon, calculateAppliedPrice
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