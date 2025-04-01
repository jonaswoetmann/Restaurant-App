import React from 'react';
import { Button } from '@/components/ui/Button';
import { View, StyleSheet } from "react-native";

type OrderButtonProps = {
  onPress: () => void;
};

export const OrderButton: React.FC<OrderButtonProps> = ({ onPress }) => {
  return (
      <View style={styles.container}>
        <Button title="Order" onPress={onPress} />
      </View>

  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingBottom: 16
  },
});

export default OrderButton;