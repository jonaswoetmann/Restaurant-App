import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import InfoIcon from '../restaurant page/InfoIcon';
import { useCart } from '../../contexts/CartContext';
import { useTagPreferences } from '../../contexts/TagPreferenceContext';

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

type TagType = { tagvalue: string };

type MenuItemType = {
    id: number;
    name: string;
    price: number;
    sectionName?: string;
    description?: string;
    photoLink?: string;
    tags?: TagType[];
};

type SectionType = {
    title: string;
    data: MenuItemType[];
};

export default function CafeScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [restaurant, setRestaurant] = useState<any>(null);
    const [sections, setSections] = useState<SectionType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [themeState, setTheme] = useState(defaultTheme);
    const { selectedTags } = useTagPreferences();

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
                const menuSections = await Promise.all(menus.map((menu: any) =>
                    fetch(`http://130.225.170.52:10331/api/menuSections/menu/${menu.id}`).then(res => res.json())
                ));

                const menuItems = await Promise.all(menuSections.flat().map((section: any) =>
                    fetch(`http://130.225.170.52:10331/api/menuItems/section/${section.id}`).then(res => res.json())
                ));

                const sectionData: SectionType[] = menuSections.flat().map((section: any, index: number) => {
                    const items: MenuItemType[] = menuItems[index].map((item: any) => ({
                        id: item.id,
                        name: item.name || 'Unknown',
                        price: item.price || 0,
                        sectionName: section.name,
                        description: item.description || 'No description available',
                        photoLink: item.photolink || 'https://via.placeholder.com/400x200',
                        tags: Array.isArray(item.tags) ? item.tags.filter(Boolean) : [],
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
                <View style={styles.headerNameContainer}>
                    <Text style={styles.headerText} numberOfLines={2} ellipsizeMode="tail">{restaurant?.name || 'Loading...'}</Text>
                </View>
                <View style={styles.headerActions}>
                    <TouchableOpacity
                        onPress={() => {
                            const allTags = Array.from(new Set(
                                sections.flatMap(section =>
                                    section.data.flatMap(item =>
                                        item.tags?.map(tag => tag.tagvalue) || []
                                    )
                                )
                            ));

                            router.push({
                                pathname: '/restaurant info/restaurant info',
                                params: {
                                    id: id,
                                    name: restaurant?.name,
                                    description: restaurant?.description || '',
                                    openingtime: restaurant?.openingtime || '',
                                    closingtime: restaurant?.closingtime || '',
                                    latitude: restaurant?.latitude?.toString() || '0',
                                    longitude: restaurant?.longitude?.toString() || '0',
                                    themeSecondaryColor: themeState.colors.secondary,
                                    tags: allTags.join(','),
                                },
                            });
                        }}
                        style={styles.iconContainer}
                    >
                        <InfoIcon />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            router.push({
                                pathname: '/cart/cart',
                                params: {
                                    tables: restaurant?.totaltables,
                                }
                            });
                        }}
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
                        renderItem={({ item }: { item: SectionType }) => (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>{item.title}</Text>
                                {item.data.map((menuItem: MenuItemType) => {
                                    const quantity = cart.find((c) => c.id === menuItem.id)?.quantity || 0;
                                    const itemTags = menuItem.tags?.map(t => t.tagvalue) || [];
                                    const isLowlighted = selectedTags.length > 0 && !itemTags.some(tag => selectedTags.includes(tag));

                                    return (
                                        <View
                                            key={menuItem.id}
                                            style={[
                                                styles.menuItem,
                                                isLowlighted && { opacity: 0.4 },
                                            ]}
                                        >
                                            <View style={{ flex: 1 }}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Image
                                                        source={{ uri: menuItem.photoLink || 'https://via.placeholder.com/400x200' }}
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
                                                                tags: itemTags.join(', '),
                                                            },
                                                        })
                                                    }
                                                >
                                                    <InfoIcon />
                                                </TouchableOpacity>

                                                {quantity > 0 ? (
                                                    <View style={styles.actionBox}>
                                                        <TouchableOpacity onPress={() => decreaseQuantity(menuItem.id)} style={styles.qtyButton}>
                                                            <Text style={styles.qtyButtonText}>-</Text>
                                                        </TouchableOpacity>
                                                        <Text style={styles.quantityText}>{quantity}</Text>
                                                        <TouchableOpacity onPress={() => increaseQuantity(menuItem.id)} style={styles.qtyButton}>
                                                            <Text style={styles.qtyButtonText}>+</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                ) : (
                                                    <TouchableOpacity onPress={() => addToCart(menuItem)} style={styles.addButton}>
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
        headerNameContainer: {
            maxWidth: 200,
            flexShrink: 1,
            flexGrow: 0,
            minWidth: 0,
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
