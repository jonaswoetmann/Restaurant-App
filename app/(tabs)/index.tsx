import { Image, StyleSheet, View } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { useRouter} from 'expo-router';
import { CafeList } from '@/components/ui/CafeList';

export default function HomeScreen() {
  const router = useRouter();

  const cafes = [
    { id: '1', name: 'Cafe Vivaldi', route: '/restaurant page/restaurant page' },
    { id: '2', name: 'Cafe Europa', route: '/restaurant page/restaurant page' },
    { id: '3', name: 'Cafe Noir', route: '/restaurant page/noir' },
  ];

 

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


