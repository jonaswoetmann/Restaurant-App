import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useCart } from '../cart/CartContext';

export default function CartScreen() {
  const { cart, removeFromCart, decreaseQuantity, addToCart } = useCart();

  return (
      <View style={styles.container}>
        <Text style={styles.header}>Your Cart</Text>
        {cart.length === 0 ? (
            <Text style={styles.emptyText}>Your cart is empty.</Text> // Shows when the cart is empty
        ) : (
            <FlatList
                data={cart}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.cartItem}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
                      <Text style={styles.itemPrice}>{item.price} DKK</Text>
                      <View style={styles.quantityButtons}>
                        <TouchableOpacity onPress={() => decreaseQuantity(item.id)}>
                          <Text style={styles.changeButton}>-</Text>
                        </TouchableOpacity>
                        <Text>{item.quantity}</Text>
                        <TouchableOpacity onPress={() => addToCart(item)}>
                          <Text style={styles.changeButton}>+</Text>
                        </TouchableOpacity>
                      </View>
                      <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                        <Text style={styles.removeButton}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                )}
            />
        )}
      </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  emptyText: { textAlign: 'center', fontSize: 16 }, // Shows when the cart is empty
  cartItem: { marginBottom: 15, padding: 10, borderRadius: 5, backgroundColor: '#f9f9f9' },
  itemName: { fontSize: 16, fontWeight: 'bold' },
  itemQuantity: { fontSize: 14, color: 'gray' },
  itemPrice: { fontSize: 14 },
  removeButton: { fontSize: 14, color: 'red', marginTop: 5 },
  quantityButtons: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  changeButton: { fontSize: 20, paddingHorizontal: 10 },
});
