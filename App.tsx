import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import { Shop, ProductDetails } from './pages/ProductPages';
import { Wholesale } from './pages/Wholesale';
import { Cart, Checkout, Profile, Login, Wishlist } from './pages/UserPages';
import { About, Contact, Policy, Terms, Affiliate, ShippingPolicy } from './pages/StaticPages';
import Admin from './pages/Admin';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <StoreProvider>
      <HashRouter>
        <ScrollToTop />
        <Layout>
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
            
            {/* Admin Route */}
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Layout>
      </HashRouter>
    </StoreProvider>
  );
};

export default App;