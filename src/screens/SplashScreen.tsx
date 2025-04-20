import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';

export default function SplashScreen({ navigation }: any) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, 2000);

    return () => clearTimeout(timer); // cleanup
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../images/NewSplashScreen.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    position: 'absolute', // Position the image absolutely to cover the entire screen
    top: 0, // Align the image to the top
    left: 0, // Align the image to the left
    width: '100%', // Ensures image takes full width of the screen
    height: '100%', // Ensures image takes full height of the screen
  },
});
