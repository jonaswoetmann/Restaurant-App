import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useCart } from './CartContext';
import { OrderButton } from './OrderButton';
import Dropdown from 'react-native-dropdown-picker';
import * as WebBrowser from 'expo-web-browser';

export default function CartScreen() {
  const { cart, increaseQuantity, decreaseQuantity, removeFromCart, restaurantId } = useCart();
  const [selectedTable, setSelectedTable] = React.useState(1);
  const [Comment, setComment] = React.useState('');
  const [open, setOpen] = React.useState(false);

  const handleOrder = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty. Please add items before placing an order.');
      return;
    }
    try {
      const orderPayload = {
        orderTable: parseInt(String(selectedTable)),
        restaurantId: restaurantId,
        userId: 1,
        menuItems: cart.flatMap(item => Array(item.quantity).fill(item.id)),
        comments: Comment,
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

      const createOrder = await response.json();
      const orderId = parseInt(createOrder.message.replace(/\D/g, ''), 10);

      const stripeResponse = await fetch(`http://130.225.170.52:10331/api/orders/${orderId}/create-payment-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ }),
      });

      if (!stripeResponse.ok) {
        console.error(`Payment session failed: ${stripeResponse.statusText}`);
        alert('Failed to initiate payment.');
        return;
      }

      const stripeData = await stripeResponse.json();
      const url = stripeData.checkout_url;

      if (!url) {
        alert('Invalid URL');
        return;
      }

      await WebBrowser.openBrowserAsync(url);

    } catch (error) {
      console.error(error);
      alert('An error occurred while placing the order.');
    }
  };

  return (
    <View style={styles.screenContainer}>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <View style={styles.cartHeader}>
            <Text style={styles.text}>Your Cart</Text>
          </View>
        }
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
        ListFooterComponent={
          <View style={styles.cartFooter}>
            <Text style={styles.dropdownLabel}>Select Table</Text>
            <Dropdown
                items={Array.from({ length: 5 }, (_, i) => ({
                  label: `Table ${i + 1}`,
                  value: (i + 1).toString(),
                }))}
                value={selectedTable.toString()}
                containerStyle={styles.dropdownContainer}
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropDownList}
                open={open}
                setOpen={setOpen}
                setValue={setSelectedTable}
            />
            <Text style={styles.dropdownLabel}>Comments</Text>
            <TextInput
              style={styles.commentBox}
              placeholder="Any special requests or comments?"
              value={Comment}
              onChangeText={setComment}
              multiline
            />
            <OrderButton onPress={handleOrder} />
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  cartHeader: {
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 20,
    backgroundColor: '#fff'
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
    marginTop: 20,
  },
  dropdownContainer: {
    height: 40,
    width: '100%',
  },
  dropdown: {
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  dropDownList: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ccc',
    maxHeight: 300,
  },
  commentBox: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    height: 80,
    marginBottom: 12,
    textAlignVertical: 'top',
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
  cartFooter: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
});