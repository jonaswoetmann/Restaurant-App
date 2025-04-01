import React, {useEffect, useState, useRef} from 'react';
import MapView, {Marker} from 'react-native-maps';
import {Button, Dimensions, StyleSheet, View} from 'react-native';
import * as Location from 'expo-location';

export default function Maps() {
    const initialLocation = {
        latitude: 55.779655,
        longitude: 12.521401,
    }

    const [myLocation, setMyLocation] = useState(initialLocation);
    const [pin, setPin] = useState({})
    const mapRef = useRef<MapView>(null);
    const local = {
        latitude: "55.779655",
        longitude: "12.521401",
    }
    useEffect(() => {
        setPin(local)
        _getLocation();
    }, [])

    const _getLocation =async() => {
        try{
            let { status } = await Location.requestForegroundPermissionsAsync()

            if(status !== 'granted'){
              console.warn('Permission denied')
              return;
            }
            let location = await Location.getCurrentPositionAsync()
            setMyLocation(location.coords)
        }
        catch(err){
            console.    warn(err);
        }
    }

    const focusOnLocation = () => {
       if(myLocation.latitude && myLocation.longitude){
           const camera = {
               center: {
                   latitude: myLocation.latitude - 0.007,
                   longitude: myLocation.longitude,
               },
               pitch: 0,
               heading: 0,
               altitude: 500,
               zoom: 14,
           }
           if(mapRef.current){
               mapRef.current.animateCamera(camera, {duration: 1000});
           }
       }
    };

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
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

                { myLocation.latitude && myLocation.longitude &&
                <Marker
                    coordinate={{
                        latitude: myLocation.latitude,
                        longitude: myLocation.longitude
                    }}
                    title={'Your Location'}
                    />
                }

            </MapView>
            <View style={styles.locationContainer}>
                <Button title='Get Location' onPress={focusOnLocation}/>
            </View>
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
    locationContainer: {
        position: 'absolute',
        bottom: 20,
        width: '100%',
        alignItems: 'center',
    }
});
