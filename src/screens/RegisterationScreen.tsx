import React, { useState } from "react";
import {
  TextInput,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  TouchableOpacity,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { setDocument } from "../utils/FirebaseUtil";
import { USER_COLLECTION_NAME } from "../utils/Constants";
import { getUserIdFromEmail } from "../utils/common";

const screenHeight = Dimensions.get("window").height;

export default function RegisterScreen({ navigation, route }: any) {
  const { email: initialEmail = "" } = route.params || {};
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [imageAnimation] = useState(new Animated.Value(0));
  const [loading, setLoading] = useState(false); // New state to track processing

  const handleFocus = () => {
    Animated.timing(imageAnimation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const handleBlur = () => {
    Animated.timing(imageAnimation, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const handleRegister = async () => {
    setError("");
    setLoading(true); // Start loading state

    Keyboard.dismiss(); // Hide the keyboard when the register button is pressed

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false); // Stop loading if error occurs
      return;
    }

    try {
      const userId = await getUserIdFromEmail(email);
      await createUserWithEmailAndPassword(auth, email, password);
      await setDocument(
        USER_COLLECTION_NAME,
        {
          emailId: email,
          password: password,
        },
        userId
      );
      navigation.navigate("AdditionalInfomrationFoam", { email });
    } catch (err: any) {
      setError(err.message);
      setLoading(false); // Stop loading if error occurs
    }
  };

  const handleInputChange = (
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    return (value: string) => {
      setter(value);
      if (error) setError("");
    };
  };

  const imageStyle = {
    transform: [
      {
        scale: imageAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.1],
        }),
      },
    ],
    opacity: imageAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0.8],
    }),
    zIndex: -1,
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          {/* Animated background image */}
          <View style={styles.bannerContainer}>
            <Animated.Image
              source={require("../../images/RegisterScreen.png")}
              style={[styles.bannerImage, imageStyle]}
              resizeMode="cover"
            />
          </View>

          {/* Form content */}
          <View style={styles.formContainer}>
            <Text style={styles.header}>Register</Text>

            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={handleInputChange(setEmail)}
              style={[styles.input, styles.readOnlyInput]}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={false}
            />

            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={handleInputChange(setPassword)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              style={styles.input}
              secureTextEntry
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity
              style={[styles.payButton, loading && styles.payButtonLoading]} // Apply loading style
              onPress={handleRegister}
              disabled={loading} // Disable button during loading
            >
              {loading ? (
                <Text style={styles.payButtonText}>Processing...</Text>
              ) : (
                <Text style={styles.payButtonText}>Register</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  bannerContainer: {
    height: screenHeight * 0.3,
    width: "100%",
    position: "absolute",
    top: 20,
    left: 0,
    zIndex: -1,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  formContainer: {
    flex: 1,
    padding: 20,
    marginTop: screenHeight * 0.25, // Push below the banner
  },
  header: {
    top: 75,
    fontSize: 26,
    textAlign: "left",
    marginBottom: 30,
    fontWeight: "bold",
    color: "#5F259F",
  },
  input: {
    top: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginVertical: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  readOnlyInput: {
    backgroundColor: "#f0f0f0",
    color: "#888",
  },
  error: {
    marginTop: 10,
    color: "red",
    textAlign: "center",
    marginBottom: 10,
    fontSize: 14,
    top: 50,
  },
  payButton: {
    top: 50,
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
  payButtonLoading: {
    backgroundColor: "#B4A1E1", // Grey color when loading
  },
});
