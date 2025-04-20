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
} from "react-native";
import DismissKeyboardView from "../components/DismissKeyboardView";
import {
  getTransactionsCollection,
  addDocumentToCollection,
} from "../utils/FirebaseUtil";
import { CATEGORY_DATA, UPI_APPS_CONFIG } from "../utils/Constants";

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

  return (
    <DismissKeyboardView style={styles.container}>
      <Text style={styles.title}>Make a Payment</Text>

      <TextInput
        placeholder="Enter Amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
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
            <Text style={styles.title}>Choose UPI App</Text>
            <TouchableOpacity
              style={styles.modalItem}
              onPress={() => openUpiApp("google")}
            >
              <Text style={styles.modalItemText}>Google Pay</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalItem}
              onPress={() => openUpiApp("phonepe")}
            >
              <Text style={styles.modalItemText}>PhonePe</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalItem}
              onPress={() => openUpiApp("paytm")}
            >
              <Text style={styles.modalItemText}>Paytm</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </DismissKeyboardView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 24, textAlign: "center", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 16,
  },
  pickerTouchable: {
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
    backgroundColor: "#1a73e8",
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
    backgroundColor: "#eee",
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
});
