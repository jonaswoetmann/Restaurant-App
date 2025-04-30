import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useFavorites } from '../FavoriteContext';
import { useTagPreferences } from '../TagPreferenceContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const fallbackTags = ['Vegan', 'Gluten-Free', 'Peanuts', 'Mild'];

export default function AccountScreen() {
    const { favorites, toggleFavorite } = useFavorites();
    const { selectedTags, toggleTag, knownTags } = useTagPreferences();
    const router = useRouter();

    const allTags = knownTags.length > 0 ? knownTags : fallbackTags;

    return (
        <View style={styles.container}>
            <Text style={styles.prefTitle}>Preferences</Text>
            <View style={styles.tagContainer}>
                {allTags.map(tag => (
                    <TouchableOpacity
                        key={tag}
                        onPress={() => toggleTag(tag)}
                        style={[styles.tag, selectedTags.includes(tag) && styles.tagSelected]}
                    >
                        <Text style={{ color: selectedTags.includes(tag) ? 'white' : 'black' }}>{tag}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.title}>Favorite Restaurants</Text>

            {favorites.length === 0 ? (
                <Text style={styles.noFavorites}>No favorited restaurants.</Text>
            ) : (
                <FlatList
                    data={favorites}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.item}
                            onPress={() =>
                                router.push({
                                    pathname: '/restaurant page/restaurant page',
                                    params: { id: item.id, name: item.name },
                                })
                            }
                        >
                            <Ionicons name="restaurant" size={24} color="#f4845f" style={styles.icon} />
                            <Text style={styles.name}>{item.name}</Text>
                            <TouchableOpacity onPress={() => toggleFavorite(item)}>
                                <Ionicons name="trash" size={20} color="gray" />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    prefTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 8, marginTop: 40 },
    tagContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
    tag: { paddingHorizontal: 14, paddingVertical: 8, backgroundColor: '#eee', borderRadius: 20 },
    tagSelected: { backgroundColor: '#f4845f' },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
    noFavorites: { fontSize: 16, color: '#888', fontStyle: 'italic', marginBottom: 20 },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#fef1ed',
        borderRadius: 12,
        marginBottom: 10,
    },
    icon: { marginRight: 12 },
    name: { fontSize: 16, fontWeight: '600', flex: 1 },
});




