import React, { createContext, useContext, useState, ReactNode } from 'react';

export type MenuItem = {
  id: number;
  name: string;
  price: number;
};

export type CartItem = MenuItem & { quantity: number };

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: number) => void;
  increaseQuantity: (itemId: number) => void;
  decreaseQuantity: (itemId: number) => void;
  restaurantId: number | null;
  setRestaurantId: (id: number | null) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [restaurantId, setRestaurantId] = useState<number | null>(null);

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: number) => {
    setCart((prev) => prev.filter((i) => i.id !== itemId));
  };

  const increaseQuantity = (itemId: number) => {
    setCart((prev) =>
        prev.map((i) =>
            i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i
        )
    );
  };

  const decreaseQuantity = (itemId: number) => {
    setCart((prev) =>
        prev
            .map((i) =>
                i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
            )
            .filter((i) => i.quantity > 0)
    );
  };

  return (
      <CartContext.Provider
          value={{ cart, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, setRestaurantId, restaurantId }}
      >
        {children}
      </CartContext.Provider>
  );
};

export default CartContext;