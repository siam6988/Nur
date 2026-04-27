import React, { useState } from 'react';
import { Product } from '../types';
import { Star, ShoppingCart, Heart, CheckCircle, XCircle, Loader2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

// Elegant Premium Loader
export const ThemeLoader: React.FC<{ finish?: boolean }> = ({ finish }) => {
  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center pointer-events-none transition-colors duration-500 ${finish ? 'bg-overlay-finish' : 'bg-primary'}`}>
      <div className={`premium-loader-container ${finish ? 'finishing' : ''}`}>
        <div className="premium-logo-reveal">
          <span className="logo-text">
            NUR<span className="dot">.</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export const ImageWithLoader = ({ src, alt, className }: { src: string, alt: string, className?: string }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <img 
      src={src} 
      alt={alt} 
      onLoad={() => setLoaded(true)}
      className={`${className} ${loaded ? 'img-blur-loaded' : 'img-blur-load'}`}
      loading="lazy"
    />
  );
};

// New Card Component
export const Card: React.FC<{ children: React.ReactNode, className?: string, onClick?: () => void }> = ({ children, className = '', onClick }) => {
  return (
    <div className={`bg-white dark:bg-darkCard p-6 rounded-lg shadow-sm border border-gray-100 dark:border-darkBorder transition-colors ${className}`} onClick={onClick}>
      {children}
    </div>
  );
};

export const LoadingSpinner: React.FC = () => {
  return <Loader2 className="animate-spin text-primary dark:text-accent" size={24} />;
};

export const AvatarRenderer: React.FC<{ avatar: string | undefined, className?: string }> = ({ avatar, className = "w-full h-full object-cover" }) => {
  if (avatar?.startsWith('sprite:')) {
    const index = parseInt(avatar.split(':')[1], 10);
    const row = Math.floor(index / 5);
    const col = index % 5;
    const posX = col * 25;
    const posY = row * 33.3333;
    return (
      <div 
        className={className} 
        style={{
          backgroundImage: "url('/avatars.jpg')",
          backgroundSize: '500% 400%',
          backgroundPosition: `${posX}% ${posY}%`,
          backgroundColor: '#fff'
        }}
      />
    );
  }
  return <img src={avatar || 'https://picsum.photos/seed/user_avatar/100/100'} alt="avatar" className={className} />;
};

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart, wishlist, toggleWishlist, language, user, t, formatPrice } = useStore();
  const discount = product.discountPercentage || 0;
  const discountedPrice = product.price - (product.price * discount / 100);
  
  const isWishlisted = wishlist.some(item => item.id === product.id);
  const displayName = language === 'bn' ? (product.name_bn || product.name_en) : (product.name_en || product.name);

  // Wholesale pricing logic
  let priceDisplay = <span className="text-primary dark:text-white font-bold text-sm md:text-lg">{formatPrice(discountedPrice)}</span>;
  let canAddToCart = true;
  
  if (product.isWholesale) {
    if (!user) {
      priceDisplay = <span className="text-accent font-bold text-xs md:text-sm">{t('loginToSeePrice')}</span>;
      canAddToCart = false;
    } else if (user.resellerStatus !== 'approved' && user.role !== 'reseller') {
      priceDisplay = <span className="text-accent font-bold text-xs md:text-sm">Apply for Wholesale</span>;
      canAddToCart = false;
    } else if (product.tierPricing && product.tierPricing.length > 0) {
      const prices = product.tierPricing.map(t => t.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      priceDisplay = <span className="text-primary dark:text-white font-bold text-sm md:text-lg">{formatPrice(minPrice)} - {formatPrice(maxPrice)}</span>;
    }
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!canAddToCart) return;
    
    addToCart(product, product.sizes?.[0] || 'Free Size', product.isWholesale ? (product.minimumOrderQuantity || 1) : 1);
    
    // Trigger small bounce animation on the button
    const target = e.currentTarget as HTMLElement;
    target.classList.add('animate-bounce-small');
    setTimeout(() => target.classList.remove('animate-bounce-small'), 400);

    // Trigger cart flash
    const cartIcon = document.getElementById('cart-icon-header');
    if (cartIcon) {
      cartIcon.classList.remove('animate-cart-flash');
      void cartIcon.offsetWidth; // reset
      cartIcon.classList.add('animate-cart-flash');
    }
  };

  return (
    <div className="product-card-premium group bg-white dark:bg-darkCard rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-darkBorder cursor-pointer relative h-full flex flex-col hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-darkBg">
        <Link to={`/product/${product.id}`}>
          <ImageWithLoader 
            src={product.images[0]} 
            alt={displayName} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        {(product.discountPercentage || 0) > 0 && !product.isWholesale && (
          <span className="absolute top-2 left-2 bg-accent text-primary text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
            -{product.discountPercentage}%
          </span>
        )}
        {product.isWholesale && product.minimumOrderQuantity && (
          <span className="absolute top-2 left-2 bg-primary text-accent text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
            MOQ: {product.minimumOrderQuantity}
          </span>
        )}
        <button 
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          className={`absolute top-2 right-2 p-1.5 rounded-full shadow-md transition hover:scale-110 z-10 ${
            isWishlisted 
              ? 'bg-accent text-primary ring-2 ring-white dark:ring-darkBg' 
              : 'bg-white/90 dark:bg-darkCard/90 text-gray-500 hover:text-accent'
          }`}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={16} className={isWishlisted ? 'fill-current' : ''} />
        </button>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/product/${product.id}`} className="hover-underline-gold text-gray-900 dark:text-gray-200 transition-colors inline-block w-full">
           <h3 className="text-xs md:text-sm font-medium line-clamp-2 mb-2 h-10" title={displayName}>{displayName}</h3>
        </Link>
        
        <div className="mt-auto">
          <div className="flex items-center space-x-2 mb-2">
            {priceDisplay}
            {(product.discountPercentage || 0) > 0 && !product.isWholesale && (
              <span className="text-gray-400 dark:text-gray-600 text-[10px] md:text-xs line-through">{formatPrice(product.price)}</span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <RatingStars rating={product.rating > 0 ? product.rating : 5} size={12} />
              <span className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">
                ({product.reviews?.length || 0})
              </span>
            </div>
            
            <div className="flex items-center gap-1.5 border border-gray-100 dark:border-darkBorder rounded-full p-1 bg-gray-50 dark:bg-darkBg shadow-sm">
              <Link
                to={`/trial-room?product=${product.id}`}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200 dark:from-blue-900/40 dark:to-purple-900/40 text-blue-700 dark:text-purple-300 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm group relative overflow-hidden"
                title="AI Try On"
              >
                 <Sparkles size={14} className="group-hover:scale-110 transition-transform" />
              </Link>
              <button 
                onClick={handleAddToCart}
                disabled={!canAddToCart}
                className={`flex items-center justify-center w-7 h-7 rounded-full transition shadow-sm ${!canAddToCart ? 'bg-gray-400 text-white cursor-not-allowed opacity-50' : 'bg-primary hover:bg-[#06152a] text-accent'}`}
                title={!canAddToCart ? "Wholesale access required" : "Add to Cart"}
              >
                <ShoppingCart size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const RatingStars: React.FC<{ rating: number, size?: number }> = ({ rating, size = 16 }) => {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star 
          key={star} 
          size={size} 
          className={`${star <= rating ? 'text-accent fill-current' : 'text-gray-300 dark:text-gray-700'}`} 
        />
      ))}
    </div>
  );
};

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'outline' | 'ghost' }> = ({ children, className, variant = 'primary', ...props }) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 hover:shadow-md";
  const variants = {
    primary: "btn-navy-gold bg-primary text-white hover:bg-[#06152a] dark:bg-white dark:text-darkBg dark:hover:bg-gray-200 shadow-sm",
    outline: "btn-navy-gold border-2 border-primary text-primary dark:border-accent dark:text-accent hover:bg-blue-50 dark:hover:bg-white/5",
    ghost: "btn-navy-gold bg-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-primary dark:hover:text-accent border border-transparent hover:border-gray-200 dark:hover:border-white/10"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className || ''}`} {...props}>
      {children}
    </button>
  );
};

export const Toast: React.FC<{ message: string; type: 'success' | 'error' }> = ({ message, type }) => {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 bg-primary dark:bg-white dark:text-darkBg text-accent px-5 py-3 rounded-lg shadow-2xl transition-all duration-300 animate-[slideUp_0.3s_ease-out]">
      {type === 'success' ? <CheckCircle size={20} className="text-accent" /> : <XCircle size={20} className="text-red-400 dark:text-red-600" />}
      <span className="font-bold text-sm text-white">{message}</span>
    </div>
  );
};

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-darkCard rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-darkBorder h-full flex flex-col animate-pulse">
      <div className="relative aspect-square bg-gray-200 dark:bg-darkBg"></div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="h-4 bg-gray-200 dark:bg-gray-700/50 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700/50 rounded w-1/2 mb-4"></div>
        <div className="mt-auto">
          <div className="h-5 bg-gray-200 dark:bg-gray-700/50 rounded w-1/3 mb-4"></div>
          <div className="flex items-center justify-between">
            <div className="h-3 bg-gray-200 dark:bg-gray-700/50 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700/50 rounded-full w-20"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const BlogCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-darkCard rounded-2xl shadow-sm border border-gray-100 dark:border-darkBorder overflow-hidden animate-pulse">
      <div className="relative overflow-hidden h-60 bg-gray-200 dark:bg-gray-800"></div>
      <div className="p-6">
        <div className="h-3 bg-gray-200 dark:bg-gray-700/50 rounded w-1/3 mb-4"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700/50 rounded w-3/4 mb-3"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700/50 rounded w-1/2 mb-5"></div>
        <div className="space-y-2 mb-6">
          <div className="h-4 bg-gray-200 dark:bg-gray-700/50 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700/50 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700/50 rounded w-2/3"></div>
        </div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700/50 rounded w-1/4"></div>
      </div>
    </div>
  );
};