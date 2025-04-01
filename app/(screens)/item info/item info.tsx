import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function ItemInfoScreen() {
  const { itemID } = useLocalSearchParams();
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [sectionName, setSectionName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        // Step 1: Get item details
        const res = await fetch(`http://130.225.170.52:10331/api/menuItems/${itemID}`);
        const item = await res.json();
        setItemName(item.name);
        setDescription(item.description);

        // Step 2: Get section name
        const sectionRes = await fetch(`http://130.225.170.52:10331/api/menuSections/${item.sectionID}`);
        const sectionData = await sectionRes.json();
        setSectionName(sectionData.name);
      } catch (err) {
        console.error('Error fetching item/section:', err);
        setItemName('Unknown Item');
        setDescription('Could not load description.');
      } finally {
        setLoading(false);
      }
    };

    if (itemID) {
      fetchItem();
    }
  }, [itemID]);

  return (
      <ScrollView style={styles.container}>
        {loading ? (
            <ActivityIndicator size="large" color="#000" />
        ) : (
            <>
              <Text style={styles.title}>{itemName}</Text>
              {sectionName ? (
                  <Text style={styles.subtitle}>Category: {sectionName}</Text>
              ) : null}

              <Image
                  source={{ uri: 'https://via.placeholder.com/400x200' }}
                  style={styles.mapImage}
              />

              <View style={styles.sectionContainer}>
                <View style={styles.section}>
                  <Text style={styles.sectionText}>Description</Text>
                  <Text style={styles.descriptionText}>{description}</Text>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionText}>Allergens</Text>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionText}>Næringsindhold</Text>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionText}>Calories</Text>
                </View>
              </View>
            </>
        )}
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
  subtitle: {
    fontSize: 16,
    marginHorizontal: 16,
    marginTop: 4,
    color: '#666',
  },
  mapImage: {
    width: '100%',
    height: 200,
    marginVertical: 8,
  },
  sectionContainer: {
    marginTop: 10,
    paddingHorizontal: 16,
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 10,
    borderRadius: 8,
  },
  sectionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    color: '#333',
  },
});



