import React from 'react';
import { View, StyleSheet, Text, FlatList, Image } from 'react-native';
import { useFavorites } from '../FavoriteContext';
import { Ionicons } from '@expo/vector-icons';

export default function AccountScreen() {
    const { favorites } = useFavorites();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Favorite Restaurants</Text>
            {favorites.length === 0 ? (
                <Text style={styles.noFavorites}>No favorites yet.</Text>
            ) : (
                <FlatList
                    data={favorites}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            <Ionicons name="restaurant" size={24} color="#f4845f" style={styles.icon} />
                            <Text style={styles.name}>{item.name}</Text>
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        flex: 1,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
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
    },
});



//'../FavoriteContext';