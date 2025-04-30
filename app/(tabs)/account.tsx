import React from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useFavorites } from '../FavoriteContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTagPreferences } from '../TagPreferenceContext';

export default function AccountScreen() {
    const { favorites, toggleFavorite } = useFavorites();
    const { selectedTags, toggleTag } = useTagPreferences();
    const router = useRouter();

    // Extract unique tags from favorites
    const allTags = Array.from(
        new Set(
            favorites.flatMap((fav) => fav.tags || [])
        )
    );

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Preferences</Text>

            <View style={styles.tagContainer}>
                {allTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                        <TouchableOpacity
                            key={tag}
                            onPress={() => toggleTag(tag)}
                            style={[
                                styles.tagButton,
                                isSelected && styles.tagButtonSelected,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.tagText,
                                    isSelected && styles.tagTextSelected,
                                ]}
                            >
                                {tag}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            <View style={{ marginTop: 40 }}>
                <Text style={styles.title}>Favorite Restaurants</Text>
            </View>

            {favorites.length === 0 ? (
                <Text style={styles.noFavorites}>No favorites yet.</Text>
            ) : (
                <FlatList
                    data={favorites}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() =>
                                router.push({
                                    pathname: '/restaurant page/restaurant page',
                                    params: {
                                        id: item.id,
                                        name: item.name,
                                    },
                                })
                            }
                            style={styles.item}
                        >
                            <Ionicons name="restaurant" size={24} color="#f4845f" style={styles.icon} />
                            <Text style={styles.name}>{item.name}</Text>
                            <TouchableOpacity onPress={() => toggleFavorite(item)} style={styles.removeButton}>
                                <Ionicons name="trash" size={20} color="gray" />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    )}
                />
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginVertical: 16,
    },
    noFavorites: {
        fontSize: 16,
        color: '#888',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fef1ed',
        padding: 12,
        borderRadius: 12,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    icon: {
        marginRight: 12,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
    },
    removeButton: {
        padding: 6,
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tagButton: {
        backgroundColor: '#eee',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginBottom: 10,
    },
    tagButtonSelected: {
        backgroundColor: '#f4845f',
    },
    tagText: {
        fontSize: 14,
        color: '#333',
    },
    tagTextSelected: {
        color: 'white',
        fontWeight: 'bold',
    },
});




//'../FavoriteContext';