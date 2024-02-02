import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  BackHandler,
  ImageBackground,
  Image,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';

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
          <Text style={{color: 'black'}}>Apakah Anda Yakin Ingin Keluar?</Text>
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
              <Text style={styles.buttonText}>Ya</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const HomeAdmin = ({navigation, route}) => {
  const {jsonData} = route.params;

  console.log('sekarang ada di Home Donatur' + jsonData[0].email);
  console.log(jsonData);

  this.state = {
    jsonData: jsonData,
  };
  console.log('email: ' + jsonData[0].email);

  const signIn = () => {
    navigation.navigate('SignIn');
  };
  const akun = () => {
    navigation.navigate('ProfileDonatur');
    // {navigation.navigate('ProfileDonatur', {uid: uid})
    // }
  };
  const InputData = () => {
    navigation.navigate('InputData', {jsonData: jsonData});
  };
  const SignUpKurir = () => {
    navigation.navigate('SignUpKurir', {jsonData: jsonData});
  };
  const Koordinat = () => {
    navigation.navigate('Koordinat', {jsonData: jsonData});
  };
  const DonasiMasukAdmin = () => {
    navigation.navigate('DonasiMasukAdmin', {jsonData: jsonData});
  };
  const DaftarDonatur = () => {
    navigation.navigate('DaftarDonatur', {jsonData: jsonData});
  };
  const DaftarKurir = () => {
    navigation.navigate('DaftarKurir', {jsonData: jsonData});
  };

  const [modalConfirmVisible, setModalConfirmVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* header */}
      <View style={styles.headercontainer}>
        <View style={{flexDirection: 'row'}}>
          <Text style={{color: '#fff'}}>administrator Food Donation</Text>
          <TouchableOpacity
            onPress={() => setModalConfirmVisible(true)}
            style={{marginLeft: 130}}>
            <MaterialCommunityIcons
              name="location-exit"
              size={35}
              color="white"
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerText}>{jsonData[0].Username}</Text>
      </View>

      <Text
        style={{
          textAlign: 'center',
          color: 'black',
          color: '#112B3C',
          fontSize: 25,
          alignSelf: 'center',
          paddingBottom: 0,
          paddingTop: 40,
        }}>
        Want to Share Food?
      </Text>

      <Text
        style={{
          textAlign: 'center',
          paddingBottom: 40,
          color: '#D61C4E',
          paddingHorizontal: 50,
        }}>
        Ayo!, bantu Rumah makan memberikan Donasi untuk yang membuthkan
      </Text>
      <View style={styles.content}>
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={InputData}>
            <MaterialCommunityIcons
              name="playlist-plus"
              size={40}
              color="#FF961D"
            />
            <Text style={styles.menuItemText}>Input Data</Text>
          </TouchableOpacity>
          <Text style={styles.menuItemKet}>Data Warga Kurang Mampu</Text>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity title style={styles.menuItem} onPress={SignUpKurir}>
            <Ionicons name="person-add" size={40} color="#FC6E51" />
            <Text style={styles.menuItemText}>Tambah Kurir</Text>
          </TouchableOpacity>
          <Text style={styles.menuItemKet}>Daftarkan Kurir Baru</Text>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity title style={styles.menuItem} onPress={Koordinat}>
            <MaterialIcons name="location-history" size={40} color="#FC6E51" />
            <Text style={styles.menuItemText}>Koordinat</Text>
          </TouchableOpacity>
          <Text style={styles.menuItemKet}>Koordinat Warga Kurang Mampu</Text>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={DonasiMasukAdmin}>
            <Ionicons name="document-text" size={40} color="#FC6E51" />
            <Text style={styles.menuItemText}>Donasi Masuk</Text>
          </TouchableOpacity>
          <Text style={styles.menuItemKet}>Donasi dari User</Text>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={DaftarDonatur}>
            <Ionicons name="restaurant" size={40} color="#FC6E51" />
            <Text style={styles.menuItemText}>Daftar Donatur</Text>
          </TouchableOpacity>
          <Text style={styles.menuItemKet}>Daftar Semua Donatur</Text>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={DaftarKurir}>
            <Fontisto name="motorcycle" size={40} color="#FC6E51" />
            <Text style={styles.menuItemText}>Daftar Kurir</Text>
          </TouchableOpacity>
          <Text style={styles.menuItemKet}>Daftar Semua Kurir</Text>
        </View>

        <CustomModal
          visible={modalConfirmVisible}
          onClose={() => setModalConfirmVisible(false)}
          onConfirm={signIn}
        />
      </View>
    </View>
  );
};

export default HomeAdmin;

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

  // conatiner
  container: {
    flex: 1,
    backgroundColor: '#FFE5B4',
  },
  headercontainer: {
    backgroundColor: '#FF961D',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    marginBottom: 10,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },

  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  menuItem: {
    width: '100%',
    height: 105,
    margin: 0,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    backgroundColor: '#F3F0D7',
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  menuItemText: {
    color: '#05375a',
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  menuItemKet: {
    color: '#D61C4E',
    textAlign: 'center',
    marginHorizontal: 0,

    alignSelf: 'center',
  },
  content: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 60,
    marginTop: 0,
  },
  menuContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '40%',
    marginBottom: 10,
    paddingBottom: 20,
  },
});
