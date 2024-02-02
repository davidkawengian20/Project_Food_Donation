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

const History = ({route, navigation}) => {
  const {jsonData} = route.params;

  const [json_data_donasi, setJsonDataDonasi] = useState([]);
  const [isFotoProfile, setIsFotoProfile] = useState(false);
  const [idFoto, setIdFoto] = useState(null);
  const [idFotoSelesai, setIdFotoSelesai] = useState(null);
  const screenHeight = Dimensions.get('window').height;
  const modalHeight = screenHeight / 2; // Setengah tinggi layar perangkat

  const [dataKosong, setDataKosong] = useState(false);

  const foto = itemId => {
    const selectedItem = json_data_donasi.find(
      item => item.Donation_Image === itemId,
      item => item.Donation_Image_Done === itemId,
    );
    console.log(`Donasi : ${selectedItem.Donation_Image}`);
    console.log(`Donasi Selesai : ${selectedItem.Donation_Image_Done}`);
    setIdFotoSelesai(null);
    setIdFoto(selectedItem.Donation_Image);

    setIsFotoProfile(true);
  };
  const fotoSelesai = itemId => {
    const selectedItem = json_data_donasi.find(
      item => item.Donation_Image_Done === itemId,
    );
    console.log(`Donasi : ${selectedItem.Donation_Image}`);
    console.log(`Donasi Selesai : ${selectedItem.Donation_Image_Done}`);
    setIdFoto(null);
    setIdFotoSelesai(selectedItem.Donation_Image_Done);

    setIsFotoProfile(true);
  };

  useEffect(() => {
    const fetchDonationData = async () => {
      const requestBody = {
        'donatur-id': jsonData[0].Donatur_ID,
      };

      try {
        const response = await fetch(
          'https://fdonasi.site/foodDonation/public/mobile/donaturHistory',
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
        History
      </Text>
    </View>
  );

  const renderContent = () => {
    const gambarDonasi =
      'https://fdonasi.site/foodDonation/public/uploaded/images_donation/';
    const gambarDonasiSelesai =
      'https://fdonasi.site/foodDonation/public/uploaded/images_donation_done/';

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
                <View style={styles.tableRow} paddingBottom={12}>
                  <Text style={styles.tableCellLeft}>Proses Donasi</Text>
                  {item.Completed_At ? (
                    <Text
                      style={
                        styles.tableCellRight
                      }>{`(Proses Selesai) ${item.Completed_At} `}</Text>
                  ) : (
                    <Text
                      style={styles.tableCellRight}>{`(Dalam Proses)`}</Text>
                  )}
                </View>
                <TouchableOpacity
                  onPress={() => foto(item.Donation_Image)}
                  style={{marginRight: 260}}>
                  <Image
                    source={{uri: gambarDonasi + item.Donation_Image}}
                    style={styles.selectedImage}
                  />
                </TouchableOpacity>
                <View
                  style={styles.headerCard}
                  backgroundColor=""
                  textAlign="center"
                  paddingTop={20}>
                  <View>
                    <Text style={styles.itemName}>{item.Donation_Process}</Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.headerCard,
                    {
                      borderWidth: 1,
                      flexDirection: 'column',
                      borderRadius: 10,
                    },
                  ]}
                  backgroundColor=""
                  textAlign="left"
                  paddingTop={20}>
                  <View style={{alignSelf: 'baseline', marginLeft: 20}}>
                    <Text style={[styles.itemName, {textAlign: 'left'}]}>
                      {`Pesan Kurir (${item.Username})`}
                    </Text>
                  </View>
                  <View>
                    <TouchableOpacity
                      onPress={() => fotoSelesai(item.Donation_Image_Done)}>
                      <Image
                        source={{
                          uri: gambarDonasiSelesai + item.Donation_Image_Done,
                        }}
                        style={styles.selectedImage}
                      />
                    </TouchableOpacity>
                  </View>
                  <View
                    style={[styles.tableRow, {flexDirection: 'column'}]}
                    paddingBottom={12}>
                    <Text style={{color: '#05375a', fontSize: 12}}>
                      {item.Donation_Message}
                    </Text>
                  </View>
                </View>
                <View></View>
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
            {idFoto && (
              <Image
                source={{uri: gambarDonasi + idFoto}}
                style={styles.maximizedImage}
              />
            )}
            {idFotoSelesai && (
              <Image
                source={{uri: gambarDonasiSelesai + idFotoSelesai}}
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

export default History;
