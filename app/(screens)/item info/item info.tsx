import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTagPreferences } from '../../contexts/TagPreferenceContext';

export default function ItemInfoScreen() {
  const { itemName, sectionName, description, photoLink, tags } = useLocalSearchParams();
  const { selectedTags } = useTagPreferences();

  const tagList = typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : [];

  return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>{itemName}</Text>
        {sectionName ? <Text style={styles.subtitle}>Category: {sectionName}</Text> : null}

        <Image
            source={{ uri: typeof photoLink === 'string' ? photoLink : 'https://via.placeholder.com/400x200' }}
            style={styles.mapImage}
        />

        <View style={styles.sectionContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionText}>Description</Text>
            <Text style={styles.descriptionText}>{description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionText}>Tags</Text>
            <View style={styles.tagsContainer}>
              {tagList.length === 0 ? (
                  <Text style={styles.descriptionText}>No tags</Text>
              ) : (
                  tagList.map((tag, index) => {
                    const isLowlighted = selectedTags.includes(tag);
                    return (
                        <View
                            key={index}
                            style={[
                              styles.tagBox,
                              isLowlighted && styles.lowlightedTag,
                            ]}
                        >
                          <Text style={styles.tagText}>{tag}</Text>
                        </View>
                    );
                  })
              )}
            </View>
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
    borderColor: '#ccc',
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
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagBox: {
    backgroundColor: '#eee',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  lowlightedTag: {
    opacity: 0.4,
  },
  tagText: {
    fontSize: 14,
    color: '#000',
  },
});




