import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Optional: for back icon

export default function UnderDevelopmentScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#5F259F" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      {/* Message */}
      <View style={styles.content}>
        <Text style={styles.title}>🚧 Under Development</Text>
        <Text style={styles.subtitle}>
          This feature will be available soon.
        </Text>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F2F7",
    padding: 20,
    paddingTop: 50,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  backText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#5F259F",
    fontWeight: "500",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#5F259F",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
  },
});
