import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import InfoIcon from '../restaurant page/InfoIcon';
import { useCart } from '../cart/CartContext';
import { Image } from 'expo-image';

const defaultTheme = {
    name: 'Standard',
    colors: {
        primary: '#FFFFFF',
        background: '#F5F5F5',
        text: '#000000',
        text2: '#FFFFFF',
        secondary: '#f4845f',
        accent1: '#4CAF50',
        accent2: '#FFDD99',
    },
};

export default function CafeScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [restaurant, setRestaurant] = useState<any>(null);
    const [menuDescription, setMenuDescription] = useState('');
    const [sections, setSections] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [themeState, setTheme] = useState(defaultTheme);

    const {
        cart,
        increaseQuantity,
        decreaseQuantity,
        restaurantId,
        setRestaurantId,
        clearCart,
        addToCart,
    } = useCart();

    const styles = useMemo(() => createStyles(themeState), [themeState]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);

                const restaurantData = await fetch(`http://130.225.170.52:10331/api/restaurants/${id}`).then(res => res.json());
                const restaurantInfo = restaurantData[0];
                setRestaurant(restaurantInfo);

                if (restaurantId !== Number(id)) {
                    clearCart();
                    setRestaurantId(Number(id));
                }

                if (restaurantInfo.theme !== "Standard") {
                    const themedata = await fetch(`http://130.225.170.52:10331/api/restaurants/theme/${restaurantInfo.theme}`).then(res => res.json());
                    const newTheme = {
                        name: restaurantInfo.theme,
                        colors: {
                            primary: themedata.primarycolor,
                            background: themedata.background,
                            text: themedata.text,
                            text2: themedata.text2,
                            secondary: themedata.secondary,
                            accent1: themedata.accent1,
                            accent2: themedata.accent2,
                        },
                    };
                    setTheme(newTheme);
                }

                const menus = await fetch(`http://130.225.170.52:10331/api/menus/restaurant/${id}`).then(res => res.json());
                setMenuDescription(menus[0]?.description || 'No description available');

                const menuSections = await Promise.all(menus.map((menu: any) =>
                    fetch(`http://130.225.170.52:10331/api/menuSections/menu/${menu.id}`).then(res => res.json())
                ));

                const menuItems = await Promise.all(menuSections.flat().map((section: any) =>
                    fetch(`http://130.225.170.52:10331/api/menuItems/section/${section.id}`).then(res => res.json())
                ));
                const sectionData = menuSections.flat().map((section: any, index: number) => {
                    const items = menuItems[index].map((item: any) => ({
                        id: item.id,
                        name: item.name || 'Unknown',
                        price: item.price || 0,
                        sectionName: section.name,
                        description: item.description || 'No description available',
                        photoLink: item.photolink || 'https://jamnawmenu.blob.core.windows.net/menu-items/Green%20Salad1',
                    }));
                    return {
                        title: section.name || `Section ${section.id}`,
                        data: items,
                    };
                });

                setSections(sectionData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.headerBox}>
                <Text style={styles.headerText}>{restaurant?.name || 'Loading...'}</Text>
                <View style={styles.headerActions}>
                    <TouchableOpacity
                        onPress={() =>
                            router.push({
                                pathname: '/restaurant info/restaurant info',
                                params: {
                                    id: id,
                                    name: restaurant?.name,
                                    description: restaurant?.description || '',
                                    openingTimes: restaurant?.openingTimes || '',
                                    closingTimes: restaurant?.closingTimes || '',
                                    latitude: restaurant?.latitude?.toString() || '0',
                                    longitude: restaurant?.longitude?.toString() || '0',
                                    themeSecondaryColor: themeState.colors.secondary,
                                },
                            })
                        }
                        style={styles.iconContainer}
                    >
                        <InfoIcon />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => router.push('/cart/cart')}
                        style={styles.cartButton}
                    >
                        <Text style={styles.cartText}>Cart</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.menuContainer}>
                {isLoading ? (
                    <Text>Loading...</Text>
                ) : (
                    <FlatList
                        data={sections}
                        keyExtractor={(item) => item.title}
                        renderItem={({ item }) => (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>{item.title}</Text>
                                {item.data.map((menuItem: { id: any; name: any; price: any; sectionName?: any; description?: any; photoLink?: any; }) => {
                                    const existing = cart.find((c) => c.id === menuItem.id);
                                    const quantity = existing?.quantity || 0;
                                    return (
                                        <View key={menuItem.id} style={styles.menuItem}>
                                            <View style={{ flex: 1 }}>
                                                <View style={{ flexDirection: 'row'}}>
                                                    <Image
                                                        source={ menuItem.photoLink }
                                                        style={styles.menuItemImage}
                                                    />
                                                    <View style={{ flex: 1, alignItems: 'center' }}>
                                                        <Text style={styles.menuText}>{menuItem.name}</Text>
                                                        <Text style={styles.priceText}>{menuItem.price} DKK</Text>
                                                    </View>
                                                </View>
                                            </View>

                                            <View style={styles.infoAndActionsRow}>
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        router.push({
                                                            pathname: '/item info/item info',
                                                            params: {
                                                                itemID: menuItem.id,
                                                                itemName: menuItem.name,
                                                                sectionName: menuItem.sectionName,
                                                                description: menuItem.description,
                                                                photoLink: menuItem.photoLink,
                                                            },
                                                        })
                                                    }
                                                >
                                                    <InfoIcon />
                                                </TouchableOpacity>

                                                {quantity > 0 ? (
                                                    <View style={styles.actionBox}>
                                                        <TouchableOpacity
                                                            onPress={() => decreaseQuantity(menuItem.id)}
                                                            style={styles.qtyButton}
                                                        >
                                                            <Text style={styles.qtyButtonText}>-</Text>
                                                        </TouchableOpacity>
                                                        <Text style={styles.quantityText}>{quantity}</Text>
                                                        <TouchableOpacity
                                                            onPress={() => increaseQuantity(menuItem.id)}
                                                            style={styles.qtyButton}
                                                        >
                                                            <Text style={styles.qtyButtonText}>+</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                ) : (
                                                    <TouchableOpacity
                                                        onPress={() => addToCart(menuItem)}
                                                        style={styles.addButton}
                                                    >
                                                        <Text style={styles.addButtonText}>Add</Text>
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                        </View>
                                    );
                                })}
                            </View>
                        )}
                    />
                )}
            </View>
        </View>
    );
}

const createStyles = (theme: typeof defaultTheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        headerBox: {
            width: '100%',
            height: 150,
            padding: 16,
            backgroundColor: theme.colors.secondary,
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: '#ccc',
            flexDirection: 'row',
        },
        headerText: {
            fontSize: 24,
            fontWeight: 'bold',
            color: theme.colors.text,
        },
        headerActions: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
        },
        iconContainer: {
            padding: 8,
        },
        cartButton: {
            paddingVertical: 6,
            paddingHorizontal: 12,
            backgroundColor: '#333',
            borderRadius: 6,
        },
        cartText: {
            color: theme.colors.text2,
            fontWeight: 'bold',
        },
        menuContainer: {
            flex: 1,
            padding: 16,
        },
        section: {
            marginBottom: 24,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 8,
        },
        menuItem: {
            backgroundColor: theme.colors.primary,
            padding: 12,
            borderRadius: 8,
            marginBottom: 8,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            elevation: 2,
        },
        menuItemImage: {
            width: 50,
            height: 50,
        },
        menuText: {
            fontSize: 16,
        },
        priceText: {
            fontSize: 16,
            fontWeight: '600',
        },
        infoAndActionsRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
        },
        addButton: {
            backgroundColor: theme.colors.accent1,
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 6,
        },
        addButtonText: {
            color: theme.colors.text2,
            fontWeight: 'bold',
        },
        actionBox: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        qtyButton: {
            backgroundColor: theme.colors.secondary,
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 4,
        },
        qtyButtonText: {
            fontSize: 18,
            fontWeight: 'bold',
        },
        quantityText: {
            fontSize: 16,
            fontWeight: '600',
            minWidth: 24,
            textAlign: 'center',
        },
    });
