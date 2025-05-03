import React, {useEffect, useState, useRef} from 'react';
import MapView, {Marker, Callout } from 'react-native-maps';
import { View, Text, Button, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { useMarker } from '@/app/contexts/MarkerContext';
import { useRouter } from 'expo-router';


export default function Maps() {
    const initialLocation = {
        latitude: 55.785821,
        longitude: 12.521153,
    }

    const [myLocation, setMyLocation] = useState(initialLocation);
    const [restaurants, setRestaurants] = useState<{ id: string; name: string; latitude: number; longitude: number; }[]>([]);
    const mapRef = useRef<MapView>(null);
    const { setSelectedMarkerId } = useMarker();
    const router = useRouter();

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
               altitude: 2000,
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
                    altitude: 3000,
                    zoom: 14,
                }}
                onPress={() => setSelectedMarkerId(null)}
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
                        onPress={() => setSelectedMarkerId(restaurant.id)}
                    >
                        <Callout onPress={() => router.push({
                            pathname: '/restaurant page/restaurant page',
                            params: { id: restaurant.id, name: restaurant.name },
                        })}>
                            <View>
                                <Text style={{ fontWeight: 'bold' }}>{restaurant.name}</Text>
                                <Text style={{ color: 'blue' }}>Tap to view details</Text>
                            </View>
                        </Callout>
                    </Marker>
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
