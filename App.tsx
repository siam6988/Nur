import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home as HomeIcon } from 'lucide-react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Layout } from './components/Layout';
import { ThemeLoader } from './components/UIComponents';
import Home from './pages/Home';
import { Shop, ProductDetails } from './pages/ProductPages';
import { Wholesale } from './pages/Wholesale';
import { Cart, Checkout, Profile, Login, Wishlist } from './pages/UserPages';
import { About, Contact, Policy, Terms, Affiliate, ShippingPolicy } from './pages/StaticPages';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Global Scroll Reveal Observer
const ScrollRevealObserver = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    // Ensure DOM is ready before observing
    setTimeout(() => {
      const revealElements = document.querySelectorAll('.reveal');
      revealElements.forEach(el => observer.observe(el));
    }, 100);

    return () => observer.disconnect();
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

const App: React.FC = () => {
  const [initialLoading, setInitialLoading] = useState(true);
  const [finishLoading, setFinishLoading] = useState(false);

  useEffect(() => {
    // Simulate initial asset loading for premium feel
    const timer = setTimeout(() => {
      setFinishLoading(true); // Trigger finish animation
      setTimeout(() => setInitialLoading(false), 500); // Wait for fade out
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <StoreProvider>
      {initialLoading && <ThemeLoader finish={finishLoading} />}
      <HashRouter>
        <ScrollToTop />
        <ScrollRevealObserver />
        <Layout>
          <Breadcrumbs />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/wholesale" element={<Wholesale />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders" element={<Profile />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/login" element={<Login />} />
            
            {/* Static Pages */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/policy" element={<Policy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/shipping" element={<ShippingPolicy />} />
            <Route path="/affiliate" element={<Affiliate />} />
          </Routes>
        </Layout>
      </HashRouter>
    </StoreProvider>
  );
};

export default App;