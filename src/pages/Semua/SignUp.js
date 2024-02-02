import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  Alert,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  Modal,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import MapView, {Marker} from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImageCropPicker from 'react-native-image-crop-picker'; // Import from the new library
import axios from 'axios';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const SignUp = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [nomor, setNomor] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRePassword] = useState('');
  // Image
  const [isFotoProfile, setIsFotoProfile] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState('');
  const [isMaximized, setIsMaximized] = useState(false);
  // Maps
  const [location, setLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [uploadedLocation, setUploadedLocation] = useState(null);
  const [isMapMaximized, setIsMapMaximized] = useState(false);
  const mapRef = useRef(null);

  const SignIn = () => {
    navigation.navigate('SignIn');
  };
  // Membuat Panel Photo

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
  const handleMapPress = event => {
    const {latitude, longitude} = event.nativeEvent.coordinate;
    setSelectedLocation({latitude, longitude});
    setUploadedLocation(null);
  };

  const uploadLocation = () => {
    if (selectedLocation) {
      setUploadedLocation(selectedLocation);
      console.log('Uploaded Location:', selectedLocation);
    }
  };

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

  const toggleMapSize = () => {
    setIsMapMaximized(!isMapMaximized);
  };
  // Error Animation
  // Error getar Animation
  // const [isVibrating, setIsVibrating] = useState(false);
  // const translateXAnim = useRef(new Animated.Value(0)).current;

  // const startVibration = () => {
  //   setIsVibrating(true);
  //   Animated.sequence([
  //     Animated.timing(translateXAnim, {
  //       toValue: 10,
  //       duration: 50,
  //       easing: Easing.linear,
  //       useNativeDriver: true,
  //     }),
  //     Animated.timing(translateXAnim, {
  //       toValue: -10,
  //       duration: 100,
  //       easing: Easing.linear,
  //       useNativeDriver: true,
  //     }),
  //     Animated.timing(translateXAnim, {
  //       toValue: 0,
  //       duration: 100,
  //       easing: Easing.linear,
  //       useNativeDriver: true,
  //     }),
  //   ]).start(() => {
  //     setIsVibrating(false);
  //   });
  // };

  // const [hpEmail, setHpEmail] = useState('Masukkan Email Anda');
  // const [dataError, setDataError] = useState(null);
  // const [errorStyle, setErrorStyle] = useState('black');
  // const [errorInfo, setErrorInfo] = useState(null);

  // ... kode yang ada sebelumnya ...
  const handleCreateAccount = async () => {
    if (
      !name.trim() ||
      !email.trim() ||
      !address.trim() ||
      !nomor.trim() ||
      !password.trim() ||
      !repassword.trim()
    ) {
      Alert.alert(
        'Input Field Kosong',
        'Harap isi semua kolom dan pastikan tidak ada yang kosong atau hanya berisi spasi.',
      );
      return;
    }

    // store image name
    const imageFilename = imageUri.substring(imageUri.lastIndexOf('/') + 1);
    console.log('Image Filename:', imageFilename);
    if (!imageUri.trim()) {
      Alert.alert('Input Field Kosong', 'Harap Mengisi Gambar.');
      return;
    }

    // Aturan Mendaftarc
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Format Email Salah', 'Masukkan alamat email yang valid.');
      return;
    }
    if (password !== repassword) {
      Alert.alert('Password Tidak Cocok', 'Pastikan kata sandi cocok.');
      return;
    }
    if (!uploadedLocation) {
      Alert.alert(
        'Lokasi Belum Dipilih',
        'Silakan pilih dan unggah lokasi Anda pada peta.',
      );
      return;
    }
    if (password.length < 8 || repassword.length < 8) {
      Alert.alert(
        'Panjang Kata Sandi',
        'Kata sandi harus lebih dari 8 karakter.',
      );
      return;
    }

    // Buat formData
    const formData = new FormData();
    formData.append('gambar', {
      uri: imageUri,
      type: 'image/jpeg',
      name: imageFilename,
    });

    // Tambahkan data lainnya ke formData jika diperlukan
    formData.append('input-role', 'Donatur');
    formData.append('input-email', email);
    formData.append('input-password', password);
    formData.append('input-username', name);
    formData.append('input-address', address);
    formData.append('input-nomor', nomor);
    formData.append('input-latitude', uploadedLocation.latitude.toString());
    formData.append('input-longitude', uploadedLocation.longitude.toString());

    try {
      const response = await fetch(
        'https://fdonasi.site/foodDonation/public/mobile/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
            // Tambahkan header lain yang diperlukan oleh API Anda
          },
          body: formData,
        },
      );

      console.log(formData);

      const textData = await response.text();
      console.log('Respon dari server:', textData);

      if (textData.includes('ERROR')) {
        Alert.alert(
          'Pendaftaran Gagal',
          'Maaf, pendaftaran akun baru gagal. Silakan coba lagi.',
        );
      } else if (textData.includes('DUPLICATE')) {
        Alert.alert(
          'Email/NIM/Nomor Registrasi Sudah Ada',
          'Maaf, email/NIM/nomor registrasi telah ada di database. Silakan hubungi administrator.',
        );
      } else if (textData.includes('SUCCESS')) {
        Alert.alert(
          'Pendaftaran Berhasil',
          'Akun baru pengguna berhasil dibuat.',
        );

        // Reset semua field input
        setName('');
        setEmail('');
        setAddress('');
        setNomor('');
        setPassword('');
        setRePassword('');
        setImageUri('');
        setUploadedLocation(null);

        // Navigasi ke halaman login
        navigation.navigate('SignIn');
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
    <View style={{flex: 1}}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={SignIn}
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
          Pendaftaran
        </Text>
      </View>

      {isMapMaximized ? null : (
        <View>
          {/* Image */}
          <View style={styles.imageSection}>
            <View
              style={{
                position: 'absolute',
                right: 140,
                top: 85,
                zIndex: 10,
                backgroundColor: '#FC6E51',
                padding: 12,
                borderRadius: 10,
              }}>
              <MaterialIcons
                name="camera-alt"
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
                    style={isMaximized ? styles.maximizedImage : styles.image}
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
                  name="account-circle"
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
                  Foto Profil
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
                      Anda Belum Memiliki Foto Profil
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
            <Text style={styles.textInput}>Email</Text>
            <MaterialCommunityIcons
              name="email"
              color="rgba(248, 111, 3, 0)"
              size={20}
              style={styles.icon}
            />
            <TextInput
              placeholder="Masukkan Email"
              placeholderTextColor={'grey'}
              style={styles.input}
              onChangeText={setEmail}
              value={email}
              // caretColor="red"
            />
          </View>

          {/* Input */}

          {/* Input - Password */}
          <View style={styles.inputRow}>
            <Text style={styles.textInput}>Password</Text>
            <MaterialCommunityIcons
              name="shield-lock-outline"
              color="rgba(248, 111, 3, 0)"
              size={20}
              style={styles.icon}
            />
            <TextInput
              placeholder="Masukkan Password"
              placeholderTextColor={'grey'}
              style={styles.input}
              onChangeText={setPassword}
              value={password}
              secureTextEntry={true}
            />
          </View>
          {/* Confirm Password */}
          <View style={styles.inputRow}>
            <Text style={styles.textInput}>Konfirmasi Password</Text>
            <MaterialCommunityIcons
              name="shield-lock-outline"
              color="rgba(248, 111, 3, 0)"
              size={20}
              style={styles.icon}
            />
            <TextInput
              placeholder="Konfirmasi Password Anda"
              placeholderTextColor={'grey'}
              style={styles.input}
              onChangeText={setRePassword}
              value={repassword}
              secureTextEntry={true}
            />
          </View>
          {/* Input - Username */}
          <View style={styles.inputRow}>
            <Text style={styles.textInput}>Nama Pengguna (RM. nama)</Text>
            <MaterialCommunityIcons
              name="home-account"
              color="rgba(248, 111, 3, 0)"
              size={20}
              style={styles.icon}
            />
            <TextInput
              placeholder="Masukkan Nama Rumah Makan"
              placeholderTextColor={'grey'}
              style={styles.input}
              onChangeText={setName}
              value={name}
            />
          </View>
          {/* Input - Nomor (telepon/Wa) */}
          <View style={styles.inputRow}>
            <Text style={styles.textInput}>Nomor(Telepon/WA)</Text>
            <FontAwesome
              name="whatsapp"
              color="rgba(248, 111, 3, 0)"
              size={20}
              style={styles.icon}
            />
            <TextInput
              placeholder="Masukkan Nomor Telepon/WhatsApp"
              placeholderTextColor={'grey'}
              style={styles.input}
              onChangeText={setNomor}
              value={nomor}
            />
          </View>
          {/* Input - Detail Lokasi */}
          <View style={styles.inputRow}>
            <Text style={styles.textInput}>Detail Lokasi</Text>
            <Entypo
              name="address"
              color="rgba(248, 111, 3, 0)"
              size={20}
              style={styles.icon}
            />
            <TextInput
              placeholder="Masukkan Detail Seputaran Lokasi"
              placeholderTextColor={'grey'}
              style={styles.input}
              onChangeText={setAddress}
              value={address}
            />
          </View>
        </View>
      )}
      {/* Map */}
      <View
        style={[
          {flexDirection: 'row', paddingLeft: 15},
          isMapMaximized ? {paddingLeft: 0} : {paddingLeft: 15},
        ]}>
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
        {/* Map Text */}

        <View
          style={isMapMaximized ? styles.mapbesar : {paddingHorizontal: 10}}>
          <Text style={{color: 'black'}}>Koordinat Saya Sekarang :</Text>
          {location ? (
            <Text style={{color: 'blue'}}>
              {location.latitude}, {location.longitude}
            </Text>
          ) : (
            <Text style={{color: 'red'}}>belum terdeteksi</Text>
          )}
          <Text style={{color: 'black'}}>Cek Koordinat :</Text>
          {selectedLocation ? (
            <Text style={{color: 'blue'}}>
              {selectedLocation.latitude}, {selectedLocation.longitude}
            </Text>
          ) : (
            <Text style={{color: 'red'}}>belum menyeleksi koordinat</Text>
          )}

          <Text style={{color: 'black'}}>Ambil Koordinat :</Text>
          {uploadedLocation ? (
            <Text style={{color: 'blue'}}>
              {uploadedLocation.latitude},{uploadedLocation.longitude}
            </Text>
          ) : (
            <Text style={{color: 'red'}}>
              'Anda belum mengambil Koordinat ! '
            </Text>
          )}
        </View>
      </View>
      {/* Maximize and Minimize Buttons (Outside of MapView) */}
      <View style={styles.mapButtonsContainer}>
        <TouchableOpacity
          style={[styles.mapButton, {marginLeft: 4}]}
          onPress={toggleMapSize}>
          <Text style={{color: 'white'}}>
            {isMapMaximized ? 'Perkecil Map' : 'Perbesar Map'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.mapButton, {backgroundColor: '#279EFF'}]}
          onPress={uploadLocation}
          disabled={!selectedLocation}>
          <Text style={{color: 'white'}}>Ambil Lokasi</Text>
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
      {isMapMaximized ? null : (
        <TouchableOpacity style={styles.submit} onPress={handleCreateAccount}>
          <Text style={{color: 'white', fontWeight: 'bold'}}>
            Daftar Sekarang!
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    backgroundColor: 'red',
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: '#FC6E51',
  },
  error: {},
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
    marginVertical: 10,
  },
  mapButtonsContainer: {
    marginTop: 2,
    marginLeft: 2,
    flexDirection: 'row',
  },
  mapButton: {
    backgroundColor: '#33BBC5',
    padding: 10,
    borderRadius: 5,
    marginLeft: 1,
  },
  // Text Koordinat
  mapbesar: {
    position: 'absolute',
    top: 20,
    left: 10,
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 10,
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
    borderRadius: 100,
    overflow: 'hidden',
  },
  image: {
    width: 115,
    height: 115,
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

  // Input
  icon: {
    textAlign: 'right',
    marginRight: 40,
  },
  textInput: {
    color: '#FC6E51',
    marginLeft: 5,
    fontSize: 14,
    padding: 0,
    fontWeight: 'bold',
    top: 5,
    paddingHorizontal: 15,
  },
  input: {
    color: 'black',
    fontSize: 14,
    height: 30,
    margin: 0,
    borderWidth: 1,
    padding: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    top: -15,
    paddingHorizontal: 15,
    borderColor: '#FC6E51',
    marginLeft: 20,
    marginRight: 40,
  },

  // Submit
  submit: {
    padding: 10,
    backgroundColor: '#F7941D',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
    borderRadius: 10,
    marginHorizontal: 30,
  },
});

export default SignUp;
