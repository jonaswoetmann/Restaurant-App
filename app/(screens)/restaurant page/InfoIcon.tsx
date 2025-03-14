import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
interface InfoIconProps {
    style?: { marginRight: number }
}

export default function InfoIcon({ style }: InfoIconProps) {
    return (
        <View style={[styles.iconContainer, style]}>
            <MaterialIcons name="info" size={24} color="#00796b" />
        </View>
    );
}


const styles = StyleSheet.create({
    infoBox: {
        width: '90%',
        padding: 16,
        backgroundColor: '#e0f7fa',
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#b2ebf2',
        marginVertical: 16,
        marginHorizontal: 'auto',
    },
    icon: {
        marginRight: 10,
    },
    text: {
        fontSize: 16,
        color: '#00796b',
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },

});