import 'dotenv/config';

export default {
    expo: {
        name: "MyNewProject",
        slug: "MyNewProject",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/images/icon.png",
        scheme: "myapp",
        userInterfaceStyle: "automatic",
        newArchEnabled: true,
        ios: {
            supportsTablet: true,
            bundleIdentifier: "com.JonasWoetmann.JamNawApp",
            infoPlist: {
                ITSAppUsesNonExemptEncryption: false
            }
        },
        android: {
            softwareKeyboardLayoutMode: "pan",
            adaptiveIcon: {
                foregroundImage: "./assets/images/adaptive-icon.png",
                backgroundColor: "#ffffff"
            },
            permissions: [
                "android.permission.CAMERA",
                "android.permission.INTERNET"
            ],
            package: "com.JonasWoetmann.JamNawApp",
            usesCleartextTraffic: true,
            config: {
                googleMaps: {
                    apiKey: process.env.GOOGLE_MAPS_API_KEY
                }
            }
        },
        web: {
            bundler: "metro",
            output: "static",
            favicon: "./assets/images/favicon.png"
        },
        plugins: [
            [
                "expo-build-properties",
                {
                    android: {
                        networkSecurityConfig: "./assets/xml/network_security_config.xml"
                    }
                }
            ],
            "expo-router",
            [
                "expo-splash-screen",
                {
                    image: "./assets/images/splash-icon.png",
                    imageWidth: 200,
                    resizeMode: "contain",
                    backgroundColor: "#ffffff"
                }
            ],
            "expo-barcode-scanner"
        ],
        experiments: {
            typedRoutes: true
        },
        extra: {
            router: {
                origin: false
            },
            eas: {
                projectId: "f71c616e-a0a0-4baf-be31-3985e60ce52d"
            }
        }
    }
};