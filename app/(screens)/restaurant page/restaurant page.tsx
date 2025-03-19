import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useCart } from '../cart/CartContext';

export default function CafeScreen() {
  const { cart, addToCart } = useCart(); // Access cart and addToCart function from the CartContext
  const [sections, setSections] = useState<{ title: string; data: { id: number; name: string; price: number }[] }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch menu section data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data for each menu section
        const section1 = await fetch('http://130.225.170.52:10331/menuItems/section/1').then((res) =>
            res.json()
        );
        const section2 = await fetch('http://130.225.170.52:10331/menuItems/section/2').then((res) =>
            res.json()
        );
        const section3 = await fetch('http://130.225.170.52:10331/menuItems/section/3').then((res) =>
            res.json()
        );

        // Map fetched data to ensure consistency
        setSections([
          {
            title: 'Appetizers',
            data: section1.map((item: any, index: number) => ({
              ...item,
              id: item.id ?? index, // Fallback for id
              name: item.name ?? 'Unknown', // Fallback for name
              price: item.price ?? 0, // Fallback for price
            })),
          },
          {
            title: 'Main Courses',
            data: section2.map((item: any, index: number) => ({
              ...item,
              id: item.id ?? index,
              name: item.name ?? 'Unknown',
              price: item.price ?? 0,
            })),
          },
          {
            title: 'Desserts',
            data: section3.map((item: any, index: number) => ({
              ...item,
              id: item.id ?? index,
              name: item.name ?? 'Unknown',
              price: item.price ?? 0,
            })),
          },
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to check if item is already in the cart
  const isInCart = (id: number) => {
    return cart.some((item: { id: number }) => item.id === id);
  };

  // Render function for each menu item with an "Add to Cart" button
  const renderMenuItem = (item: { id: number; name: string; price: number }) => {
    return (
        <View key={item.id} style={styles.menuItem}>
          <View>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>{item.price} DKK</Text>
          </View>
          <TouchableOpacity
              style={[styles.addButton, isInCart(item.id) && styles.inCartButton]} // Change button style if item is in cart
              onPress={() => addToCart({ ...item, quantity: 1 })} // Add item to cart when clicked
          >
            <Text style={styles.addButtonText}>
              {isInCart(item.id) ? 'In Cart' : 'Add to Cart'} {/* Change button text if item is in cart */}
            </Text>
          </TouchableOpacity>
        </View>
    );
  };

  return (
      <View style={styles.container}>
        {/* Show loading text while data is being fetched */}
        {isLoading ? (
            <Text>Loading...</Text>
        ) : (
            sections.map((section) => (
                <View key={section.title}>
                  {/* Render each section */}
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                  {section.data.map(renderMenuItem)} {/* Render menu items in each section */}
                </View>
            ))
        )}
      </View>
  );
}

// Styles for the screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 8,
    color: '#444',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    marginVertical: 4,
    borderRadius: 5,
    backgroundColor: '#fff',
    elevation: 2,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
  },
  itemPrice: {
    fontSize: 16,
    color: 'gray',
  },
  addButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  inCartButton: {
    backgroundColor: '#ccc',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});