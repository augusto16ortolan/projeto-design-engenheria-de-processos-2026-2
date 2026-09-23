import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function BotaoFiltro({ label, action, ativo = false }) {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={ativo ? styles.ativo : styles.botao}
      onPress={() => action()}
    >
      <Text style={ativo ? styles.textoAtivo : styles.texto}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  ativo: {
    backgroundColor: "#0F172A",
    borderRadius: 8,
    marginRight: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  textoAtivo: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  botao: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  texto: {
    color: "#475569",
    fontSize: 14,
    fontWeight: "600",
  },
});
