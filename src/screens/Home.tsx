import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import DismissKeyboardView from '../components/DismissKeyboardView';

const screenHeight = Dimensions.get('window').height;

export default function HomeScreen({ navigation }: any) {
  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <DismissKeyboardView style={styles.container}>
      {/* Top Banner (15% of screen height) */}
      <View style={styles.bannerContainer}>
        <Image
          source={require("../../images/FinHubBg3.png")}// Replace with your image
          style={styles.bannerImage}
          resizeMode="cover"
        />
      </View>

      {/* Action Tiles */}
      <View style={styles.tilesContainer}>
        <TouchableOpacity
          style={styles.tile}
          onPress={() => navigation.navigate('QRCodeScanner')}
        >
          <Text style={styles.tileText}>Scan QR</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tile}
          onPress={() => navigation.navigate('PhoneNumberPayScreen')}
        >
          <Text style={styles.tileText}>Pay via Phone Number</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tile}
          onPress={() => navigation.navigate('UnderDevelopmentScreen')}
        >
          <Text style={styles.tileText}>Split Hub</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tile}
          onPress={() => navigation.navigate('UnderDevelopmentScreen')}
        >
          <Text style={styles.tileText}>Analytics Hub</Text>
        </TouchableOpacity>

      </View>
    </DismissKeyboardView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bannerContainer: {
    height: screenHeight * 0.25,
    width: '100%',
  },
  bannerImage: {
    width: '100%',
    height: '130%',
  },
  tilesContainer: {
    flex: 1,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 20,
  },
  tile: {
    backgroundColor: '#E6E6FA',
    borderRadius: 20,
    width: '45%',
    height: 190,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 9,
  },
  tileText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#5F259F',
    textAlign: 'center',
  },
});
