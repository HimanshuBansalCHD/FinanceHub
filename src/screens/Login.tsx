import React, { useState } from "react";
import { TextInput, Button, Text, StyleSheet } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import DismissKeyboardView from "../components/DismissKeyboardView";

export default function LoginScreen({ navigation, route }: any) {
  const { email: initialEmail = "" } = route.params || {};
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError(""); // clear any previous error

    try {
      // await signInWithEmailAndPassword(auth, email, password);
      await signInWithEmailAndPassword(auth, "a@11.com", "a@11.com");
      navigation.navigate("Home");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleInputChange = (
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    return (value: string) => {
      setter(value);
      if (error) setError(""); // clear error on new input
    };
  };

  return (
    <DismissKeyboardView style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={handleInputChange(setEmail)}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={handleInputChange(setPassword)}
        style={styles.input}
        secureTextEntry
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button title="Login" onPress={handleLogin} />
      <Text onPress={() => navigation.navigate("Register")} style={styles.link}>
        Don't have an account? Register
      </Text>
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
  link: { color: "blue", textAlign: "center", marginTop: 20 },
});
