import React, {useEffect, useRef, useState} from 'react';
import {Animated, View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { CafeList } from '@/components/ui/CafeList';
import Maps from '@/components/ui/Maps';
import { IconSymbol } from '@/components/ui/IconSymbol';
import Constants from "expo-constants";

export default function HomeScreen() {
    const [cafes, setCafes] = useState<{ id: string; name: string; route: string }[]>([]);
    const [filteredCafes, setFilteredCafes] = useState(cafes);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searching, setSearching] = useState(false);
    const scrollY = useRef(new Animated.Value(0)).current;
    const mapAnimatedHeight = useRef(new Animated.Value(350)).current;
    const mapHeightRef = useRef(350);
    const prevScrollY = useRef(0);
    const isCollapsed = useRef(false);

    useEffect(() => {
        const fetchCafes = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('http://130.225.170.52:10331/api/restaurants');
                const data = await response.json();

                const mappedCafes = data.map((restaurant: { id: number; name: string }) => ({
                    id: restaurant.id.toString(),
                    name: restaurant.name,
                    route: `/restaurant page/restaurant page?id=${restaurant.id}`,
                }));

                setCafes(mappedCafes);
                setFilteredCafes(mappedCafes);
            } catch (error) {
                console.error('Error fetching cafes:', error);
                setCafes([]);
                setFilteredCafes([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCafes();
    }, []);

    useEffect(() => {
        const lowercasedQuery = searchQuery.toLowerCase();
        const filtered = cafes.filter((cafe) =>
            cafe.name.toLowerCase().includes(lowercasedQuery)
        );
        if (JSON.stringify(filtered) !== JSON.stringify(filteredCafes)) {
            setFilteredCafes(filtered);
        }
        setSearching(lowercasedQuery.length > 0);
    }, [searchQuery, cafes]);

    const handleScroll = (event: any) => {
        const currentY = event.nativeEvent.contentOffset.y;
        const scrollingDown = currentY > prevScrollY.current;

        const collapseThreshold = 120;

        if (!isCollapsed.current && currentY <= collapseThreshold) {
            const newHeight = 350 - currentY;

            // Prevent jumpiness when scrolling back up after re-expanding map
            if (mapHeightRef.current === 350 && currentY < prevScrollY.current) {
                prevScrollY.current = currentY;
                return;
            }

            Animated.timing(mapAnimatedHeight, {
                toValue: newHeight,
                duration: 30,
                useNativeDriver: false,
            }).start();
            mapHeightRef.current = newHeight;

            event.target.scrollToOffset?.({ offset: 0, animated: false });
            prevScrollY.current = currentY;
            return;
        }

        if (scrollingDown && !isCollapsed.current && currentY > collapseThreshold) {
            isCollapsed.current = true;
            Animated.timing(mapAnimatedHeight, {
                toValue: 100,
                duration: 100,
                useNativeDriver: false,
            }).start();
            mapHeightRef.current = 100;
        }

        prevScrollY.current = currentY;
    };

    const handleMapPress = () => {
        if (isCollapsed.current) {
            isCollapsed.current = false;
            Animated.timing(mapAnimatedHeight, {
                toValue: 350,
                duration: 100,
                useNativeDriver: false,
            }).start();
            mapHeightRef.current = 350;
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ flex: 1 }}>
                    <View style={styles.searchContainer}>
                        <View style={styles.searchInputWrapper}>
                            <IconSymbol name="qrcode.viewfinder" color="black" size={20} />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search Here"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                placeholderTextColor="black"
                            />
                        </View>
                    </View>
                    {searching && (
                        <View style={styles.overlay}>
                            <CafeList cafes={filteredCafes} scrollY={scrollY} onScroll={handleScroll} />
                        </View>
                    )}

                    {!searching && (
                        <>
                            <TouchableWithoutFeedback onPress={handleMapPress}>
                                <Animated.View style={{ height: mapAnimatedHeight, overflow: 'hidden' }}>
                                    <Maps />
                                </Animated.View>
                            </TouchableWithoutFeedback>
                            <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                {isLoading ? (
                                    <Text>Loading...</Text>
                                ) : (
                                    <CafeList cafes={filteredCafes} scrollY={scrollY} onScroll={handleScroll} />
                                )}
                            </ThemedView>
                        </>
                    )}
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: 'White',
        zIndex: 1,
        paddingTop: Constants.statusBarHeight,
    },
    searchInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        height: 40,
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 10,
    },
    searchInput: {
        marginLeft: 8,
        flex: 1,
        height: '100%',
    },
    overlay: {
        position: 'absolute',
        top: 100,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 2,
        justifyContent: 'center',
        alignItems: 'center',
    }
});