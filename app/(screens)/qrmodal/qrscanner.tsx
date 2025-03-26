import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function QRScannerModal() {
    const router = useRouter();

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>QR Scanner</Text>
            <Button title="close" onPress={() => router.back()} />
        </View>
    )
}