import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

interface User {
    name: string;
    email: string;
}

interface MenuListProps {
    data: User[];
    isLoading: boolean;
}

const MenuList: React.FC<MenuListProps> = ({ data, isLoading }) => {
    const renderItem = ({ item }: { item: User }) => (
        <View style={styles.item}>
            <Text style={styles.itemText}>{item.name}</Text>
            <Text style={styles.itemSubText}>Email: {item.email}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {isLoading ? (
                <Text>Loading...</Text>
            ) : (
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                />
            )}
        </View>
    );
};

export default MenuList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
    },
    item: {
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        backgroundColor: '#e6e6e6',
        borderRadius: 8,
    },
    itemText: {
        fontSize: 18,
        fontWeight: '500',
    },
    itemSubText: {
        fontSize: 14,
        color: '#555',
    },
});