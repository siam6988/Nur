import React, { useEffect, useState } from 'react';
import { CATEGORIES } from '../constants';
import { ProductCard, LoadingSpinner } from '../components/UIComponents';
import { Link } from 'react-router-dom';
import { ChevronRight, Truck, ShieldCheck, RefreshCw, Headset, Clock } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { motion, useScroll, useTransform } from 'motion/react';
import { useSEO } from '../hooks/useSEO';

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 12,
    minutes: 34,
    seconds: 56
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 }; // Reset
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-1.5 mt-2">
      <Clock size={16} className="text-danger mr-1" />
      <div className="bg-danger/10 dark:bg-danger/20 text-danger px-2 py-1 rounded text-sm font-mono font-bold border border-danger/20">
        {String(timeLeft.hours).padStart(2, '0')}
      </div>
      <span className="text-danger font-bold">:</span>
      <div className="bg-danger/10 dark:bg-danger/20 text-danger px-2 py-1 rounded text-sm font-mono font-bold border border-danger/20">
        {String(timeLeft.minutes).padStart(2, '0')}
      </div>
      <span className="text-danger font-bold">:</span>
      <div className="bg-danger/10 dark:bg-danger/20 text-danger px-2 py-1 rounded text-sm font-mono font-bold border border-danger/20">
        {String(timeLeft.seconds).padStart(2, '0')}
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  useSEO({
    title: 'Home',
    description: 'NUR - Best Online Shopping Website in Bangladesh. Buy electronics, fashion, and home products at the best price with fast delivery.',
    keywords: 'online shopping Bangladesh, buy electronics BD, NUR shop, cheap products BD',
    url: 'https://nur-eight.vercel.app/'
  });

  const { products, isLoading, t, recentlyViewed, categories, language, banners } = useStore();
  const [currentBanner, setCurrentBanner] = useState(0);

  // Parallax setup
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);

  // Auto slide banner
  useEffect(() => {
    if (!banners || banners.length === 0) return;
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000); // 4 seconds
    return () => clearInterval(timer);
  }, [banners]);

  const retailProducts = products.filter(p => !p.isWholesale);
  const featuredProducts = retailProducts.slice(0, 8);
  const flashSaleProducts = retailProducts.filter(p => p.discountPercentage > 10).slice(0, 8);

  return (
    <div className="space-y-12 pb-12">
      {/* Banner Slider Reserved Space */}
      <div className="container mx-auto px-4">
        <div className="relative w-full h-[200px] md:h-[400px] overflow-hidden rounded-2xl bg-gray-100 dark:bg-darkCard/50 border-2 border-dashed border-gray-300 dark:border-darkBorder flex items-center justify-center">
          {!banners || banners.length === 0 ? (
            <div className="text-center p-6 text-gray-400">
              <p className="text-lg md:text-xl font-medium">Banner Section</p>
              <p className="text-sm">Add dynamic banners from your Admin Panel.</p>
            </div>
          ) : (
            <>
              {banners.map((banner, index) => (
                <div 
                  key={banner.id}
                  className={`absolute top-0 left-0 w-full h-full transition-opacity duration-700 ease-in-out ${index === currentBanner ? 'opacity-100' : 'opacity-0'}`}
                >
                  <motion.div style={{ y: y1 }} className="absolute inset-0 w-full h-[150%] -top-[25%] pointer-events-none">
                    <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                  </motion.div>
                  <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center">
                    <div className="container mx-auto px-4 md:px-8">
                      <h2 className="text-2xl md:text-5xl font-bold text-white mb-4 drop-shadow-md">{banner.title}</h2>
                      <Link to={banner.link} className="inline-block bg-accent text-white px-6 py-2 md:px-8 md:py-3 rounded-full font-bold hover:bg-yellow-600 transition shadow-lg" data-key="buyNow">
                        {t('buyNow')}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
              {/* Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {banners.map((_, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setCurrentBanner(idx)}
                    className={`w-2 h-2 rounded-full ${idx === currentBanner ? 'bg-accent w-6' : 'bg-white/50'} transition-all`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Services Features */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white dark:bg-darkCard p-6 rounded-xl shadow-sm border border-gray-100 dark:border-darkBorder transition-colors">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-50 dark:bg-white/5 rounded-full text-primary dark:text-blue-400"><Truck size={24} /></div>
            <div>
              <p className="font-bold text-sm dark:text-white" data-key="fastDelivery">{t('fastDelivery')}</p>
              <p className="text-xs text-gray-500" data-key="allOverBD">{t('allOverBD')}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-50 dark:bg-white/5 rounded-full text-green-600 dark:text-green-400"><ShieldCheck size={24} /></div>
            <div>
              <p className="font-bold text-sm dark:text-white" data-key="securePayment">{t('securePayment')}</p>
              <p className="text-xs text-gray-500" data-key="secure100">{t('secure100')}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-50 dark:bg-white/5 rounded-full text-yellow-600 dark:text-yellow-400"><RefreshCw size={24} /></div>
            <div>
              <p className="font-bold text-sm dark:text-white" data-key="easyReturn">{t('easyReturn')}</p>
              <p className="text-xs text-gray-500" data-key="within7Days">{t('within7Days')}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-50 dark:bg-white/5 rounded-full text-purple-600 dark:text-purple-400"><Headset size={24} /></div>
            <div>
              <p className="font-bold text-sm dark:text-white" data-key="support247">{t('support247')}</p>
              <p className="text-xs text-gray-500" data-key="atYourService">{t('atYourService')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Flash Sale */}
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-6">
          <div>
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white" data-key="flashSale">{t('flashSale')}</h2>
              <CountdownTimer />
            </div>
            <p className="text-sm text-gray-500 mt-1" data-key="flashSaleDesc">{t('flashSaleDesc')}</p>
          </div>
          <Link to="/shop" className="text-primary dark:text-accent text-sm font-semibold flex items-center hover:underline" data-key="viewAllOffers">
            {t('viewAllOffers')} <ChevronRight size={16} />
          </Link>
        </div>
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
            hidden: {}
          }}
          className="flex overflow-x-auto gap-4 md:gap-6 pb-4 snap-x snap-mandatory no-scrollbar"
        >
          {flashSaleProducts.map((product, index) => (
            <motion.div 
              key={product.id} 
              variants={{
                hidden: { opacity: 0, x: (index - 2) * -100, y: 20, rotate: (index - 2) * 5, scale: 0.8 },
                visible: { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1, transition: { type: 'spring', stiffness: 120, damping: 14 } }
              }}
              className="min-w-[240px] md:min-w-[280px] snap-start flex-none"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Categories Grid (Masonry/Bento) */}
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6" data-key="popularCategories">{t('popularCategories')}</h2>
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
            hidden: {}
          }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[150px] md:auto-rows-[200px]"
        >
          {categories.filter(c => c.id !== 'all').map((cat, idx) => (
             <motion.div
               key={cat.id}
               variants={{
                 hidden: { opacity: 0, y: 30, scale: 0.95 },
                 visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 100 } }
               }}
               className={`${idx === 0 ? 'col-span-2 row-span-2 md:col-span-2 md:row-span-2' : ''} ${idx === 3 ? 'md:col-span-2' : ''} ${idx === 4 ? 'row-span-2' : ''} h-full`}
             >
               <Link 
                 to={`/shop?category=${cat.id}`} 
                 className={`block w-full h-full group relative rounded-2xl overflow-hidden bg-gray-200 dark:bg-darkCard shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1`}
               >
                 <img 
                   src={cat.image || `https://picsum.photos/seed/${cat.id}/800/800`} 
                   alt={language === 'bn' ? cat.name_bn : cat.name_en} 
                   className="w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-out" 
                   loading="lazy"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-5 md:p-6 flex flex-col justify-end">
                   <span className="text-white text-xl md:text-3xl font-bold tracking-tight drop-shadow-md transform group-hover:-translate-y-2 transition-transform duration-300">{language === 'bn' ? cat.name_bn : cat.name_en}</span>
                   <span className="text-accent text-sm md:text-base opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75 font-semibold flex items-center mt-1">
                     {t('shopNow')} <ChevronRight size={16} className="ml-1" />
                   </span>
                 </div>
               </Link>
             </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Just For You / Featured (Carousel) */}
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
           <h2 className="text-2xl font-bold text-gray-800 dark:text-white" data-key="justForYou">{t('justForYou')}</h2>
           <Link to="/shop" className="bg-white dark:bg-darkCard dark:text-white border border-gray-200 dark:border-darkBorder px-5 py-2 rounded-full text-sm font-semibold hover:bg-gray-50 dark:hover:bg-white/5 shadow-sm hover:shadow" data-key="seeMore">{t('seeMore')}</Link>
        </div>
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
            hidden: {}
          }}
          className="flex overflow-x-auto gap-4 md:gap-6 pb-4 snap-x snap-mandatory no-scrollbar"
        >
          {featuredProducts.map((product, index) => (
            <motion.div 
              key={product.id} 
              variants={{
                hidden: { opacity: 0, x: (index - 2) * -80, y: 30, rotate: (index - 2) * 6, scale: 0.9 },
                visible: { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1, transition: { type: 'spring', stiffness: 150, damping: 15 } }
              }}
              className="min-w-[200px] md:min-w-[260px] snap-start flex-none"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <div className="container mx-auto px-4 mt-12">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6" data-key="recentlyViewed">{t('recentlyViewed')}</h2>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
              hidden: {}
            }}
            className="flex overflow-x-auto gap-4 md:gap-6 pb-4 snap-x snap-mandatory no-scrollbar"
          >
            {recentlyViewed.map((product, index) => (
              <motion.div 
                key={product.id} 
                variants={{
                  hidden: { opacity: 0, scale: 0.9, y: 20 },
                  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 120 } }
                }}
                className="min-w-[200px] md:min-w-[260px] snap-start flex-none"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Home;