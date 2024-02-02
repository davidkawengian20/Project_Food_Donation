import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Image,
  Dimensions,
  Modal,
  Animated,
  Easing,
} from 'react-native';

import {Gap, Button} from '../../components';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import DatePicker from 'react-native-date-picker';

// Image
import ImageCropPicker from 'react-native-image-crop-picker'; // Import library untuk memilih gambar
const CustomModal = ({visible, onClose, onConfirm}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => onClose()}>
      <View style={styles.modalConfirmContainer}>
        <View style={styles.modalConfirmContent}>
          <Text style={styles.modalConfirmTitle}>Konfirmasi</Text>
          <Text style={{color: 'black'}}>
            Apakah Anda yakin ingin mengirimkan donasi ini?
            {'\n'}
            Pastikan Makanan yang Anda berikan Halal
          </Text>
          <View style={styles.buttonConfirmContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => onClose()}>
              <Text style={styles.buttonText}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={() => {
                onConfirm();
                onClose();
              }}>
              <Text style={styles.buttonText}>Kirim</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const Donation = ({navigation, route}) => {
  // Pharsing Data
  const {jsonData} = route.params;

  // confirm donation
  const [modalConfirmVisible, setModalConfirmVisible] = useState(false);

  // Input Data
  const [detailJemputan, setDetailJemputan] = useState('');
  const [jamMasak, setJamMasak] = useState('');
  const [jenisMakanan, setJenisMakanan] = useState('');
  const [keterangan, setKeterangan] = useState('');

  // Image
  const [isFotoProfile, setIsFotoProfile] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState('');
  const [isMaximized, setIsMaximized] = useState(false);

  // Input Jam
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Format the time without seconds
    const formattedTime = date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    setJamMasak(formattedTime);
  }, [date]);

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

  // Back
  const HomeDonatur = () => {
    navigation.navigate('HomeDonatur', {jsonData: jsonData});
  };

  const handleConfirm = async () => {
    if (
      (!detailJemputan.trim() ||
        !jamMasak.trim() ||
        !jenisMakanan.trim() ||
        !keterangan.trim()) &&
      !imageUri
    ) {
      startVibration(true);
      setIsError(true);
      setErrorName('Input Data dan Gambar Tidak Boleh Kosong !');
      return;
    }
    if (
      !detailJemputan.trim() ||
      !jamMasak.trim() ||
      !jenisMakanan.trim() ||
      !keterangan.trim()
    ) {
      startVibration(true);
      setIsError(true);
      setErrorName('Input Data Tidak Boleh Kosong !');
      return;
    }

    if (!imageUri) {
      startVibration(true);
      setIsError(true);
      setErrorName('Masukkan Gambar Lebih Dulu !');
      return;
    }
    const imageFilename = imageUri.substring(imageUri.lastIndexOf('/') + 1);
    console.log('Image Filename:', imageFilename);

    const formData = new FormData();
    formData.append('donatur_id', jsonData[0].Donatur_ID);
    formData.append('input-detail_penjemputan', detailJemputan);
    formData.append('input-jam_masak', jamMasak);
    formData.append('input-jenis_makanan', jenisMakanan);
    formData.append('input-keterangan', keterangan);
    formData.append('gambar', {
      uri: imageUri,
      type: 'image/jpeg',
      name: imageFilename,
    });

    try {
      const response = await axios.post(
        'https://fdonasi.site/foodDonation/public/mobile/donate',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      console.log('Data uploaded successfully', response.data);

      if (response.data.includes('SUCCESS')) {
        Alert.alert(
          'User Account',
          'Donation data has been successfully added.',
        );

        navigation.navigate('HomeDonatur', {jsonData: jsonData});

        setDetailJemputan('');
        setJamMasak('');
        setJenisMakanan('');
        setKeterangan('');
      }
    } catch (error) {
      console.error('Error uploading data', error);
      Alert.alert('Error Message', 'Failed to upload data. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={HomeDonatur}
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
          Donation
        </Text>
      </View>
      <Text
        style={{
          left: 20,
          fontSize: 23,
          color: '#454545',
          paddingBottom: 30,
          paddingTop: 40,
          fontWeight: 'bold',
        }}>
        Input Data Donasi Makanan
      </Text>
      {/* Error */}
      {isError ? (
        <View>
          <View style={[styles.info]}>
            <MaterialIcons name="error" color="red" size={20} />
            <View style={{flexDirection: 'column'}}>
              <Animated.Text
                style={[
                  styles.error,
                  isVibrating && {transform: [{translateX: translateXAnim}]},
                ]}>
                {errorName}
              </Animated.Text>
            </View>
          </View>
        </View>
      ) : null}

      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <Text style={styles.textInput}>Detail Penjemputan</Text>
          <Entypo
            name="location"
            color="rgba(0, 0, 0, 0)"
            size={20}
            style={styles.icon}
          />
          <TextInput
            placeholder="Masukkan Detail Penjemputan"
            style={styles.input}
            onChangeText={setDetailJemputan}
            value={detailJemputan}
            caretColor="red"
          />
        </View>
        <Gap height={20} />
        <View style={styles.inputRow}>
          <Text style={styles.textInput}>Jam berapa dimasak?</Text>
          <MaterialCommunityIcons
            name="timeline-help"
            color="rgba(0, 0, 0, 0)"
            size={20}
            style={styles.icon}
          />
          <TouchableOpacity
            onPress={() => setOpen(true)}
            style={{flexDirection: 'row'}}>
            <Text style={[styles.textInput, {color: '#FFBF9B', fontSize: 18}]}>
              Tekan Untuk Memasukkan
            </Text>
            <Text style={[styles.textInput, {color: 'white', fontSize: 18}]}>
              {jamMasak ? `${jamMasak}` : `Tekan Untuk Memasukkan`}
            </Text>
          </TouchableOpacity>
        </View>
        <DatePicker
          modal
          open={open}
          locale="id"
          date={date}
          mode={'time'}
          onConfirm={selectedDate => {
            setOpen(false);

            // Extract the hour and minute from the selectedDate
            const selectedHour = selectedDate.getHours();
            const selectedMinute = selectedDate.getMinutes();

            // Create a new Date object with the current year, month, and day,
            // but with the selected hour and minute
            const newDate = new Date();
            newDate.setHours(selectedHour, selectedMinute);

            // Update the state with the new Date object
            setDate(newDate);
          }}
          onCancel={() => {
            setOpen(false);
          }}
        />

        <Gap height={20} />
        <View style={styles.inputRow}>
          <Text style={styles.textInput}>Jenis Makanan</Text>
          <MaterialCommunityIcons
            name="food"
            color="rgba(0, 0, 0, 0)"
            size={20}
            style={styles.icon}
          />
          <TextInput
            placeholder="Masukkan Jenis Makanan"
            style={styles.input}
            onChangeText={setJenisMakanan}
            value={jenisMakanan}
          />
        </View>

        <Gap height={20} />
        <View style={styles.inputRow}>
          <Text style={styles.textInput}>Keterangan Tambahan</Text>
          <MaterialCommunityIcons
            name="text-box-plus-outline"
            color="rgba(0, 0, 0, 0)"
            size={20}
            style={styles.icon}
          />
          <TextInput
            placeholder="Masukkan Keterangan Tambahan"
            style={styles.input}
            onChangeText={setKeterangan}
            value={keterangan}
          />
        </View>

        {/* <Gap height={20} />
        <View style={styles.inputRow}>
          <Text style={styles.textInput}>Foto</Text>
          <MaterialCommunityIcons
            name="image-filter-center-focus"
            size={60}
            style={{paddingTop: 10, paddingLeft: 15}}
          />
        </View> */}

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

        <Gap height={20} />
        <Button
          title="Confirm"
          color="#263A29"
          textColor="white"
          onPress={() => setModalConfirmVisible(true)}
        />
        <CustomModal
          visible={modalConfirmVisible}
          onClose={() => setModalConfirmVisible(false)}
          onConfirm={handleConfirm}
        />
      </View>
    </SafeAreaView>
  );
};

export default Donation;

const styles = StyleSheet.create({
  modalConfirmContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalConfirmContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalConfirmTitle: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonConfirmContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  button: {
    padding: 10,
    marginLeft: 10,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: 'red',
  },
  confirmButton: {
    backgroundColor: 'green',
  },
  buttonText: {
    color: 'white',
  },
  // container
  container: {
    flex: 1,
    backgroundColor: '#F6F1E9',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: 'red',
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: '#E86A33',
  },
  inputContainer: {
    height: 620,
    width: '95%',
    marginTop: 20,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignSelf: 'center',
    top: -15,
    backgroundColor: '#41644A',
    borderRadius: 20,
    shadowColor: 'white',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  textInput: {
    color: '#fff',
    marginLeft: -10,
    fontSize: 20,
    padding: 0,
    fontWeight: 'bold',
    top: 5,
    paddingHorizontal: 15,
  },
  input: {
    color: 'white',
    fontSize: 20,
    height: 30,
    margin: 0,
    borderWidth: 1,
    borderColor: 'grey',
    padding: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    top: -15,
    paddingHorizontal: 15,
  },
  icon: {
    textAlign: 'right',
  },

  // Error Statement
  info: {
    padding: 5,
    backgroundColor: '#F6F1E9',
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
