import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

export default function CafeScreen() {
  const [data, setData] = useState<{ name: string; email: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://130.225.170.52:10331/users');
        const json: { name: string; email: string }[] = await response.json();
        setData(json);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderItem = ({ item }: { item: { name: string; email: string } }) => (
      <View style={styles.item}>{}
        <Text style={styles.itemText}>{item.name}</Text>
        <Text style={styles.itemSubText}>Email: {item.email}</Text>
      </View>
  );


  return (
      <View style={styles.container}>
        {isLoading ? (
            <Text>Loading...</Text>
        ) : (
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
            />
        )}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  itemSubText: {
    fontSize: 14,
    color: '#555',
  },
  item: {
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#e6e6e6',
    borderRadius: 8,
  },
  itemText: {
    fontSize: 18,
    fontWeight: '500',
  },
  },
);