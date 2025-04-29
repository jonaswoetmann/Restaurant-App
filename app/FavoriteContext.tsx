import React, { createContext, useContext, useState, ReactNode } from 'react';


type FavoriteRestaurant = {
    id: number;
    name: string;
};

type FavoriteContextType = {
    favorites: FavoriteRestaurant[];
    toggleFavorite: (restaurant: FavoriteRestaurant) => void;
};

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

export const FavoriteProvider = ({ children }: { children: ReactNode }) => {
    const [favorites, setFavorites] = useState<FavoriteRestaurant[]>([]);

    const toggleFavorite = (restaurant: FavoriteRestaurant) => {
        setFavorites((prev) =>
            prev.some((fav) => fav.id === restaurant.id)
                ? prev.filter((fav) => fav.id !== restaurant.id)
                : [...prev, restaurant]
        );
    };

    return (
        <FavoriteContext.Provider value={{ favorites, toggleFavorite }}>
            {children}
        </FavoriteContext.Provider>
    );
};

export const useFavorites = () => {
    const context = useContext(FavoriteContext);
    if (!context) {
        throw new Error('useFavorites must be used within a FavoriteProvider');
    }
    return context;
};

export default FavoriteContext;