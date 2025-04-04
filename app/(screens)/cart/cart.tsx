import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useCart } from './CartContext';
import { OrderButton } from './OrderButton';
import { Picker } from '@react-native-picker/picker';

export default function CartScreen() {
  const { cart, increaseQuantity, decreaseQuantity, removeFromCart } = useCart();
  const [selectedTable, setSelectedTable] = React.useState(1);

  const handleOrder = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty. Please add items before placing an order.');
      return;
    }

    try {
      const orderPayload = {
        orderTable: parseInt(String(selectedTable)),
        restaurantId: 1,
        menuItems: cart.map(item => item.id)
      };

      const response = await fetch('http://130.225.170.52:10331/api/orders/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        console.error(`Failed to place order: ${response.statusText}`);
        alert('An error occurred while placing the order.');
        return;
      }

      alert('Order placed successfully!');
    } catch (error) {
      console.error(error);
      alert('An error occurred while placing the order.');
    }
  };

  return (
      <View style={styles.screenContainer}>
        <View style={styles.cartContainer}>
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
          <Text style={styles.dropdownLabel}>Select Table</Text>
          <Picker
              selectedValue={selectedTable}
              onValueChange={(itemValue) => setSelectedTable(itemValue)}
              style={styles.picker}
          >
            {Array.from({ length: 50 }, (_, i) => (
                <Picker.Item key={i + 1} label={`Table ${i + 1}`} value={(i + 1).toString()} />
            ))}
          </Picker>
          <OrderButton onPress={handleOrder} />
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  cartContainer: {
    paddingTop: 40,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dropdownLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
    marginTop: 10,
  },
  picker: {
    height: 50,
    width: '100%',
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
