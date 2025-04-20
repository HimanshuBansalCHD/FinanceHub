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
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from "react-native";
import { setDocument } from "../utils/FirebaseUtil";
import { USER_COLLECTION_NAME } from "../utils/Constants";
import { getUserIdFromEmail } from "../utils/common";

const screenHeight = Dimensions.get("window").height;

export default function AdditionalInformationScreen({
  navigation,
  route,
}: any) {
  const { email } = route.params || {};
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("male");
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [ageError, setAgeError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [imageAnimation] = useState(new Animated.Value(0));

  const genderData = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ];

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

  const handleSaveInformation = async () => {
    const userId = await getUserIdFromEmail(email);
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
          name: name,
          age: age,
          gender: gender,
          phoneNumber: phoneNumber,
          isVerified: true,
        },
        userId
      );

      navigation.navigate("Home");
    } catch (err: any) {
      setError(err.message);
    }
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
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <View style={styles.bannerContainer}>
            <Animated.Image
              source={require("../../images/RegisterScreen.png")}
              style={[styles.bannerImage, imageStyle]}
              resizeMode="cover"
            />
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>Enter Your Details</Text>

            <TextInput
              placeholder="Name"
              value={name}
              onChangeText={setName}
              onFocus={handleFocus}
              onBlur={handleBlur}
              style={[styles.input, nameError && styles.inputError]}
            />

            <TextInput
              placeholder="Age"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
              onFocus={handleFocus}
              onBlur={handleBlur}
              style={[styles.input, ageError && styles.inputError]}
            />

            <TextInput
              placeholder="Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              onFocus={handleFocus}
              onBlur={handleBlur}
              style={[styles.input, phoneError && styles.inputError]}
            />

            <Text style={styles.label}>Gender</Text>
            <TouchableOpacity
              style={styles.pickerTouchable}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.pickerText}>
                {gender
                  ? gender.charAt(0).toUpperCase() + gender.slice(1)
                  : "Select gender"}
              </Text>
            </TouchableOpacity>

            <Modal
              transparent={true}
              visible={modalVisible}
              animationType="fade"
              onRequestClose={() => setModalVisible(false)}
            >
              <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPressOut={() => setModalVisible(false)}
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
                              gender === item.value ? "#E6E6FA" : "#fff",
                          },
                        ]}
                        onPress={() => {
                          setGender(item.value);
                          setModalVisible(false);
                        }}
                      >
                        <Text style={styles.modalItemText}>{item.label}</Text>
                      </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.value}
                  />
                </View>
              </TouchableOpacity>
            </Modal>

            {error && <Text style={styles.error}>{error}</Text>}

            <TouchableOpacity
              style={styles.proceedButton}
              onPress={handleSaveInformation}
            >
              <Text style={styles.proceedButtonText}>Proceed</Text>
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
    top: 10,
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
    marginTop: screenHeight * 0.25,
  },
  title: {
    top: 30,
    fontSize: 24,
    textAlign: "left",
    marginBottom: 20,
    fontWeight: "bold",
    color: "#5F259F",
  },
  input: {
    top: 30,
    borderWidth: 1,
    padding: 12,
    marginBottom: 20,
    borderRadius: 8,
    borderColor: "#ccc",
    fontSize: 16,
  },
  inputError: {
    borderColor: "red",
  },
  label: {
    top: 30,
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
  },
  pickerTouchable: {
    top: 30,
    padding: 12,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ccc",
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  pickerText: {
    fontSize: 16,
    color: "#333",
  },
  error: {
    top: 30,
    color: "red",
    textAlign: "center",
    marginBottom: 10,
    fontSize: 14,
  },
  proceedButton: {
    top: 30,
    marginTop: 10,
    backgroundColor: "#5F259F",
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  modalContainer: {
    width: 280,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    elevation: 9,
  },
  modalItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E6E6FA",
    borderRadius: 8,
  },
  modalItemText: {
    fontSize: 18,
    fontWeight: "500",
  },
});
