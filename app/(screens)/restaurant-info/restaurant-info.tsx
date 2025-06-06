import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Linking } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useLocalSearchParams } from 'expo-router';
import { TextInput, Button, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../../contexts/FavoriteContext';



type Rating = {
    id: number;
    rating: number;
    restaurantid: number;
    text: string;
};

const defaultTheme = {
    secondary: '#f4845f',
};

export default function RestaurantInfoScreen() {
    const { id, name, description, openingtime, closingtime, latitude, longitude, themeSecondaryColor,tags } = useLocalSearchParams();

    const lat = parseFloat(latitude as string) || 0;
    const lon = parseFloat(longitude as string) || 0;

    const [ratings, setRatings] = useState<Rating[]>([]);
    const [loadingRatings, setLoadingRatings] = useState(true);

    const [newRating, setNewRating] = useState('');
    const [newText, setNewText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const { favorites, toggleFavorite } = useFavorites();
    const restaurantId = Number(id);
    const isFavorite = favorites.some((fav: { id: number }) => fav.id === restaurantId);

    const secondaryColor = (themeSecondaryColor as string) || defaultTheme.secondary;

    const styles = useMemo(() => createStyles(secondaryColor), [secondaryColor]);

    const fetchRatings = async () => {
        try {
            const res = await fetch('http://130.225.170.52:10331/api/ratings');
            const data: Rating[] = await res.json();
            const filtered = data.filter((r) => r.restaurantid === Number(id));
            setRatings(filtered);
        } catch (err) {
            console.error('Error fetching ratings:', err);
        } finally {
            setLoadingRatings(false);
        }
    };

    useEffect(() => {
        fetchRatings();
    }, [id]);

    const submitRating = async () => {
        const ratingNum = Number(newRating);

        if (ratingNum < 1 || ratingNum > 5 || !newText.trim()) {
            Alert.alert('Invalid input', 'Please provide a rating between 1-5 and a comment.');
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch('http://130.225.170.52:10331/api/ratings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    rating: ratingNum,
                    restaurantID: Number(id),
                    text: newText.trim(),
                }),
            });

            if (!res.ok) throw new Error('Failed to submit review.');

            setNewRating('');
            setNewText('');
            Alert.alert('Success', 'Your review has been submitted!');
            fetchRatings();
        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'Failed to submit your review.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerBox}>
                <Text style={styles.headerText}>{name || 'Restaurant'}</Text>
                <TouchableOpacity
                    onPress={() =>
                        toggleFavorite({
                            id: restaurantId,
                            name: name?.toString() || 'Unknown',
                            tags: typeof tags === 'string'
                                ? tags.split(',').map(t => t.trim())
                                : Array.isArray(tags)
                                    ? tags
                                    : [],
                        })
                    }
                >
                    <Ionicons
                        name={isFavorite ? 'heart' : 'heart-outline'}
                        size={28}
                        color={isFavorite ? 'red' : 'gray'}
                    />
                </TouchableOpacity>
            </View>


            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: lat,
                    longitude: lon,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
            >
                <Marker
                    coordinate={{ latitude: lat, longitude: lon }}
                    title={name?.toString()}
                    description={description?.toString()}
                />
            </MapView>

            <View style={styles.sectionContainer}>
                <View style={styles.section}>
                    <Text style={styles.sectionText}>About</Text>
                    <Text style={styles.descriptionText}>{description || 'No description available.'}</Text>

                    <Text style={styles.sectionText}>Opening Times</Text>
                    <Text style={styles.descriptionText}>{`${openingtime} - ${closingtime}` || 'No opening time available.'}</Text>

                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionText}>User Ratings</Text>
                    {loadingRatings ? (
                        <Text>Loading ratings...</Text>
                    ) : ratings.length === 0 ? (
                        <Text>No ratings available.</Text>
                    ) : (
                        ratings.map((r) => (
                            <View key={r.id} style={{ marginTop: 10 }}>
                                <Text>⭐ {r.rating}/5</Text>
                                <Text>{r.text}</Text>
                            </View>
                        ))
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionText}>Leave a Review</Text>
                    <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <TouchableOpacity key={star} onPress={() => setNewRating(String(star))}>
                                <Text style={{ fontSize: 30, marginHorizontal: 2 }}>
                                    {Number(newRating) >= star ? '⭐' : '☆'}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <TextInput
                        placeholder="Write your review here..."
                        value={newText}
                        onChangeText={setNewText}
                        multiline
                        style={[styles.input, { height: 80 }]}
                    />
                    <Button title={submitting ? 'Submitting...' : 'Submit'} onPress={submitRating} disabled={submitting} />
                    <TouchableOpacity
                        style={{ marginTop: 12 }}
                        onPress={() => {
                            Alert.alert(
                                'Report Restaurant',
                                'Do you want to report this restaurant?',
                                [
                                    { text: 'Cancel', style: 'cancel' },
                                    {
                                        text: 'Yes',
                                        onPress: () => {
                                            const subject = encodeURIComponent(`Report for Restaurant: ${name}`);
                                            const body = encodeURIComponent('Please describe the issue you encountered.');
                                            const email = 'support@example.com';
                                            Linking.openURL(`mailto:${email}?subject=${subject}&body=${body}`);
                                        },
                                    },
                                ]
                            );
                        }}
                    >
                        <Text style={{ color: 'red', textAlign: 'center', textDecorationLine: 'underline' }}>
                            Report Restaurant
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const createStyles = (secondaryColor: string) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    headerBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: secondaryColor,
        height: 100,
        marginBottom: 12,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
    },
    map: {
        width: Dimensions.get('window').width,
        height: 200,
        marginVertical: 8,
    },
    sectionContainer: {
        marginTop: 10
    },
    section: {
        backgroundColor: '#fff',
        padding: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 12,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    sectionText: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    descriptionText: {
        fontSize: 16,
        marginTop: 8
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 10,
        marginVertical: 8,
        fontSize: 16,
        backgroundColor: '#fff',
    },
});
