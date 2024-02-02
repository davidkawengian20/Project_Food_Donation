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
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useNavigationState} from '@react-navigation/native';
import {home1} from '../../assets';

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

const KurirHome = ({navigation, route}) => {
  // cara mendapatkan data dari parameter
  const {jsonData} = route.params;

  console.log('sekarang ada di Home Kurir' + jsonData[0].email);
  console.log(jsonData);

  const list = () => {
    navigation.navigate('HomeAdmin');
  };
  const signIn = () => {
    navigation.navigate('SignIn');
  };
  const ChangePassword = () => {
    navigation.navigate('ChangePassword', {jsonData: jsonData});
  };
  const Profile = () => {
    navigation.navigate('Profile', {jsonData: jsonData});
    // {navigation.navigate('ProfileDonatur', {uid: uid})
    // }
  };
  const AmbilDonasi = () => {
    navigation.navigate('AmbilDonasi', {jsonData: jsonData});
    // {navigation.navigate('ProfileDonatur', {uid: uid})
    // }
  };

  const DonasiMasukKurir = () => {
    navigation.navigate('DonasiMasukKurir', {jsonData: jsonData});
  };
  const [modalConfirmVisible, setModalConfirmVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* header */}
      <View style={styles.headercontainer}>
        <Text style={{color: '#fff'}}>Kurir Food Donation</Text>
        {/* <Text style={styles.headerText}>{`${nama}`}</Text> */}
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
          paddingBottom: 60,
          color: '#606C5D',
          paddingHorizontal: 50,
        }}>
        Ayo!, bantu Rumah makan memberikan Donasi untuk yang membuthkan
      </Text>
      <View style={styles.content}>
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={DonasiMasukKurir}>
            <MaterialCommunityIcons
              name="format-list-group"
              size={40}
              color="#B31312"
            />
            <Text style={styles.menuItemText}>Donasi Masuk</Text>
          </TouchableOpacity>
          {/* <Text style={styles.menuItemKet}>jangan lupa update WKM!</Text> */}
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity title style={styles.menuItem} onPress={Profile}>
            <FontAwesome name="drivers-license-o" size={40} color="#B31312" />
            <Text style={styles.menuItemText}>Profile</Text>
          </TouchableOpacity>
          {/* <Text style={styles.menuItemKet}>WKM siap</Text> */}
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity title style={styles.menuItem} onPress={AmbilDonasi}>
            <FontAwesome5 name="people-carry" size={40} color="#B31312" />
            <Text style={styles.menuItemText}>Ambil Donasi</Text>
          </TouchableOpacity>
          {/* <Text style={styles.menuItemKet}>WKM siap</Text> */}
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={ChangePassword}>
            <MaterialCommunityIcons
              name="onepassword"
              size={40}
              color="#B31312"
            />
            <Text style={styles.menuItemText}>Change Password</Text>
          </TouchableOpacity>
          {/* <Text style={styles.menuItemKet}>menu untuk anda mengubah password</Text> */}
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setModalConfirmVisible(true)}>
            <MaterialCommunityIcons
              name="location-exit"
              size={40}
              color="#B31312"
            />
            <Text style={styles.menuItemText}>Exit</Text>
          </TouchableOpacity>
          {/* <Text style={styles.menuItemKet}>menu untuk keluar halaman dan kembali ke login</Text> */}
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

export default KurirHome;

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
    backgroundColor: '#EEE2DE',
  },
  headercontainer: {
    backgroundColor: '#2B2A4C',
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
    backgroundColor: '#fff',
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
    color: '#EA906C',
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
