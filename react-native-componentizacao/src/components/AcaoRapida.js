import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function AcaoRapida({ icone, label, action }) {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={styles.acao}
      onPress={() => action()}
    >
      <Text style={styles.icone}>{icone}</Text>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  acao: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
    borderRadius: 10,
    borderWidth: 1,
    flex: 1,
    paddingHorizontal: 6,
    paddingVertical: 14,
  },
  icone: {
    color: "#0F172A",
    fontSize: 22,
    fontWeight: "700",
  },
  label: {
    color: "#475569",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 5,
  },
});
