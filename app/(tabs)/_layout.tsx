import {Tabs, useRouter} from 'expo-router';
import React from 'react';
import { Platform, TouchableOpacity, View, StyleSheet } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  return (
      <>
          <Tabs
          screenOptions={{
              tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
              headerShown: false,
              tabBarButton: HapticTab,
              tabBarBackground: TabBarBackground,
              tabBarStyle: Platform.select({
                  ios: {
                      // Use a transparent background on iOS to show the blur effect
                      position: 'absolute',
                  },
                  default: {},
              }),
          }}>
          <Tabs.Screen
              name="index"
              options={{
                  title: 'Home',
                  tabBarIcon: ({color}) => <IconSymbol size={28} name="house.fill" color={color}/>,
              }}/>
          <Tabs.Screen
              name="account"
              options={{
                  title: 'Account',
                  tabBarIcon: ({color}) => <IconSymbol size={28} name="person.crop.circle.fill" color={color}/>,
              }}/>
      </Tabs>
          <QRButton onPress={() => router.push('/qrmodal/qrscanner')}/>
      </>
  );
}
const QRButton: React.FC<{ onPress: () => void }> = ({ onPress }) => {

    return (
        <TouchableOpacity style={styles.qrButton} onPress={onPress}>
            <View style={styles.innerCircle}>
                <IconSymbol size={32} name="qrcode.viewfinder" color="white" />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    qrButton: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        backgroundColor: 'transparent',
    },
    innerCircle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#151718',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
});
