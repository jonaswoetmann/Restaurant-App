import React, { useEffect, useState } from 'react';
import { Animated, View, Text } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { CafeList } from '@/components/ui/CafeList';
import Maps from '@/components/ui/Maps';

export default function HomeScreen() {
    const [cafes, setCafes] = useState<{ id: string; name: string; route: string }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const scrollY = useState(new Animated.Value(0))[0];
    const mapAnimatedHeight = useState(new Animated.Value(400))[0];

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
            } catch (error) {
                console.error('Error fetching cafes:', error);
                setCafes([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCafes();
    }, []);

    useEffect(() => {
        const listenerId = scrollY.addListener(({ value }) => {
            if (value < 250) {
                Animated.timing(mapAnimatedHeight, {
                    toValue: 400,
                    duration: 300,
                    useNativeDriver: false,
                }).start();
            } else {
                Animated.timing(mapAnimatedHeight, {
                    toValue: 100,
                    duration: 300,
                    useNativeDriver: false,
                }).start();
            }
        });

        return () => {
            scrollY.removeListener(listenerId);
        };
    }, [scrollY]);

    return (
        <View style={{ flex: 1 }}>
            <Animated.View style={{ height: mapAnimatedHeight, overflow: 'hidden' }}>
                <Maps/>
            </Animated.View>
            <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                {isLoading ? (
                    <Text>Loading...</Text>
                    ) : (
                    <CafeList cafes={cafes} scrollY={scrollY} />
                )}
            </ThemedView>
        </View>
    );
}