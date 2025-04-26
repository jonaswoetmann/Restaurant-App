import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';
import {Colors} from '@/constants/Colors';

type ButtonProps = {
  title: string;
  onPress: () => void;
  centerText?: boolean;
  rating?: number;
};

export const Button: React.FC<ButtonProps> = ({ title, onPress, centerText = false, rating }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <View>
        <Text style={[styles.buttonText, centerText && styles.centerText]}>{title}</Text>
        {rating && (
            <Text style={styles.rating}>{rating}</Text>
        )}
      </View>
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
    width: 320,
    height: 100,
    textAlignVertical: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlignVertical: 'center',
  },
  centerText: {
    textAlign: 'center'
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    textAlignVertical: 'center',
    textAlign: 'right',
  }
});