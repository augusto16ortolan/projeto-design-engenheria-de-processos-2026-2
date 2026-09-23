import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function CardEstatistica({ numero, label, action }) {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={styles.card}
      onPress={() => action()}
    >
      <Text style={styles.numero}>{numero}</Text>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
    borderRadius: 10,
    borderWidth: 1,
    flex: 1,
    paddingVertical: 18,
  },
  numero: {
    color: "#0F172A",
    fontSize: 23,
    fontWeight: "800",
  },
  label: {
    color: "#64748B",
    fontSize: 13,
    marginTop: 4,
  },
});
