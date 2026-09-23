import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";

export default function Botao({ label, action, type = "primary" }) {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={type === "primary" ? styles.primaryButton : styles.secondaryButton}
      onPress={() => action()}
    >
      <Text
        style={
          type === "primary"
            ? styles.primaryButtonText
            : styles.secondaryButtonText
        }
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#0F172A",
    borderRadius: 10,
    marginTop: 12,
    padding: 16,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  secondaryButton: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#CBD5E1",
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 12,
    padding: 15,
  },
  secondaryButtonText: {
    color: "#334155",
    fontSize: 15,
    fontWeight: "700",
  },
});
