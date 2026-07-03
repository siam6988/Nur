import React, { useState, useMemo } from 'react';
import { Star } from 'lucide-react';
import { Product } from '../types';
import { Card, Button, RatingStars } from './UIComponents';
import { motion } from 'motion/react';

interface ProductReviewsProps {
  product: Product;
  canReview: boolean;
  hasReviewed: boolean;
  addReview: (productId: string, rating: number, comment: string) => void;
  t: (key: string) => string;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({ product, canReview, hasReviewed, addReview, t }) => {
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);

  const reviews = product.reviews || [];
  const totalReviews = reviews.length;
  
  const ratingCounts = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
      if (counts[r.rating as keyof typeof counts] !== undefined) {
        counts[r.rating as keyof typeof counts]++;
      }
    });
    return counts;
  }, [reviews]);

  const averageRating = totalReviews > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : 0;

  return (
    <div className="mt-12 bg-white dark:bg-darkCard p-6 md:p-10 rounded-3xl border border-gray-100 dark:border-darkBorder shadow-sm">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Rating Summary */}
        <div className="w-full md:w-1/3 space-y-6">
          <h2 className="text-2xl font-bold dark:text-white" data-key="reviews">{t('reviews')}</h2>
          <div className="flex items-center gap-4">
            <div className="text-5xl font-black text-gray-900 dark:text-white">{averageRating}</div>
            <div>
              <RatingStars rating={Number(averageRating)} size={20} />
              <p className="text-sm text-gray-500 mt-1">Based on {totalReviews} reviews</p>
            </div>
          </div>
          
          <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-darkBorder">
            {[5, 4, 3, 2, 1].map(star => {
              const count = ratingCounts[star as keyof typeof ratingCounts];
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-3">{star}</span>
                  <Star size={14} className="text-accent fill-current" />
                  <div className="flex-1 h-2 bg-gray-100 dark:bg-darkBg rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-accent rounded-full"
                    />
                  </div>
                  <span className="text-xs text-gray-400 w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Review List & Form */}
        <div className="w-full md:w-2/3 space-y-8">
          {canReview && !hasReviewed ? (
            <div className="bg-gray-50 dark:bg-darkBg p-6 rounded-2xl border dark:border-darkBorder">
              <h3 className="font-bold text-lg mb-4 dark:text-white" data-key="writeReview">{t('writeReview')}</h3>
              <div className="mb-4">
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2" data-key="rating">{t('rating')}</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button 
                      key={star} 
                      onClick={() => setReviewRating(star)} 
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star size={28} className={`${star <= reviewRating ? 'text-accent fill-current' : 'text-gray-300 dark:text-gray-600'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2" data-key="yourOpinion">{t('yourOpinion')}</label>
                <textarea 
                  className="w-full border border-gray-200 dark:border-darkBorder dark:bg-darkCard dark:text-white rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary outline-none transition-all resize-none" 
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
                className="px-8 py-3 rounded-xl font-bold shadow-md shadow-primary/20"
                data-key="submitReview"
              >
                {t('submitReview') || 'Submit Review'}
              </Button>
            </div>
          ) : hasReviewed ? (
            <div className="bg-gray-50 dark:bg-darkBg flex flex-col items-center justify-center text-center p-8 rounded-2xl border dark:border-darkBorder">
              <Star size={40} className="text-accent mb-3 fill-current" />
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">You have already reviewed this product.</p>
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-darkBg flex flex-col items-center justify-center text-center p-8 rounded-2xl border dark:border-darkBorder">
              <div className="w-12 h-12 bg-gray-200 dark:bg-darkCard rounded-full flex items-center justify-center mb-3">
                <Star size={24} className="text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">You must purchase and receive this product to leave a review.</p>
            </div>
          )}

          <div className="space-y-4">
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={review.id} 
                  className="bg-white dark:bg-darkCard p-5 rounded-2xl border border-gray-100 dark:border-darkBorder shadow-sm flex flex-col sm:flex-row gap-4"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-primary dark:text-white">
                      {review.userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                      <div className="flex items-center gap-3">
                        <p className="font-bold text-sm dark:text-white">{review.userName}</p>
                        <div className="flex items-center gap-1">
                          <RatingStars rating={review.rating} size={12} />
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">{review.date}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{review.comment}</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-gray-500 italic p-8 text-center bg-gray-50 dark:bg-darkBg rounded-2xl" data-key="noReviews">
                {t('noReviews')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
