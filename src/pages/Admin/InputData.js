import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  Modal,
  Animated,
  Easing,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import MapView, {Marker} from 'react-native-maps';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Gap, Button} from '../../components';

const InputData = ({navigation, route}) => {
  const {jsonData} = route.params;
  const [keluarga, setKeluarga] = useState('');
  const [lokasi, setLokasi] = useState('');
  // Maps
  const [location, setLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [uploadedLocation, setUploadedLocation] = useState(null);
  const [isMapMaximized, setIsMapMaximized] = useState(false);
  const mapRef = useRef(null);

  // Error getar Animation
  const [errorName, setErrorName] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isVibrating, setIsVibrating] = useState(false);
  const translateXAnim = useRef(new Animated.Value(0)).current;
  const startVibration = () => {
    setIsVibrating(true);
    Animated.sequence([
      Animated.timing(translateXAnim, {
        toValue: 10,
        duration: 50,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(translateXAnim, {
        toValue: -10,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(translateXAnim, {
        toValue: 0,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsVibrating(false);
    });
  };

  // Maps
  // Lokasi Saya
  Geolocation.getCurrentPosition(
    position => {
      setLocation(position.coords);
      // setSelectedLocation(position.coords);
    },
    error => {
      console.error(error);
    },
    {enableHighAccuracy: true, timeout: 60000, maximumAge: 10000}, // Set timeout to 30 seconds
  );

  // Pergi ke Lokasi Saya
  const handleMapPress = event => {
    const {latitude, longitude} = event.nativeEvent.coordinate;
    setSelectedLocation({latitude, longitude});
    setUploadedLocation(null);
  };

  // Upload Lokasi
  const uploadLocation = () => {
    if (selectedLocation) {
      setUploadedLocation(selectedLocation);
      console.log('Uploaded Location:', selectedLocation);
    }
  };

  // Reset Lokasi ke Lokasi Saya
  const resetLocation = () => {
    setSelectedLocation(location);
    setUploadedLocation(null);
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  };

  // Perbesar dan Perkecil Maps
  const toggleMapSize = () => {
    setIsMapMaximized(!isMapMaximized);
  };

  // Pergi ke Halaman HomeAdmin
  const HomeAdmin = () => {
    navigation.navigate('HomeAdmin', {jsonData: jsonData});
  };
  const test = () => {
    console.log('testing');
    // console.log(uploadedLocation.latitude.toString());
    if (!uploadedLocation) {
      Alert.alert(
        'Lokasi Belum Dipilih',
        'Silakan pilih dan unggah lokasi Anda pada peta.',
      );
      return;
    }
  };
  const handleCreateAccount = () => {
    // check if input fields are not empty or only spaces
    if (!keluarga.trim() || !lokasi.trim()) {
      startVibration(true);
      setIsError(true);
      setErrorName('Input Data Tidak Boleh Kosong !');
      return;
    }
    if (!uploadedLocation) {
      startVibration(true);
      setIsError(true);
      setErrorName('Ambil Lokasi lebih dulu.');
      return;
    }
    // create request body with email and password input values
    const requestBody = {
      'input-keluarga': keluarga,
      'input-latitude': uploadedLocation.latitude.toString(),
      'input-longitude': uploadedLocation.longitude.toString(),
      'input-keterangan_lokasi': lokasi,
    };

    // Time out request data
    const timeoutPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('Request timed out.'));
      }, 5000); // 5000 (5 detik)
    });

    Promise.race([
      fetch('https://fdonasi.site/foodDonation/public/mobile/addTarget', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: Object.keys(requestBody)
          .map(
            key =>
              `${encodeURIComponent(key)}=${encodeURIComponent(
                requestBody[key],
              )}`,
          )
          .join('&'),
      }),
      timeoutPromise,
    ])
      .then(response => response.text())
      .then(textData => {
        // handle response data
        console.log(textData);

        // check if textData contains "ERROR"
        if (textData.includes('ERROR')) {
          // handle error case
          //console.error("Login failed:", textData);
          Alert.alert(
            'Error Message',
            'Sorry, create new account failed. Please try again.',
          );
          return;
        }

        // check if textData contains "INCORRECT"
        if (textData.includes('DUPLICATE')) {
          // handle INCORRECT case
          Alert.alert(
            'Error Message',
            'Sorry, duplicate email/nim/reg.number were found in database. Please contact the administrator.',
          );
          return;
        }

        if (textData.includes('SUCCESS')) {
          // message
          Alert.alert('Output', 'Warga Kurang Mampu berhasil ditambahkan.');
          // console.log('testing');

          // Set empty field
          setKeluarga('');
          setLokasi('');
          setUploadedLocation('');
          navigation.navigate('HomeAdmin', {
            jsonData: jsonData,
          });
        }
      })
      .catch(error => {
        //console.error(error);
        Alert.alert('Error Message', error.message);
        return;
      });
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={HomeAdmin}
          style={{flexDirection: 'row', paddingLeft: 20}}>
          <MaterialCommunityIcons
            name="keyboard-backspace"
            size={26}
            color="white"
          />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 21,
            textAlign: 'left',
            flex: 1,
            fontWeight: 'bold',
            paddingLeft: 30,
            color: 'white',
          }}>
          Input Data
        </Text>
      </View>
      {isMapMaximized ? null : (
        <View>
          {/* Logo */}
          <MaterialCommunityIcons
            name="playlist-plus"
            color="#F1C376"
            size={120}
            style={{alignSelf: 'center', paddingTop: 20}}
          />

          {/* Error */}
          {isError ? (
            <View>
              <View style={[styles.info]}>
                <MaterialIcons name="error" color="red" size={20} />
                <View style={{flexDirection: 'column'}}>
                  <Animated.Text
                    style={[
                      styles.error,
                      isVibrating && {
                        transform: [{translateX: translateXAnim}],
                      },
                    ]}>
                    {errorName}
                  </Animated.Text>
                </View>
              </View>
            </View>
          ) : null}

          {/* Input Data */}
          {/* <View style={styles.inputContainer}> */}
          <View style={styles.inputRow}>
            {/* Input Data - Keluarga */}
            <Text style={styles.textInput}>Keluarga</Text>
            <MaterialIcons
              name="family-restroom"
              color="#F7E6C4"
              size={20}
              style={styles.icon}
            />
            <TextInput
              placeholder="Masukkan Nama Keluarga"
              placeholderTextColor={'grey'}
              style={styles.input}
              onChangeText={setKeluarga}
              value={keluarga}
              caretColor="red"
            />
          </View>
          {/* Input Data - Detail Lokasi */}
          <Gap height={20} />
          <View style={styles.inputRow}>
            <Text style={styles.textInput}>Keterangan Lokasi</Text>
            <MaterialIcons
              name="my-location"
              color="#F7E6C4"
              size={20}
              style={styles.icon}
            />
            <TextInput
              placeholder="Masukkan Deskripsi Lokasi"
              placeholderTextColor={'grey'}
              style={styles.input}
              onChangeText={setLokasi}
              value={lokasi}
            />
          </View>
        </View>
      )}

      {/* Maps - */}
      {/* Map - Text Info Koordinat */}
      <View style={isMapMaximized ? styles.mapbesar : {paddingHorizontal: 10}}>
        <Text style={styles.ttlekortext}>Koordinat Saya Sekarang :</Text>
        {location ? (
          <Text style={styles.koortext}>
            {location.latitude}, {location.longitude}
          </Text>
        ) : (
          <Text style={styles.textkoor}>belum terdeteksi</Text>
        )}
        <Text style={styles.ttlekortext}>Cek Koordinat :</Text>
        {selectedLocation ? (
          <Text style={styles.koortext}>
            {selectedLocation.latitude}, {selectedLocation.longitude}
          </Text>
        ) : (
          <Text style={styles.textkoor}>belum menyeleksi koordinat</Text>
        )}

        <Text style={styles.ttlekortext}>Ambil Koordinat :</Text>
        {uploadedLocation ? (
          <Text style={styles.koortext}>
            {uploadedLocation.latitude},{uploadedLocation.longitude}
          </Text>
        ) : (
          <Text style={styles.textkoor}>
            'Anda belum mengambil Koordinat ! '
          </Text>
        )}
      </View>
      {/* Gabungan Maps dan Button menjadi Row */}
      <View
        style={[
          {flexDirection: isMapMaximized ? 'coumn' : 'row'},
          {flex: isMapMaximized ? 1 : 0},
        ]}>
        {/* Maps - Tampilan Maps */}
        <MapView
          ref={mapRef}
          style={[
            styles.map,
            isMapMaximized ? styles.maximizedMap : styles.minimizedMap,
          ]}
          initialRegion={
            location
              ? {
                  latitude: location.latitude,
                  longitude: location.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }
              : null
          }
          onPress={handleMapPress}>
          {selectedLocation && (
            <Marker
              coordinate={{
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
              }}
              title="Selected Location"
            />
          )}
          {uploadedLocation && (
            <Marker
              coordinate={{
                latitude: uploadedLocation.latitude,
                longitude: uploadedLocation.longitude,
              }}
              title="Uploaded Location"
              pinColor="blue"
            />
          )}
        </MapView>
        {/* Maps - Button */}
        <View
          style={[
            styles.mapButtonsContainer,
            {
              flexDirection: isMapMaximized ? 'row' : 'column',
              marginBottom: isMapMaximized ? 15 : 0,
            },
          ]}>
          <TouchableOpacity
            style={[styles.mapButton, {marginLeft: 4}]}
            onPress={toggleMapSize}>
            <Text style={{color: 'white', textAlign: 'justify'}}>
              {isMapMaximized ? 'Perkecil Map' : 'Perbesar Map'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.mapButton,
              {backgroundColor: '#279EFF', marginLeft: 4},
            ]}
            onPress={uploadLocation}
            disabled={!selectedLocation}>
            <Text style={{color: 'white', textAlign: 'justify'}}>
              Ambil Lokasi
            </Text>
          </TouchableOpacity>
          {location ? (
            <View>
              <TouchableOpacity
                onPress={resetLocation}
                style={[styles.mapButton, {backgroundColor: 'red'}]}>
                <Text style={{color: 'white'}}>Lokasi Saya</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </View>
      {isMapMaximized ? null : (
        <View>
          <Gap height={20} />
          <Button
            title="Input"
            color="#606C5D"
            textColor="white"
            onPress={handleCreateAccount}
          />
        </View>
      )}

      {/* </View> */}
    </View>
  );
};

export default InputData;

const styles = StyleSheet.create({
  // Header
  header: {
    flexDirection: 'row',
    backgroundColor: 'red',
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: 'rgba(78, 78, 78, 0.9)',
  },

  // Error Statement
  info: {
    padding: 5,
    backgroundColor: 'white',
    // borderWidth: 1,
    // borderColor: 'red',
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
  },
  error: {
    marginLeft: 5,
    color: 'red',
    margin: 1,
    textAlign: 'center',
  },

  // Input
  // inputContainer: {
  //   height: 550,
  //   width: 360,
  //   marginTop: 20,
  //   paddingHorizontal: 10,
  //   justifyContent: 'center',
  //   alignSelf: 'center',
  //   top: -15,
  //   marginTop: 60,
  //   backgroundColor: '#606C5D',
  //   borderRadius: 20,
  //   shadowColor: 'white',
  //   shadowOffset: {
  //     width: 0,
  //     height: 2,
  //   },
  // },
  textInput: {
    color: '#606C5D',
    marginLeft: 5,
    fontSize: 20,
    padding: 0,
    fontWeight: 'bold',
    top: 5,
    paddingHorizontal: 15,
  },

  input: {
    color: 'black',
    fontSize: 20,
    height: 30,
    margin: 0,
    borderWidth: 1,
    padding: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    top: -15,
    paddingHorizontal: 15,
    borderColor: '#606C5D',
    marginLeft: 20,
    marginRight: 40,
  },
  icon: {
    textAlign: 'right',
    marginRight: 40,
    color: '#606C5D',
  },

  // Maps
  map: {
    flex: 1,
    // backgroundColor: 'black',
  },
  maximizedMap: {
    height: 700, // Adjust as needed
    marginTop: 10,
    marginBottom: 0,
  },
  minimizedMap: {
    weight: 100,
    paddingHorizontal: 50,
    marginVertical: 0,
    marginTop: 15,
    marginLeft: 15,
  },
  mapButtonsContainer: {
    marginTop: 15,
    marginLeft: 0,
  },

  mapButton: {
    backgroundColor: '#33BBC5',
    padding: 10,
    borderRadius: 5,
    marginLeft: 0,
    marginRight: 30,
    marginTop: 2,
    // marginTop:15
  },

  mapbesar: {
    position: 'absolute',
    top: 20,
    left: 10,
    backgroundColor: 'white',
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    zIndex: 2,
    marginTop: 40,
  },

  textkoor: {color: 'red', marginLeft: 15, marginBottom: 10, marginTop: 3},
  koortext: {
    color: 'blue',
    marginLeft: 15,
    marginBottom: 10,
    marginTop: 3,
  },
  ttlekortext: {
    color: 'black',
    fontSize: 17,
    marginLeft: 15,
  },
});
