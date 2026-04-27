import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ProductCard, RatingStars, Button, Card, LoadingSpinner, ProductCardSkeleton } from '../components/UIComponents';
import { CATEGORIES } from '../constants';
import { Filter, ShoppingCart, Heart, Minus, Plus, Share2, Star, Search, X, Package, Sparkles, Loader2 } from 'lucide-react';
import { Product, OrderStatus } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { useSEO } from '../hooks/useSEO';

// --- Shop Page ---
export const Shop: React.FC = () => {
  useSEO({
    title: 'Shop All Products',
    description: 'Browse our complete collection of premium lifestyle and fashion products at NUR. Best prices and regular discounts.',
    keywords: 'NUR shop, buy clothes, premium fashion BD, online shopping',
    url: 'https://nur-eight.vercel.app/shop'
  });

  const { products, isLoading, t } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [filterCat, setFilterCat] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [showWholesale, setShowWholesale] = useState(false);
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category');
    const query = params.get('q');
    
    if (cat) setFilterCat(cat);
    if (query) setSearchQuery(query);
  }, [location.search]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter(p => {
      if (!showWholesale && p.isWholesale) return false;
      if (showWholesale && !p.isWholesale) return false;
      
      const matchesCategory = filterCat === 'all' || p.categoryId === filterCat || p.category === filterCat;
      const nameEn = p.name_en || p.name || '';
      const nameBn = p.name_bn || '';
      const descEn = p.description_en || p.description || '';
      const descBn = p.description_bn || '';
      
      const searchTerms = searchQuery.toLowerCase().split(' ').filter(term => term.length > 0);
      const matchesSearch = searchTerms.length === 0 || searchTerms.some(term => 
        nameEn.toLowerCase().includes(term) || 
        nameBn.includes(term) ||
        descEn.toLowerCase().includes(term) ||
        descBn.includes(term)
      );
      const discount = p.discountPercentage || 0;
      const discountedPrice = p.price - (p.price * discount / 100);
      const matchesMinPrice = minPrice === '' || discountedPrice >= Number(minPrice);
      const matchesMaxPrice = maxPrice === '' || discountedPrice <= Number(maxPrice);
      return matchesCategory && matchesSearch && matchesMinPrice && matchesMaxPrice;
    });

    if (sortBy === 'price-low') {
      result.sort((a, b) => (a.price*(1-(a.discountPercentage||0)/100)) - (b.price*(1-(b.discountPercentage||0)/100)));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => (b.price*(1-(b.discountPercentage||0)/100)) - (a.price*(1-(a.discountPercentage||0)/100)));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }
    return result;
  }, [products, filterCat, searchQuery, minPrice, maxPrice, sortBy]);

  const clearFilters = () => {
    setFilterCat('all');
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('default');
    setShowWholesale(false);
    navigate('/shop');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 flex-shrink-0">
          <Card className="sticky top-24 !p-5">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-primary dark:text-white" />
                <h3 className="font-bold text-lg dark:text-white" data-key="filter">{t('filter')}</h3>
              </div>
              {(filterCat !== 'all' || minPrice || maxPrice) && (
                <button onClick={clearFilters} className="text-xs text-primary dark:text-accent font-bold hover:underline" data-key="reset">{t('reset')}</button>
              )}
            </div>
            
            <div className="mb-8">
              <h4 className="font-bold mb-4 text-xs text-gray-400 uppercase tracking-widest" data-key="category">{t('category')}</h4>
              <div className="space-y-2">
                {CATEGORIES.map(cat => (
                  <label key={cat.id} className="flex items-center group cursor-pointer">
                    <input type="radio" name="category" className="hidden" checked={filterCat === cat.id} onChange={() => setFilterCat(cat.id)} />
                    <span className={`text-sm transition-all ${filterCat === cat.id ? 'text-primary dark:text-white font-bold translate-x-1' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'}`}>{t(`cat_${cat.id}`)}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-xs text-gray-400 uppercase tracking-widest" data-key="priceRange">{t('priceRange')}</h4>
              <div className="flex flex-col gap-2 mb-8">
                <input type="number" placeholder={t('min')} value={minPrice} onChange={e => setMinPrice(e.target.value)} className="w-full border dark:border-darkBorder dark:bg-darkBg dark:text-white p-2 text-sm rounded-md focus:ring-1 focus:ring-primary outline-none" />
                <input type="number" placeholder={t('max')} value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="w-full border dark:border-darkBorder dark:bg-darkBg dark:text-white p-2 text-sm rounded-md focus:ring-1 focus:ring-primary outline-none" />
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-xs text-gray-400 uppercase tracking-widest">Type</h4>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={showWholesale} 
                  onChange={(e) => setShowWholesale(e.target.checked)} 
                  className="w-4 h-4 text-primary"
                />
                <span className="text-sm dark:text-gray-300">Wholesale Products</span>
              </label>
            </div>
          </Card>
        </div>

        {/* Content Area */}
        <div className="flex-1">
           {/* Search & Sort */}
           <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <input 
                  type="text" 
                  placeholder={t('searchProduct')}
                  className="w-full dark:bg-darkCard dark:text-white border border-gray-200 dark:border-darkBorder rounded-xl py-3 pl-12 pr-4 shadow-sm focus:ring-2 focus:ring-primary/20 transition outline-none"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-4 top-3.5 text-gray-400 hover:text-danger"><X size={20} /></button>}
              </div>
              <select 
                className="bg-white dark:bg-darkCard dark:text-white border dark:border-darkBorder rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
              >
                <option value="default">{t('sortDefault')}</option>
                <option value="price-low">{t('sortLowHigh')}</option>
                <option value="price-high">{t('sortHighLow')}</option>
                <option value="rating">{t('sortRating')}</option>
              </select>
           </div>

           {isLoading ? (
             <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {[...Array(8)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
             </div>
           ) : filteredAndSortedProducts.length > 0 ? (
             <motion.div 
               initial="hidden"
               animate="visible"
               variants={{
                 hidden: {},
                 visible: { transition: { staggerChildren: 0.05 } }
               }}
               className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
             >
               {filteredAndSortedProducts.map(p => (
                 <motion.div 
                   key={p.id}
                   variants={{
                     hidden: { opacity: 0, y: 15, scale: 0.96 },
                     visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 100 } }
                   }}
                 >
                   <ProductCard product={p} />
                 </motion.div>
               ))}
             </motion.div>
           ) : (
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="flex flex-col items-center justify-center py-24 text-center bg-white dark:bg-darkCard rounded-3xl border border-gray-100 dark:border-darkBorder shadow-sm"
             >
               <div className="relative mb-8">
                 <div className="absolute inset-0 bg-primary/10 dark:bg-primary/5 rounded-full blur-2xl transform scale-150"></div>
                 <div className="relative bg-primary/5 dark:bg-primary/10 p-8 rounded-full">
                   <Search size={56} className="text-primary/60 dark:text-primary/40" />
                 </div>
               </div>
               <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3" data-key="noProductFound">{t('noProductFound') || 'No Products Found'}</h3>
               <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md px-4 leading-relaxed">
                 We couldn't find any products matching your current filters or search query. Try adjusting them or browse all our products.
               </p>
               <Button onClick={clearFilters} className="px-8 py-3 rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all font-bold text-sm" data-key="viewAllProducts">
                 {t('viewAllProducts') || 'View All Products'}
               </Button>
             </motion.div>
           )}
        </div>
      </div>
    </div>
  );
};

// --- Product Details Page ---
export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToCart, toggleWishlist, wishlist, addReview, user, orders, isLoading, t, language, addToRecentlyViewed, formatPrice, calculateAppliedPrice } = useStore();
  const product = products.find(p => p.id === id);
  
  useSEO({
    title: product ? product.name : 'Product Details',
    description: product ? product.description.substring(0, 160) : 'View product details at NUR',
    image: product ? product.images[0] : undefined,
    url: typeof window !== 'undefined' ? window.location.href : '',
    keywords: product ? `${product.name}, buy ${product.name} BD, ${product.category}` : '',
    schema: product ? {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.name,
      "image": product.images,
      "description": product.description,
      "brand": {
        "@type": "Brand",
        "name": "NUR"
      },
      "sku": product.id,
      "offers": {
        "@type": "Offer",
        "url": typeof window !== 'undefined' ? window.location.href : '',
        "priceCurrency": "BDT",
        "price": calculateAppliedPrice ? calculateAppliedPrice(product, 1) : product.price,
        "itemCondition": "https://schema.org/NewCondition",
        "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
      }
    } : undefined
  });

  const [selectedSize, setSelectedSize] = useState<string>(product?.sizes[0] || '');
  const [mainImage, setMainImage] = useState(product?.images[0] || '');
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [zoomStyle, setZoomStyle] = useState({ opacity: 0, backgroundPosition: '0% 0%' });
  const [quantity, setQuantity] = useState<number>(1);
  const [quantityError, setQuantityError] = useState<string>('');
  const [buyNowMessage, setBuyNowMessage] = useState<string>('');

  // AI Fit Predictor States
  const [showAIFitPrompt, setShowAIFitPrompt] = useState(false);
  const [fitHeight, setFitHeight] = useState('');
  const [fitWeight, setFitWeight] = useState('');
  const [fitResult, setFitResult] = useState<{size: string, match: number} | null>(null);
  const [isFitting, setIsFitting] = useState(false);

  // AI Stylist States
  const [showStylist, setShowStylist] = useState(false);
  const [isStyling, setIsStyling] = useState(false);
  const [stylingTips, setStylingTips] = useState<string[]>([]);

  const handleAIFit = () => {
    if (!fitHeight || !fitWeight) return;
    setIsFitting(true);
    setTimeout(() => {
       const sizes = product?.sizes || ['M'];
       const heightInt = parseInt(fitHeight);
       let predicted = sizes[0];
       if (heightInt > 180 && sizes.includes('XL')) predicted = 'XL';
       else if (heightInt > 170 && sizes.includes('L')) predicted = 'L';
       else if (heightInt > 160 && sizes.includes('M')) predicted = 'M';
       else if (sizes.includes('S')) predicted = 'S';
       
       setFitResult({ size: predicted, match: Math.floor(Math.random() * 8) + 90 });
       setSelectedSize(predicted);
       setIsFitting(false);
    }, 2000);
  };

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0]);
      setMainImage(product.images[0]);
      addToRecentlyViewed(product);
      setFitResult(null);
      setShowAIFitPrompt(false);
      setShowStylist(false);
      setStylingTips([]);
      if (product.isWholesale && product.minimumOrderQuantity) {
        setQuantity(product.minimumOrderQuantity);
      } else {
        setQuantity(1);
      }
      setQuantityError('');
    }
  }, [product]);

  const handleAskStylist = () => {
    if (stylingTips.length > 0) {
      setShowStylist(!showStylist);
      return;
    }
    
    setShowStylist(true);
    setIsStyling(true);
    setTimeout(() => {
      // Mock AI stylist output based on category
      let tips = [
        "Pair it with classic white sneakers for a clean look.",
        "Layer under a denim jacket for cooler evenings.",
        "Accessorize with simple silver minimalist jewelry."
      ];
      if (product?.categoryId === 'c2' || product?.category === 'electronics') {
        tips = [
          "Perfect for your minimalist desk setup.",
          "Keep it protected with an anti-scratch clear case.",
          "Pair with a sleek wireless charging pad to complete the look."
        ];
      } else if (product?.categoryId === 'c3') {
        tips = [
          "Use a matte setting spray to lock the look in completely.",
          "Pair with a neutral lip color to let the eyes shine."
        ];
      }
      setStylingTips(tips);
      setIsStyling(false);
    }, 2500);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 animate-pulse">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 bg-white dark:bg-darkCard p-6 rounded-2xl border border-gray-100 dark:border-darkBorder">
          <div className="w-full md:w-1/2 space-y-4">
            <div className="w-full aspect-[4/5] bg-gray-200 dark:bg-darkBg rounded-xl"></div>
            <div className="flex gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-20 h-20 bg-gray-200 dark:bg-darkBg rounded-lg"></div>
              ))}
            </div>
          </div>
          <div className="w-full md:w-1/2 space-y-6">
            <div className="h-4 bg-gray-200 dark:bg-darkBg w-24 rounded"></div>
            <div className="h-8 bg-gray-200 dark:bg-darkBg w-3/4 rounded"></div>
            <div className="h-6 bg-gray-200 dark:bg-darkBg w-1/4 rounded"></div>
            <div className="space-y-3 pt-6 border-t border-gray-100 dark:border-darkBorder">
              <div className="h-4 bg-gray-200 dark:bg-darkBg w-full rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-darkBg w-5/6 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-darkBg w-4/6 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (!product) return <div className="p-10 text-center dark:text-white">Product not found</div>;

  const discount = product.discountPercentage || 0;
  const discountedPrice = product.price - (product.price * discount / 100);
  const canReview = user && orders.some(order => order.status === OrderStatus.DELIVERED && order.items.some(item => item.id === product.id));
  const hasReviewed = user && product.reviews?.some(r => r.userId === user.id);
  
  const displayName = language === 'bn' ? (product.name_bn || product.name_en) : (product.name_en || product.name);
  const displayDescription = language === 'bn' ? (product.description_bn || product.description_en) : (product.description_en || product.description);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({ opacity: 1, backgroundPosition: `${x}% ${y}%` });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ opacity: 0, backgroundPosition: '0% 0%' });
  };

  const currentPrice = product.isWholesale ? calculateAppliedPrice(product as any, quantity) : discountedPrice;
  const totalPrice = currentPrice * quantity;

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val)) {
      setQuantity(val);
      if (product.isWholesale && product.minimumOrderQuantity && val < product.minimumOrderQuantity) {
        setQuantityError(`${t('moqRequired')} ${product.minimumOrderQuantity}`);
      } else {
        setQuantityError('');
      }
    } else if (e.target.value === '') {
      setQuantity(0 as any); // allow empty temporarily while typing
      if (product.isWholesale && product.minimumOrderQuantity) {
        setQuantityError(`${t('moqRequired')} ${product.minimumOrderQuantity}`);
      }
    }
  };

  const handleQuantityBlur = () => {
    if (quantity < 1 || isNaN(quantity)) {
      setQuantity(product.isWholesale && product.minimumOrderQuantity ? product.minimumOrderQuantity : 1);
      setQuantityError('');
    } else if (product.isWholesale && product.minimumOrderQuantity && quantity < product.minimumOrderQuantity) {
      // User typed a quantity less than MOQ. We leave it as typed so they see the error.
      setQuantityError(`${t('moqRequired')} ${product.minimumOrderQuantity}`);
    } else {
      setQuantityError('');
    }
  };

  const handleAddToCart = () => {
    if (product.isWholesale && product.minimumOrderQuantity && quantity < product.minimumOrderQuantity) {
      setQuantityError(`${t('moqRequired')} ${product.minimumOrderQuantity}`);
      return;
    }
    addToCart(product, selectedSize, quantity);
  };

  const handleBuyNow = () => {
    if (product.isWholesale && product.minimumOrderQuantity && quantity < product.minimumOrderQuantity) {
      setQuantityError(`${t('moqRequired')} ${product.minimumOrderQuantity}`);
      return;
    }
    addToCart(product, selectedSize, quantity);
    setBuyNowMessage('Added to cart! Redirecting...');
    setTimeout(() => {
      navigate('/checkout');
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="container mx-auto px-4 py-8"
    >
       <Card className="!p-6 md:!p-10 shadow-lg border-primary/5">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
           <motion.div 
             initial={{ opacity: 0, x: -30 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.6, delay: 0.2 }}
             className="space-y-4"
           >
             <div 
               className="aspect-square bg-gray-100 dark:bg-darkBg rounded-2xl overflow-hidden border dark:border-darkBorder relative cursor-crosshair"
               onMouseMove={handleMouseMove}
               onMouseLeave={handleMouseLeave}
             >
               <img src={mainImage} alt={displayName} className="w-full h-full object-cover" />
               <div 
                 className="absolute inset-0 pointer-events-none transition-opacity duration-200"
                 style={{
                   backgroundImage: `url(${mainImage})`,
                   backgroundPosition: zoomStyle.backgroundPosition,
                   backgroundSize: '200%',
                   opacity: zoomStyle.opacity
                 }}
               />
             </div>
             <div className="flex gap-2 overflow-x-auto no-scrollbar">
               {product.images.map((img, idx) => (
                 <button key={idx} onClick={() => setMainImage(img)} className={`w-16 h-16 rounded-lg border-2 flex-shrink-0 ${mainImage === img ? 'border-primary' : 'border-gray-200 dark:border-darkBorder'}`}>
                   <img src={img} alt="thumb" className="w-full h-full object-cover rounded-md" />
                 </button>
               ))}
             </div>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, x: 30 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.6, delay: 0.3 }}
             className="flex flex-col h-full"
           >
             <h1 className="text-2xl md:text-4xl font-bold dark:text-white mb-2">{displayName}</h1>
             
             {product.isWholesale && (
               <div className="mb-4 inline-block bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs font-bold px-3 py-1 rounded-full">
                 {t('wholesale')}
               </div>
             )}

             <div className="flex items-center gap-4 mb-6">
                <RatingStars rating={product.rating} />
                <span className="text-sm text-gray-500">({product.reviews?.length || 0} {t('reviews')})</span>
                <span className="text-gray-300 dark:text-gray-700">|</span>
                <button 
                  onClick={handleAskStylist}
                  className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 flex items-center gap-1 hover:opacity-80 transition"
                >
                  <Sparkles size={14} className="text-purple-500" /> Ask AI Stylist
                </button>
             </div>

             <AnimatePresence>
               {showStylist && (
                 <motion.div 
                   initial={{ height: 0, opacity: 0 }}
                   animate={{ height: 'auto', opacity: 1 }}
                   exit={{ height: 0, opacity: 0 }}
                   className="overflow-hidden mb-6"
                 >
                   <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10 border border-purple-100 dark:border-purple-800/30 rounded-xl p-5 shadow-sm">
                     <h4 className="text-sm font-bold text-purple-800 dark:text-purple-300 mb-3 flex items-center gap-2">
                       <Sparkles size={14} /> AI Stylist Recommendations
                     </h4>
                     {isStyling ? (
                       <div className="flex items-center gap-3 text-sm text-gray-500 py-2">
                         <Loader2 size={16} className="animate-spin text-purple-500" />
                         Analyzing trends and item features...
                       </div>
                     ) : (
                       <ul className="space-y-2">
                         {stylingTips.map((tip, idx) => (
                           <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                             <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0"></div>
                             {tip}
                           </li>
                         ))}
                       </ul>
                     )}
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>
             
             <div className="bg-gray-50 dark:bg-darkBg p-6 rounded-2xl border dark:border-darkBorder mb-8">
               {product.isWholesale ? (
                 !user ? (
                   <div className="text-xl font-bold text-accent">{t('loginToSeePrice')}</div>
                 ) : (user.resellerStatus !== 'approved' && user.role !== 'reseller') ? (
                   <div className="text-xl font-bold text-accent">Apply for Wholesale to see prices</div>
                 ) : (
                   <div>
                     <div className="flex items-end gap-2 mb-2">
                       <span className="text-4xl font-bold text-primary dark:text-white">{formatPrice(currentPrice)}</span>
                       <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">/ unit</span>
                     </div>
                     <div className="text-sm text-gray-600 dark:text-gray-400">
                       Total: <span className="font-bold text-gray-900 dark:text-white">{formatPrice(totalPrice)}</span> for {quantity} units
                     </div>
                   </div>
                 )
               ) : (
                 <div>
                   <span className="text-4xl font-bold text-primary dark:text-white">{formatPrice(discountedPrice)}</span>
                   {(product.discountPercentage || 0) > 0 && <span className="text-gray-400 line-through ml-4">{formatPrice(product.price)}</span>}
                 </div>
               )}
             </div>

             {product.isWholesale && user && product.tierPricing && product.tierPricing.length > 0 && (
               <div className="mb-8">
                 <h4 className="font-bold text-sm mb-3 dark:text-white">{t('tierPricing')}</h4>
                 <div className="bg-white dark:bg-darkCard border dark:border-darkBorder rounded-lg overflow-hidden">
                   <table className="w-full text-sm text-left">
                     <thead className="bg-gray-50 dark:bg-darkBg text-gray-600 dark:text-gray-400">
                       <tr>
                         <th className="px-4 py-2 font-medium">Quantity</th>
                         <th className="px-4 py-2 font-medium">Price / Unit</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100 dark:divide-darkBorder">
                       {product.tierPricing.map((tier, idx) => (
                         <tr key={idx} className={quantity >= tier.min && (!tier.max || quantity <= tier.max) ? 'bg-blue-50 dark:bg-blue-900/10' : ''}>
                           <td className="px-4 py-2 dark:text-gray-300">
                             {tier.min} {tier.max ? `- ${tier.max}` : '+'}
                           </td>
                           <td className="px-4 py-2 font-bold text-primary dark:text-white">{formatPrice(tier.price)}</td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
               </div>
             )}
             
             <div className="mb-8">
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed whitespace-pre-wrap">{displayDescription}</p>

               {product.sizes && product.sizes.length > 0 && (
                 <>
                   <div className="flex justify-between items-end mb-4">
                     <p className="text-xs font-bold text-gray-400 uppercase tracking-widest" data-key="selectSize">{t('selectSize')}</p>
                     <button 
                       onClick={() => setShowAIFitPrompt(!showAIFitPrompt)}
                       className="text-xs flex items-center gap-1 font-bold text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                     >
                       <Sparkles size={12} className="animate-pulse" /> Find My Fit (AI)
                     </button>
                   </div>
                   
                   <AnimatePresence>
                     {showAIFitPrompt && (
                       <motion.div 
                         initial={{ height: 0, opacity: 0 }}
                         animate={{ height: 'auto', opacity: 1 }}
                         exit={{ height: 0, opacity: 0 }}
                         className="overflow-hidden mb-6"
                       >
                         <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/40 rounded-xl p-4">
                           <h4 className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2">
                             <Sparkles size={14} /> AI Size Match
                           </h4>
                           {fitResult ? (
                             <div className="bg-white dark:bg-darkCard p-3 rounded-lg border border-blue-100 dark:border-blue-800 shadow-sm text-center">
                               <p className="text-sm text-gray-600 dark:text-gray-300">Based on our data, your perfect size is:</p>
                               <div className="text-3xl font-black text-blue-600 dark:text-blue-400 my-2">{fitResult.size}</div>
                               <p className="text-xs text-blue-500 font-medium">✨ {fitResult.match}% Match Confidence</p>
                               <button 
                                 onClick={() => { setFitResult(null); setShowAIFitPrompt(false); }}
                                 className="text-xs text-gray-500 mt-3 hover:underline"
                               >
                                 Recalculate
                               </button>
                             </div>
                           ) : (
                             <div className="space-y-3">
                               <div className="grid grid-cols-2 gap-3">
                                 <div>
                                   <label className="text-xs text-gray-600 dark:text-gray-400 block mb-1">Height (cm)</label>
                                   <input type="number" value={fitHeight} onChange={e => setFitHeight(e.target.value)} placeholder="e.g. 175" className="w-full p-2 text-sm border dark:border-darkBorder rounded bg-white dark:bg-darkBg dark:text-white" />
                                 </div>
                                 <div>
                                   <label className="text-xs text-gray-600 dark:text-gray-400 block mb-1">Weight (kg)</label>
                                   <input type="number" value={fitWeight} onChange={e => setFitWeight(e.target.value)} placeholder="e.g. 70" className="w-full p-2 text-sm border dark:border-darkBorder rounded bg-white dark:bg-darkBg dark:text-white" />
                                 </div>
                               </div>
                               <button 
                                 onClick={handleAIFit}
                                 disabled={!fitHeight || !fitWeight || isFitting}
                                 className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                               >
                                 {isFitting ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />} 
                                 {isFitting ? "Analyzing Proportions..." : "Predict Size"}
                               </button>
                             </div>
                           )}
                         </div>
                       </motion.div>
                     )}
                   </AnimatePresence>

                   <div className="flex gap-2 flex-wrap mb-6">
                     {product.sizes.map(size => (
                       <button key={size} onClick={() => setSelectedSize(size)} className={`px-5 py-2 rounded-lg font-bold border ${selectedSize === size ? 'bg-primary text-white border-primary' : 'border-gray-200 dark:border-darkBorder dark:text-gray-300'}`}>{size}</button>
                     ))}
                   </div>
                 </>
               )}

               <div className="mb-6">
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Quantity</p>
                 <div className="flex items-center gap-4">
                   <div className="flex items-center border dark:border-darkBorder rounded-lg overflow-hidden">
                     <button 
                       onClick={() => {
                         const newQ = Math.max(1, quantity - 1);
                         setQuantity(newQ);
                         if (product.isWholesale && product.minimumOrderQuantity && newQ < product.minimumOrderQuantity) {
                           setQuantityError(`${t('moqRequired')} ${product.minimumOrderQuantity}`);
                         } else {
                           setQuantityError('');
                         }
                       }}
                       className="px-4 py-2 bg-gray-50 dark:bg-darkBg hover:bg-gray-100 dark:hover:bg-white/5 dark:text-white transition"
                     >
                       <Minus size={16} />
                     </button>
                     <input 
                       type="number" 
                       value={quantity || ''}
                       onChange={handleQuantityChange}
                       onBlur={handleQuantityBlur}
                       className="w-16 text-center py-2 border-x dark:border-darkBorder dark:bg-darkCard dark:text-white outline-none"
                       min={1}
                     />
                     <button 
                       onClick={() => {
                         const newQ = quantity + 1;
                         setQuantity(newQ);
                         if (product.isWholesale && product.minimumOrderQuantity && newQ < product.minimumOrderQuantity) {
                           setQuantityError(`${t('moqRequired')} ${product.minimumOrderQuantity}`);
                         } else {
                           setQuantityError('');
                         }
                       }}
                       className="px-4 py-2 bg-gray-50 dark:bg-darkBg hover:bg-gray-100 dark:hover:bg-white/5 dark:text-white transition"
                     >
                       <Plus size={16} />
                     </button>
                   </div>
                   {product.isWholesale && product.minimumOrderQuantity && (
                     <span className="text-sm text-gray-500 dark:text-gray-400">
                       MOQ: {product.minimumOrderQuantity} units
                     </span>
                   )}
                 </div>
                 {quantityError && <p className="text-red-500 text-sm mt-2">{quantityError}</p>}
               </div>
             </div>

             <div className="flex gap-4">
               <Button 
                 onClick={handleAddToCart} 
                 className="flex-1 py-4 text-xl shadow-lg shadow-primary/20" 
                 data-key="addToCart"
                 disabled={product.isWholesale && (!user || (user.resellerStatus !== 'approved' && user.role !== 'reseller'))}
               >
                 {t('addToCart')}
               </Button>
               <div className="relative flex-1">
                 <Button 
                   onClick={handleBuyNow} 
                   className="w-full h-full py-4 text-xl bg-accent hover:bg-yellow-600 text-white font-bold shadow-lg shadow-accent/20"
                   data-key="buyNow"
                   disabled={(product.isWholesale && (!user || (user.resellerStatus !== 'approved' && user.role !== 'reseller'))) || !!buyNowMessage}
                 >
                   {t('buyNow')}
                 </Button>
                 {buyNowMessage && (
                   <motion.div 
                     initial={{ opacity: 0, y: -10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 border border-gray-700 text-white text-[11px] md:text-xs px-4 py-2 rounded-lg shadow-xl whitespace-nowrap flex items-center gap-2 pointer-events-none z-50"
                   >
                     <ShoppingCart size={14} className="text-accent" />
                     {buyNowMessage}
                     <motion.div 
                       animate={{ rotate: 360 }}
                       transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                       className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full ml-1"
                     />
                   </motion.div>
                 )}
               </div>
             </div>
             {product.isWholesale && !user && (
               <p className="text-sm text-accent mt-2 text-center">{t('loginToSeePrice')}</p>
             )}
           </motion.div>
         </div>
       </Card>

       {/* Reviews Section */}
       <div className="mt-8">
         <h2 className="text-2xl font-bold mb-6 dark:text-white" data-key="reviews">{t('reviews')} ({product.reviews?.length || 0})</h2>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {/* Review List */}
           <div className="space-y-4">
             {product.reviews && product.reviews.length > 0 ? (
               product.reviews.map(review => (
                 <Card key={review.id} className="!p-4">
                   <div className="flex justify-between items-start mb-2">
                     <div>
                       <p className="font-bold text-sm dark:text-white">{review.userName}</p>
                       <div className="flex items-center gap-2">
                         <RatingStars rating={review.rating} size={12} />
                         <span className="text-xs text-gray-400">{review.date}</span>
                       </div>
                     </div>
                   </div>
                   <p className="text-sm text-gray-600 dark:text-gray-300">{review.comment}</p>
                 </Card>
               ))
             ) : (
               <div className="text-gray-500 italic" data-key="noReviews">{t('noReviews')}</div>
             )}
           </div>

           {/* Add Review Form */}
           {canReview && !hasReviewed ? (
             <Card>
               <h3 className="font-bold text-lg mb-4 dark:text-white" data-key="writeReview">{t('writeReview')}</h3>
               <div className="mb-4">
                 <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1" data-key="rating">{t('rating')}</label>
                 <div className="flex gap-1">
                   {[1, 2, 3, 4, 5].map(star => (
                     <button key={star} onClick={() => setReviewRating(star)} className="focus:outline-none">
                       <Star size={24} className={`${star <= reviewRating ? 'text-accent fill-current' : 'text-gray-300 dark:text-gray-600'}`} />
                     </button>
                   ))}
                 </div>
               </div>
               <div className="mb-4">
                 <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1" data-key="yourOpinion">{t('yourOpinion')}</label>
                 <textarea 
                   className="w-full border dark:border-darkBorder dark:bg-darkBg dark:text-white rounded p-2 text-sm" 
                   rows={4}
                   value={reviewText}
                   onChange={e => setReviewText(e.target.value)}
                   placeholder={t('placeholderReview')}
                 ></textarea>
               </div>
               <Button 
                 onClick={() => {
                   if (reviewText.trim()) {
                     addReview(product.id, reviewRating, reviewText);
                     setReviewText('');
                     setReviewRating(5);
                   }
                 }}
                 disabled={!reviewText.trim()}
                 data-key="submitReview"
               >
                 {t('submitReview')}
               </Button>
             </Card>
           ) : hasReviewed ? (
             <Card className="flex flex-col items-center justify-center text-center py-10">
               <Star size={48} className="text-accent mb-4 fill-current" />
               <p className="text-gray-500 dark:text-gray-400">You have already reviewed this product.</p>
             </Card>
           ) : (
             <Card className="flex flex-col items-center justify-center text-center py-10">
               <Package size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
               <p className="text-gray-500 dark:text-gray-400">You must purchase and receive this product to leave a review.</p>
             </Card>
           )}
         </div>
       </div>
    </motion.div>
  );
};