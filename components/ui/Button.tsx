import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import {Colors} from '@/constants/Colors';

type ButtonProps = {
  title: string;
  onPress: () => void;
};

export const Button: React.FC<ButtonProps> = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.buttonBackground,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: 320,
    height: 100,
    textAlignVertical: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlignVertical: 'center',
  },
});