import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

const MapScreen = () => {
  const [userLocation, setUserLocation] = useState(null);
  const destination = {latitude: 1.41724688, longitude: 124.9826957};

  useEffect(() => {
    const fetchUserLocation = () => {
      Geolocation.getCurrentPosition(
        position => {
          const newUserLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setUserLocation(newUserLocation);
        },
        error => {
          console.error('Error getting user location:', error);
        },
      );
    };

    fetchUserLocation();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: userLocation?.latitude || 0,
          longitude: userLocation?.longitude || 0,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}>
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title="User Location"
            description="This is the user's location."
            pinColor="blue"
          />
        )}

        {destination && (
          <Marker
            coordinate={destination}
            title="Tujuan Rute"
            description="Deskripsi tujuan rute"
            pinColor="green"
          />
        )}
      </MapView>

      <Text style={styles.locationText}>
        User Location:{' '}
        {userLocation
          ? `${userLocation.latitude}, ${userLocation.longitude}`
          : 'Loading...'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  locationText: {
    textAlign: 'center',
    fontSize: 16,
  },
});

export default MapScreen;
