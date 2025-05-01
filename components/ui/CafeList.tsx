import React from 'react';
import {View, Animated, StyleSheet} from 'react-native';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'expo-router';

type Cafe = {
  id: string;
  name: string;
  route: string;
  rating: number;
};

type CafeListProps = {
  cafes: Cafe[];
  scrollY?: Animated.Value;
  onScroll?: (event: any) => void;
};

export const CafeList: React.FC<CafeListProps> = ({ cafes, scrollY, onScroll }) => {
  const router = useRouter();

  return (
    <View style={styles.list}>
      <Animated.FlatList
        data={cafes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Button title={item.name} showRating={true} rating={item.rating} onPress={() => router.push(item.route as any)} />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        onScroll={
          scrollY
            ? Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: false, listener: onScroll }
              )
            : undefined
        }
        scrollEventThrottle={scrollY ? 1 : undefined}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 100,
  }
});

export default CafeList;
