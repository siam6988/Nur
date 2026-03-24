import React, { useEffect, useState } from 'react';
import { ProductCard, LoadingSpinner } from '../components/UIComponents';
import { Link } from 'react-router-dom';
import { ChevronRight, Truck, ShieldCheck, RefreshCw, Headset } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const Home: React.FC = () => {
  const { products, isLoading, t, recentlyViewed, categories, language, banners } = useStore();
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    if (!banners || banners.length === 0) return;
    const timer = setInterval(() => setCurrentBanner((prev) => (prev + 1) % banners.length), 4000);
    return () => clearInterval(timer);
  }, [banners]);

  if (isLoading) return <div className="min-h-[60vh] flex items-center justify-center"><LoadingSpinner /></div>;

  const retailProducts = products.filter(p => !p.isWholesale);
  const featuredProducts = retailProducts.filter(p => p.isFeatured).slice(0, 4);
  if (featuredProducts.length === 0) featuredProducts.push(...retailProducts.slice(0, 4));
  
  const flashSaleProducts = retailProducts.filter(p => (p.discount || p.discountPercentage || 0) > 10).slice(0, 4);

  return (
    <div className="space-y-12 pb-12">
      {/* Dynamic Banner Slider */}
      {banners.length > 0 && (
        <div className="relative w-full h-[200px] md:h-[400px] overflow-hidden bg-gray-200 dark:bg-darkCard">
          {banners.map((banner, index) => (
            <div key={banner.id} className={`absolute top-0 left-0 w-full h-full transition-opacity duration-700 ease-in-out ${index === currentBanner ? 'opacity-100' : 'opacity-0'}`}>
              <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center">
                <div className="container mx-auto px-4 md:px-8">
                  <h2 className="text-2xl md:text-5xl font-bold text-white mb-2 drop-shadow-md">{banner.title}</h2>
                  <p className="text-lg text-accent font-bold mb-4 drop-shadow-md">{banner.offerText}</p>
                  <Link to={banner.link || '/shop'} className="inline-block bg-accent text-white px-6 py-2 md:px-8 md:py-3 rounded-full font-bold hover:bg-yellow-600 transition shadow-lg">
                    {t('buyNow')}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Rest of the UI remains same... */}
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">{t('popularCategories')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map(cat => (
             <Link key={cat.id} to={`/shop?category=${cat.id}`} className="group relative h-40 md:h-64 rounded-xl overflow-hidden shadow-md">
               <img src={cat.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 flex flex-col justify-end p-4">
                 <span className="text-white text-lg font-bold">{language === 'bn' ? cat.name_bn : cat.name_en}</span>
               </div>
             </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
