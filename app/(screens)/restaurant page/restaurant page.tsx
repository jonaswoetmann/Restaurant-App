import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import InfoIcon from './InfoIcon';
import MenuList from './MenuList';

export default function CafeScreen() {
  const router = useRouter();
  const [sections, setSections] = useState<{ title: string; data: { id: number; name: string; price: number }[] }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const menus = await fetch('http://130.225.170.52:10331/menus/restaurant/2').then((res) => res.json());

        const menuSectionsPromises = menus.map((menu: { id: number }) =>
            fetch(`http://130.225.170.52:10331/menuSections/menu/${menu.id}`).then((res) => res.json())
        );

        const menuSections = await Promise.all(menuSectionsPromises);

        const menuItemsPromises = menuSections.flat().map((section: { id: number }) =>
            fetch(`http://130.225.170.52:10331/menuItems/section/${section.id}`).then((res) => res.json())
        );

        const menuItems = await Promise.all(menuItemsPromises);

        const sectionData = menuSections.flat().map((section: { id: number; name: string }, index: number) => {
          const items = menuItems[index].map((item: { id: number; name: string; price: number }) => ({
            id: item.id,
            name: item.name || 'Unknown',
            price: item.price || 0,
          }));

          return {
            title: section.name || `Section ${section.id}`,
            data: items,
          };
        });


        setSections(sectionData);
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
        <View style={styles.headerBox}>
          <Text style={styles.headerText}>Cafe Vivaldi</Text>

          <TouchableOpacity
              onPress={() => {
                router.push('/(screens)/restaurant info/restaurant info');
              }}
              style={styles.iconContainer}
          >
            <InfoIcon />
          </TouchableOpacity>
        </View>

        <View style={styles.container}>
          {isLoading ? <Text>Loading...</Text> : <MenuList sections={sections} isLoading={isLoading} />}
        </View>
      </View>
  );
}


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
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  iconContainer: {
    padding: 8,
  },
});
