import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import InfoIcon from './InfoIcon'; // Ensure the InfoIcon component is correctly imported

interface InfoIconProps {
    style?: { marginRight: number }
}

export default function InfoBox({style}: InfoIconProps) {
    return (
        <View style={styles.infoBox}>
            {}
            <InfoIcon style={styles.icon}/>

            {}
            <Text style={styles.text}>This is an informational box.</Text>
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
});