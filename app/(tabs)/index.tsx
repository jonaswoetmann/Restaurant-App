import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, View, Text } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { CafeList } from '@/components/ui/CafeList';

export default function HomeScreen() {
    const [cafes, setCafes] = useState<{ id: string; name: string; route: string }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const scrollY = new Animated.Value(0);

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

    const imageHeight = scrollY.interpolate({
        inputRange: [0, 500],
        outputRange: [400, 100],
    })


    return (
        <View style={{ flex: 1 }}>
            <Animated.Image
                source={require('@/assets/images/partial-react-logo.png')}
                style={[styles.reactLogo, {height: imageHeight}]}
            />
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


const styles = StyleSheet.create({
    reactLogo: {
        width: '100%',
        resizeMode: 'contain',
    },
    scrollContainer: {
    },
});

