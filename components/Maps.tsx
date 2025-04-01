import React, {useState} from 'react';
import MapView from 'react-native-maps';
import {Dimensions, StyleSheet, View} from 'react-native';

export default function Maps() {
    const initialLocation = {
        latitude: 55.779655,
        longitude: 12.521401,
    }

    const [myLocation, setMyLocation] = useState(initialLocation);

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialCamera={{
                    center: {
                        latitude: myLocation.latitude,
                        longitude: myLocation.longitude,
                    },
                    pitch: 0,
                    heading: 0,
                    altitude: 500,
                    zoom: 14,
                }}
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
