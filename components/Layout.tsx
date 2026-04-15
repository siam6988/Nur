import React, { useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Search, Phone, Facebook, Instagram, Twitter, MapPin, Heart, Moon, Sun, Globe, Camera, Loader2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../constants';
import { Toast } from './UIComponents';
import { Currency } from '../types';
import { analyzeImageForSearch } from '../services/gemini';

export const Navbar: React.FC = () => {
  const { cart, user, logout, theme, setTheme, language, setLanguage, currency, setCurrency, t, categories, showToast } = useStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleImageSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzingImage(true);
    try {
      const keywords = await analyzeImageForSearch(file);
      if (keywords) {
        setSearchQuery(keywords);
        navigate(`/shop?q=${encodeURIComponent(keywords.trim())}`);
        showToast("Image analyzed successfully!", "success");
      }
    } catch (error) {
      showToast("Failed to analyze image for search.", "error");
    } finally {
      setIsAnalyzingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-darkCard shadow-md dark:shadow-none border-b dark:border-darkBorder transition-colors duration-300">
      {/* Top Bar */}
      <div className="bg-primary dark:bg-primary/20 text-white text-xs py-1">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <p data-key="tagline">{t('tagline')}</p>
          <div className="flex space-x-4">
            <span className="cursor-pointer hover:text-accent" data-key="mobileApp">{t('mobileApp')}</span>
            <span className="cursor-pointer hover:text-accent" data-key="customerCare">{t('customerCare')}</span>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary dark:text-white tracking-tighter flex items-center">
            NUR<span className="text-accent text-3xl">.</span>
          </Link>

          {/* Search - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-auto relative">
            <input 
              type="text" 
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border-2 border-gray-200 dark:border-darkBorder dark:bg-darkBg dark:text-white rounded-lg py-2 px-4 pr-24 focus:outline-none focus:border-primary transition-colors"
            />
            <div className="absolute right-16 top-0 h-full flex items-center justify-center px-2">
              <label className="cursor-pointer text-gray-400 hover:text-primary transition-colors" title="Search by Image">
                {isAnalyzingImage ? <Loader2 size={20} className="animate-spin" /> : <Camera size={20} />}
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageSearch}
                  ref={fileInputRef}
                  disabled={isAnalyzingImage}
                />
              </label>
            </div>
            <button type="submit" className="absolute right-0 top-0 h-full bg-primary text-white px-6 rounded-r-lg hover:bg-blue-800 transition">
              <Search size={20} />
            </button>
          </form>

          {/* Actions */}
          <div className="flex items-center space-x-2 md:space-x-6">
            
            {/* Currency Toggle */}
            <div className="relative group">
              <button className="flex items-center gap-1 px-2 py-1 rounded-full border border-gray-200 dark:border-darkBorder bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300 text-xs font-bold hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                {currency}
              </button>
              <div className="absolute right-0 mt-2 w-24 bg-white dark:bg-darkCard border border-gray-100 dark:border-darkBorder rounded-lg shadow-xl hidden group-hover:block p-1">
                {Object.values(Currency).map(c => (
                  <button 
                    key={c}
                    onClick={() => setCurrency(c)}
                    className={`block w-full text-left px-4 py-2 text-sm rounded ${currency === c ? 'bg-primary/10 text-primary dark:text-white font-bold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-darkBg'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Language Toggle */}
            <button 
              onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
              className="flex items-center gap-1 px-2 py-1 rounded-full border border-gray-200 dark:border-darkBorder bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300 text-xs font-bold hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              title={language === 'bn' ? 'Switch to English' : 'বাংলায় দেখুন'}
            >
              <Globe size={14} />
              {language === 'bn' ? 'EN' : 'BN'}
            </button>

            {/* Theme Toggle */}
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <Link to="/cart" className="relative text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white transition">
              <ShoppingCart size={24} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative group">
                <Link to="/profile" className="flex items-center space-x-1 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-white">
                  <User size={24} />
                  <span className="hidden md:inline font-medium text-sm truncate max-w-[100px]">{user.name}</span>
                </Link>
                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-darkCard border border-gray-100 dark:border-darkBorder rounded-lg shadow-xl hidden group-hover:block p-2">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-darkBg rounded" data-key="profile">{t('profile')}</Link>
                  <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-darkBg rounded" data-key="orders">{t('orders')}</Link>
                  <button onClick={logout} className="w-full text-left block px-4 py-2 text-sm text-danger hover:bg-red-50 dark:hover:bg-red-900/20 rounded" data-key="logout">{t('logout')}</button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white transition">
                <span className="font-medium text-sm" data-key="login">{t('login')}</span>
              </Link>
            )}

            {/* Mobile Menu Btn */}
            <button className="md:hidden text-gray-600 dark:text-gray-300" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Search - Mobile */}
        <form onSubmit={handleSearch} className="md:hidden mt-3 relative">
          <input 
            type="text" 
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-300 dark:border-darkBorder dark:bg-darkBg dark:text-white rounded-md py-2 px-4 pr-20 text-sm"
          />
          <div className="absolute right-10 top-0 h-full flex items-center justify-center px-1">
            <label className="cursor-pointer text-gray-400 hover:text-primary transition-colors" title="Search by Image">
              {isAnalyzingImage ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageSearch}
                disabled={isAnalyzingImage}
              />
            </label>
          </div>
          <button type="submit" className="absolute right-3 top-2.5 text-gray-400">
            <Search size={18} />
          </button>
        </form>
      </div>

      {/* Categories Bar - Desktop */}
      <div className="hidden md:block border-t border-gray-100 dark:border-darkBorder bg-white dark:bg-darkCard">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8 py-2 overflow-x-auto no-scrollbar items-center">
            <Link to="/shop" className="text-sm font-bold text-primary dark:text-white hover:text-blue-600 whitespace-nowrap flex items-center gap-1">
              <ShoppingCart size={14} /> {t('retail')}
            </Link>
            <Link to="/wholesale" className="text-sm font-bold text-accent hover:text-yellow-600 whitespace-nowrap flex items-center gap-1">
              <ShoppingCart size={14} /> {t('wholesale')}
            </Link>
            <div className="w-px h-4 bg-gray-300 dark:bg-gray-700"></div>
            {categories.map(cat => (
              <Link key={cat.id} to={`/shop?category=${cat.id}`} className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-white whitespace-nowrap">
                {language === 'bn' ? cat.name_bn : cat.name_en}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-darkCard border-t border-gray-100 dark:border-darkBorder py-2">
            <Link to="/shop" className="block px-4 py-2 text-sm font-bold text-primary dark:text-white" onClick={() => setIsMenuOpen(false)}>
              {t('retail')}
            </Link>
            <Link to="/wholesale" className="block px-4 py-2 text-sm font-bold text-accent" onClick={() => setIsMenuOpen(false)}>
              {t('wholesale')}
            </Link>
            <div className="border-t border-gray-100 dark:border-darkBorder my-1"></div>
           {categories.map(cat => (
              <Link key={cat.id} to={`/shop?category=${cat.id}`} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300" onClick={() => setIsMenuOpen(false)}>
                {language === 'bn' ? cat.name_bn : cat.name_en}
              </Link>
            ))}
        </div>
      )}
    </header>
  );
};

export const Footer: React.FC = () => {
  const { t } = useStore();
  
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6 border-t border-gray-800">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-2xl font-bold text-white mb-4">NUR<span className="text-accent">.</span></h3>
          <p className="text-sm leading-relaxed mb-4" data-key="footerDesc">
            {t('footerDesc')}
          </p>
          <div className="flex space-x-4">
            <Facebook className="hover:text-primary cursor-pointer transition" />
            <Instagram className="hover:text-primary cursor-pointer transition" />
            <Twitter className="hover:text-primary cursor-pointer transition" />
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-white mb-4" data-key="quickLinks">{t('quickLinks')}</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-white transition" data-key="aboutUs">{t('aboutUs')}</Link></li>
            <li><Link to="/shipping" className="hover:text-white transition" data-key="shippingPolicy">{t('shippingPolicy')}</Link></li>
            <li><Link to="/affiliate" className="hover:text-accent transition font-bold text-accent" data-key="affiliate">{t('affiliate')}</Link></li>
            <li><Link to="/policy" className="hover:text-white transition" data-key="privacyPolicy">{t('privacyPolicy')}</Link></li>
            <li><Link to="/terms" className="hover:text-white transition" data-key="terms">{t('terms')}</Link></li>
            <li><Link to="/contact" className="hover:text-white transition" data-key="contactUs">{t('contactUs')}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-white mb-4" data-key="customerArea">{t('customerArea')}</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/profile" className="hover:text-white transition" data-key="myAccount">{t('myAccount')}</Link></li>
            <li><Link to="/orders" className="hover:text-white transition" data-key="trackOrder">{t('trackOrder')}</Link></li>
            <li><Link to="/cart" className="hover:text-white transition" data-key="shoppingCart">{t('shoppingCart')}</Link></li>
            <li><Link to="/wishlist" className="hover:text-white transition" data-key="wishlist">{t('wishlist')}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-white mb-4" data-key="contact">{t('contact')}</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start space-x-2">
              <MapPin size={18} className="mt-1 flex-shrink-0 text-accent" />
              <span>Hocker's Market, Bondor Bazar, Sylhet</span>
            </li>
            <li className="flex items-center space-x-2">
              <Phone size={18} className="text-accent" />
              <span className="font-bold">+880 1736118083</span>
            </li>
          </ul>
          <div className="mt-8">
             <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Accepted Payments</span>
             <div className="flex flex-wrap gap-2 mt-3">
                <span className="bg-gray-800 border border-gray-700 px-3 py-1 rounded text-[10px] font-bold text-white uppercase">Bkash</span>
                <span className="bg-gray-800 border border-gray-700 px-3 py-1 rounded text-[10px] font-bold text-white uppercase">Nogod</span>
                <span className="bg-gray-800 border border-gray-700 px-3 py-1 rounded text-[10px] font-bold text-white uppercase text-accent">COD</span>
             </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 mt-10 pt-6 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} NUR E-commerce. Designed for Trust & Excellence in Sylhet, Bangladesh.
      </div>
    </footer>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useStore();

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800 dark:text-gray-100 transition-colors duration-300">
      <Navbar />
      <main className="flex-grow bg-gray-50 dark:bg-darkBg">
        {children}
      </main>
      <Footer />
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};