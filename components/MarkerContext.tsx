import React, { createContext, useContext, useState } from 'react';

type MarkerContextType = {
    selectedMarkerId: string | null;
    setSelectedMarkerId: (id: string | null) => void;
};

const MarkerContext = createContext<MarkerContextType>({
    selectedMarkerId: null,
    setSelectedMarkerId: () => {},
});

export const MarkerProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);

    return (
        <MarkerContext.Provider value={{ selectedMarkerId, setSelectedMarkerId }}>
            {children}
        </MarkerContext.Provider>
    );
};

export const useMarker = () => useContext(MarkerContext);