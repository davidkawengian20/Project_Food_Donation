import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Zocial from 'react-native-vector-icons/Zocial';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

function Profile({route, navigation}) {
  const {jsonData} = route.params;
  const profileData = jsonData;
  const [back, setBack] = useState('');

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

  const imageUrl = `https://fdonasi.site/foodDonation/public/uploaded/images_profile/${profileData[0].Profile_Picture}`;

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(back, {
              jsonData: profileData,
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
          Profile
        </Text>
      </View>
    );
  };

  const renderContent = () => {
    return (
      <View style={styles.containerprofile}>
        <View style={styles.iconContainer}>
          <View style={styles.prof}>
            {profileData[0].Profile_Picture ? (
              <Image source={{uri: imageUrl}} style={styles.profileImage} />
            ) : (
              <Ionicons name="person-circle-outline" size={200} color="#555" />
            )}
          </View>
        </View>

        <View style={styles.containerText}>
          <FontAwesome5 name="user-alt" size={24} style={styles.icontext} />
          <View style={styles.textinputcontainer}>
            <Text style={styles.textdata}>{profileData[0].Username}</Text>
          </View>
        </View>

        <View style={styles.containerText}>
          <Zocial name="email" size={24} style={styles.icontext} />
          <View style={styles.textinputcontainer}>
            <Text style={styles.textdata}>{profileData[0].Email}</Text>
          </View>
        </View>
        {profileData[0].Address && (
          <View>
            <View style={styles.containerText}>
              <Entypo name="address" size={24} style={styles.icontext} />
              <View style={styles.textinputcontainer}>
                <Text style={styles.textdata}>{profileData[0].Address}</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.containerText}>
          <Ionicons
            name="logo-whatsapp"
            size={24}
            style={[styles.icontext, {color: 'green'}]}
          />
          <View style={styles.textinputcontainer}>
            <Text style={styles.textdata}>{profileData[0].Phone_Number}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.submit, {marginTop: 0, backgroundColor: 'red'}]}
          onPress={() =>
            navigation.navigate('EditProfile', {
              jsonData: profileData,
            })
          }>
          <Text style={{color: 'white', fontWeight: 'bold'}}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderFooter = () => {
    return (
      <View style={styles.footer}>
        <Text style={styles.footerText}>2023 © Food Donatuion Unklab</Text>
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
  container: {
    flex: 1,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  submit: {
    padding: 10,
    backgroundColor: '#F7941D',
    alignItems: 'center',
    marginBottom: 5,
    marginTop: 30,
    borderRadius: 10,
    marginHorizontal: 30,
  },
  icontext: {
    color: '#05375a',
    marginLeft: 20,
  },
  prof: {
    backgroundColor: 'grey',
    borderRadius: 100, // Untuk gambar bundar
    borderWidth: 3,
    borderColor: 'grey',
    marginBottom: 40,
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100, // Untuk gambar bundar
  },
  containerText: {
    flexDirection: 'row',
  },

  textinputcontainer: {},
  header: {
    flexDirection: 'row',
    backgroundColor: 'red',
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: '#05375a',
  },
  headerText: {
    fontSize: 20,
    color: '#fff',
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
  containerprofile: {
    flex: 1,

    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    // borderBottomLeftRadius: 20,
    // borderBottomRightRadius: 20,
    marginTop: 30,
  },
  iconContainer: {
    marginBottom: 20,
    marginTop: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: '#05375a',
    fontWeight: 'bold',
    marginBottom: 5,
    marginLeft: 20,
  },
  textdata: {
    fontSize: 16,
    color: '#05375a',
    //fontWeight: 'bold',
    marginBottom: 20,
    marginLeft: 30,
    fontSize: 20,
  },
});

export default Profile;
