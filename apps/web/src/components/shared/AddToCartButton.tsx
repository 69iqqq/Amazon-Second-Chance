'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';

interface AddToCartButtonProps {
  item: {
    id: string;
    title: string;
    price: number;
    imageUrl: string;
    sellerId: string;
  };
  className?: string;
}

export function AddToCartButton({ item, className = '' }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to the Link
    addToCart({
      ...item,
      quantity: 1,
      isReturnable: false, // Default to final sale when quick-adding from catalogue
      returnFee: 0
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <button 
      onClick={handleAddToCart}
      className={`mt-3 text-[13px] rounded-full px-5 py-1.5 shadow-sm font-medium transition ${
        isAdded 
          ? 'bg-green-600 hover:bg-green-700 text-white border border-green-700' 
          : 'bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-[#0f1111]'
      } ${className}`}
    >
      {isAdded ? 'Added ✓' : 'Add to cart'}
    </button>
  );
}
