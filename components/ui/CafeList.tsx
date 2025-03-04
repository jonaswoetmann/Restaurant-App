import React from 'react';
import { View, FlatList } from 'react-native';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'expo-router';

type Cafe = {
  id: string;
  name: string;
  route: string;
};

type CafeListProps = {
  cafes: Cafe[];
};

export const CafeList: React.FC<CafeListProps> = ({ cafes }) => {
  const router = useRouter();

  return (
    <View>
      <FlatList
        data={cafes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Button title={item.name} onPress={() => router.push(item.route)} />
        )}
      />
    </View>
  );
};

export default CafeList;
