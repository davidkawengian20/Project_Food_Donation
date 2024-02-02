import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
  Button,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
// Maps
import MapView, {Marker} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Geolocation from '@react-native-community/geolocation';
import index from '../../routers';

function Koordinat({route, navigation}) {
  const [jsonData, setJsonData] = useState(null);
  const [json_data_kwkm, setJsonDataKwkm] = useState(null);
  // Maps
  const origin = {latitude: 1.41778779, longitude: 124.98404807};
  const destination = {latitude: 1.41724688, longitude: 124.9826957};
  const [showRoute, setShowRoute] = useState(false);
  const [location, setLocation] = useState(null);
  const mapRef = useRef(null);
  const [idFamilyLatitude, setIdFamilyLatitude] = useState('');
  const [idFamilyLongitude, setIdFamilyLongitude] = useState('');
  const [lokasiKeluarga, setLokasiKeluarga] = useState(null);
  const [ruteKeluarga, setRuteKeluarga] = useState(false);
  const [idFamilyName, setIdFamilyName] = useState('');

  Geolocation.getCurrentPosition(
    position => {
      setLocation(position.coords);
      // setSelectedLocation(position.coords);
    },
    error => {
      console.error(error);
    },
    {enableHighAccuracy: true, timeout: 60000, maximumAge: 15000}, // Set timeout to 30 seconds
  );
  const myLocation = location
    ? {latitude: location.latitude, longitude: location.longitude}
    : null;

  const handleStartPress = () => {
    setShowRoute(true);

    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: 1.416866592781566,
        longitude: 124.98432844877243,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  };
  const closehandleStarPress = () => {
    setShowRoute(false);
  };
  const closeRute = () => {
    setLokasiKeluarga(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      const {jsonData} = route.params;
      setJsonData(jsonData);

      const requestBody = {
        'user-role': jsonData[0].Role,
      };

      try {
        const response = await fetch(
          'https://fdonasi.site/foodDonation/public/mobile/listTargetDonationAdmin',
          {
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
          },
        );

        const textData = await response.text();
        console.log('OUTPUT BACKEND DAFTAR TARGET DONASI:');
        console.log(textData);

        if (textData.includes('ERROR')) {
          Alert.alert(
            'Error Message',
            'Sorry, access data class failed. Please try again.',
          );
          return;
        } else if (textData.includes('EMPTY ROW')) {
          Alert.alert(
            'Empty Record',
            'Sorry, there is no class you have registered.',
          );
          return;
        } else {
          const dataArray = textData.split('SUCCESS');
          const Koordinat = dataArray[1];
          console.log('DATA DONASI:');
          console.log(Koordinat);

          const parsedData = JSON.parse(Koordinat);
          setJsonDataKwkm(parsedData);
        }
      } catch (error) {
        Alert.alert(
          'Error Message',
          'Sorry, we have got an error. Please try again.',
        );
      }
    };

    fetchData();
  }, [route.params]);
  const handleRute = async itemId => {
    const selectedItem = json_data_kwkm.find(
      item => item.Location_Info === itemId,
      item => item.Family_Latitude === itemId,
      item => item.Family_Longitude === itemId,
    );
    setIdFamilyLatitude(selectedItem.Family_Latitude);
    setIdFamilyLongitude(selectedItem.Family_Longitude);
    setLokasiKeluarga({
      latitude: parseFloat(selectedItem.Family_Latitude),
      longitude: parseFloat(selectedItem.Family_Longitude),
    });
    setIdFamilyName(selectedItem.Family_Name);
    console.log('Data : ');
    console.log(`Location ${selectedItem.Location_Info}`);
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity
          style={{paddingLeft: 20}}
          onPress={() =>
            navigation.navigate('HomeAdmin', {
              jsonData: jsonData,
            })
          }>
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
          Koordinat
        </Text>
      </View>
    );
  };

  const renderContent = () => {
    if (!json_data_kwkm) {
      return (
        <View style={styles.content}>
          <Text>Data Warga Kurang Mampu tidak tersedia</Text>
        </View>
      );
    }

    return (
      <View style={styles.content} backgroundColor="#fff">
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={
            location
              ? {
                  latitude: location.latitude,
                  longitude: location.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }
              : null
          }>
          {location ? (
            <Marker
              pinColor="blue"
              coordinate={myLocation}
              title="Lokasi : Lokasi Saya">
              <MaterialIcons
                name="location-history"
                color="#0000FF"
                size={50}
              />
            </Marker>
          ) : null}

          {lokasiKeluarga && (
            <>
              <Marker
                coordinate={{
                  latitude: parseFloat(idFamilyLatitude),
                  longitude: parseFloat(idFamilyLongitude),
                }}
                title={idFamilyName}>
                <MaterialIcons name="family-restroom" color="red" size={20} />
              </Marker>
              <MapViewDirections
                origin={myLocation}
                destination={lokasiKeluarga}
                apikey={'AIzaSyD9Jt-zZZf8k7dGDCj017iOo3QLiPvsaNs'}
                strokeWidth={5}
                strokeColor="blue"
                onReady={result => {
                  console.log(`Distance: ${result.distance} km`);
                  console.log(`Duration: ${result.duration} min.`);
                }}
              />
            </>
          )}

          {/* <Marker coordinate={origin} title="San Francisco" />
          <Marker coordinate={destination} title="Los Angeles" /> */}

          {showRoute && (
            <>
              {json_data_kwkm &&
                json_data_kwkm.map((item, index) => (
                  <React.Fragment key={index}>
                    <Marker
                      pinColor="green"
                      coordinate={{
                        latitude: parseFloat(item.Family_Latitude),
                        longitude: parseFloat(item.Family_Longitude),
                      }}
                      title={`Lokasi: ${item.Family_Name}`}>
                      <MaterialIcons
                        name="family-restroom"
                        color="red"
                        size={20}
                      />
                    </Marker>
                  </React.Fragment>
                ))}
              {/* <MapViewDirections
                origin={myLocation}
                destination={destination}
                apikey={'AIzaSyD9Jt-zZZf8k7dGDCj017iOo3QLiPvsaNs'}
                strokeWidth={5}
                strokeColor="blue"
              /> */}
            </>
          )}
        </MapView>
        <View style={{flexDirection: 'row', marginVertical: 5}}>
          <Button
            color={'blue'}
            title="Keluarga Terdaftar"
            onPress={handleStartPress}
          />
          {showRoute && (
            <Button
              color={'red'}
              title="Berhenti"
              onPress={closehandleStarPress}
            />
          )}
          {lokasiKeluarga && (
            <Button color={'red'} title="Stop Rute" onPress={closeRute} />
          )}
        </View>

        <ScrollView>
          {json_data_kwkm.map((item, index) => (
            <TouchableOpacity key={index} style={styles.itemContainer}>
              <View style={styles.itemDetails}>
                <View style={styles.headerCard}>
                  <Text style={styles.itemName}>{item.Family_Name}</Text>
                  <TouchableOpacity style={styles.IconViewClass}>
                    <Entypo name="location" size={24} color="black" />
                  </TouchableOpacity>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableCellLeft}>Titik Lokasi : </Text>
                  <Text style={styles.tableCellRight}>
                    {item.Family_Latitude + ',' + item.Family_Longitude}
                  </Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableCellLeft}>Keterangan Lokasi</Text>
                  <Text style={styles.tableCellRight}>
                    {item.Location_Info}
                  </Text>
                </View>
                <View
                  style={styles.headerCard1}
                  backgroundColor=""
                  textAlign="center"
                  paddingTop={20}>
                  <TouchableOpacity
                    onPress={() => handleRute(item.Location_Info)}>
                    <Text style={styles.itemName}>Cek Rute Keluarga</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderFooter = () => {
    return (
      <View style={styles.footer}>
        <Text style={styles.footerText}>2023 © Food Donation</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderContent()}
      {renderFooter()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  header: {
    flexDirection: 'row',
    backgroundColor: 'red',
    paddingTop: 5,
    paddingBottom: 5,
  },
  map: {
    height: 300,
    // weight: 400,
  },
  content: {
    flex: 1,
    paddingTop: 15,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 1,
  },
  tableCellLeft: {
    color: 'white',
    flex: 1,
    textAlign: 'left',
    fontSize: 12,
    marginTop: 5,
  },
  tableCellRight: {
    color: 'white',
    flex: 1,
    textAlign: 'right',
    fontSize: 11,
    marginTop: 5,
  },
  itemContainer: {
    flexDirection: 'row',
    paddingBottom: 10,
    paddingTop: 15,
    paddingRight: 15,
    paddingLeft: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
    backgroundColor: '#9E9FA5',
    elevation: 5,
    marginBottom: 15,
    marginLeft: 5,
    marginRight: 5,
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    borderRadius: 10,
    shadowColor: 'black',
  },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 0,
    paddingBottom: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerCard1: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 0,
    paddingBottom: 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  IconViewClass: {
    position: 'relative',
    position: 'absolute',
    right: 5,
    paddingBottom: 10,
  },
  itemDetails: {
    marginLeft: 10,
    flex: 1,
  },
  itemName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    height: 25,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 5,
    marginBottom: 5,
  },
  footerText: {
    fontSize: 16,
    color: 'gray',
  },
  notificationIcon: {
    position: 'relative',
    position: 'absolute',
    right: 20,
    top: 17,
  },
});

export default Koordinat;
