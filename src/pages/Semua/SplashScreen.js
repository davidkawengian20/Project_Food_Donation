import {StyleSheet, View, Image} from 'react-native';
import React, {useEffect} from 'react';
import {Background} from '../../assets/images';

const SplashScreen = ({navigation}) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('SignIn');
    }, 5000);
  }, []);
  return (
    <View style={styles.container}>
      <Image source={Background} style={{flex: 1, resizeMode: 'cover'}} />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  BackgroundContainer: {
    width: '100%',
    height: '100%',
  },
});
