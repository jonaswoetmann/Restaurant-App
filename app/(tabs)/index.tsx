import React, {useEffect, useRef, useState} from 'react';
import {Animated, View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, PanResponder, Pressable} from 'react-native';
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
    const mapAnimatedHeight = useRef(new Animated.Value(350)).current;
    const mapHeightRef = useRef(350);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gestureState) => {
                let newHeight = mapHeightRef.current + gestureState.dy;
                if (newHeight > 550) newHeight = 550;
                if (newHeight < 20) newHeight = 20;
                mapAnimatedHeight.setValue(newHeight);
            },
            onPanResponderRelease: (_, gestureState) => {
                if (Math.abs(gestureState.dy) < 5) {
                    handleBarPress();
                    return;
                }
                let newHeight = mapHeightRef.current + gestureState.dy;
                if (newHeight > 550) newHeight = 550;
                if (newHeight < 20) newHeight = 20;

                let snapPoint = 20;
                if (newHeight > 150 && newHeight < 400) {
                    snapPoint = 300;
                } else if (newHeight > 400) {
                    snapPoint = 550;
                }

                Animated.timing(mapAnimatedHeight, {
                    toValue: snapPoint,
                    duration: 150,
                    useNativeDriver: false,
                }).start();
                mapHeightRef.current = snapPoint;
            }
        })
    ).current;

    const handleBarPress = () => {
        let nextSnapPoint = 20;
        if (mapHeightRef.current === 20) {
            nextSnapPoint = 300;
        } else if (mapHeightRef.current === 300) {
            nextSnapPoint = 20;
        } else {
            nextSnapPoint = 300;
        }

        Animated.timing(mapAnimatedHeight, {
            toValue: nextSnapPoint,
            duration: 200,
            useNativeDriver: false,
        }).start();
        mapHeightRef.current = nextSnapPoint;
    };

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
                            <IconSymbol name="magnifyingglass" color="black" size={20} />
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
                            <CafeList cafes={filteredCafes} />
                        </View>
                    )}

                    {!searching && (
                        <>
                            <Animated.View
                                style={[{ height: mapAnimatedHeight, overflow: 'hidden' }]}
                            >
                                <Maps />
                            </Animated.View>
                            <Pressable onPress={handleBarPress}>
                                <View
                                {...panResponder.panHandlers}
                                    style={{
                                        height: 30,
                                        backgroundColor: '#ccc',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        position: 'relative',
                                    }}
                                >
                                    <View style={{ width: 40, height: 5, borderRadius: 3, backgroundColor: '#bbb' }} />
                                </View>
                            </Pressable>
                            <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop:-5, borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
                                {isLoading ? (
                                    <Text>Loading...</Text>
                                ) : (
                                    <CafeList cafes={filteredCafes} />
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
        zIndex: 2,
        backgroundColor: 'white',
    },
});