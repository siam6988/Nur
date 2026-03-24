import React, { useState, useEffect, useMemo } from 'react';
// ... imports
export const ProductDetails: React.FC = () => {
  // ... existing states
  const { products, addToCart, addReview, user, orders, isLoading, t, language, allReviews, getDiscountedPrice, calculateAppliedPrice } = useStore();
  const product = products.find(p => p.id === id);
  // ...

  const productReviews = allReviews.filter(r => r.productId === product?.id);
  const avgRating = productReviews.length > 0 ? productReviews.reduce((s, r) => s + r.rating, 0) / productReviews.length : product?.rating || 0;

  const currentPrice = product?.isWholesale ? calculateAppliedPrice(product as any, quantity) : getDiscountedPrice(product as any);
  const totalPrice = currentPrice * quantity;

  return (
    // ... main UI
    <div className="flex items-center gap-4 mb-6">
      <RatingStars rating={avgRating} />
      <span className="text-sm text-gray-500">({productReviews.length} {t('reviews')})</span>
    </div>
    // ...
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6 dark:text-white" data-key="reviews">{t('reviews')} ({productReviews.length})</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          {productReviews.length > 0 ? productReviews.map(review => (
            <Card key={review.id} className="!p-4">
              <p className="font-bold text-sm dark:text-white">{review.userName}</p>
              <RatingStars rating={review.rating} size={12} />
              <p className="text-sm mt-2">{review.comment}</p>
            </Card>
          )) : <div className="text-gray-500 italic">{t('noReviews')}</div>}
        </div>
        {/* ... Review Form ... */}
      </div>
    </div>
  )
};
