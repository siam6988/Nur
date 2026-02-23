import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Product, CartItem, Order, OrderStatus, Review, Category } from '../types';
import { DELIVERY_CHARGE_INSIDE, DELIVERY_CHARGE_OUTSIDE } from '../constants';
import { db } from '../firebase-config';
import { collection, onSnapshot, query, where, addDoc, updateDoc, doc, setDoc, getDoc, getDocs } from 'firebase/firestore';
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
  login: (email: string, name?: string) => Promise<void>;
  logout: () => void;
  updateProfile: (name: string, avatar: string) => void;
  addToCart: (product: Product, size: string) => void;
  removeFromCart: (cartId: string) => void;
  updateCartQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  placeOrder: (shippingDetails: any, paymentMethod: any) => Promise<boolean>;
  cancelOrder: (orderId: string) => void;
  addReview: (productId: string, rating: number, comment: string) => void;
  cartTotal: number;
  isAuthenticated: boolean;
  recentlyViewed: Product[];
  addToRecentlyViewed: (product: Product) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [toast, setToast] = useState<ToastData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');
  const [language, setLanguageState] = useState<'bn' | 'en'>('bn');

  // Translation helper
  const t = (key: string): string => {
    // @ts-ignore
    return translations[language][key] || key;
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
    const savedUser = localStorage.getItem('nur_user');
    const savedCart = localStorage.getItem('nur_cart');
    const savedWishlist = localStorage.getItem('nur_wishlist');
    const savedRecentlyViewed = localStorage.getItem('nur_recently_viewed');
    const savedTheme = localStorage.getItem('nur_theme') as 'light' | 'dark';
    const savedLanguage = localStorage.getItem('nur_language') as 'bn' | 'en';
    
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    if (savedRecentlyViewed) setRecentlyViewed(JSON.parse(savedRecentlyViewed));
    if (savedTheme) setTheme(savedTheme);
    if (savedLanguage) setLanguageState(savedLanguage);
  }, []);

  // Seeding Logic
  useEffect(() => {
    if (!db) return;
    const seedDatabase = async () => {
      try {
        const productsColl = collection(db, "products");
        const categoriesColl = collection(db, "categories");
        
        const pSnapshot = await getDocs(productsColl);
        const cSnapshot = await getDocs(categoriesColl);

        if (pSnapshot.empty) {
          console.log("Seeding Products...");
          for (const p of demoProducts) {
            await setDoc(doc(db, "products", p.id), p);
          }
        }

        if (cSnapshot.empty) {
          console.log("Seeding Categories...");
          for (const c of demoCategories) {
            await setDoc(doc(db, "categories", c.id), c);
          }
        }
      } catch (error) {
        console.error("Error seeding database:", error);
      }
    };
    
    seedDatabase();
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
    });

    // Categories Listener
    const qCategories = query(collection(db, "categories"), where("isVisible", "==", true));
    const unsubCategories = onSnapshot(qCategories, (snapshot) => {
      const categoriesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
      setCategories(categoriesData);
    });

    return () => {
      unsubProducts();
      unsubCategories();
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

  const login = async (email: string, name: string = 'Tanvir Hasan') => {
    if (!db) {
      console.warn("Firestore not initialized");
      return;
    }
    // For now, we simulate login but try to fetch/create user in Firestore to keep consistency
    // In a real app, use firebase/auth
    const userId = `u-${email.replace(/[^a-zA-Z0-9]/g, '')}`;
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    let userData: User;
    if (userSnap.exists()) {
      userData = { id: userSnap.id, ...userSnap.data() } as User;
    } else {
      userData = {
        id: userId,
        name: name,
        email: email,
        points: 0,
        avatar: 'https://picsum.photos/seed/user_avatar/100/100',
        address: 'Dhaka, Bangladesh',
        phone: '01700000000'
      };
      await setDoc(userRef, userData);
    }
    
    setUser(userData);
    localStorage.setItem('nur_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nur_user');
  };

  const addToCart = (product: Product, size: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.selectedSize === size);
      if (existing) {
        return prev.map(item => 
          item.cartId === existing.cartId 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { ...product, cartId: `${product.id}-${size}-${Date.now()}`, selectedSize: size, quantity: 1 }];
    });
    // Use name_en or name_bn based on language, or just default to name_en for toast
    const productName = language === 'bn' ? product.name_bn : product.name_en;
    showToast(`${productName} ${t('addedToCart')}`);
  };

  const removeFromCart = (cartId: string) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  const updateCartQuantity = (cartId: string, quantity: number) => {
    if (quantity < 1) return;
    setCart(prev => prev.map(item => item.cartId === cartId ? { ...item, quantity } : item));
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
      return [product, ...filtered].slice(0, 10);
    });
  };

  const placeOrder = async (shippingDetails: any, paymentMethod: any) => {
    if (!user || !db) return false;
    const subTotal = cart.reduce((acc, item) => {
      const discountedPrice = item.price - (item.price * item.discountPercentage / 100);
      return acc + (discountedPrice * item.quantity);
    }, 0);
    
    let shippingCost = 0;
    if (subTotal <= 5000) {
      shippingCost = shippingDetails.city === 'Sylhet' ? DELIVERY_CHARGE_INSIDE : DELIVERY_CHARGE_OUTSIDE;
    }

    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      userId: user.id,
      items: [...cart],
      totalAmount: subTotal,
      deliveryCharge: shippingCost,
      discountAmount: 0,
      finalTotal: subTotal + shippingCost,
      status: OrderStatus.PENDING,
      paymentMethod,
      shippingAddress: shippingDetails.address,
      contactNumber: shippingDetails.phone,
      date: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, "orders", newOrder.id), newOrder);

      const pointsEarned = Math.floor(subTotal / 100);
      const updatedUser = { ...user, points: user.points + pointsEarned };
      
      await updateDoc(doc(db, "users", user.id), { points: updatedUser.points });
      
      setUser(updatedUser);
      localStorage.setItem('nur_user', JSON.stringify(updatedUser));

      clearCart();
      return true;
    } catch (error) {
      console.error("Error placing order:", error);
      showToast("Failed to place order", "error");
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
    const price = item.price - (item.price * item.discountPercentage / 100);
    return acc + (price * item.quantity);
  }, 0);

  return (
    <StoreContext.Provider value={{
      user, products, categories, cart, wishlist, orders, toast, isLoading, theme, language, setTheme, setLanguage, t, login, logout, updateProfile, addToCart, removeFromCart, updateCartQuantity, clearCart, toggleWishlist, placeOrder, cancelOrder, addReview, cartTotal, isAuthenticated: !!user, recentlyViewed, addToRecentlyViewed
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