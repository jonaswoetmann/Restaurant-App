import React from 'react';
import { Button } from '@/components/ui/Button';

type OrderButtonProps = {
  onPress: () => void;
};

export const OrderButton: React.FC<OrderButtonProps> = ({ onPress }) => {
  return <Button title="Order" onPress={onPress} />;
};

export default OrderButton;