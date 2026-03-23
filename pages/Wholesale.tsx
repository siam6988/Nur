import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ProductCard, Card, LoadingSpinner } from '../components/UIComponents';
import { Package, Search, X } from 'lucide-react';

export const Wholesale: React.FC = () => {
  const { products, isLoading, t, language } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');

  const wholesaleProducts = useMemo(() => {
    let result = products.filter(p => p.isWholesale === true && p.isActive === true);

    if (searchQuery) {
      result = result.filter(p => {
        const nameEn = p.name_en || p.name || '';
        const nameBn = p.name_bn || '';
        return nameEn.toLowerCase().includes(searchQuery.toLowerCase()) || nameBn.includes(searchQuery);
      });
    }

    if (sortBy === 'price-low') {
      result.sort((a, b) => (a.price*(1-a.discountPercentage/100)) - (b.price*(1-b.discountPercentage/100)));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => (b.price*(1-b.discountPercentage/100)) - (a.price*(1-a.discountPercentage/100)));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }
    return result;
  }, [products, searchQuery, sortBy]);

  if (isLoading) return <div className="container mx-auto px-4 py-20 flex justify-center"><LoadingSpinner /></div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-primary dark:text-white mb-4">{t('wholesaleProducts')}</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
          {language === 'bn' 
            ? 'আপনার ব্যবসার জন্য সেরা দামে পাইকারি পণ্য কিনুন। আমাদের রয়েছে বিশাল কালেকশন এবং আকর্ষণীয় টিয়ার প্রাইসিং।' 
            : 'Buy wholesale products at the best prices for your business. We have a huge collection and attractive tier pricing.'}
        </p>
        <Link to="/shop" className="inline-block bg-primary text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 transition shadow-md">
          {language === 'bn' ? 'রিটেইল শপে ফিরে যান' : 'Back to Retail Shop'}
        </Link>
      </div>

      <div className="mb-8 flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto">
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

      {wholesaleProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {wholesaleProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      ) : (
        <Card className="text-center py-20 max-w-2xl mx-auto">
          <Package size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">{t('noWholesaleProducts')}</p>
        </Card>
      )}
    </div>
  );
};
