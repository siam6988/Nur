import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ProductCard, RatingStars, Button, Card, LoadingSpinner } from '../components/UIComponents';
import { CATEGORIES } from '../constants';
import { Filter, ShoppingCart, Heart, Minus, Plus, Share2, Star, Search, X, Package } from 'lucide-react';
import { Product } from '../types';

// --- Shop Page ---
export const Shop: React.FC = () => {
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
      const matchesSearch = nameEn.toLowerCase().includes(searchQuery.toLowerCase()) || nameBn.includes(searchQuery);
      const discountedPrice = p.price - (p.price * p.discountPercentage / 100);
      const matchesMinPrice = minPrice === '' || discountedPrice >= Number(minPrice);
      const matchesMaxPrice = maxPrice === '' || discountedPrice <= Number(maxPrice);
      return matchesCategory && matchesSearch && matchesMinPrice && matchesMaxPrice;
    });

    if (sortBy === 'price-low') {
      result.sort((a, b) => (a.price*(1-a.discountPercentage/100)) - (b.price*(1-b.discountPercentage/100)));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => (b.price*(1-b.discountPercentage/100)) - (a.price*(1-a.discountPercentage/100)));
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

  if (isLoading) return <div className="container mx-auto px-4 py-20 flex justify-center"><LoadingSpinner /></div>;

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

           {filteredAndSortedProducts.length > 0 ? (
             <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
               {filteredAndSortedProducts.map(p => <ProductCard key={p.id} product={p} />)}
             </div>
           ) : (
             <Card className="text-center py-20">
               <Package size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
               <p className="text-gray-500 dark:text-gray-400" data-key="noProductFound">{t('noProductFound')}</p>
               <button onClick={clearFilters} className="mt-4 text-primary dark:text-accent font-bold" data-key="viewAllProducts">{t('viewAllProducts')}</button>
             </Card>
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
  const { products, addToCart, toggleWishlist, wishlist, addReview, user, orders, isLoading, t, language, addToRecentlyViewed, calculateAppliedPrice } = useStore();
  const product = products.find(p => p.id === id);
  const [selectedSize, setSelectedSize] = useState<string>(product?.sizes[0] || '');
  const [mainImage, setMainImage] = useState(product?.images[0] || '');
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [zoomStyle, setZoomStyle] = useState({ opacity: 0, backgroundPosition: '0% 0%' });
  const [quantity, setQuantity] = useState<number>(1);
  const [quantityError, setQuantityError] = useState<string>('');

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0]);
      setMainImage(product.images[0]);
      addToRecentlyViewed(product);
      if (product.isWholesale && product.minimumOrderQuantity) {
        setQuantity(product.minimumOrderQuantity);
      } else {
        setQuantity(1);
      }
      setQuantityError('');
    }
  }, [product]);

  if (isLoading) return <div className="p-20 text-center"><LoadingSpinner /></div>;
  if (!product) return <div className="p-10 text-center dark:text-white">Product not found</div>;

  const discountedPrice = product.price - (product.price * product.discountPercentage / 100);
  const canReview = user && orders.some(order => order.status === 'DELIVERED' && order.items.some(item => item.id === product.id));
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
    if (product.isWholesale && product.minimumOrderQuantity && quantity < product.minimumOrderQuantity) {
      setQuantity(product.minimumOrderQuantity);
      setQuantityError('');
    } else if (quantity < 1 || isNaN(quantity)) {
      setQuantity(product.isWholesale && product.minimumOrderQuantity ? product.minimumOrderQuantity : 1);
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
    navigate('/checkout');
  };

  return (
    <div className="container mx-auto px-4 py-8">
       <Card className="!p-6 md:!p-10">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
           <div className="space-y-4">
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
           </div>

           <div>
             <h1 className="text-2xl md:text-4xl font-bold dark:text-white mb-2">{displayName}</h1>
             
             {product.isWholesale && (
               <div className="mb-4 inline-block bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs font-bold px-3 py-1 rounded-full">
                 {t('wholesale')}
               </div>
             )}

             <div className="flex items-center gap-4 mb-6">
                <RatingStars rating={product.rating} />
                <span className="text-sm text-gray-500">({product.reviews.length} {t('reviews')})</span>
             </div>
             
             <div className="bg-gray-50 dark:bg-darkBg p-6 rounded-2xl border dark:border-darkBorder mb-8">
               {product.isWholesale ? (
                 !user ? (
                   <div className="text-xl font-bold text-accent">{t('loginToSeePrice')}</div>
                 ) : (
                   <div>
                     <div className="flex items-end gap-2 mb-2">
                       <span className="text-4xl font-bold text-primary dark:text-white">৳{currentPrice}</span>
                       <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">/ unit</span>
                     </div>
                     <div className="text-sm text-gray-600 dark:text-gray-400">
                       Total: <span className="font-bold text-gray-900 dark:text-white">৳{totalPrice}</span> for {quantity} units
                     </div>
                   </div>
                 )
               ) : (
                 <div>
                   <span className="text-4xl font-bold text-primary dark:text-white">৳{discountedPrice}</span>
                   {product.discountPercentage > 0 && <span className="text-gray-400 line-through ml-4">৳{product.price}</span>}
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
                           <td className="px-4 py-2 font-bold text-primary dark:text-white">৳{tier.price}</td>
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
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4" data-key="selectSize">{t('selectSize')}</p>
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
                         const newQ = Math.max(product.isWholesale ? (product.minimumOrderQuantity || 1) : 1, quantity - 1);
                         setQuantity(newQ);
                         setQuantityError('');
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
                       min={product.isWholesale ? (product.minimumOrderQuantity || 1) : 1}
                     />
                     <button 
                       onClick={() => {
                         setQuantity(quantity + 1);
                         setQuantityError('');
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
                 disabled={product.isWholesale && !user}
               >
                 {t('addToCart')}
               </Button>
               <Button 
                 onClick={handleBuyNow} 
                 className="flex-1 py-4 text-xl bg-accent hover:bg-yellow-600 text-white shadow-lg shadow-accent/20"
                 data-key="shopNow"
                 disabled={product.isWholesale && !user}
               >
                 {t('shopNow')}
               </Button>
             </div>
             {product.isWholesale && !user && (
               <p className="text-sm text-accent mt-2 text-center">{t('loginToSeePrice')}</p>
             )}
           </div>
         </div>
       </Card>

       {/* Reviews Section */}
       <div className="mt-8">
         <h2 className="text-2xl font-bold mb-6 dark:text-white" data-key="reviews">{t('reviews')} ({product.reviews.length})</h2>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {/* Review List */}
           <div className="space-y-4">
             {product.reviews.length > 0 ? (
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
    </div>
  );
};