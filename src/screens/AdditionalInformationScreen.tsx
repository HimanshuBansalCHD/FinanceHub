import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import DismissKeyboardView from "../components/DismissKeyboardView";
import { setDocument } from "../utils/FirebaseUtil";
import { USER_COLLECTION_NAME } from "../utils/Constants";
import { getUserIdFromEmail } from "../utils/common";

export default function AdditionalInformationScreen({
  navigation,
  route,
}: any) {
  const { email } = route.params || {}; // Get user from params
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("male");
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [ageError, setAgeError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);

  const handleSaveInformation = async () => {
    const userId = await getUserIdFromEmail(email);
    // Reset all error states first
    setNameError(false);
    setPhoneError(false);
    setAgeError(false);
    setError("");

    if (name.trim() === "") {
      setNameError(true);
      setError("Please enter your name.");
      return;
    }

    if (!age || isNaN(Number(age)) || Number(age) < 18) {
      setAgeError(true);
      setError("Please enter a valid age (18+).");
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setPhoneError(true);
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    try {
      await setDocument(
        USER_COLLECTION_NAME,
        {
          name,
          age,
          gender,
          phoneNumber,
        },
        userId
      );

      Alert.alert("Information saved successfully.");
      navigation.navigate("Home");
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Gender data for the dropdown
  const genderData = [
    { label: "Male", value: "male", color: "blue" },
    { label: "Female", value: "female", color: "#D5006D" },
  ];

  return (
    <DismissKeyboardView style={styles.container}>
      <Text style={styles.title}>Enter Your Details</Text>

      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={[styles.input, nameError && styles.inputError]}
      />

      <TextInput
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        style={[styles.input, ageError && styles.inputError]}
        keyboardType="numeric"
      />

      <TextInput
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        style={[styles.input, phoneError && styles.inputError]}
        keyboardType="phone-pad"
      />

      {/* Gender Text with TouchableOpacity */}
      <Text style={styles.label}>Gender</Text>
      <TouchableOpacity
        style={styles.pickerTouchable}
        onPress={() => setModalVisible(true)}
      >
        <Text
          style={[
            { color: gender === "male" ? "blue" : "#D5006D" }, // Style color based on gender selection
            styles.pickerText,
          ]}
        >
          {gender === "male" ? "Male" : "Female"}{" "}
          {/* Display selected gender */}
        </Text>
      </TouchableOpacity>

      {/* Modal for Gender Dropdown */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)} // Close modal on request
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)} // Close modal if clicked outside
        >
          <View style={styles.modalContainer}>
            <FlatList
              data={genderData}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    {
                      backgroundColor:
                        gender === item.value ? "#e0e0e0" : "white",
                    },
                  ]}
                  onPress={() => {
                    setGender(item.value); // Set selected gender
                    setModalVisible(false); // Close modal after selection
                  }}
                >
                  <Text style={[styles.modalItemText, { color: item.color }]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.value}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Error message */}
      {error && <Text style={styles.error}>{error}</Text>}

      {/* Proceed Button using TouchableOpacity */}
      <TouchableOpacity
        style={styles.proceedButton}
        onPress={handleSaveInformation}
      >
        <Text style={styles.proceedButtonText}>Proceed</Text>
      </TouchableOpacity>
    </DismissKeyboardView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, textAlign: "center", marginBottom: 20 },
  input: {
    borderWidth: 1,
    padding: 12,
    marginBottom: 20,
    borderRadius: 8,
    borderColor: "#ddd",
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
  },
  pickerText: {
    padding: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    fontSize: 16,
    textAlign: "center",
  },
  pickerTouchable: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ddd",
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
    fontSize: 14,
  },
  proceedButton: {
    marginTop: 20,
    backgroundColor: "#1a73e8",
    borderRadius: 8,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  proceedButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  //   Pop-Up Config
  modalContainer: {
    width: 280,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    elevation: 9, // Shadow effect
  },
  modalItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 0,
    marginVertical: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  modalItemText: {
    fontSize: 18,
    fontWeight: "500",
  },
  inputError: {
    borderColor: "red",
  },
});
