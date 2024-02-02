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

const HomeDonatur = ({navigation, route}) => {
  // cara mendapatkan data dari parameter
  const {jsonData} = route.params;

  console.log('sekarang ada di Home Donatur' + jsonData[0].Username);
  console.log(jsonData);

  const history = () => {
    navigation.navigate('History', {jsonData: jsonData});
  };
  const procesDonasi = () => {
    navigation.navigate('ProsesDonasi', {jsonData: jsonData});
  };
  const signIn = () => {
    navigation.navigate('SignIn');
  };
  const ChangePassword = () => {
    navigation.navigate('ChangePassword', {jsonData: jsonData});
  };
  const Profile = () => {
    navigation.navigate('Profile', {jsonData: jsonData});
  };
  const Donation = () => {
    navigation.navigate('Donation', {jsonData: jsonData});
  };
  const [modalConfirmVisible, setModalConfirmVisible] = useState(false);
  return (
    <View style={styles.container}>
      {/* header */}
      <View style={styles.headercontainer}>
        <Text style={{fontSize: 25, fontWeight: 'bold', color: 'white'}}>
          Food Donation
        </Text>
        {/* <Text style={styles.headerText}>{`${nama}`}</Text> */}
        <Text style={styles.headerText}>
          Selamat Datang {jsonData[0].Username}
        </Text>
      </View>

      <Text
        style={{
          textAlign: 'center',
          color: 'black',
          color: '#000',
          fontSize: 25,
          alignSelf: 'center',
          paddingBottom: 0,
          paddingTop: 10,
        }}>
        Want to Share Food?
      </Text>

      <Text
        style={{
          textAlign: 'center',
          paddingBottom: 30,
          color: '#B7B7B7',
          paddingHorizontal: 50,
        }}>
        Mari berdonasi untuk membantu orang yang membutuhkan makanan diKelurahan
        Airmadidi Atas
      </Text>
      <View style={styles.content}>
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={Donation}>
            <Icon name="fast-food" size={40} color="#BA704F" />
            <Text style={styles.menuItemText}>Donation</Text>
          </TouchableOpacity>
          <Text style={styles.menuItemKet}>Make a donation</Text>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={history}>
            <MaterialCommunityIcons name="history" size={40} color="#BA704F" />
            <Text style={styles.menuItemText}>History</Text>
          </TouchableOpacity>
          <Text style={styles.menuItemKet}>View History</Text>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={procesDonasi}>
            <MaterialCommunityIcons
              name="clock-start"
              size={40}
              color="#BA704F"
            />
            <Text style={styles.menuItemText}>Process</Text>
          </TouchableOpacity>
          <Text style={styles.menuItemKet}>View Process</Text>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity title style={styles.menuItem} onPress={Profile}>
            <MaterialCommunityIcons
              name="account-circle"
              size={40}
              color="#BA704F"
            />
            <Text style={styles.menuItemText}>Profile</Text>
          </TouchableOpacity>
          <Text style={styles.menuItemKet}>View Profile</Text>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={ChangePassword}>
            <MaterialCommunityIcons
              name="shield-lock-outline"
              size={40}
              color="#BA704F"
            />
            <Text style={styles.menuItemText}>Change Password</Text>
          </TouchableOpacity>
          <Text style={styles.menuItemKet}>User Change Password</Text>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setModalConfirmVisible(true)}>
            <MaterialCommunityIcons
              name="location-exit"
              size={40}
              color="#BA704F"
            />
            <Text style={styles.menuItemText}>Exit</Text>
          </TouchableOpacity>
          <Text style={styles.menuItemKet}>User Quit</Text>
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
export default HomeDonatur;

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
    backgroundColor: '#fff',
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
    color: '#4D4D4D',
    fontSize: 17,
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
    shadowColor: 'black',
    backgroundColor: '#F5F5F5',
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
    color: '#B7B7B7',
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
