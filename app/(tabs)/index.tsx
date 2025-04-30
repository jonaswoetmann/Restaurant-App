import React, {useEffect, useRef, useState} from 'react';
import {Animated, View, Text, TextInput, StyleSheet, TouchableWithoutFeedback, Keyboard, PanResponder, Pressable, Dimensions} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { CafeList } from '@/components/ui/CafeList';
import Maps from '@/components/ui/Maps';
import { IconSymbol } from '@/components/ui/IconSymbol';
import Constants from "expo-constants";
import { useMarker } from '@/components/MarkerContext';

export default function HomeScreen() {
    const [cafes, setCafes] = useState<{ id: string; name: string; route: string }[]>([]);
    const [filteredCafes, setFilteredCafes] = useState(cafes);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searching, setSearching] = useState(false);
    const mapAnimatedHeight = useRef(new Animated.Value(300)).current;
    const mapHeightRef = useRef(300);
    const ScreenHeight = Dimensions.get('window').height;
    const HighSnap = ScreenHeight * 0.02;
    const MidSnap = ScreenHeight * 0.4;
    const LowSnap = ScreenHeight * 0.75;

    const { selectedMarkerId } = useMarker();

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gestureState) => {
                let newHeight = mapHeightRef.current + gestureState.dy;
                if (newHeight > LowSnap) newHeight = LowSnap;
                if (newHeight < HighSnap) newHeight = HighSnap;
                mapAnimatedHeight.setValue(newHeight);
            },
            onPanResponderRelease: (_, gestureState) => {
                const { dy, vy } = gestureState;
                let newHeight = mapHeightRef.current + dy;

                if (newHeight > LowSnap) newHeight = LowSnap;
                if (newHeight < HighSnap) newHeight = HighSnap;

                const SNAP_POINTS = [HighSnap, MidSnap, LowSnap];

                let targetSnapIndex = 0;
                let minDistance = Infinity;
                SNAP_POINTS.forEach((point, index) => {
                    const distance = Math.abs(newHeight - point);
                    if (distance < minDistance) {
                        minDistance = distance;
                        targetSnapIndex = index;
                    }
                });

                const VELOCITY_THRESHOLD = 0.3;

                if (Math.abs(vy) >= VELOCITY_THRESHOLD) {
                    if (vy < 0 && targetSnapIndex > 0) {
                        targetSnapIndex--;
                    } else if (vy > 0 && targetSnapIndex < SNAP_POINTS.length - 1) {
                        targetSnapIndex++;
                    }
                }

                const snapPoint = SNAP_POINTS[targetSnapIndex];

                Animated.timing(mapAnimatedHeight, {
                    toValue: snapPoint,
                    duration: 200,
                    useNativeDriver: false,
                }).start();

                mapHeightRef.current = snapPoint;
            }
        })
    ).current;

    const handleBarPress = () => {
        let nextSnapPoint;
        if (mapHeightRef.current === HighSnap) {
            nextSnapPoint = MidSnap;
        } else if (mapHeightRef.current === MidSnap) {
            nextSnapPoint = HighSnap;
        } else {
            nextSnapPoint = MidSnap;
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

useEffect(() => {
  if (selectedMarkerId) {
    const selectedCafe = cafes.find(cafe => cafe.id === selectedMarkerId);
    if (selectedCafe) {
      setFilteredCafes([selectedCafe]);
    }
  } else {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = cafes.filter((cafe) =>
      cafe.name.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredCafes(filtered);
  }
}, [selectedMarkerId, cafes, searchQuery]);

    return (
        <View
            style={{ flex: 1 }}
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
                            <ThemedView colorName = 'page' style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop:-5,
                                borderTopLeftRadius: 8,
                                borderTopRightRadius: 8
                            }}>
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
        </View>
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
        top: Dimensions.get('window').height * 0.12,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2,
        backgroundColor: 'white',
        alignItems: 'center',
    },
});