import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useCart } from './CartContext';

export default function CartScreen() {
  const { cart, increaseQuantity, decreaseQuantity, removeFromCart } = useCart();

  return (
      <View style={styles.container}>
        <Text style={styles.text}>Your Cart</Text>
        <FlatList
            data={cart}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={<Text>Your cart is empty.</Text>}
            renderItem={({ item }) => (
                <View style={styles.item}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.price}>{item.price} DKK</Text>

                  <View style={styles.controls}>
                    <TouchableOpacity onPress={() => decreaseQuantity(item.id)} style={styles.qtyButton}>
                      <Text style={styles.qtyButtonText}>-</Text>
                    </TouchableOpacity>

                    <Text style={styles.quantity}>{item.quantity}</Text>

                    <TouchableOpacity onPress={() => increaseQuantity(item.id)} style={styles.qtyButton}>
                      <Text style={styles.qtyButtonText}>+</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                      <Text style={styles.remove}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                </View>
            )}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  name: {
    fontWeight: '600',
    fontSize: 16,
  },
  price: {
    fontSize: 14,
    marginBottom: 6,
    color: '#555',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
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
  quantity: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 4,
  },
  remove: {
    marginLeft: 'auto',
    color: 'red',
    fontSize: 14,
  },
});

