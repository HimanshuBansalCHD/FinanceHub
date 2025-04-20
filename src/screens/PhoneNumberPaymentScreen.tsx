import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  Animated,
} from "react-native";
import DismissKeyboardView from "../components/DismissKeyboardView";

const screenHeight = Dimensions.get("window").height;

export default function PhoneNumberPayScreen({ navigation }: any) {
  const [phone, setPhone] = useState("");
  const [imageAnimation] = useState(new Animated.Value(0)); // Create an animated value

  useEffect(() => {
    // Reset image animation to original position when the component mounts
    Animated.timing(imageAnimation, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleFocus = () => {
    // Start the animation when the input is focused (editing starts)
    Animated.timing(imageAnimation, {
      toValue: 1, // Change the value to trigger the animation
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const handleBlur = () => {
    // Reset the animation when the input is blurred (editing ends)
    Animated.timing(imageAnimation, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const validateAndProceed = () => {
    if (!phone.match(/^[6-9]\d{9}$/)) {
      Alert.alert(
        "Invalid Phone Number",
        "Please enter a valid 10-digit number."
      );
      return;
    }

    // Create a basic UPI URI using phone number as VPA
    const upiId = `${phone}@upi`;
    const upiUri = `upi://pay?pa=${upiId}`;

    navigation.navigate("Pay", {
      scannedData: upiUri,
    });
  };

  // Interpolation to animate the background image style
  const imageStyle = {
    transform: [
      {
        scale: imageAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.1], // Scale the image when input is focused
        }),
      },
    ],
    opacity: imageAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0.8], // Slightly fade the image when focused
    }),
  };

  return (
    <DismissKeyboardView>
      <View style={styles.bannerContainer}>
        {/* Apply the animated image style */}
        <Animated.Image
          source={require("../../images/PayAndTrack.png")} // Replace with your image
          style={[styles.bannerImage, imageStyle]} // Combine static and animated styles
          resizeMode="cover"
        />
      </View>

      <View style={styles.container}>
        <Text style={styles.header}>Enter phone number</Text>

        <TextInput
          placeholder="Ex: 8861200351"
          style={styles.input}
          keyboardType="number-pad"
          maxLength={10}
          value={phone}
          onChangeText={setPhone}
          onFocus={handleFocus} // Start animation when focused
          onBlur={handleBlur} // Reset animation when blurred
        />

        <TouchableOpacity style={styles.payButton} onPress={validateAndProceed}>
          <Text style={styles.payButtonText}>Pay Now</Text>
        </TouchableOpacity>
      </View>
    </DismissKeyboardView>
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    height: screenHeight * 0.40,
    width: "100%",
  },
  bannerImage: {
    width: "100%",
    height: "105%",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    textAlign: "left",
    marginTop: -190,
    marginBottom: 30,
    fontWeight: "bold",
    color: "#5F259F",
  },
  input: {
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginTop: -5,
    marginBottom: 20,
    elevation: 2,
  },
  payButton: {
    backgroundColor: "#5F259F",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  payButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
