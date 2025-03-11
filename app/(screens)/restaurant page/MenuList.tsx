import React from 'react';
import { View, Text, SectionList, StyleSheet } from 'react-native';

interface User {
    id: number;
    name: string;
    price: number;
}

interface Section {
    title: string;
    data: User[];
}

interface MenuListProps {
    sections: Section[];
    isLoading: boolean;
}

const MenuList: React.FC<MenuListProps> = ({ sections, isLoading }) => {
    const renderItem = ({ item }: { item: User }) => (
        <View style={styles.item}>
            <Text style={styles.itemText}>{item.name}</Text>
            <Text style={styles.itemSubText}>Price: {item.price}</Text>
        </View>
    );

    const renderSectionHeader = ({
                                     section,
                                 }: {
        section: Section;
    }) => (
        <View style={styles.header}>
            <Text style={styles.headerText}>{section.title}</Text>
        </View>
    );


    return (
        <SectionList
            sections={sections}
            renderItem={renderItem}
            renderSectionHeader={renderSectionHeader}
            keyExtractor={(item) => item.id.toString()}
        />
    );
};


export default MenuList;

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#f0f0f0',
        padding: 8,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    item: {
        padding: 16,
        backgroundColor: '#e6e6e6',
        marginBottom: 8,
    },
    itemText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    itemSubText: {
        fontSize: 14,
        color: '#666',
    },
});
