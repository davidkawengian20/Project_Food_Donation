import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
  Button,
  Image,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
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
          <Text style={{color: 'black'}}>Apakah Anda yakin ?</Text>
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
              <Text style={styles.buttonText}>Hapus</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

function DaftarKurir({route, navigation}) {
  const [jsonData, setJsonData] = useState(null);
  const [json_data_kwkm, setJsonDataKwkm] = useState(null);
  const [modalConfirmVisible, setModalConfirmVisible] = useState(false);

  const [nama, setNama] = useState('');
  const hapus = itemId => {
    const selectedItem = json_data_kwkm.find(item => item.Username === itemId);
    console.log('apakah yakin?');
    setNama(selectedItem.Username);
    setModalConfirmVisible(true);
    console.log('betul yakin?');
  };
  const deleteKurir = async () => {
    // Tambahkan data lainnya ke formData jika diperlukan
    const formData = new FormData();
    formData.append('user-role', 'Kurir');
    formData.append('username', nama);

    try {
      const response = await fetch(
        'https://fdonasi.site/foodDonation/public/mobile/deleteDonaturKurir/',
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
      console.log(textData);

      if (textData.includes('ERROR')) {
        Alert.alert(
          'Donasi Gagal',
          'Maaf, Proses Donasi gagal. Silakan coba lagi.',
        );
      } else if (textData.includes('Data Deleted Successfully')) {
        Alert.alert(
          `${nama} berhasil di Hapus`,
          'Anda tidak akan menemukannya lagi sebagai Daftar Kurir.',
        );
      }
    } catch (error) {
      console.error('Error:', error.message);
      Alert.alert(
        'Terjadi Kesalahan',
        'Maaf, terjadi kesalahan. Silakan coba lagi nanti.',
      );
    }
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
          'https://fdonasi.site/foodDonation/public/mobile/listKurirAdmin',
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
          Daftar Penyumbang
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
    const gambarDonasi = `https://fdonasi.site/foodDonation/public/uploaded/images_profile/`;
    return (
      <View style={styles.content} backgroundColor="#fff">
        <ScrollView>
          {json_data_kwkm.map((item, index) => (
            <View key={index} style={styles.itemContainer}>
              <View style={styles.itemDetails}>
                <View style={styles.headerCard}>
                  <Text style={styles.itemName}>{item.Username}</Text>
                  <TouchableOpacity style={styles.IconViewClass}>
                    <FontAwesome name="motorcycle" size={24} color="white" />
                  </TouchableOpacity>
                </View>

                <View style={{marginRight: 263}}>
                  <Image
                    source={{uri: gambarDonasi + item.Profile_Picture}}
                    style={styles.selectedImage}
                  />
                </View>

                <View style={styles.tableRow}>
                  <Text style={styles.tableCellLeft}>Nomor Telepon</Text>
                  <Text style={styles.tableCellRight}>{item.Phone_Number}</Text>
                </View>

                <View
                  style={styles.headerCard1}
                  backgroundColor=""
                  textAlign="center"
                  paddingTop={20}>
                  <TouchableOpacity onPress={() => hapus(item.Username)}>
                    <Text style={[styles.itemName, {color: 'red'}]}>
                      Delete
                    </Text>
                  </TouchableOpacity>
                  <CustomModal
                    visible={modalConfirmVisible}
                    onClose={() => setModalConfirmVisible(false)}
                    onConfirm={deleteKurir}
                  />
                </View>
              </View>
            </View>
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
  modalConfirmContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
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
  // conatiner
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
  selectedImage: {
    width: 200,
    height: 200,
    // alignSelf: 'center',
    marginVertical: 10,
    borderRadius: 10,
    marginLeft: 10,
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

export default DaftarKurir;
