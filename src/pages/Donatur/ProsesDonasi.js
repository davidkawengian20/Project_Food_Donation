import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  Dimensions,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Octicons from 'react-native-vector-icons/Octicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const ProsesDonasi = ({route, navigation}) => {
  const {jsonData} = route.params;

  const [json_data_donasi, setJsonDataDonasi] = useState([]);
  const [isFotoProfile, setIsFotoProfile] = useState(false);
  const [idFoto, setIdFoto] = useState(null);
  const screenHeight = Dimensions.get('window').height;
  const modalHeight = screenHeight / 2; // Setengah tinggi layar perangkat
  const [dataKosong, setDataKosong] = useState(false);

  const foto = itemId => {
    const selectedItem = json_data_donasi.find(
      item => item.Donation_Image === itemId,
    );
    setIdFoto(selectedItem.Donation_Image);
    setIsFotoProfile(true);
  };

  useEffect(() => {
    const fetchDonationData = async () => {
      const requestBody = {
        'donatur-id': jsonData[0].Donatur_ID,
      };

      try {
        const response = await fetch(
          'https://fdonasi.site/foodDonation/public/mobile/listDonation',
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

        if (!response.ok) {
          throw new Error('Request failed');
        }

        const textData = await response.text();
        console.log(textData);

        if (textData.includes('ERROR')) {
          Alert.alert(
            'Error Message',
            'Sorry, access data class failed. Please try again.',
          );
        } else if (textData.includes('EMPTY ROW')) {
          Alert.alert(
            'Empty Record',
            'Sorry, there is no class you have registered.',
          );
        } else {
          const dataArray = textData.split('SUCCESS');
          const datadonasi = dataArray[1];
          const json_data_donasi = JSON.parse(datadonasi);
          setJsonDataDonasi(json_data_donasi);
        }
      } catch (error) {
        Alert.alert('Masih Kosong', 'Belum ada Donasi Masuk.');
        setDataKosong(true);
        return;
      }
    };

    fetchDonationData();
  }, [jsonData]);

  const closeFotoProfile = () => {
    setIsFotoProfile(false);
  };
  const testing = itemId => {
    const selectedItem = json_data_donasi.find(
      item => item.Donation_ID === itemId,
    );
    console.log(selectedItem.Donation_ID);
  };

  const handleConfirm = async itemId => {
    const selectedItem = json_data_donasi.find(
      item => item.Donation_ID === itemId,
    );
    console.log(selectedItem.Donation_ID);
    // Create a new FormData object
    const formData = new FormData();

    // Send the selected values to the server or use them as needed

    // Append data to formData
    formData.append('Donation_ID', selectedItem.Donation_ID);

    try {
      const response = await fetch(
        'https://fdonasi.site/foodDonation/public/mobile/sendToHistory/',
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
        Alert.alert('Donasi Berhasil', 'Donasi Tersimpan di Hisotry.');

        // Reset semua field input
        navigation.navigate('HomeDonatur', {jsonData});

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

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => navigation.navigate('HomeDonatur', {jsonData})}
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
        Proses Donasi
      </Text>
    </View>
  );

  const selectIconColor = status => {
    if (status === 'Menunggu Proses') {
      return 'green'; // Warna hijau untuk status 'Selesai'
    } else if (status === 'Proses Diterima dan Sedang Menunggu Proses Kurir') {
      return 'green'; // Warna hijau untuk status 'Selesai'
    } else if (status === 'Donasi Diproses Oleh Kurir') {
      return 'green'; // Warna hijau untuk status 'Selesai'
    } else if (status === 'Kurir Sedang Dalam Perjalanan') {
      return 'green'; // Warna hijau untuk status 'Selesai'
    } else if (status === 'Kurir Sampai Ditujuan') {
      return 'green'; // Warna hijau untuk status 'Selesai'
    } else {
      return 'grey'; // Warna abu-abu untuk status lainnya
    }
  };

  const renderContent = () => {
    const gambarDonasi =
      'https://fdonasi.site/foodDonation/public/uploaded/images_donation/';

    if (!json_data_donasi) {
      return (
        <View style={styles.content}>
          <Text>History Donasi Kosong.</Text>
        </View>
      );
    }

    return (
      <View style={styles.content} backgroundColor="#fff">
        <ScrollView>
          {dataKosong && (
            <View style={styles.itemContainer}>
              <Text style={{color: 'black'}}>Belum ada Donasi Masuk.</Text>
            </View>
          )}
          {json_data_donasi.map((item, index) => (
            <View key={index} style={styles.itemContainer}>
              <View style={styles.itemDetails}>
                <View style={styles.headerCard}>
                  <Text style={styles.itemName}>Donasi di buat pada</Text>

                  <View style={styles.IconViewClass}>
                    {item.Created_At ? (
                      <Text style={styles.itemName}>{item.Created_At}</Text>
                    ) : (
                      <Text style={styles.itemName}>Hari Tanggal</Text>
                    )}
                  </View>
                </View>
                <View
                  style={{
                    borderTopWidth: 1,
                    width: '100%',
                    borderColor: '#f7f0f7',
                  }}
                />
                <View style={styles.tableRow}>
                  <Text style={styles.tableCellLeft}>Detail Penjemputan</Text>
                  <Text style={styles.tableCellRight}>
                    {item.Pickup_Details}
                  </Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableCellLeft}>Jam berapa dimasak?</Text>
                  <Text style={styles.tableCellRight}>{item.Cook_Time}</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableCellLeft}>Jenis Makanan</Text>
                  <Text style={styles.tableCellRight}>{item.Type_of_Food}</Text>
                </View>
                <View style={styles.tableRow} paddingBottom={12}>
                  <Text style={styles.tableCellLeft}>Keterangan</Text>
                  <Text style={styles.tableCellRight}>
                    {item.Additional_Information}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => foto(item.Donation_Image)}
                  style={{alignItems: 'center'}}>
                  <Image
                    source={{uri: gambarDonasi + item.Donation_Image}}
                    style={styles.selectedImage}
                  />
                </TouchableOpacity>

                {/* Icon - Process */}
                <View
                  style={{
                    marginTop: 25,
                    flexDirection: 'row',
                    alignContent: 'center',
                    justifyContent: 'space-evenly',
                  }}>
                  <AntDesign
                    name="checkcircle"
                    size={24}
                    color={
                      item.Donation_Process ===
                      'Proses Diterima dan Sedang Menunggu Proses Kurir'
                        ? 'green'
                        : item.Donation_Process === 'Donasi Diproses Oleh Kurir'
                        ? 'green' // Change 'blue' to the color you want for this case
                        : item.Donation_Process ===
                          'Kurir Sedang Dalam Perjalanan'
                        ? 'green' // Change 'orange' to the color you want for this case
                        : item.Donation_Process === 'Kurir Sampai Ditujuan'
                        ? 'green' // Change 'red' to the color you want for this case
                        : 'grey' // Default color for other cases
                    }
                    style={{marginRight: 8}}
                  />
                  <Octicons
                    name="horizontal-rule"
                    size={25}
                    color={
                      item.Donation_Process === 'Donasi Diproses Oleh Kurir'
                        ? 'green' // Change 'blue' to the color you want for this case
                        : item.Donation_Process ===
                          'Kurir Sedang Dalam Perjalanan'
                        ? 'green' // Change 'orange' to the color you want for this case
                        : item.Donation_Process === 'Kurir Sampai Ditujuan'
                        ? 'green' // Change 'red' to the color you want for this case
                        : 'grey' // Default color for other cases
                    }
                    style={{marginRight: 8}}
                  />
                  <FontAwesome6
                    name="boxes-packing"
                    size={25}
                    color={
                      item.Donation_Process === 'Donasi Diproses Oleh Kurir'
                        ? 'green' // Change 'blue' to the color you want for this case
                        : item.Donation_Process ===
                          'Kurir Sedang Dalam Perjalanan'
                        ? 'green' // Change 'orange' to the color you want for this case
                        : item.Donation_Process === 'Kurir Sampai Ditujuan'
                        ? 'green' // Change 'red' to the color you want for this case
                        : 'grey' // Default color for other cases
                    }
                    style={{marginRight: 8}}
                  />
                  <Octicons
                    name="horizontal-rule"
                    size={25}
                    color={
                      item.Donation_Process === 'Kurir Sedang Dalam Perjalanan'
                        ? 'green' // Change 'orange' to the color you want for this case
                        : item.Donation_Process === 'Kurir Sampai Ditujuan'
                        ? 'green' // Change 'red' to the color you want for this case
                        : 'grey' // Default color for other cases
                    }
                    style={{marginRight: 8}}
                  />
                  <FontAwesome
                    name="motorcycle"
                    size={25}
                    color={
                      item.Donation_Process === 'Kurir Sedang Dalam Perjalanan'
                        ? 'green' // Change 'orange' to the color you want for this case
                        : item.Donation_Process === 'Kurir Sampai Ditujuan'
                        ? 'green' // Change 'red' to the color you want for this case
                        : 'grey' // Default color for other cases
                    }
                    style={{marginRight: 8}}
                  />
                  <Octicons
                    name="horizontal-rule"
                    size={25}
                    color={
                      item.Donation_Process === 'Kurir Sampai Ditujuan'
                        ? 'green' // Change 'red' to the color you want for this case
                        : 'grey' // Default color for other cases
                    }
                    style={{marginRight: 8}}
                  />
                  <FontAwesome6
                    name="people-carry-box"
                    size={25}
                    color={
                      item.Donation_Process === 'Kurir Sampai Ditujuan'
                        ? 'green' // Change 'red' to the color you want for this case
                        : 'grey' // Default color for other cases
                    }
                    style={{marginRight: 8}}
                  />
                </View>
                {/* Icon - Process */}

                <View
                  style={styles.headerCard}
                  textAlign="center"
                  paddingTop={20}>
                  <View>
                    <Text style={styles.itemName}>{item.Donation_Process}</Text>
                  </View>
                </View>
                {item.Donation_Process === 'Kurir Sampai Ditujuan' ? (
                  <View>
                    <TouchableOpacity
                      onPress={() => handleConfirm(item.Donation_ID)}
                      style={{
                        padding: 12,
                        backgroundColor: '#05375a',
                        borderRadius: 3,
                      }}>
                      <Text
                        style={[
                          styles.itemName,
                          {color: 'white', textAlign: 'center'},
                        ]}>
                        Donasi Selesai
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>
            </View>
          ))}
        </ScrollView>
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
            {gambarDonasi !== '' ? null : (
              <View
                style={{
                  height: '95%',
                  weight: '100%',
                  alignContent: 'center',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => setIsFotoProfile(true)}
                  style={{alignItems: 'center', justifyContent: 'center'}}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 20,
                      textAlign: 'center',
                      fontStyle: 'italic',
                      fontWeight: 'bold',
                    }}>
                    Anda Tidak Memiliki Gambar
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            {gambarDonasi !== '' && (
              <Image
                source={{uri: gambarDonasi + idFoto}}
                style={styles.maximizedImage}
              />
            )}
          </View>
        </Modal>
      </View>
    );
  };

  const renderFooter = () => (
    <View style={styles.footer}>
      <Text style={styles.footerText}>2023 © Food Donation</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderContent()}
      {renderFooter()}
    </View>
  );
};

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
    backgroundColor: '#F86F03',
  },
  selectedImage: {
    width: 50,
    height: 50,
    // alignSelf: 'center',
    marginVertical: 10,
    borderRadius: 10,
    marginLeft: 10,
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
    fontSize: 16,
    marginTop: 5,
  },
  tableCellRight: {
    color: '#05375a',
    flex: 1,
    textAlign: 'right',
    fontSize: 16,
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
    fontSize: 17,
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

export default ProsesDonasi;
