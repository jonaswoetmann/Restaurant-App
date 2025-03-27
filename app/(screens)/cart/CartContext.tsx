import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the structure for a CartItem
type CartItem = {
    id: number;
    name: string;
    price: number;
    quantity: number;
};

// Define the context type to include cart data and functions to modify it
type CartContextType = {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: number) => void;
    decreaseQuantity: (id: number) => void;
};

// Create the context with a default value of undefined
const CartContext = createContext<CartContextType | undefined>(undefined);

// CartProvider component that wraps the application and provides context to children
export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);  // Initialize cart as an empty array

    // Function to add an item to the cart or update its quantity if it's already in the cart
    const addToCart = (item: CartItem) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
            if (existingItem) {
                // If item already exists in the cart, increase its quantity
                return prevCart.map((cartItem) =>
                    cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
                );
            }
            // If the item is new, add it to the cart with quantity 1
            return [...prevCart, { ...item, quantity: 1 }];
        });
    };

    // Function to remove an item from the cart by its id
    const removeFromCart = (id: number) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    };

    // Function to decrease the quantity of an item, and remove it from the cart if quantity reaches zero
    const decreaseQuantity = (id: number) => {
        setCart((prevCart) => {
            return prevCart
                .map((cartItem) =>
                    cartItem.id === id && cartItem.quantity > 1
                        ? { ...cartItem, quantity: cartItem.quantity - 1 }
                        : cartItem
                )
                .filter((cartItem) => cartItem.quantity > 0); // Remove items that reach quantity 0
        });
    };

    // Provide the cart and functions to modify it to the component tree
    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, decreaseQuantity }}>
            {children}
        </CartContext.Provider>
    );
};

// Custom hook to access the cart context
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export default CartContext;