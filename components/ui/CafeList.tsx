import React from 'react';
import { View, Animated } from 'react-native';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'expo-router';

type Cafe = {
  id: string;
  name: string;
  route: string;
};

type CafeListProps = {
  cafes: Cafe[];
  scrollY: Animated.Value;
};

export const CafeList: React.FC<CafeListProps> = ({ cafes, scrollY }) => {
  const router = useRouter();

  return (
    <View style={{flex: 1}}>
      <Animated.FlatList
        data={cafes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Button title={item.name} onPress={() => router.push(item.route)} />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
        )}
        scrollEventThrottle={1}
      />
    </View>
  );
};

export default CafeList;
