import React, { useState } from "react";
import { TextInput, Button, Text, StyleSheet } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import DismissKeyboardView from "../components/DismissKeyboardView";
import { setDocument } from "../utils/FirebaseUtil";
import { USER_COLLECTION_NAME } from "../utils/Constants";
import { getUserIdFromEmail } from "../utils/common";

export default function RegisterScreen({ navigation, route }: any) {
  const { email: initialEmail = "" } = route.params || {};
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setError(""); // clear any previous error

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      const userId = await getUserIdFromEmail(email);
      await createUserWithEmailAndPassword(auth, email, password);
      await setDocument(
        USER_COLLECTION_NAME,
        {
          email,
          password,
        },
        userId
      );
      navigation.navigate("AdditionalInfomrationFoam", { email });
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleInputChange = (
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    return (value: string) => {
      setter(value);
      if (error) setError(""); // clear error when user types again
    };
  };

  return (
    <DismissKeyboardView style={styles.container}>
      <Text style={styles.title}>Register</Text>

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
        style={styles.input}
        secureTextEntry
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button title="Register" onPress={handleRegister} />
    </DismissKeyboardView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  error: { color: "red", textAlign: "center", marginBottom: 10 },
  readOnlyInput: {
    backgroundColor: "#f0f0f0", // Light grey background
    color: "#888", // Muted text color
  },
});
