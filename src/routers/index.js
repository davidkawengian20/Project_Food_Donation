import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  Halaman1,
  Halaman2,
  SplashScreen,
  SignIn,
  SignUp,
  HomeDonatur,
  History,
  Donation,
  Profile,
  ChangePassword,
  DonasiMasukAdmin,
  HomeAdmin,
  InputData,
  Koordinat,
  DonasiMasukKurir,
  KurirHome,
  EditProfile,
  Halaman3,
  Halaman4,
  SignUpKurir,
  AmbilDonasi,
  ProsesDonasi,
  DaftarDonatur,
  DaftarKurir,
} from '../pages';

const Stack = createNativeStackNavigator();

const index = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="DaftarKurir"
        component={DaftarKurir}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="DaftarDonatur"
        component={DaftarDonatur}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="Halaman1"
        component={Halaman1}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="Halaman4"
        component={Halaman4}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SignIn"
        component={SignIn}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="ProsesDonasi"
        component={ProsesDonasi}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Halaman3"
        component={Halaman3}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="AmbilDonasi"
        component={AmbilDonasi}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SignUpKurir"
        component={SignUpKurir}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Halaman2"
        component={Halaman2}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="KurirHome"
        component={KurirHome}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="DonasiMasukKurir"
        component={DonasiMasukKurir}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Koordinat"
        component={Koordinat}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="InputData"
        component={InputData}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="HomeAdmin"
        component={HomeAdmin}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="DonasiMasukAdmin"
        component={DonasiMasukAdmin}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Donation"
        component={Donation}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="History"
        component={History}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="HomeDonatur"
        component={HomeDonatur}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default index;
