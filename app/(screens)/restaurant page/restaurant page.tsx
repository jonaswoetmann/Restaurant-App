import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import InfoIcon from './InfoIcon';
import { useCart } from '../cart/CartContext';

export default function CafeScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [restaurantName, setRestaurantName] = useState('Loading...');
  const [sections, setSections] = useState<
      { title: string; data: { id: number; name: string; price: number }[] }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const { cart, addToCart, increaseQuantity, decreaseQuantity } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const restaurant = await fetch(
            `http://130.225.170.52:10331/api/restaurants/${id}`
        ).then((res) => res.json());
        setRestaurantName(restaurant[0]?.name || 'Unknown');

        const menus = await fetch(
            `http://130.225.170.52:10331/api/menus/restaurant/${id}`
        ).then((res) => res.json());

        const menuSectionsPromises = menus.map((menu: { id: number }) =>
            fetch(`http://130.225.170.52:10331/api/menuSections/menu/${menu.id}`).then((res) =>
                res.json()
            )
        );
        const menuSections = await Promise.all(menuSectionsPromises);

        const menuItemsPromises = menuSections
            .flat()
            .map((section: { id: number }) =>
                fetch(`http://130.225.170.52:10331/api/menuItems/section/${section.id}`).then((res) =>
                    res.json()
                )
            );
        const menuItems = await Promise.all(menuItemsPromises);

        const sectionData = menuSections.flat().map(
            (section: { id: number; name: string }, index: number) => {
              const items = menuItems[index].map(
                  (item: { id: number; name: string; price: number }) => ({
                    id: item.id,
                    name: item.name || 'Unknown',
                    price: item.price || 0,
                  })
              );

              return {
                title: section.name || `Section ${section.id}`,
                data: items,
              };
            }
        );

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
        {/* Header */}
        <View style={styles.headerBox}>
          <Text style={styles.headerText}>{restaurantName}</Text>

          {/* Info and Cart buttons */}
          <View style={styles.headerActions}>
            <TouchableOpacity
                onPress={() => router.push('/restaurant info/restaurant info')}
                style={styles.iconContainer}
            >
              <InfoIcon />
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => router.push('/cart/cart')}
                style={styles.cartButton}
            >
              <Text style={styles.cartText}>Cart</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu */}
        <View style={styles.menuContainer}>
          {isLoading ? (
              <Text>Loading...</Text>
          ) : (
              <FlatList
                  data={sections}
                  keyExtractor={(item) => item.title}
                  renderItem={({ item }) => (
                      <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{item.title}</Text>
                        {item.data.map((menuItem) => {
                          const existing = cart.find((c) => c.id === menuItem.id);
                          const quantity = existing?.quantity || 0;

                          return (
                              <View key={menuItem.id} style={styles.menuItem}>
                                <View>
                                  <Text style={styles.menuText}>{menuItem.name}</Text>
                                  <Text style={styles.priceText}>{menuItem.price} DKK</Text>
                                </View>

                                <View style={styles.actionBox}>
                                  {quantity > 0 ? (
                                      <>
                                        <TouchableOpacity
                                            onPress={() => decreaseQuantity(menuItem.id)}
                                            style={styles.qtyButton}
                                        >
                                          <Text style={styles.qtyButtonText}>-</Text>
                                        </TouchableOpacity>
                                        <Text style={styles.quantityText}>{quantity}</Text>
                                        <TouchableOpacity
                                            onPress={() => increaseQuantity(menuItem.id)}
                                            style={styles.qtyButton}
                                        >
                                          <Text style={styles.qtyButtonText}>+</Text>
                                        </TouchableOpacity>
                                      </>
                                  ) : (
                                      <TouchableOpacity
                                          onPress={() => addToCart(menuItem)}
                                          style={styles.addButton}
                                      >
                                        <Text style={styles.addButtonText}>Add</Text>
                                      </TouchableOpacity>
                                  )}
                                </View>
                              </View>
                          );
                        })}
                      </View>
                  )}
              />
          )}
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'Colors.background',
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    padding: 8,
  },
  cartButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#333',
    borderRadius: 6,
  },
  cartText: {
    color: 'white',
    fontWeight: 'bold',
  },
  menuContainer: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  menuItem: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  menuText: {
    fontSize: 16,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  actionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qtyButton: {
    backgroundColor: '#ddd',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
  },
  qtyButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    minWidth: 24,
    textAlign: 'center',
  },
});
