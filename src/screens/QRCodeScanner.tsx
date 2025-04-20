import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

export default function QRCodeScanner({ navigation }: any): any {
  const [facing, setFacing] = useState<"front" | "back">("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to access the camera
        </Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }

  const handleScan = ({ data }: { data: string }) => {
    if (!scanned) {
      setScanned(true);
      navigation.navigate("Pay", { scannedData: data });
      setTimeout(() => setScanned(false), 3000);
    }
  };

  const toggleCameraFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        barcodeScannerSettings={{
          barcodeTypes: [
            "qr",
            "ean13",
            "ean8",
            "upc_a",
            "upc_e",
            "code39",
            "code128",
          ],
        }}
        onBarcodeScanned={handleScan}
      >
        {/* Darkened overlay outside the scan area */}
        <View style={styles.overlay}>
          <View style={styles.topOverlay} />
          <View style={styles.leftOverlay} />
          <View style={styles.rightOverlay} />
          <View style={styles.bottomOverlay} />

          {/* Scan Area */}
          <View style={styles.scanArea} />
        </View>

        {/* Flip Camera Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.buttonText}>Flip Camera</Text>
          </TouchableOpacity>
        </View>

        {/* Watermark */}
        <Text style={styles.watermark}>Scan QR Code</Text>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  message: {
    textAlign: "center",
    marginTop: 20,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
  },
  button: {
    backgroundColor: "black",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    bottom: 190,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    // bottom: 90,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  // Top overlay, darkens the top portion of the screen
  topOverlay: {
    position: "absolute",
    top: 0,
    left: `12.5%`,
    right: `12.5%`,
    height: "32.5%", // Darken top 25% of the screen
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  // Bottom overlay, darkens the bottom portion of the screen
  bottomOverlay: {
    position: "absolute",
    bottom: 0,
    left: `12.5%`,
    right: `12.5%`,
    height: "32.5%", // Darken bottom 25% of the screen
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  // Left overlay, darkens the left portion of the screen
  leftOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: "12.5%", // Darken left 25% of the screen
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  // Right overlay, darkens the right portion of the screen
  rightOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: "12.5%", // Darken right 25% of the screen
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  scanArea: {
    width: 300,
    height: 300,
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 10,
    backgroundColor: "transparent", // Scan area remains clear
  },
  // Watermark style
  watermark: {
    position: "absolute",
    bottom: 50, // Adjust as necessary
    width: "100%",
    textAlign: "center",
    color: "rgba(255, 255, 255, 0.5)", // Semi-transparent white color
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 2,
  },
});
