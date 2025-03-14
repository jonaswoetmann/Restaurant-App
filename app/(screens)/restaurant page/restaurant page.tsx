import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MenuList from './MenuList';

export default function CafeScreen() {
  const [sections, setSections] = useState<{ title: string; data: { id: number; name: string; price: number }[] }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const section1 = await fetch('http://130.225.170.52:10331/menuItems/section/1').then((res) =>
            res.json(),
        );
        const section2 = await fetch('http://130.225.170.52:10331/menuItems/section/2').then((res) =>
            res.json(),
        );
        const section3 = await fetch('http://130.225.170.52:10331/menuItems/section/3').then((res) =>
            res.json(),
        );

        setSections([
          { title: 'Appetizers', data: section1.map((item: any, index: number) => ({ ...item, id: item.id ?? index, name: item.name ?? 'Unknown', price: item.price ?? 0 })) },
          { title: 'Main Courses', data: section2.map((item: any, index: number) => ({ ...item, id: item.id ?? index, name: item.name ?? 'Unknown', price: item.price ?? 0 })) },
          { title: 'Desserts', data: section3.map((item: any, index: number) => ({ ...item, id: item.id ?? index, name: item.name ?? 'Unknown', price: item.price ?? 0 })) },
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };


    fetchData();
  }, []);

  return (
      <View style={styles.container}>
        {}
        <View style={styles.headerBox}>
          <Text style={styles.headerText}>Cafe Vivaldi</Text>
        </View>

        <View style={styles.container}>
        {isLoading ? (
            <Text>Loading...</Text>
        ) : (
            <MenuList sections={sections} isLoading={isLoading} />
        )}
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerBox: {
    width: '100%',
    height: 150,
    padding: 16,
    backgroundColor: '#ffdd99',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});
