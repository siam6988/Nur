import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronRight, Home as HomeIcon } from 'lucide-react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Layout } from './components/Layout';
import { ThemeLoader } from './components/UIComponents';
import { ChatBot } from './components/ChatBot';
import Home from './pages/Home';
import { Shop, ProductDetails } from './pages/ProductPages';
import { Wholesale } from './pages/Wholesale';
import { TrialRoom } from './pages/TrialRoom';
import { Cart, Checkout, Profile, Login, Wishlist } from './pages/UserPages';
import { About, Contact, Policy, Terms, Affiliate, ShippingPolicy, Blogs, BlogDetails } from './pages/StaticPages';
import { BlogAdmin } from './pages/AdminPages';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Breadcrumbs = () => {
  const location = useLocation();
  const { products, t, language } = useStore();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <div className="bg-gray-50 dark:bg-darkBg border-b dark:border-darkBorder py-3">
      <div className="container mx-auto px-4 flex items-center text-sm text-gray-500 dark:text-gray-400 overflow-x-auto whitespace-nowrap">
        <Link to="/" className="hover:text-primary dark:hover:text-white flex items-center gap-1">
          <HomeIcon size={14} /> {t('home') || 'Home'}
        </Link>
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          
          let displayName = value.charAt(0).toUpperCase() + value.slice(1);
          
          if (pathnames[index - 1] === 'product') {
            const product = products.find(p => p.id === value);
            if (product) {
              displayName = language === 'bn' ? (product.name_bn || product.name_en || product.name || value) : (product.name_en || product.name || value);
            }
          } else {
            const translated = t(value);
            if (translated && translated !== value) {
              displayName = translated;
            }
          }

          return (
            <div key={to} className="flex items-center">
              <ChevronRight size={14} className="mx-2 flex-shrink-0" />
              {last ? (
                <span className="text-gray-800 dark:text-gray-200 font-medium truncate max-w-[200px]" title={displayName}>
                  {displayName}
                </span>
              ) : (
                <Link to={to} className="hover:text-primary dark:hover:text-white truncate max-w-[150px]">
                  {displayName}
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/shop" element={<PageWrapper><Shop /></PageWrapper>} />
        <Route path="/wholesale" element={<PageWrapper><Wholesale /></PageWrapper>} />
        <Route path="/trial-room" element={<PageWrapper><TrialRoom /></PageWrapper>} />
        <Route path="/product/:id" element={<PageWrapper><ProductDetails /></PageWrapper>} />
        <Route path="/cart" element={<PageWrapper><Cart /></PageWrapper>} />
        <Route path="/checkout" element={<PageWrapper><Checkout /></PageWrapper>} />
        <Route path="/profile" element={<PageWrapper><Profile /></PageWrapper>} />
        <Route path="/orders" element={<PageWrapper><Profile /></PageWrapper>} />
        <Route path="/wishlist" element={<PageWrapper><Wishlist /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        
        {/* Static Pages */}
        <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
        <Route path="/blogs" element={<PageWrapper><Blogs /></PageWrapper>} />
        <Route path="/blogs/:id" element={<PageWrapper><BlogDetails /></PageWrapper>} />
        <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
        <Route path="/policy" element={<PageWrapper><Policy /></PageWrapper>} />
        <Route path="/terms" element={<PageWrapper><Terms /></PageWrapper>} />
        <Route path="/shipping" element={<PageWrapper><ShippingPolicy /></PageWrapper>} />
        <Route path="/affiliate" element={<PageWrapper><Affiliate /></PageWrapper>} />

        {/* Admin Pages */}
        <Route path="/admin/blogs" element={<PageWrapper><BlogAdmin /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};

// Wrap main app to consume context and tie animation to real loading state
const AppContent: React.FC = () => {
  const { isLoading } = useStore();
  const [initialLoading, setInitialLoading] = useState(true);
  const [finishLoading, setFinishLoading] = useState(false);

  useEffect(() => {
    // Force finish after 3 seconds maximum to prevent hanging
    const forceTimer = setTimeout(() => {
      setFinishLoading(true);
      setTimeout(() => setInitialLoading(false), 500);
    }, 3000);

    if (!isLoading) {
      setFinishLoading(true);
      const timer = setTimeout(() => {
        setInitialLoading(false);
      }, 500);
      return () => {
        clearTimeout(timer);
        clearTimeout(forceTimer);
      };
    }
    
    return () => clearTimeout(forceTimer);
  }, [isLoading]);

  return (
    <>
      {initialLoading && <ThemeLoader finish={finishLoading} />}
      <HashRouter>
        <ScrollToTop />
        <Layout>
          <Breadcrumbs />
          <AnimatedRoutes />
        </Layout>
        <ChatBot />
      </HashRouter>
    </>
  );
};

const App: React.FC = () => {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
};

export default App;