import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
  Modal,
  Button,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import DropDownPicker from 'react-native-dropdown-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// Maps
import MapView, {Marker} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

function DonasiMasukAdmin({route, navigation}) {
  const jsonData = route.params ? route.params.jsonData : null;

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [label, setLabel] = useState([]);

  const [items, setItems] = useState([]);
  const [selectedItemsText, setSelectedItemsText] = useState('');
  const [json_data_donasi, setJsonDataDonasi] = useState(null);
  const [isModalVisible1, setModalVisible1] = useState(false);
  const [idBaru, setIdBaru] = useState(null);

  // Maps
  const origin = {latitude: 1.41778779, longitude: 124.98404807};
  const destination = {latitude: 1.41724688, longitude: 124.9826957};
  const [showRoute, setShowRoute] = useState(false);
  const [location, setLocation] = useState(null);
  const mapRef = useRef(null);
  const [idFamilyLatitude, setIdFamilyLatitude] = useState('');
  const [idFamilyLongitude, setIdFamilyLongitude] = useState('');
  const [lokasiKeluarga, setLokasiKeluarga] = useState(null);

  // ID - Donation
  const [idDonation, setIdDonation] = useState('');
  const [idUsername, setIdUsername] = useState('');
  const [idPhoneNumber, setIdPhoneNumber] = useState('');
  const [idDonaturLatitude, setIdDonaturLatitude] = useState('');
  const [idDonaturLongitude, setIdDonaturLongitude] = useState('');
  const [idDetailPenjemputan, setIdDetailPenjemputan] = useState('');
  const [idJamMasak, setIdJamMasak] = useState('');
  const [idJenisMakanan, setIdJenisMakanan] = useState('');
  const [idKeterangan, setIdKeterangan] = useState('');
  const [idLokasiAsli, setIdLokasiAsli] = useState('');
  const [idLatLongDon, setIdLatLongDon] = useState(null);
  const [datakel, setData] = useState('');

  // Jarak dan Waktu Tempuh
  const [idJarakTempuh, setIdJarakTempuh] = useState('');
  const [idWaktuTempuh, setIdWaktuTempuh] = useState('');

  // Donasi Kosong
  const [dataKosong, setDataKosong] = useState(false);

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
  const donaturLocation = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: parseFloat(idDonaturLatitude),
        longitude: parseFloat(idDonaturLongitude),
        latitudeDelta: 0.00922,
        longitudeDelta: 0.00421,
      });
    }
  };

  // console.log(json_data_donasi);

  const toggleModal1 = itemId => {
    console.log('buka');
    const selectedItem = json_data_donasi.find(
      item => item.Donation_ID === itemId,
    );
    // ID - Donation
    setIdDonation(selectedItem.Donation_ID);
    setIdUsername(selectedItem.Username);
    setIdPhoneNumber(selectedItem.Phone_Number);
    setIdDonaturLatitude(selectedItem.Donatur_Latitude);
    setIdDonaturLongitude(selectedItem.Donatur_Longitude);
    setIdLokasiAsli(selectedItem.Address);
    setIdDetailPenjemputan(selectedItem.Pickup_Details);
    setIdJamMasak(selectedItem.Cook_Time);
    setIdJenisMakanan(selectedItem.Type_of_Food);
    setIdKeterangan(selectedItem.Additional_Information);
    setIdLatLongDon({
      latitude: parseFloat(selectedItem.Donatur_Latitude),
      longitude: parseFloat(selectedItem.Donatur_Longitude),
    });

    console.log('ID Donasi :');
    console.log(selectedItem.Donation_ID);
    setIdBaru(selectedItem.Donation_ID);
    // console.log(selectedItem.id);
    // create request body with email and password input values
    const requestBody = {
      'user-role': 'Admin',
    };

    // Time out request data
    const timeoutPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('Request timed out.'));
      }, 5000); // 5000 (5 detik)
    });

    Promise.race([
      fetch(
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
      ),
      timeoutPromise,
    ])
      .then(response => response.text())
      .then(textData => {
        // handle response data

        console.log('\n Data Keluarga');
        console.log(textData);
        const jsonData = JSON.parse(textData.substring(textData.indexOf('[')));
        setData(jsonData);

        // check if textData contains "ERROR"
        if (textData.includes('ERROR1')) {
          // handle error case
          //console.error("Login failed:", textData);
          Alert.alert(
            'Error Message',
            'Sorry, create new account failed. Please try again.',
          );
          return;
        }

        // check if textData contains "INCORRECT"

        if (textData.includes('SUCCESS')) {
          // console.log('testing');

          setModalVisible1(true);

          // Parse the JSON data

          console.log('lihat data 2 :');
          console.log(datakel);

          const familyNames = jsonData.map(item => ({
            label: item.Family_Name,
            value: item.Family_ID,
          }));
          setItems(familyNames);

          // Log the Family_Name when opening the panel
          console.log('Family_Name saat buka panel:');
          jsonData.forEach(item => {
            console.log(item.Family_Name);
          });
        }
      })
      .catch(error => {
        console.error(error.message);
        Alert.alert('Error Message', error.message);
        return;
      });
  };

  // ini close model
  const closetoggleModal1 = () => {
    console.log('tutup');
    setModalVisible1(false);

    console.log('ID RM Donasi: ' + idBaru);
    console.log('Keluarga Selected:' + label.join(', '));
  };

  useEffect(() => {
    const selectedText = value.length > 0 ? `${value.length} was Targeted` : '';
    setSelectedItemsText(selectedText);
    fetchData();
  }, [value]);

  const fetchData = () => {
    const requestBody = {
      'user-role': jsonData[0].Role,
    };

    const fetchPromise = fetch(
      'https://fdonasi.site/foodDonation/public/mobile/listDonationAdmin',
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
    )
      .then(response => response.text())
      .then(textData => {
        console.log(textData);
        if (textData.includes('ERROR')) {
          Alert.alert(
            'Error Message',
            'Sorry, access data class failed. Please try again.',
          );
          return;
        } else if (textData.includes('No donation in database')) {
          Alert.alert('Masih Kosong', 'Belum ada Donasi Masuk.');
          setDataKosong(true);
          return;
        } else {
          const dataArray = textData.split('SUCCESS');
          const datadonasi = dataArray[1];
          const json_data_donasi = JSON.parse(datadonasi);
          setJsonDataDonasi(json_data_donasi);
        }
      })
      .catch(error => {
        Alert.alert(
          'Error Message',
          'Sorry, we have got an error. Please try again.',
        );
        return;
      });

    const timeout = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('Request timed out'));
      }, 5000);
    });

    Promise.race([fetchPromise, timeout]).catch(error => {
      if (error.message === 'Request timed out') {
        Alert.alert(
          'Error Message',
          'Sorry, the request has timed out. Please try again.',
        );
      } else {
        Alert.alert(
          'Error Message',
          'Sorry, we have got an error. Please try again.',
        );
      }
    });
  };
  const test = () => {
    console.log(value);
    if (value == '') {
      Alert.alert(
        'Keluarga Kosong',
        'Maaf, Anda perlu menargetkan Keluarga lebih dulu.',
      );
    }
  };

  const handleConfirm = async () => {
    // Get the selected id and keluarga values
    if (!value.trim()) {
      Alert.alert(
        'Select Keluarga Kosong',
        'Harap Targetkan Keluarga terlebih dahulu.',
      );
      return;
    }

    // Create a new FormData object
    const formData = new FormData();

    // Send the selected values to the server or use them as needed

    // Use the itemId to access the corresponding data from json_data_donasi

    // Log the id and keluarga

    console.log('item.id:', idDonation);

    // Append data to formData
    formData.append('id-keluarga', value);
    formData.append('user-role', jsonData[0].Role);
    formData.append('id_donasi', idDonation);

    try {
      const response = await fetch(
        'https://fdonasi.site/foodDonation/public/mobile/updateListDonationAdmin/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
            // Tambahkan header lain yang diperlukan oleh API Anda
          },
          body: formData,
        },
      );
      console.log('\n\nData yang terkirim (formData) :');
      console.log(formData);

      const textData = await response.text();
      console.log('Respon dari server:', textData);

      if (textData.includes('ERROR')) {
        Alert.alert(
          'Donasi Gagal',
          'Maaf, Kirim Donasi Gagal, Silakan coba lagi.',
        );
      } else if (textData.includes('SUCCESS')) {
        Alert.alert('Donasi Berhasil', 'Donasi Sudah berhasil terkirim.');

        // Reset semua field input

        setValue('');
        setModalVisible1(false);

        // Navigasi ke halaman login
        // navigation.navigate('SignIn');
      }
    } catch (error) {
      console.error('Error:', error.message);
      Alert.alert(
        'Terjadi Kesalahan',
        'Maaf, terjadi kesalahan. Silakan coba lagi nanti.',
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('HomeAdmin', {
              jsonData: jsonData,
            })
          }
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
          Donasi Masuk
          {/* Halaman 2 */}
        </Text>
      </View>

      <View style={styles.content} backgroundColor="#fff">
        {dataKosong && (
          <View style={styles.itemContainer}>
            <Text style={{color: 'black'}}>Belum ada Donasi Masuk.</Text>
          </View>
        )}
        <ScrollView>
          {json_data_donasi ? (
            json_data_donasi.map((item, index) => (
              <TouchableOpacity key={index} style={styles.itemContainer}>
                <View style={styles.itemDetails}>
                  <View style={styles.headerCard}>
                    <Text style={styles.itemName}>{item.Username}</Text>
                    <TouchableOpacity style={styles.IconViewClass}>
                      <MaterialIcons
                        name="location-pin"
                        size={24}
                        color="black"
                      />
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      borderTopWidth: 1,
                      width: '100%',
                      borderColor: '#f7f0f7',
                    }}
                  />
                  <View style={styles.tableRow}>
                    <Text style={styles.tableCellLeft}>ID</Text>
                    <Text style={styles.tableCellRight}>
                      {item.Donation_ID}
                    </Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={styles.tableCellLeft}>Detail Penjemputan</Text>
                    <Text style={styles.tableCellRight}>
                      {item.Pickup_Details}
                    </Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={styles.tableCellLeft}>
                      Jam berapa dimasak?
                    </Text>
                    <Text style={styles.tableCellRight}>{item.Cook_Time}</Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={styles.tableCellLeft}>Jenis Makanan</Text>
                    <Text style={styles.tableCellRight}>
                      {item.Type_of_Food}
                    </Text>
                  </View>

                  <View style={styles.tableRow} paddingBottom={12}>
                    <Text style={styles.tableCellLeft}>Keterangan</Text>
                    <Text style={styles.tableCellRight}>
                      {item.Additional_Information}
                    </Text>
                  </View>

                  <View style={styles.tableRow} paddingBottom={12}>
                    <Text style={styles.tableCellLeft}>Nomor Telepon</Text>
                    <Text style={styles.tableCellRight}>
                      {item.Phone_Number}
                    </Text>
                  </View>

                  {/* <Gap height={20} />
                  <View style={styles.inputRow}>
                    <Text style={{color: 'black'}}>Target Donasi</Text>
                    <Text style={{color: 'black'}}>
                      Keluarga Selected: {value.join(', ')}
                    </Text>
                  </View> */}

                  <View
                    style={[styles.headerCard, {flexDirection: 'column'}]}
                    backgroundColor=""
                    textAlign="center"
                    paddingTop={20}>
                    <TouchableOpacity
                      onPress={() => toggleModal1(item.Donation_ID)}>
                      <Text style={styles.itemName}>Target Sumbangan</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.content}>
              <Text>History Donasi Kosong.</Text>
            </View>
          )}
        </ScrollView>
      </View>
      {/* Panel */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible1}
        onRequestClose={() => setModalVisible1(false)}>
        <View style={styles.modalContainer}>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={
              location
                ? {
                    latitude: 1.416866592781566,
                    longitude: 124.98432844877243,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }
                : null
            }>
            <Marker
              coordinate={{
                latitude: parseFloat(idDonaturLatitude),
                longitude: parseFloat(idDonaturLongitude),
              }}
              title={idUsername}>
              <MaterialIcons name="restaurant" color="green" size={20} />
            </Marker>
            {showRoute && (
              <>
                {datakel &&
                  datakel.map((item, index) => (
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
          <View style={{flexDirection: 'row'}}>
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
          </View>
          <View style={{flexDirection: 'row', marginTop: 2, marginBottom: 4}}>
            <Button
              color={'blue'}
              title="Lokasi Donatur"
              onPress={donaturLocation}
            />
          </View>
          <DropDownPicker
            mode="BADGE"
            searchable={true}
            // multiple={true}
            min={0}
            max={3} // Limit the maximum selection to 3 families
            open={open}
            value={value}
            label={label}
            items={items} // Use the updated items state
            setOpen={setOpen}
            setValue={setValue}
            setLabel={setLabel}
            setItems={setItems}
            placeholder="Pilih keluarga"
            selectedLabelStyle={{color: 'blue'}}
            style={{maxHeight: 200}} // Adjust maxHeight as needed
          />

          <TouchableOpacity
            onPress={() => setModalVisible1(false)}
            style={{
              padding: 10,
              backgroundColor: 'blue',
              marginBottom: 10,
              marginTop: 5,
              marginHorizontal: 10,
              borderRadius: 5,
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: 15,
              }}>
              Kembali
            </Text>
          </TouchableOpacity>
          <ScrollView>
            {/* ID - Donation */}
            <View style={styles.itemContainer}>
              <View style={styles.itemDetails}>
                <View style={styles.headerCard}>
                  <Text style={styles.itemName}>Detail Donasi</Text>
                  <TouchableOpacity style={styles.IconViewClass}>
                    <MaterialIcons
                      name="location-pin"
                      size={24}
                      color="black"
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    borderTopWidth: 1,
                    width: '100%',
                    borderColor: '#f7f0f7',
                  }}
                />

                {/* # ID - Donation */}
                <View style={styles.tableRow} paddingBottom={12}>
                  <Text style={styles.tableCellLeft}>Donasi ID</Text>
                  {idDonation && (
                    <Text style={styles.tableCellRight}>{idDonation}</Text>
                  )}
                </View>
                <View style={styles.tableRow} paddingBottom={12}>
                  <Text style={styles.tableCellLeft}>Nama Penyumbang</Text>
                  {idUsername && (
                    <Text style={styles.tableCellRight}>{idUsername}</Text>
                  )}
                </View>

                <View style={styles.tableRow} paddingBottom={12}>
                  <Text style={styles.tableCellLeft}>Lokasi Rumah Makan</Text>
                  {idLokasiAsli && (
                    <Text style={styles.tableCellRight}>{idLokasiAsli}</Text>
                  )}
                </View>
                <View style={styles.tableRow} paddingBottom={12}>
                  <Text style={styles.tableCellLeft}>
                    Lokasi Penjemputan Makanan
                  </Text>
                  {idDetailPenjemputan && (
                    <Text style={styles.tableCellRight}>
                      {idDetailPenjemputan}
                    </Text>
                  )}
                </View>
                <View style={styles.tableRow} paddingBottom={12}>
                  <Text style={styles.tableCellLeft}>Keterangan Makanan</Text>
                  {idKeterangan && (
                    <Text style={styles.tableCellRight}>{idKeterangan}</Text>
                  )}
                </View>
                <View style={styles.tableRow} paddingBottom={12}>
                  <Text style={styles.tableCellLeft}>Jam Masak Makanan</Text>
                  {idJamMasak && (
                    <Text style={styles.tableCellRight}>{idJamMasak}</Text>
                  )}
                </View>
                <View style={styles.tableRow} paddingBottom={12}>
                  <Text style={styles.tableCellLeft}>Jenis Makanan</Text>
                  {idJenisMakanan && (
                    <Text style={styles.tableCellRight}>{idJenisMakanan}</Text>
                  )}
                </View>
                <View style={styles.tableRow} paddingBottom={12}>
                  <Text style={styles.tableCellLeft}>Telepon Rumah Makan</Text>
                  {idPhoneNumber && (
                    <Text style={styles.tableCellRight}>{idPhoneNumber}</Text>
                  )}
                </View>
              </View>
            </View>
            <TouchableOpacity
              onPress={handleConfirm}
              style={{
                padding: 10,
                backgroundColor: 'blue',
                marginBottom: 10,
                marginHorizontal: 20,
                borderRadius: 10,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 15,
                }}>
                Confirm
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      <View style={styles.footer}>
        <Text style={styles.footerText}>2023 © Food Donation</Text>
      </View>
    </View>
  );
}

export default DonasiMasukAdmin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  // Panle
  modalContainer: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#DADDB1',
  },
  // Map
  map: {
    height: 300,
    // weight: 400,
  },
  header: {
    flexDirection: 'row',
    backgroundColor: 'red',
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: 'rgba(78, 78, 78, 1)',
  },
  input: {
    fontSize: 20,
    height: 30,
    margin: 0,
    borderWidth: 1,
    color: 'black',
    borderColor: 'black',
    padding: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    top: -15,
  },
  headerText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
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
    color: '#05375a',
    flex: 1,
    textAlign: 'left',
    fontSize: 12,
    marginTop: 5,
  },
  tableCellRight: {
    color: '#05375a',
    flex: 1,
    textAlign: 'right',
    fontSize: 11,
    marginTop: 5,
  },
  itemContainer: {
    flexDirection: 'row',
    //padding: 15,
    paddingBottom: 10,
    paddingTop: 15,
    paddingRight: 15,
    paddingLeft: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
    backgroundColor: '#E9B384',
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
    //backgroundColor: '#7732a8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 0,
    //paddingHorizontal: 16,
    //paddingTop: 16,
    paddingBottom: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  IconViewClass: {
    position: 'relative',
    position: 'absolute',
    right: 5,
    //top: 17,
    paddingBottom: 10,
  },
  itemDetails: {
    marginLeft: 10,
    flex: 1,
  },
  itemName: {
    color: '#05375a',
    fontSize: 16,
    fontWeight: 'bold',
  },

  footer: {
    height: 25,
    alignItems: 'center',
    justifyContent: 'flex-start', // on top
    //backgroundColor: '#2c3e50',
    //justifyContent: 'center',
    marginTop: 5,
    marginBottom: 5,
  },

  footerText: {
    fontSize: 16,
    //color: '#fff',
    color: 'gray',
  },
  notificationIcon: {
    position: 'relative',
    position: 'absolute',
    right: 20,
    top: 17,
  },
});
