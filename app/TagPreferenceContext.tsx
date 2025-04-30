import React, { createContext, useContext, useState, ReactNode } from 'react';

type TagPreferenceContextType = {
    selectedTags: string[];
    toggleTag: (tag: string) => void;
};

const TagPreferenceContext = createContext<TagPreferenceContextType | undefined>(undefined);

export const PreferenceProvider = ({ children }: { children: ReactNode }) => {
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const toggleTag = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    return (
        <TagPreferenceContext.Provider value={{ selectedTags, toggleTag }}>
            {children}
        </TagPreferenceContext.Provider>
    );
};

export const useTagPreferences = () => {
    const context = useContext(TagPreferenceContext);
    if (!context) {
        throw new Error('useTagPreferences must be used within a PreferenceProvider');
    }
    return context;
};

export default TagPreferenceContext;