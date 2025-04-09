import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function RestaurantInfoScreen() {
  const router = useRouter();
  const { name, description, latitude, longitude } = useLocalSearchParams();

  const lat = parseFloat(latitude as string) || 0;
  const lon = parseFloat(longitude as string) || 0;

  return (
      <ScrollView style={styles.container}>
        {/* Title */}
        <Text style={styles.title}>{name || 'Restaurant'}</Text>

        {/* MapView */}
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

        {/* Sections */}
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
        </View>
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginTop: 16,
  },
  map: {
    width: Dimensions.get('window').width,
    height: 200,
    marginVertical: 8,
  },
  sectionContainer: {
    marginTop: 10,
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  descriptionText: {
    fontSize: 16,
    marginTop: 8,
  },
});

