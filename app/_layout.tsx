import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { CartProvider } from './(screens)/cart/CartContext';
import { MarkerProvider } from '@/components/MarkerContext';
import { FavoriteProvider } from './FavoriteContext';
import { PreferenceProvider } from './TagPreferenceContext';
import { StripeProvider } from '@stripe/stripe-react-native';

// Prevent splash screen auto-hide until fonts are loaded
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) return null;

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <CartProvider>
                <MarkerProvider>
                    <FavoriteProvider>
                        <PreferenceProvider>
                            <StripeProvider
                                publishableKey="pk_test_51RJwQGQPyhk2Fd4q93dVaaetDTfMZjCDsfLWGnkfvGBe3hvbOxizY91eja3fnkvj1pwXYOzwQoj5bzHfJQCcCqeu00kMCTl1JA"
                            >
                                <Stack screenOptions={{ headerTitle: '' }}>
                                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                                    <Stack.Screen name="+not-found" />
                                </Stack>
                                <StatusBar style="auto" />
                            </StripeProvider>
                        </PreferenceProvider>
                    </FavoriteProvider>
                </MarkerProvider>
            </CartProvider>
        </ThemeProvider>
    );
}


//'./FavoriteContext';
