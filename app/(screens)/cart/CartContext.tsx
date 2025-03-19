
import React, { createContext, useState, useContext, ReactNode } from 'react';

type CartItem = { id: number; name: string; price: number; quantity: number };

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  decreaseQuantity: (id: number) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
            cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const decreaseQuantity = (id: number) => {
    setCart((prevCart) => {
      return prevCart
          .map((cartItem) =>
              cartItem.id === id && cartItem.quantity > 1
                  ? { ...cartItem, quantity: cartItem.quantity - 1 }
                  : cartItem
          )
          .filter((cartItem) => cartItem.quantity > 0);
    });
  };

  return (
      <CartContext.Provider value={{ cart, addToCart, removeFromCart, decreaseQuantity }}>
        {children}
      </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}