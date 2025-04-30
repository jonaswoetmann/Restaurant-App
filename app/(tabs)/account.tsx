import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useFavorites } from '../FavoriteContext';
import { useTagPreferences } from '../TagPreferenceContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const fallbackTags = ['Vegan', 'Gluten-Free', 'Peanuts', 'Mild'];

export default function AccountScreen() {
    const { favorites, toggleFavorite } = useFavorites();
    const { selectedTags, toggleTag } = useTagPreferences();
    const [allTags, setAllTags] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const res = await fetch('http://130.225.170.52:10331/api/tags');
                const data = await res.json();
                const tagsFromServer = data.map((t: any) => t.tagvalue);
                setAllTags(tagsFromServer);
            } catch (err) {
                console.warn('❌ Failed to fetch tags, using fallback list.');
                setAllTags(fallbackTags);
            } finally {
                setLoading(false);
            }
        };

        fetchTags();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.prefTitle}>Preferences</Text>
            {loading ? (
                <Text>Loading tags...</Text>
            ) : allTags.length === 0 ? (
                <Text>No tags found.</Text>
            ) : (
                <View style={styles.tagContainer}>
                    {allTags.map(tag => (
                        <TouchableOpacity
                            key={tag}
                            onPress={() => toggleTag(tag)}
                            style={[
                                styles.tag,
                                selectedTags.includes(tag) && styles.tagSelected,
                            ]}
                        >
                            <Text style={{ color: selectedTags.includes(tag) ? 'white' : 'black' }}>{tag}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            <Text style={styles.title}>Favorite Restaurants</Text>
            {favorites.length === 0 ? (
                <Text style={styles.noFavorites}>No favorites yet.</Text>
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
    container: { flex: 1, backgroundColor: '#fff', padding: 20 },
    prefTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 8, marginTop: 40 },
    tagContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
    tag: { paddingHorizontal: 14, paddingVertical: 8, backgroundColor: '#eee', borderRadius: 20 },
    tagSelected: { backgroundColor: '#f4845f' },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
    noFavorites: { fontSize: 16, color: '#888' },
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
    icon: { marginRight: 12 },
    name: { fontSize: 16, fontWeight: '600', flex: 1 },
});



