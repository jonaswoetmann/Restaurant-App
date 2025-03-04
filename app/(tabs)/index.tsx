import { Image, StyleSheet, View } from 'react-native';

{/*import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';*/}
import { ThemedView } from '@/components/ThemedView';
import { useRouter} from 'expo-router';
{/*import { CafeButton } from '@/components/ui/CafeButton';*/}
import { CafeList } from '@/components/ui/CafeList';

export default function HomeScreen() {
  const router = useRouter();

  const cafes = [
    { id: '1', name: 'Cafe Vivaldi', route: '/restaurant page/restaurant page' },
    { id: '2', name: 'Cafe Europa', route: '/restaurant page/europa' },
    { id: '3', name: 'Cafe Noir', route: '/restaurant page/noir' },
  ];

  {/*return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      
       <CafeButton onPress={() => router.push('/restaurant page/restaurant page')} />
      
      <CafeList cafes={cafes} />

    </ThemedView>
    </ParallaxScrollView>
  );*/}

  return (
    <View style={{ flex: 1 }}>
      <Image
        source={require('@/assets/images/partial-react-logo.png')}
        style={styles.reactLogo}
      />
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <CafeList cafes={cafes} />
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  reactLogo: {
    height: 178,
    width: 290,
    alignSelf: 'center',
    marginBottom: 20,
  },
});

{/*const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});*/}
