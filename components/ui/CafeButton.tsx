import React from 'react';
import { Button } from '@/components/ui/Button';

type CafeButtonProps = {
  onPress: () => void;
};

export const CafeButton: React.FC<CafeButtonProps> = ({ onPress }) => {
  return <Button title="Cafe Vivaldi" onPress={onPress} />;
};

export default CafeButton;