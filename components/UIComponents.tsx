import React from 'react';
import { Product } from '../types';
import { Star, ShoppingCart, Heart, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white dark:bg-darkCard p-6 rounded-lg shadow-sm border border-gray-100 dark:border-darkBorder transition-colors ${className}`}>{children}</div>
);

export const LoadingSpinner: React.FC = () => <Loader2 className="animate-spin text-primary dark:text-white" size={20} />;

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart, wishlist, toggleWishlist, language, user, t, getDiscountedPrice } = useStore();
  const discountedPrice = getDiscountedPrice(product);
  
  const isWishlisted = wishlist.some(item => item.id === product.id);
  const displayName = language === 'bn' ? (product.name_bn || product.name_en) : (product.name_en || product.name);

  let priceDisplay = <span className="text-primary dark:text-white font-bold text-sm md:text-lg">৳{discountedPrice}</span>;
  if (product.isWholesale) {
    if (!user) priceDisplay = <span className="text-accent font-bold text-xs md:text-sm">{t('loginToSeePrice')}</span>;
    else if (product.tierPricing && product.tierPricing.length > 0) {
      const prices = product.tierPricing.map(t => t.price);
      priceDisplay = <span className="text-primary dark:text-white font-bold text-sm md:text-lg">৳{Math.min(...prices)} - ৳{Math.max(...prices)}</span>;
    }
  }

  const discountVal = product.discount !== undefined ? product.discount : (product.discountPercentage || 0);

  return (
    <div className="group bg-white dark:bg-darkCard rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-darkBorder cursor-pointer relative h-full flex flex-col">
      <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-darkBg">
        <Link to={`/product/${product.id}`}>
          <img src={product.images[0]} alt={displayName} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
        </Link>
        {discountVal > 0 && !product.isWholesale && (
          <span className="absolute top-2 left-2 bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
            -{product.discountType === 'fixed' ? `৳${discountVal}` : `${discountVal}%`}
          </span>
        )}
        {product.isWholesale && product.minimumOrderQuantity && (
          <span className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">MOQ: {product.minimumOrderQuantity}</span>
        )}
        <button onClick={(e) => { e.preventDefault(); toggleWishlist(product); }} className={`absolute top-2 right-2 p-1.5 rounded-full shadow-md transition ${isWishlisted ? 'bg-red-50 text-red-500 opacity-100' : 'bg-white text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-500'}`}>
          <Heart size={16} className={isWishlisted ? 'fill-current' : ''} />
        </button>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/product/${product.id}`} className="hover:text-primary dark:hover:text-white transition">
           <h3 className="text-xs md:text-sm font-medium line-clamp-2 mb-2 h-10 dark:text-gray-200">{displayName}</h3>
        </Link>
        <div className="mt-auto">
          <div className="flex items-center space-x-2 mb-2">
            {priceDisplay}
            {discountVal > 0 && !product.isWholesale && <span className="text-gray-400 text-[10px] md:text-xs line-through">৳{product.price}</span>}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Star size={14} className="text-accent fill-current" />
              <span className="text-[10px] md:text-xs text-gray-500 ml-1">{product.rating > 0 ? product.rating.toFixed(1) : 'New'}</span>
            </div>
            <button onClick={(e) => { e.preventDefault(); addToCart(product, product.sizes?.[0] || 'Free Size', product.isWholesale ? (product.minimumOrderQuantity || 1) : 1); }} className="flex items-center gap-1.5 bg-primary hover:bg-blue-700 text-white text-[10px] md:text-xs font-medium px-3 py-1.5 rounded-full transition shadow-sm">
              <ShoppingCart size={12} /> Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const RatingStars: React.FC<{ rating: number, size?: number }> = ({ rating, size = 16 }) => (
  <div className="flex">
    {[1, 2, 3, 4, 5].map(star => <Star key={star} size={size} className={`${star <= rating ? 'text-accent fill-current' : 'text-gray-300 dark:text-gray-700'}`} />)}
  </div>
);

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'outline' | 'ghost' }> = ({ children, className, variant = 'primary', ...props }) => {
  const variants = {
    primary: "bg-primary text-white hover:bg-blue-800 dark:bg-white dark:text-darkBg dark:hover:bg-gray-200",
    outline: "border-2 border-primary text-primary dark:border-white dark:text-white hover:bg-blue-50 dark:hover:bg-white/10",
    ghost: "bg-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
  };
  return <button className={`px-4 py-2 rounded-lg font-medium transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className || ''}`} {...props}>{children}</button>;
};

export const Toast: React.FC<{ message: string; type: 'success' | 'error' }> = ({ message, type }) => (
  <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 bg-gray-900 text-white px-5 py-3 rounded-lg shadow-2xl transition-all duration-300 animate-[slideUp_0.3s_ease-out]">
    {type === 'success' ? <CheckCircle size={20} className="text-green-400" /> : <XCircle size={20} className="text-red-400" />}
    <span className="font-bold text-sm">{message}</span>
  </div>
);
