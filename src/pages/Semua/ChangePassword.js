import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  Text,
  View,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Gap, Button} from '../../components';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ChangePassword = ({navigation, route}) => {
  const {jsonData} = route.params;
  const [back, setBack] = useState('');
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  console.log('sekarang ada di Home ChangePassword' + jsonData[0].Email);
  console.log(jsonData);

  // set oldPass and newPass to empty string on screen focus
  //   useFocusEffect(
  //     React.useCallback(() => {
  //         setOldPass('');
  //       setNewPass('');
  //     }, []),
  //   );

  useEffect(() => {
    console.log('sekarang ada di Profile Donatur');
    console.log(jsonData);
    console.log('email: ' + jsonData[0].Email);
    if (jsonData[0].Role === 'Donatur') {
      setBack('HomeDonatur');
    }
    if (jsonData[0].Role === 'Kurir') {
      setBack('KurirHome');
    }
    if (jsonData[0].Role === 'Admin') {
      setBack('HomeAdmin');
    }
  }, [jsonData]);

  const handleSignIn = () => {
    // check if old pass and new pass are not empty or only spaces
    if (!oldPass.trim() && !newPass.trim()) {
      Alert.alert(
        'Error Message',
        'Input old password and new password fields cannot be empty or contain only spaces.',
      );
      return;
    }

    if (oldPass === newPass) {
      Alert.alert(
        'Error Message',
        'Input password fields must be different from the previous one.',
      );
      return;
    }

    if (!oldPass.trim()) {
      Alert.alert(
        'Error Message',
        'Input old password field cannot be empty or contain only spaces.',
      );
      return;
    }

    if (!newPass.trim()) {
      Alert.alert(
        'Error Message',
        'Input new password field cannot be empty or contain only spaces.',
      );
      return;
    }

    // create request body with email and password input values
    const requestBody = {
      'input-old-password': oldPass,
      'input-new-password': newPass,
      'email-user': jsonData[0].Email,
      'input-role': jsonData[0].Role,
    };

    // Time out request data
    const timeoutPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('Request timed out.'));
      }, 5000); // 5000 (5 detik)
    });

    Promise.race([
      fetch('https://fdonasi.site/foodDonation/public/mobile/changePassword', {
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
        console.log(textData);

        // check if textData contains "ERROR"
        if (textData.includes('ERROR')) {
          // handle error case
          //console.error("Login failed:", textData);
          Alert.alert(
            'Error Message',
            'Sorry, change password failed. Please try again.',
          );
          return;
        }

        // check if textData contains "INCORRECT"
        if (textData.includes('INCORRECT')) {
          // handle INCORRECT case
          Alert.alert(
            'Error Message',
            'Sorry, you put incorrect old password. Please try again.',
          );
          return;
        }
        // Check if old password matches the current password
        if (oldPass !== jsonData[0].Password) {
          Alert.alert(
            'Error Message',
            'The old password does not match the current password. Please try again.',
          );
          return;
        }

        if (textData.includes('Change Password Success')) {
          Alert.alert(
            'Password Changed',
            'Student password has been changed successfully. Please sign in with the new password.',
          );
          // redirect to SignInScreen on successful change password
          navigation.navigate('SignIn');
        }
      })
      .catch(error => {
        //console.error(error);
        Alert.alert('Error Message', error.message);
        return;
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(back, {
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
          Change Password
        </Text>
      </View>
      {/* <Image source={BackgroundSignIn} style={styles.backgroundImage} /> */}
      <MaterialCommunityIcons
        name="shield-lock-outline"
        size={100}
        color="#D7E9B9"
        style={{marginBottom: 70, textAlign: 'center', marginTop: 120}}
      />

      <View style={styles.inputall}>
        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <Text style={styles.textInput}>Old Password</Text>
            <MaterialCommunityIcons
              name="lock-alert-outline"
              color="#F2E3DB"
              size={20}
              style={styles.icon}
            />
            <TextInput
              placeholder="Masukkan Password Lama"
              style={styles.input}
              onChangeText={setOldPass}
              value={oldPass}
              caretColor="red"
            />
          </View>
          <Gap height={20} />
          <View style={styles.inputRow}>
            <Text style={styles.textInput}>New Password</Text>
            <MaterialCommunityIcons
              name="lock-reset"
              color="#F2E3DB"
              size={20}
              style={styles.icon}
            />
            <TextInput
              placeholder="Masukkan Pasword Baru"
              style={styles.input}
              onChangeText={setNewPass}
              value={newPass}
              secureTextEntry={true}
            />
          </View>

          <Gap height={20} />
          <Button
            title="Change Password"
            color="#85A389"
            textColor="#1A4D2E"
            onPress={handleSignIn}
          />
          {/* <Gap height={10} /> */}
          {/* <Button
            title="RegiTesster"
            color="transparent"
            textColor="white"
            onPress={goSignIn}
          /> */}
        </View>
      </View>
    </View>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    backgroundColor: 'red',
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: '#263A29',
  },
  container: {
    // height: 600,
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#41644A',
  },
  inputContainer: {
    height: 300,
    width: 300,
    paddingTop: 50,
    paddingHorizontal: 10,
    // backgroundColor: 'red',
  },
  inputall: {
    backgroundColor: '#263A29',
    height: 350,
    width: 350,
    paddingLeft: 25,
    padding: 0,
    borderRadius: 10,
    paddingBottom: 20,
    alignSelf: 'center',
  },
  textInput: {
    fontSize: 17,
    marginLeft: -15,
    fontWeight: 'bold',
    paddingTop: 15,
  },
  icon: {
    textAlign: 'right',
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
  inputRow: {},
  // backgroundImage: {
  //   position: 'absolute',
  //   width: '100%',
  //   height: '100%',
  //   resizeMode: 'cover',
  // },
});
