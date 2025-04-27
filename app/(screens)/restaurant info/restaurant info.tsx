import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { TextInput, Button, Alert } from 'react-native';
import StarRating from 'react-native-star-rating-widget'; // npm install react-native-star-rating-widget

type Rating = {
  id: number;
  rating: number;
  restaurantid: number;
  text: string;
};

export default function RestaurantInfoScreen() {
  const router = useRouter();
  const { id, name, description, latitude, longitude } = useLocalSearchParams();

  const lat = parseFloat(latitude as string) || 0;
  const lon = parseFloat(longitude as string) || 0;

  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loadingRatings, setLoadingRatings] = useState(true);

  const [newRating, setNewRating] = useState('');
  const [newText, setNewText] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
      fetchRatings(); // Refresh ratings
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to submit your review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>{name || 'Restaurant'}</Text>

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
          {/* About & Info */}
          <View style={styles.section}>
            <Text style={styles.sectionText}>About</Text>
            <Text style={styles.descriptionText}>{description || 'No description available.'}</Text>
          </View>

          {/* Cuisines */}
          <TouchableOpacity
              style={styles.section}

          >
            <Text style={styles.sectionText}>Cuisines</Text>
          </TouchableOpacity>

          {/* Opening Times */}
          <View style={styles.section}>
            <Text style={styles.sectionText}>Opening Times</Text>
            <Text style={styles.descriptionText}>Monday - Sunday: 08:00 - 22:00</Text>
          </View>

          {/* Existing Ratings */}
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

          {/* Review Form */}
          <View style={styles.section}>
            <Text style={styles.sectionText}>Leave a Review</Text>
            <StarRating
                rating={Number(newRating)}
                onChange={(rating) => setNewRating(String(rating))}
                maxStars={5}
                starSize={30}
            />
            <TextInput
                placeholder="Write your review here..."
                value={newText}
                onChangeText={setNewText}
                multiline
                style={[styles.input, { height: 80 }]}
            />
            <Button title={submitting ? 'Submitting...' : 'Submit'} onPress={submitRating} disabled={submitting} />
          </View>
        </View>
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginHorizontal: 16, marginTop: 16 },
  map: {
    width: Dimensions.get('window').width,
    height: 200,
    marginVertical: 8,
  },
  sectionContainer: { marginTop: 10 },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 10,
  },
  sectionText: { fontSize: 18, fontWeight: 'bold' },
  descriptionText: { fontSize: 16, marginTop: 8 },
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


