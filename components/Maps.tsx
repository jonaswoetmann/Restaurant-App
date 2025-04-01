import React, {useState} from 'react';
import MapView from 'react-native-maps';
import {Dimensions, StyleSheet, View} from 'react-native';

export default function Maps() {
    const initialLocation = {
        latitude: 55.8,
        longitude: 8.0,
    }

    const [myLocation, setMyLocation] = useState(initialLocation);

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={
                    {
                        latitude: myLocation.latitude,
                        longitude: myLocation.longitude,
                        latitudeDelta: 0.1,
                        longitudeDelta: 0.1,
                    }
                }
                provider='google'
            >

            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});
