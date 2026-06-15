'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string; // listingId
  title: string;
  price: number;
  imageUrl: string;
  quantity: number;
  sellerId?: string;
  isReturnable?: boolean;
  returnFee?: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('amazon_2nd_life_cart');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load cart', e);
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('amazon_2nd_life_cart', JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addToCart = (item: CartItem) => {
    setItems(prev => {
      // For return opt-in, if they add the same item but with different return settings, 
      // we should probably just update it or treat it as a separate item.
      // To keep it simple, we treat it as the same item and preserve the latest return settings.
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity, isReturnable: item.isReturnable, returnFee: item.returnFee } : i);
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
  };

  const clearCart = () => setItems([]);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = items.reduce((sum, item) => {
    const baseTotal = item.price * item.quantity;
    const feeTotal = (item.returnFee || 0) * item.quantity;
    return sum + baseTotal + feeTotal;
  }, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
