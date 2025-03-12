import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function RestaurantInfoScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Cafe Vivaldi</Text>

      {/* Map Image Placeholder */}
      <Image 
        source={{ uri: 'https://via.placeholder.com/400x200' }} 
        style={styles.mapImage} 
      />

      {/* Sections */}
      <View style={styles.sectionContainer}>
        <TouchableOpacity 
          style={styles.section} 
          onPress={() => router.push('/restaurant page/restaurant page')} 
        >
          <Text style={styles.sectionText}>Cuisines</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.section}>
          <Text style={styles.sectionText}>About</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.section}>
          <Text style={styles.sectionText}>Opening times</Text>
        </TouchableOpacity>
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
  mapImage: {
    width: '100%',
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
  },
  sectionText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

