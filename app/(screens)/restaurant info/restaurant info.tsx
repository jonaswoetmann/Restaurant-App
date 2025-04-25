import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useLocalSearchParams, useRouter } from 'expo-router';

type Rating = {
  id: number;
  rating: number;
  restaurantid: number;
  text: string;
};

export default function RestaurantInfoScreen() {
  const router = useRouter();
  const { id, name, description, latitude, longitude } = useLocalSearchParams();
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loadingRatings, setLoadingRatings] = useState(true);

  const lat = parseFloat(latitude as string) || 0;
  const lon = parseFloat(longitude as string) || 0;

  useEffect(() => {
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

    fetchRatings();
  }, [id]);

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
          <TouchableOpacity
              style={styles.section}
              onPress={() => router.push('/restaurant page/restaurant page')}
          >
            <Text style={styles.sectionText}>Cuisines</Text>
          </TouchableOpacity>

          <View style={styles.section}>
            <Text style={styles.sectionText}>About</Text>
            <Text style={styles.descriptionText}>
              {description || 'No description available.'}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionText}>Opening times</Text>
            <Text style={styles.descriptionText}>Monday - Sunday: 08:00 - 22:00</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionText}>User Ratings</Text>
            {loadingRatings ? (
                <Text>Loading ratings...</Text>
            ) : ratings.length === 0 ? (
                <Text style={styles.descriptionText}>No ratings available.</Text>
            ) : (
                ratings.map((r) => (
                    <View key={r.id} style={{ marginTop: 10 }}>
                      <Text style={styles.descriptionText}>⭐ {r.rating}/5</Text>
                      <Text style={styles.descriptionText}>{r.text}</Text>
                    </View>
                ))
            )}
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
});


