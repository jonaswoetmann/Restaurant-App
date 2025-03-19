import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useCart } from '../cart/CartContext'; // Access cart context for managing cart items
import { useLocalSearchParams } from 'expo-router'; // To access params from the URL (restaurant ID)
import InfoIcon from './InfoIcon'; // Custom icon component

export default function CafeScreen() {
  const router = useRouter();
  const { cart, addToCart, decreaseQuantity, removeFromCart } = useCart(); // Access cart functions from context
  const [sections, setSections] = useState<{ title: string; data: { id: number; name: string; price: number }[] }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useLocalSearchParams(); // Get the restaurant ID from the URL

  // Fetch menu section data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch menu for the given restaurant
        const menus = await fetch(`http://130.225.170.52:10331/menus/restaurant/${id}`).then((res) => res.json());

        // Fetch menu sections based on the menu IDs
        const menuSectionsPromises = menus.map((menu: { id: number }) =>
            fetch(`http://130.225.170.52:10331/menuSections/menu/${menu.id}`).then((res) => res.json())
        );
        const menuSections = await Promise.all(menuSectionsPromises);

        // Fetch menu items for each section
        const menuItemsPromises = menuSections.flat().map((section: { id: number }) =>
            fetch(`http://130.225.170.52:10331/menuItems/section/${section.id}`).then((res) => res.json())
        );
        const menuItems = await Promise.all(menuItemsPromises);

        // Map the fetched data into sections with menu items
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
  }, [id]); // Fetch data on mount and whenever the restaurant ID changes

  // Helper function to check if item is already in the cart
  const isInCart = (id: number) => {
    return cart.some((item: { id: number }) => item.id === id);
  };

  // Function to render quantity buttons in the cart
  const renderQuantityButtons = (item: { id: number; quantity: number }) => {
    return (
        <View style={styles.quantityButtons}>
          <TouchableOpacity onPress={() => decreaseQuantity(item.id)}>
            <Text style={styles.changeButton}>-</Text>
          </TouchableOpacity>
          <Text>{item.quantity}</Text>
          <TouchableOpacity onPress={() => addToCart({ ...cart.find((cartItem) => cartItem.id === item.id)!, quantity: 1 })}>
            <Text style={styles.changeButton}>+</Text>
          </TouchableOpacity>
        </View>
    );
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
              style={[styles.addButton, isInCart(item.id) && styles.inCartButton]}
              onPress={() => addToCart({ ...item, quantity: 1 })} // Add item to cart when clicked
          >
            <Text style={styles.addButtonText}>
              {isInCart(item.id) ? 'In Cart' : 'Add to Cart'}
            </Text>
          </TouchableOpacity>
        </View>
    );
  };

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

          {/* Button to navigate to CartScreen */}
          <TouchableOpacity
              onPress={() => {
                router.push('/(screens)/cart/cart'); // Navigate to the CartScreen
              }}
              style={styles.cartButton}
          >
            <Text style={styles.cartButtonText}>Go to Cart</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.container}>
          {isLoading ? <Text>Loading...</Text> : (
              sections.map((section) => (
                  <View key={section.title}>
                    <Text style={styles.sectionTitle}>{section.title}</Text>
                    {section.data.map((item) => {
                      return (
                          <View key={item.id}>
                            {renderMenuItem(item)}
                            {isInCart(item.id) && (
                                <View style={styles.cartActions}>
                                  {renderQuantityButtons(cart.find((cartItem) => cartItem.id === item.id)!)}

                                  <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                                    <Text style={styles.removeButton}>Remove</Text>
                                  </TouchableOpacity>
                                </View>
                            )}
                          </View>
                      );
                    })}
                  </View>
              ))
          )}
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
  cartButton: {
    padding: 8,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    marginTop: 10,
  },
  cartButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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
  quantityButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  changeButton: {
    fontSize: 20,
    paddingHorizontal: 10,
  },
  cartActions: {
    marginTop: 10,
  },
  removeButton: {
    fontSize: 14,
    color: 'red',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 8,
    color: '#444',
  },
});


