import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Alert,
} from "react-native";
import DismissKeyboardView from "../components/DismissKeyboardView";
import { isExistingUser, getUserIdFromEmail } from "../utils/common";

export default function SmartAuthScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email.trim());
  };

  const handleContinue = async () => {
    try {
      if (await isExistingUser(null, email)) {
        navigation.navigate("Home", { email });
      } else {
        navigation.navigate("Register", { email });
      }
    } catch (err) {
      const error = err as Error;
      Alert.alert("Error", error.message);
    }
  };

  const isEmailValid = isValidEmail(email);

  return (
    <DismissKeyboardView>
      <ImageBackground
        source={require("../../images/Background.jpeg")}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>Welcome to FinanceHub</Text>
          <TextInput
            placeholder="Enter your email"
            placeholderTextColor="#ccc"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={[styles.button, !isEmailValid && styles.buttonDisabled]}
            onPress={handleContinue}
            disabled={!isEmailValid}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </DismissKeyboardView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 30,
    margin: 20,
    borderRadius: 12,
  },
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.2)",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#1a73e8",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "gray",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
