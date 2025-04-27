import React, {useEffect, useState, useRef} from 'react';
import MapView, {Marker} from 'react-native-maps';
import {Button, StyleSheet, View} from 'react-native';
import * as Location from 'expo-location';

export default function Maps() {
    const initialLocation = {
        latitude: 55.779655,
        longitude: 12.521401,
    }

    const [myLocation, setMyLocation] = useState(initialLocation);
    const [restaurants, setRestaurants] = useState<{ id: string; name: string; latitude: number; longitude: number; }[]>([]);
    const mapRef = useRef<MapView>(null);

    useEffect(() => {
        _getLocation();
        _fetchRestaurants();
    }, []);

    const _fetchRestaurants = async () => {
        try {
            const response = await fetch('http://130.225.170.52:10331/api/restaurants');
            const data = await response.json();
            const mappedRestaurants = data.map((item: any) => ({
                id: item.id.toString(),
                name: item.name,
                latitude: parseFloat(item.latitude),
                longitude: parseFloat(item.longitude),
            }));
            setRestaurants(mappedRestaurants);
        } catch (error) {
            console.warn('Error fetching restaurants:', error);
        }
    };

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
                   latitude: myLocation.latitude,
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

                {restaurants.map((restaurant) => (
                    <Marker
                        key={restaurant.id}
                        coordinate={{
                            latitude: restaurant.latitude,
                            longitude: restaurant.longitude,
                        }}
                        title={restaurant.name}
                        onPress={() => {


                        }}
                    />
                ))}

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
        flex: 1,
    },
    locationContainer: {
        position: 'absolute',
        bottom: 20,
        width: '100%',
        alignItems: 'center',
    }
});
