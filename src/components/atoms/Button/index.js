import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';

const Button = ({
  title,
  color = '##F7941D',
  textColor = '#020202',
  mL,
  mT,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View style={styles.container(color)}>
        <Text style={styles.text(textColor)}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  container: (color, pdL, pH, mH) => ({
    height: 40,
    backgroundColor: color,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 50,
    borderRadius: 30,
  }),
  text: textColor => ({
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    color: textColor,
    textAlign: 'center',

    fontWeight: 'bold',
  }),
});
