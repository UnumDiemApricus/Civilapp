import React, { useEffect, useState } from 'react';
import { View, Platform, Alert, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Location from 'expo-location';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setCurrentLocation, setSearchLocation } from '../store/slices/locationSlice';
import { GOOGLE_PLACES_API_KEY } from '@env';
import { styled } from 'nativewind';

const StyledView = styled(View);

const HomeScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { currentLocation, searchLocation } = useSelector((state: RootState) => state.location);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        if (Platform.OS === 'ios') {
          const backgroundStatus = await Location.requestBackgroundPermissionsAsync();
          if (backgroundStatus.status !== 'granted') {
            Alert.alert(
              'Limited Location Access',
              'Background location access not granted. Some features may be limited.',
              [{ text: 'OK' }]
            );
          }
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        dispatch(setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }));
      } catch (error) {
        setErrorMsg('Error getting location');
        console.error('Location error:', error);
      }
    })();
  }, [dispatch]);

  const initialRegion = currentLocation ? {
    latitude: currentLocation.latitude,
    longitude: currentLocation.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  } : {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <StyledView className="flex-1">
      <StyledView className="absolute top-0 left-0 right-0 z-10 m-2">
        <GooglePlacesAutocomplete
          placeholder="Search for a location"
          fetchDetails={true}
          onPress={(data, details = null) => {
            if (details) {
              dispatch(setSearchLocation({
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
                description: data.description
              }));
            }
          }}
          query={{
            key: GOOGLE_PLACES_API_KEY,
            language: 'en',
          }}
          styles={{
            container: {
              flex: 0,
              backgroundColor: 'white',
              borderRadius: 8,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            },
            textInput: {
              height: 45,
              borderRadius: 8,
              paddingVertical: 5,
              paddingHorizontal: 10,
              fontSize: 16,
              marginBottom: 5,
            },
          }}
        />
      </StyledView>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
      >
        {currentLocation && (
          <Marker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
            title="Current Location"
            pinColor="blue"
          />
        )}
        {searchLocation && (
          <Marker
            coordinate={{
              latitude: searchLocation.latitude,
              longitude: searchLocation.longitude,
            }}
            title={searchLocation.description || "Search Location"}
            pinColor="green"
          />
        )}
      </MapView>
    </StyledView>
  );
};

export default HomeScreen;
