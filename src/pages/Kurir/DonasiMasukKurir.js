import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
  Button,
  TextInput,
  Modal,
  Dimensions,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// import {Gap} from '../components';
// Maps
import MapView, {Marker} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Geolocation from '@react-native-community/geolocation';
// Image
import ImageCropPicker from 'react-native-image-crop-picker';

function DonasiMasukKurir({route, navigation}) {
  const [jsonData, setJsonData] = useState([]);
  const [json_data_donasi, setJsonDataDonasi] = useState([]);
  // Ucapan
  const [salam, setSalam] = useState('');
  // Panel
  const [modalVisible, setModalVisible] = useState(false);
  // Maps
  const origin = {latitude: 1.41778779, longitude: 124.98404807}; // San Francisco
  const destination = {latitude: 1.41724688, longitude: 124.9826957}; // Los Angeles
  const [showRoute, setShowRoute] = useState(false);
  const [location, setLocation] = useState(null);
  const mapRef = useRef(null);
  // Image
  const [isFotoProfile, setIsFotoProfile] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState('');
  const [isMaximized, setIsMaximized] = useState(false);
  const [idFoto, setIdFoto] = useState(null);
  const foto = () => {
    setIsFotoProfile(true);
  };
  const gambarDonasi =
    'https://fdonasi.site/foodDonation/public/uploaded/images_donation/';

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
  const [idLatLongFam, setIdLatLongFam] = useState(null);
  // Jarak dan Waktu Tempuh Donasi
  const [idJarakTempuh, setIdJarakTempuh] = useState('');
  const [idWaktuTempuh, setIdWaktuTempuh] = useState('');

  // Jarak dan Waktu Tempuh saya ke Donasi
  const [idJarakTempuhmytodo, setIdJarakTempuhmytodo] = useState('');
  const [idWaktuTempuhmytodo, setIdWaktuTempuhmytodo] = useState('');
  // ID - Family
  const [idFamilyLatitude, setIdFamilyLatitude] = useState('');
  const [idFamilyLongitude, setIdFamilyLongitude] = useState('');
  const [idFamilyName, setIdFamilyName] = useState('');
  const [idLocationInfo, setIdLocationInfo] = useState('');
  const [idLatLongDon, setIdLatLongDon] = useState(null);

  // Show Rute
  const [myToDoLocation, setMyToDoLocation] = useState(true);
  const [doToFamLocation, setDoToFamLocation] = useState(false);
  const [myToFamLocation, setMyToFamLocation] = useState(false);
  // ganti rute
  const [gantiRute, setGantiRute] = useState(true);
  const [titleRute, setTitleRute] = useState('Rute Menuju Lokasi Donatur...');

  // Donasi Kosong
  const [dataKosong, setDataKosong] = useState(false);

  const ubahRute = () => {
    if (gantiRute == true) {
      setGantiRute(false);
      setTitleRute(`Rute Menuju Lokasi Keluarga...`);
    } else if (gantiRute == false) {
      setGantiRute(true);
      setTitleRute('Rute Menuju Lokasi Donatur...');
    }
  };

  const akhirProses = () => {
    if (!imageUri.trim()) {
      Alert.alert('Input Field Kosong', 'Harap Mengisi Gambar.');
      return;
    }
    console.log('Testing');
    console.log(idDonation);

    console.log(salam);
  };

  // Image

  const selectImage = async () => {
    try {
      const response = await ImageCropPicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
        cropperCircleOverlay: true,
        compressImageQuality: 0.7,
      });

      setImageUri(response.path);
      setIsMaximized(false); // Reset maximized state when selecting a new image
      setIsFotoProfile(false); // Tutup panel setelah gambar terpilih
      setIsModalVisible(false);
      // uploadImage(response.path);
    } catch (error) {
      console.log('ImagePicker Error: ', error);
    }
  };

  const captureImage = async () => {
    try {
      const response = await ImageCropPicker.openCamera({
        width: 300,
        height: 300,
        cropping: true,
        cropperCircleOverlay: true,
        compressImageQuality: 0.7,
      });

      setImageUri(response.path);
      setIsMaximized(false); // Reset maximized state when capturing a new image
      setIsFotoProfile(false); // Tutup panel setelah gambar terambil
      setIsModalVisible(false);
    } catch (error) {
      console.log('Camera Error: ', error);
    }
  };
  const deleteImage = () => {
    setImageUri('');
    setIsMaximized(false);
    setIsFotoProfile(false);
    setIsModalVisible(false);
  };

  const closeFotoProfile = () => {
    toggleMaximize(false);
    setIsFotoProfile(false); // Menutup panel saat tidak diperlukan
  };
  const closeImageSelector = () => {
    setIsModalVisible(false);
  };
  const screenHeight = Dimensions.get('window').height;
  const modalHeight = screenHeight / 2; // Setengah tinggi layar perangkat

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  // Maps
  // Maps - My Location
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
  // Maps - Start Rute
  const handleStartPress = () => {
    setShowRoute(true);
    console.log(location.latitude);
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.00922,
        longitudeDelta: 0.00421,
      });
    }
  };
  // Maps - My Location
  const myLocation = location
    ? {latitude: location.latitude, longitude: location.longitude}
    : null;

  // Maps - Donatur Location
  // const DonaturLoacation = json_data_donasi
  //   ? json_data_donasi.map(item => ({
  //       latitude: parseFloat(item.Donatur_Latitude),
  //       longitude: parseFloat(item.Donatur_Longitude),
  //     }))
  //   : [];

  useEffect(() => {
    let timeoutId;
    const fetchData = async () => {
      try {
        const {jsonData} = route.params;

        setJsonData(jsonData);

        const requestBody = {
          Kurir_ID: jsonData[0].Kurir_ID,
          id_donasi: jsonData.Donation_ID,
        };

        const response = await fetch(
          'https://fdonasi.site/foodDonation/public/mobile/listDonationKurirID/',
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

        clearTimeout(timeoutId); // Clear the timeout when data is received

        const textData = await response.text();
        console.log('Data :');
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
      } catch (error) {
        Alert.alert(
          'Error Message',
          'Sorry, we have got an error. Please try again.',
        );
        return;
      }
    };

    timeoutId = setTimeout(() => {
      Alert.alert(
        'Error Message',
        'Sorry, the request has timed out. Please try again.',
      );
    }, 5000);

    Promise.race([fetchData(), timeoutId]);
  }, []);
  const testing = itemId => {
    const selectedItem = json_data_donasi.find(
      item => item.Donation_ID === itemId,
    );

    // console.log(salam);
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
    setIdFoto(selectedItem.Donation_Image);

    // ID - Family
    setIdFamilyLatitude(selectedItem.Family_Latitude);
    setIdFamilyLongitude(selectedItem.Family_Longitude);
    setIdFamilyName(selectedItem.Family_Name);
    setIdLocationInfo(selectedItem.Location_Info);
    setIdLatLongFam({
      latitude: parseFloat(selectedItem.Family_Latitude),
      longitude: parseFloat(selectedItem.Family_Longitude),
    });

    console.log('testing');
    // setModalVisible(true);
    console.log(selectedItem);

    // kirim data
    const requestBody = {
      Donation_ID: selectedItem.Donation_ID,
    };

    // Time out request data
    const timeoutPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('Request timed out.'));
      }, 5000); // 5000 (5 detik)
    });

    Promise.race([
      fetch(
        'https://fdonasi.site/foodDonation/public/mobile/processStartKurirID',
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
        console.log(selectedItem.Donation_ID);

        console.log(textData);

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

          setModalVisible(true);
        }
      })
      .catch(error => {
        console.error(error.message);
        Alert.alert('Error Message', error.message);
        return;
      });
  };
  // Selesai
  const prosesSelesai = async () => {
    if (!salam.trim()) {
      Alert.alert(
        'Input Field Kosong',
        'Harap isi semua kolom dan pastikan tidak ada yang kosong atau hanya berisi spasi.',
      );
      return;
    }
    if (!imageUri.trim()) {
      Alert.alert('Input Field Kosong', 'Harap Mengisi Gambar.');
      return;
    }

    // store image name
    const imageFilename = imageUri.substring(imageUri.lastIndexOf('/') + 1);
    console.log('Image Filename:', imageFilename);

    // Buat formData
    const formData = new FormData();
    formData.append('gambar', {
      uri: imageUri,
      type: 'image/jpeg',
      name: imageFilename,
    });

    // Tambahkan data lainnya ke formData jika diperlukan
    formData.append('donation_id', idDonation);
    formData.append('donation_message', salam);

    try {
      const response = await fetch(
        'https://fdonasi.site/foodDonation/public/mobile/donationKurirDone/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
            // Tambahkan header lain yang diperlukan oleh API Anda
          },
          body: formData,
        },
      );
      console.log('Data yang terkirim :');
      console.log(formData);

      const textData = await response.text();
      console.log('Respon dari server:', textData);

      if (textData.includes('ERROR')) {
        Alert.alert(
          'Donasi Gagal',
          'Maaf, Proses Donasi gagal. Silakan coba lagi.',
        );
      } else if (textData.includes('SUCCESS')) {
        Alert.alert(
          'Proses Donasi Selesai',
          'Seluruh Proses Donasi Sudah Selesai.',
        );

        // Reset semua field input

        setSalam('');

        // Navigasi ke halaman login
        navigation.navigate('KurirHome', {
          jsonData: jsonData,
        });
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
            navigation.navigate('KurirHome', {
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
        </Text>
      </View>
      {/* Panel */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
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
                title="My Location">
                <MaterialIcons
                  name="location-history"
                  color="#0000FF"
                  size={50}
                />
              </Marker>
            ) : null}

            {/* Location - Saya ke Donatur */}
            {gantiRute && (
              <Marker
                coordinate={{
                  latitude: parseFloat(idDonaturLatitude),
                  longitude: parseFloat(idDonaturLongitude),
                }}
                title={idUsername}>
                <MaterialIcons name="restaurant" color="green" size={20} />
              </Marker>
            )}
            {gantiRute && (
              <MapViewDirections
                origin={myLocation}
                destination={idLatLongDon}
                apikey={'AIzaSyD9Jt-zZZf8k7dGDCj017iOo3QLiPvsaNs'}
                strokeWidth={3}
                strokeColor="green"
                onReady={result => {
                  console.log(`Distance: ${result.distance} km.`);
                  console.log(`Duration: ${result.duration} min.`);
                  setIdJarakTempuh(`${result.distance} km.`);
                  setIdWaktuTempuh(`${result.duration} min.`);
                }}
              />
            )}

            {/* Location - Saya ke Target Keluarga */}
            {gantiRute ? null : (
              <Marker
                coordinate={{
                  latitude: parseFloat(idFamilyLatitude),
                  longitude: parseFloat(idFamilyLongitude),
                }}
                title={idFamilyName}>
                <MaterialIcons name="family-restroom" color="red" size={20} />
              </Marker>
            )}
            {gantiRute ? null : (
              <MapViewDirections
                origin={myLocation}
                destination={idLatLongFam}
                apikey={'AIzaSyD9Jt-zZZf8k7dGDCj017iOo3QLiPvsaNs'}
                strokeWidth={3}
                strokeColor="red"
                onReady={result => {
                  console.log(`Distance: ${result.distance} km.`);
                  console.log(`Duration: ${result.duration} min.`);
                  setIdJarakTempuhmytodo(`${result.distance} km.`);
                  setIdWaktuTempuhmytodo(`${result.duration} min.`);
                }}
              />
            )}
          </MapView>

          <TouchableOpacity
            onPress={() => setModalVisible(false)}
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
            {/* Title Rute*/}
            <View style={styles.itemContainer}>
              <View style={styles.itemDetails}>
                <View style={styles.headerCard}>
                  <Text style={styles.itemName}>{titleRute}</Text>
                  <View style={styles.IconViewClass}>
                    {gantiRute ? (
                      <MaterialIcons
                        name="restaurant"
                        color="green"
                        size={24}
                      />
                    ) : (
                      <MaterialIcons
                        name="family-restroom"
                        color="red"
                        size={24}
                      />
                    )}
                  </View>
                </View>
                <TouchableOpacity onPress={ubahRute}>
                  <Text style={[styles.itemName, {color: 'red'}]}>
                    Ganti Rute
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* # ID - Jarak Tempu Saya ke Keluarga*/}
            {gantiRute ? null : (
              <View>
                <View style={styles.itemContainer}>
                  <View style={styles.itemDetails}>
                    <View style={styles.headerCard}>
                      <Text style={styles.itemName}>
                        Jarak dan Waktu Tempuh ke Keluarga
                      </Text>
                      <View style={styles.IconViewClass}>
                        <MaterialIcons
                          name="family-restroom"
                          color="red"
                          size={24}
                        />
                      </View>
                    </View>
                    <View
                      style={{
                        borderTopWidth: 1,
                        width: '100%',
                        borderColor: '#f7f0f7',
                      }}
                    />
                    <View style={styles.tableRow} paddingBottom={12}>
                      <Text style={styles.tableCellLeft}>
                        Jarak Tempuh Saya ke Donatur
                      </Text>
                      {idJarakTempuhmytodo && (
                        <Text style={styles.tableCellRight}>
                          {idJarakTempuhmytodo}
                        </Text>
                      )}
                    </View>
                    <View style={styles.tableRow} paddingBottom={12}>
                      <Text style={styles.tableCellLeft}>Waktu Tempuh</Text>
                      {idWaktuTempuhmytodo && (
                        <Text style={styles.tableCellRight}>
                          {idWaktuTempuhmytodo}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            )}

            {/* # ID - Jarak Tempu Saya ke Donatur*/}
            {gantiRute && (
              <View style={styles.itemContainer}>
                <View style={styles.itemDetails}>
                  <View style={styles.headerCard}>
                    <Text style={styles.itemName}>
                      Jarak dan Waktu Tempuh ke Donatur
                    </Text>
                    <View style={styles.IconViewClass}>
                      <MaterialIcons
                        name="restaurant"
                        color="green"
                        size={24}
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      borderTopWidth: 1,
                      width: '100%',
                      borderColor: '#f7f0f7',
                    }}
                  />
                  <View style={styles.tableRow} paddingBottom={12}>
                    <Text style={styles.tableCellLeft}>
                      Jarak Tempuh Saya ke Donatur
                    </Text>
                    {idJarakTempuh && (
                      <Text style={styles.tableCellRight}>{idJarakTempuh}</Text>
                    )}
                  </View>
                  <View style={styles.tableRow} paddingBottom={12}>
                    <Text style={styles.tableCellLeft}>Waktu Tempuh</Text>
                    {idWaktuTempuh && (
                      <Text style={styles.tableCellRight}>{idWaktuTempuh}</Text>
                    )}
                  </View>
                </View>
              </View>
            )}

            {/* ID - Donation */}
            <View style={styles.itemContainer}>
              <View style={styles.itemDetails}>
                <View style={styles.headerCard}>
                  <Text style={styles.itemName}>Detail Donasi</Text>
                  <View style={styles.IconViewClass}>
                    <MaterialIcons name="description" size={24} color="black" />
                  </View>
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
                <View style={{marginRight: 263}}>
                  <Image
                    source={{uri: gambarDonasi + idFoto}}
                    style={styles.selectedImage}
                  />
                </View>
              </View>
            </View>

            {/* # ID - Donation */}
            <View style={styles.itemContainer}>
              <View style={styles.itemDetails}>
                <View style={styles.headerCard}>
                  <Text style={styles.itemName}>Detail Target Donasi</Text>
                  <View style={styles.IconViewClass}>
                    <MaterialIcons name="description" size={24} color="black" />
                  </View>
                </View>
                <View
                  style={{
                    borderTopWidth: 1,
                    width: '100%',
                    borderColor: '#f7f0f7',
                  }}
                />
                <View style={styles.tableRow} paddingBottom={12}>
                  <Text style={styles.tableCellLeft}>Nama Penerima Donasi</Text>
                  {idFamilyName && (
                    <Text style={styles.tableCellRight}>{idFamilyName}</Text>
                  )}
                </View>
                <View style={styles.tableRow} paddingBottom={12}>
                  <Text style={styles.tableCellLeft}>
                    Lokasi Keluarga Penerima
                  </Text>
                  {idLocationInfo && (
                    <Text style={styles.tableCellRight}>{idLocationInfo}</Text>
                  )}
                </View>
              </View>
            </View>

            {/* # ID - Bukti Donasi */}

            <View
              style={{
                height: 280,
                width: '95%',
                marginTop: 20,
                paddingHorizontal: 10,
                justifyContent: 'center',
                alignSelf: 'center',
                top: -15,
                backgroundColor: 'white',
                borderRadius: 20,
                shadowColor: 'white',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
              }}>
              <Text style={styles.itemName}>Bukti Donasi</Text>
              {/* Image */}
              <View style={styles.imageSection}>
                <View
                  style={{
                    position: 'absolute',
                    right: 120,
                    top: 85,
                    zIndex: 10,
                    backgroundColor: '#FC6E51',
                    padding: 12,
                    borderRadius: 10,
                  }}>
                  <FontAwesome5
                    name="folder-plus"
                    color="white"
                    size={20}
                    onPress={() => setIsModalVisible(true)}
                    // style={}
                  />
                </View>
                {imageUri !== '' && (
                  <TouchableOpacity
                    style={[
                      styles.imageContainer,
                      // isMaximized && styles.maximizedImageContainer,
                    ]}
                    onPress={() => {
                      toggleMaximize();
                      setIsFotoProfile(true);
                    }}>
                    {isMaximized ? null : (
                      <Image
                        source={{uri: imageUri}}
                        style={
                          isMaximized ? styles.maximizedImage : styles.image
                        }
                      />
                    )}
                  </TouchableOpacity>
                )}
                {imageUri !== '' ? null : (
                  <TouchableOpacity
                    onPress={() => setIsFotoProfile(true)}
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    {/* <Text style={styles.selectImageText}>foto profil</Text> */}
                    <MaterialIcons
                      name="insert-photo"
                      color="grey"
                      size={130}
                      // style={}
                    />
                  </TouchableOpacity>
                )}
              </View>

              {/* Panel untuk melihat foto profil */}
              <Modal
                animationType="fade"
                transparent={true}
                visible={isFotoProfile}
                onRequestClose={closeFotoProfile}>
                <View
                  style={[
                    styles.modalPicture,
                    {height: modalHeight, backgroundColor: 'black'},
                  ]}>
                  <View style={[styles.header, {backgroundColor: '#454545'}]}>
                    <TouchableOpacity
                      onPress={closeFotoProfile}
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
                      Gambar Sumbangan
                    </Text>
                  </View>
                  {imageUri !== '' ? null : (
                    <View
                      style={{
                        height: '95%',
                        weight: '100%',
                        alignContent: 'center',
                        justifyContent: 'center',
                      }}>
                      <TouchableOpacity
                        onPress={() => setIsFotoProfile(true)}
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        {/* <Text style={styles.selectImageText}>foto profil</Text> */}
                        <Text
                          style={{
                            color: 'white',
                            fontSize: 20,
                            textAlign: 'center',
                            fontStyle: 'italic',
                            fontWeight: 'bold',
                          }}>
                          Anda Belum Memasukkan Gambar
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  {imageUri !== '' && (
                    <Image
                      source={{uri: imageUri}}
                      style={isMaximized ? styles.maximizedImage : styles.image}
                    />
                  )}
                </View>
              </Modal>

              {/* Panel untuk memilih atau mengambil gambar */}
              <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={closeImageSelector}>
                <TouchableOpacity
                  style={styles.overlay}
                  onPress={closeImageSelector} // Menutup panel saat layar di luar panel disentuh
                >
                  <View style={[styles.modalPicture, {height: modalHeight}]}>
                    <Text
                      style={{
                        textAlign: 'center',
                        marginBottom: 300,
                      }}>
                      Tab untuk Keluar
                    </Text>
                    <View
                      style={[
                        styles.modalContent,
                        {alignItems: 'left', backgroundColor: '#454545'},
                      ]}>
                      <Text
                        style={{
                          color: '#FFE6C7',
                          fontWeight: 'bold',
                          fontSize: 20,
                          marginBottom: 20,
                        }}>
                        Foto Profil
                      </Text>
                      <View style={{flexDirection: 'row'}}>
                        <View>
                          <TouchableOpacity style={styles.buttonPicture}>
                            <FontAwesome5
                              name="camera-retro"
                              color="#FF6000"
                              size={30}
                              onPress={captureImage}
                              // style={}
                            />
                          </TouchableOpacity>
                          <Text style={{textAlign: 'center', marginRight: 5}}>
                            Kamera
                          </Text>
                        </View>
                        <View>
                          <TouchableOpacity style={styles.buttonPicture}>
                            <FontAwesome5
                              name="images"
                              color="#FF6000"
                              size={30}
                              onPress={selectImage}
                              // style={}
                            />
                          </TouchableOpacity>
                          <Text style={{textAlign: 'center', marginRight: 5}}>
                            Galery
                          </Text>
                        </View>
                        <View>
                          <TouchableOpacity style={styles.buttonPicture}>
                            <FontAwesome5
                              name="trash-alt"
                              color="#FF6000"
                              size={30}
                              onPress={deleteImage}
                              // style={}
                            />
                          </TouchableOpacity>
                          <Text style={{textAlign: 'center'}}>Hapus</Text>
                        </View>
                      </View>
                      {/* <Button title="Select from Gallery" onPress={selectImage} />
                  <Button title="Capture Image" onPress={captureImage} />
                  <Button title="Delete" onPress={deleteImage} />
                  <Button title="Cancel" onPress={closeImageSelector} /> */}
                    </View>
                  </View>
                </TouchableOpacity>
              </Modal>
              {/* Input - Email */}
              <View style={styles.inputRow}>
                <Text
                  style={[styles.itemName, {color: 'black', marginBottom: 5}]}>
                  Pesan
                </Text>

                <TextInput
                  placeholder="Masukkan Pesan untuk Donatur"
                  placeholderTextColor={'grey'}
                  style={styles.input}
                  onChangeText={setSalam}
                  value={salam}
                  caretColor="red"
                  // defaultValue="Hello World"
                />
              </View>
            </View>
            <TouchableOpacity
              onPress={prosesSelesai}
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
                Selesai
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      <View style={{backgroundColor: 'white'}}></View>
      {json_data_donasi ? (
        <View style={styles.content} backgroundColor="#fff">
          {dataKosong && (
            <View style={styles.itemContainer}>
              <Text style={{color: 'black'}}>Belum ada Donasi Masuk.</Text>
            </View>
          )}
          <ScrollView>
            {json_data_donasi.map((item, index) => (
              <View key={index} style={styles.itemContainer}>
                <View style={styles.itemDetails}>
                  <View style={styles.headerCard}>
                    <Text style={styles.itemName}>{item.Username}</Text>
                    <TouchableOpacity style={styles.IconViewClass}>
                      <MaterialIcons
                        name="share-location"
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

                  <View style={styles.tableRow} paddingBottom={12}>
                    <Text style={styles.tableCellLeft}>Donasi ID</Text>
                    <Text style={styles.tableCellRight}>
                      {item.Donation_ID}
                    </Text>
                  </View>

                  <View style={styles.tableRow} paddingBottom={12}>
                    <Text style={styles.tableCellLeft}>
                      Penerima Sumbangan :
                    </Text>
                    <Text style={styles.tableCellRight}>
                      {item.Family_Name}
                    </Text>
                  </View>

                  <View
                    style={styles.headerCard}
                    // backgroundColor="red"
                    textAlign="center"
                    paddingTop={20}>
                    <TouchableOpacity onPress={() => testing(item.Donation_ID)}>
                      <Text style={styles.itemName}>Tekan untuk Proses</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      ) : (
        <View style={styles.content}>
          <Text>Donasi Kosong.</Text>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>2023 © foodDonation Unklab</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  selectedImage: {
    width: 320,
    height: 320,
    // alignSelf: 'center',
    marginVertical: 10,
    borderRadius: 10,
    marginLeft: 10,
  },
  // Panel
  modalContainer: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#DADDB1',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  paneltarget: {
    backgroundColor: '#F4D160',
    marginHorizontal: 12,
    marginTop: 5,
    paddingHorizontal: 20,
    borderRadius: 10,
  },

  // Map
  map: {
    height: 300,
    // weight: 400,
  },

  header: {
    backgroundColor: '#F86F03',
    flexDirection: 'row',

    paddingTop: 5,
    paddingBottom: 5,
  },
  textInput: {
    // marginTop: Platform.OS === 'ios' ? 0 : 0,
    fontSize: 17,
    marginLeft: -5,
    fontWeight: 'bold',
    paddingTop: 15,
    color: 'black',
  },
  input: {
    width: 300,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
    color: 'black',
  },
  icon: {
    textAlign: 'right',
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
    backgroundColor: '#f9f9f9',
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
  // Image
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Warna latar belakang overlay
  },
  modalPicture: {
    flex: 1,
    justifyContent: 'flex-end', // Panel akan muncul di bagian bawah layar
    // backgroundColor: 'black',
  },
  modalContent: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
  },

  imageSection: {
    // paddingTop: 40,
    marginTop: 20,
    height: 120,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectImageText: {
    color: 'white',
    fontSize: 18,
    // textDecorationLine: 'underline',
  },
  imageContainer: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: 105,
    height: 105,
  },

  maximizedImage: {
    paddingTop: 100,
    // paddingTop: 20,
    // marginTop: 20,
    width: '100%',
    height: '95%',
    resizeMode: 'contain',
    // zIndex: 2,
  },
  buttonPicture: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 28,
    borderColor: 'grey',
    marginLeft: 5,
    marginRight: 10,
    marginBottom: 5,
  },
});

export default DonasiMasukKurir;
