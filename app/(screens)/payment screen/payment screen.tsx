import React, { useState } from 'react';
import { View, Text, Button, Alert, ActivityIndicator } from 'react-native';
import { useStripe, CardField, CardFieldInput } from '@stripe/stripe-react-native';

export default function PaymentScreen() {
  const { confirmPayment } = useStripe();
  const [cardDetails, setCardDetails] = useState<CardFieldInput.Details | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePayPress = async () => {
    setLoading(true);

    try {
      const response = await fetch('', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 1 })
      });

      const { clientSecret } = await response.json();

      const { paymentIntent, error } = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
        paymentMethodData: {
          billingDetails: {
            email: 'user@example.com',
          },
        },
      });

      if (error) {
        Alert.alert('Payment failed', error.message);
      } else if (paymentIntent) {
        Alert.alert('Success', 'Payment successful!');
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      <Text style={{ marginBottom: 20 }}>Enter your card details</Text>
      <CardField
        postalCodeEnabled={false}
        cardStyle={{
          backgroundColor: '#FFFFFF',
          textColor: '#000000',
        }}
        style={{
          width: '100%',
          height: 50,
          marginVertical: 30,
        }}
        onCardChange={(details) => {
          setCardDetails(details);
        }}
      />
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Button title="Pay" onPress={handlePayPress} />
      )}
    </View>
  );
}