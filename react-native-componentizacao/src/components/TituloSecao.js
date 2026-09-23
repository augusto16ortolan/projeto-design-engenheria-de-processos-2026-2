import { StyleSheet, Text } from "react-native";

export default function TituloSecao({ titulo }) {
  return <Text style={styles.sectionTitle}>{titulo}</Text>;
}

const styles = StyleSheet.create({
  sectionTitle: {
    color: "#0F172A",
    fontSize: 19,
    fontWeight: "800",
    letterSpacing: -0.2,
    marginBottom: 14,
    marginTop: 32,
  },
});
