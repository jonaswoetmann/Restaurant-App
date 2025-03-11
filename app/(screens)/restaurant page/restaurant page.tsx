import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MenuList from './MenuList';

export default function CafeScreen() {
  const [data, setData] = useState<{ name: string; price: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://130.225.170.52:10331/menuItems/section/2');
        const json: { name: string; price: number }[] = await response.json();
        setData(json);
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
        <MenuList data={data} isLoading={isLoading} />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
});