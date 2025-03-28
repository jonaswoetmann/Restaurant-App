import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function AccountScreen() {
  return (
    <View>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Account</ThemedText>
      </ThemedView>
      <ThemedText>This will be stored preferences, settings and information</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    paddingTop: 60,
    paddingLeft: 20,
    flexDirection: 'row',
    gap: 8,
  },
});
