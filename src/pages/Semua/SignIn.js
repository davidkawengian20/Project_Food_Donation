import React, {useState, useRef} from 'react';
import {useFocusEffect, useEffect} from '@react-navigation/native';
import {
  View,
  Alert,
  Text,
  Image,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Animated,
  Easing,
} from 'react-native';
import {Backgrounds, BackgroundSignIn, Logo, Logo1} from '../../assets';
import {Gap, Button} from '../../components';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Halaman3 = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isError, setIsError] = useState(false);

  // SignUp (Akun Baru Teks Button)
  const SignUp = () => {
    navigation.navigate('SignUp');
  };

  // Error getar Animation
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

  const testing = () => {
    console.log('testing');
  };

  // Panel - Choose Role
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedButton, setSelectedButton] = useState(null);
  // Panel - Open
  const openModal = () => {
    setModalVisible(true);
    // console.log(selectedButton);
  };
  // Panel - Close
  const closeModal = () => {
    setModalVisible(false);
  };
  // Panel - Button Role
  const handleButtonClick = buttonName => {
    setSelectedButton(buttonName);
    closeModal();
  };

  // set email and password to empty string on screen focus
  // refresh
  useFocusEffect(
    React.useCallback(() => {
      setEmail('');
      setPassword('');
      setSelectedButton(null);
      setIsError(false);
    }, []),
  );

  const [errorName, setErrorName] = useState(null);
  // Button Login
  const handleLogin = () => {
    // check if email, password and role are not empty or only spaces
    if (!email.trim() && !password.trim() && !selectedButton) {
      startVibration(true);
      setIsError(true);
      setErrorName('Email, Password dan Role Tidak boleh Kosong !');

      return;
    }
    if (!email.trim() && !password.trim()) {
      startVibration(true);
      setIsError(true);
      setErrorName('Input Email dan Password tidak boleh Kosong !');
      return;
    }
    if (!email.trim() && !selectedButton) {
      startVibration(true);
      setIsError(true);
      setErrorName('Input Email dan Select Role tidak boleh Kosong!');
      return;
    }

    if (!password.trim() && !selectedButton) {
      startVibration(true);
      setIsError(true);
      setErrorName('Input Password dan Select Role tidak boleh Kosong!');
      return;
    }
    if (!email.trim()) {
      startVibration(true);
      setIsError(true);
      setErrorName('Input Email tidak boleh Kosong!');
      return;
    }
    if (!password.trim()) {
      startVibration(true);
      setIsError(true);
      setErrorName('Input Password tidak boleh Kosong!');
      return;
    }
    if (!selectedButton) {
      startVibration(true);
      setIsError(true);
      setErrorName(
        "Select Role tidak boleh Kosong !\n Click teks 'Click untuk Pilih Role'",
      );
      return;
    }

    // create request body with email and password input values
    const requestBody = {
      'input-role': selectedButton,
      'input-email': email,
      'input-password': password,
    };
    // Cek Data Input
    console.log(`Email : ${email}`);
    console.log(`Password : ${password}`);
    console.log(`Role : ${selectedButton}`);
    // Time out request data
    const timeoutPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('Request timed out'));
      }, 10000); // 5000 (5 detik)
    });

    Promise.race([
      fetch('https://fdonasi.site/foodDonation/public/mobile/login', {
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
      }),
      timeoutPromise,
    ])
      .then(response => response.text())
      .then(textData => {
        // handle response data
        console.log('Data yang terkirim : ');
        console.log(textData);

        if (textData.includes('ERROR')) {
          startVibration(true);
          setIsError(true);
          setErrorName('Anda Salah Memasukkan Email, Password atau Role !');
          return;
        }

        if (textData.includes('SUCCESS')) {
          const dataArray = textData.split('SUCCESS');
          const jsonString = dataArray[1];

          // to json format
          const jsonData = JSON.parse(jsonString);
          console.log('Data : ');
          console.log(jsonData);

          // tes print role
          console.log('User Role : ' + selectedButton);

          Alert.alert(
            'Login Success',
            'Selamat Datang di Aplikasi Food Donation.',
          );
          setErrorName(null);
          setIsError(false);

          // masuk ke halaman Donatur
          if (selectedButton == 'Donatur') {
            // redirect to HomeScreen on successful login and pass textData as parameter
            navigation.navigate('HomeDonatur', {jsonData});
          }

          // Masuk ke halaman Administrator
          if (selectedButton == 'Admin') {
            // redirect to HomeScreen on successful login and pass textData as parameter
            navigation.navigate('HomeAdmin', {jsonData});
          }

          // Masuk ke halaman kurir
          if (selectedButton == 'Kurir') {
            // redirect to HomeScreen on successful login and pass textData as parameter
            navigation.navigate('KurirHome', {jsonData});
          }
        }
      })
      .catch(error => {
        //console.error(error);
        Alert.alert('Error Message', error.message);
        return;
      });
  };

  return (
    <ImageBackground source={Backgrounds} style={style.container}>
      {/* Header */}
      <View style={style.header}>
        <Image source={Logo} style={style.Logo}></Image>
      </View>

      {/* footer Transparan */}
      <ScrollView
        contentContainerStyle={[style.footer, {}]}
        animation="fadeInUpBig">
        {/* Error */}
        {isError ? (
          <View>
            <View style={[style.info]}>
              <MaterialIcons name="error" color="red" size={20} />
              <View style={{flexDirection: 'column'}}>
                <Animated.Text
                  style={[
                    style.error,
                    isVibrating && {transform: [{translateX: translateXAnim}]},
                  ]}>
                  {errorName}
                </Animated.Text>
              </View>
            </View>
          </View>
        ) : null}

        {/* Input Container */}
        <View style={style.containerInput}>
          {/* Input - Email */}
          <View style={style.inputRow}>
            <Text style={style.textInput}>Email</Text>
            <MaterialCommunityIcons
              name="email-outline"
              color="rgba(248, 111, 3, 0)"
              size={20}
              style={style.icon}
            />
            <TextInput
              placeholder="Masukkan Email"
              style={style.input}
              onChangeText={setEmail}
              value={email}
              caretColor="red"
              // defaultValue="Hello World"
            />
          </View>
          {/* Input - Password */}
          <Gap height={5} />
          <View style={style.inputRow}>
            <Text style={style.textInput}>Password</Text>
            <MaterialCommunityIcons
              name="lock"
              color="rgba(248, 111, 3, 0)"
              size={20}
              style={style.icon}
            />
            <TextInput
              placeholder="Masukkan Password"
              style={style.input}
              onChangeText={setPassword}
              value={password}
              secureTextEntry={true}
            />
          </View>
          {/* Select - Role */}
          <Gap height={5} />
          <View style={{flexDirection: 'row'}}>
            <Text style={[style.textInput, {paddingTop: 15}]}>
              Login Sebagai :
            </Text>
            <TouchableOpacity onPress={openModal}>
              <Text
                style={[style.textInput, {paddingLeft: 25, color: 'yellow'}]}>
                {selectedButton || "'Click untuk Pilih Role'"}
              </Text>
            </TouchableOpacity>
          </View>
          {/* Panel - Select Role */}
          <Modal
            transparent={true}
            visible={isModalVisible}
            onRequestClose={closeModal}>
            <View style={style.modalContainer}>
              <View style={style.modalContent}>
                <Text style={style.modalText}>Pilih Salah Satu Button:</Text>
                <TouchableOpacity
                  style={style.button}
                  onPress={() => handleButtonClick('Admin')}>
                  <Text style={style.buttonText}>Admin</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={style.button}
                  onPress={() => handleButtonClick('Donatur')}>
                  <Text style={style.buttonText}>Donatur</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={style.button}
                  onPress={() => handleButtonClick('Kurir')}>
                  <Text style={style.buttonText}>Kurir</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={style.closeButton}
                  onPress={closeModal}>
                  <Text style={[style.buttonText, {color: 'white'}]}>
                    Tutup Panel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          {/* Button - Login */}
          <Gap height={25} />
          <Button
            title="Login"
            color="#F7941D"
            textColor="white"
            onPress={handleLogin}
          />
          {/* Teks Button - SignUp */}
          <View style={style.gantiakun}>
            <Text style={{color: 'white'}}>belum punya Akun? buat</Text>
            <TouchableOpacity onPress={SignUp}>
              <Text style={{fontWeight: 'bold', color: 'yellow'}}>
                {' '}
                Akun Baru
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Gambar Tambahan */}
        <View style={[style.header, {paddingTop: 40}]}>
          {isError ? null : <Image source={Logo1} style={style.Logo1}></Image>}
          {/* <Image source={Logo1} style={style.Logo1}></Image> */}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};
const {height} = Dimensions.get('screen');
const height_logo = height * 0.28;
const style = StyleSheet.create({
  // container
  container: {
    flex: 1,
  },

  // gambar tambahan Wallpaper
  header: {
    paddingTop: 80,
    paddingBottom: 5,
    paddingLeft: 10,
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Logo: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 110, // Set the desired width for the logo
    height: 105, // Set the desired height for the logo
    resizeMode: 'contain',
  },
  Logo1: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 190, // Set the desired width for the logo
    height: 140, // Set the desired height for the logo
    resizeMode: 'contain',
  },
  // Footer Transparant
  footer: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 50,
    alignItems: 'center',
    // backgroundColor: 'black',
  },

  // Error Statement
  info: {
    padding: 5,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'red',
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

  // Input Container
  containerInput: {
    height: 370,
    width: 350,
    paddingHorizontal: 0,
    alignSelf: 'center',
    paddingTop: 10,
    paddingLeft: 30,
    paddingRight: 30,
    backgroundColor: 'rgba(248, 111, 3, 0.3)',
    borderWidth: 0, // Lebar border
    borderColor: '#F86F03',
    borderRadius: 10,
  },
  textInput: {
    // marginTop: Platform.OS === 'ios' ? 0 : 0,
    fontSize: 17,
    marginLeft: -15,
    fontWeight: 'bold',
    paddingTop: 15,
    color: 'white',
  },
  input: {
    fontSize: 20,
    height: 30,
    margin: 0,
    borderWidth: 1,
    borderColor: 'white',
    padding: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    top: -15,
  },
  icon: {
    textAlign: 'right',
  },

  // style panel
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  button: {
    backgroundColor: 'yellow',
    padding: 20,
    paddingHorizontal: 40,
    margin: 10,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  closeButton: {
    backgroundColor: 'red',
    padding: 20,
    borderRadius: 10,
  },

  // Teks Button - Signup
  gantiakun: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 15,
    alignSelf: 'center',
  },
});

export default Halaman3;
