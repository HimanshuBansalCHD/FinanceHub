import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Modal,
  FlatList,
  Linking,
  Image,
  Animated,
  Dimensions,
} from "react-native";
import DismissKeyboardView from "../components/DismissKeyboardView";
import {
  getTransactionsCollection,
  addDocumentToCollection,
} from "../utils/FirebaseUtil";
import { CATEGORY_DATA, UPI_APPS_CONFIG } from "../utils/Constants";

const screenHeight = Dimensions.get("window").height;

export default function PayScreen({ route }: any) {
  const { scannedData } = route.params;
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [subCategoryModalVisible, setSubCategoryModalVisible] = useState(false);
  const [upiModalVisible, setUpiModalVisible] = useState(false);
  const [AmountError, setAmountError] = useState(false);
  const [CategoryError, setCategoryError] = useState(false);
  const [isPaying, setIsPaying] = useState(false); // New state to track Pay button
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

  const handlePay = async () => {
    setAmountError(false);
    setCategoryError(false);
    setError(""); // clear any previous error

    if (!amount || isNaN(Number(amount))) {
      setAmountError(true);
      setError("Please enter amount");
      return;
    }

    if (category.trim() === "") {
      setCategoryError(true);
      setError("Please select a category");
      return;
    }

    try {
      setIsPaying(true);
      setUpiModalVisible(true); // Show UPI modal

      await addDocumentToCollection(getTransactionsCollection(), {
        amount: parseFloat(amount),
        category: category,
        subCategory: subCategory,
        notes: note,
        status: "DONE",
        timestamp: new Date(),
      });
    } catch (err: unknown) {
      const error = err as Error;
      Alert.alert("Error", error.message);
      setIsPaying(false); // Re-enable button if error occurs
    }
  };

  const openUpiApp = async (app: "google" | "phonepe" | "paytm") => {
    const upiParams = scannedData.replace("upi://pay", "");
    const finalNote = encodeURIComponent(note);
    const finalAmount = amount;

    const upiScheme = UPI_APPS_CONFIG[app].scheme;
    const url = `${upiScheme}${upiParams}&am=${finalAmount}&tn=${finalNote}&cu=INR`;
    Linking.openURL(url);

    setUpiModalVisible(false);
  };

  // Re-enable the Pay button when UPI modal is closed
  useEffect(() => {
    if (!upiModalVisible) {
      setIsPaying(false); // Enable Pay button again when modal is closed
    }
  }, [upiModalVisible]);

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
    <DismissKeyboardView style={styles.container}>
      <View style={styles.bannerContainer}>
        {/* Apply the animated image style */}
        <Animated.Image
          source={require("../../images/PaymentWithTracking.png")} // Replace with your image
          style={[styles.bannerImage, imageStyle]} // Combine static and animated styles
          resizeMode="cover"
        />
      </View>

      <Text style={styles.header}>Enter details</Text>

      <TextInput
        placeholder="Enter Amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        onFocus={handleFocus} // Trigger animation when focused
        onBlur={handleBlur} // Trigger animation when blurred
        style={[styles.input, AmountError && styles.inputError]}
      />

      <TouchableOpacity
        style={[styles.pickerTouchable, CategoryError && styles.inputError]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.pickerText}>
          {category ? category : "Select a category..."}
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
              data={CATEGORY_DATA}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setCategory(item.value);
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

      <TouchableOpacity
        style={styles.pickerTouchable}
        onPress={() => setSubCategoryModalVisible(true)}
      >
        <Text style={styles.pickerText}>
          {subCategory ? subCategory : "Select a sub-category (Optional)"}
        </Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={subCategoryModalVisible}
        animationType="fade"
        onRequestClose={() => setSubCategoryModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setSubCategoryModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <FlatList
              data={CATEGORY_DATA}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setSubCategory(item.value);
                    setSubCategoryModalVisible(false);
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

      <TextInput
        placeholder="Note (optional)"
        value={note}
        onChangeText={setNote}
        style={styles.input}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity
        style={[
          styles.payButton,
          isPaying && styles.disabledButton, // Apply disabled styles
        ]}
        onPress={handlePay}
        disabled={isPaying} // Disable button when isPaying is true
      >
        <Text style={styles.payButtonText}>
          {isPaying ? "Processing..." : "Pay"}
        </Text>
      </TouchableOpacity>

      {/* UPI Modal */}
      <Modal
        transparent={true}
        visible={upiModalVisible}
        animationType="slide"
        onRequestClose={() => setUpiModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setUpiModalVisible(false)} // Close modal when clicking outside
        >
          <View style={styles.modalContainer}>
            <Text style={styles.subHeader}>Choose UPI App</Text>

            <TouchableOpacity
              style={styles.modalItem}
              onPress={() => openUpiApp("google")}
            >
              <View style={styles.logoRow}>
                <Image
                  source={require("../../assets/upi/googlePay.png")}
                  style={styles.logo}
                />
                <Text style={styles.modalItemText}>Google Pay</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalItem}
              onPress={() => openUpiApp("phonepe")}
            >
              <View style={styles.logoRow}>
                <Image
                  source={require("../../assets/upi/PhonePe.png")}
                  style={styles.logo}
                />
                <Text style={styles.modalItemText}>PhonePe</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalItem}
              onPress={() => openUpiApp("paytm")}
            >
              <View style={styles.logoRow}>
                <Image
                  source={require("../../assets/upi/Paytm.png")}
                  style={styles.logo}
                />
                <Text style={styles.modalItemText}>Paytm</Text>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </DismissKeyboardView>
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    top: 20,
    left: 32,
    height: screenHeight * 0.33,
    width: "100%",
    position: "absolute", // Prevent image from affecting layout
    zIndex: -1,
  },
  bannerImage: {
    width: "100%",
    height: "105%",
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  input: {
    top: 90,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 16,
  },
  header: {
    top: 110,
    fontSize: 24,
    textAlign: "left",
    marginBottom: 30,
    fontWeight: "bold",
    bottom: -10,
    color: "#5F259F",
  },
  subHeader: {
    fontSize: 22,
    textAlign: "center",
    marginTop: 15,
    marginBottom: 15,
    fontWeight: "bold",
    color: "#5F259F",
  },
  pickerTouchable: {
    top: 90,
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
  payButton: {
    top: 90,
    backgroundColor: "#5F259F",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#aaa", // Grey color when disabled
  },
  payButtonText: {
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
  inputError: {
    borderColor: "red",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
    fontSize: 14,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  logo: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
});
