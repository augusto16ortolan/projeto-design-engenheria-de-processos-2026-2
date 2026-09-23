import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Aviso({ icone, titulo, texto, labelAcao, action }) {
  return (
    <View style={styles.card}>
      <View style={styles.iconeContainer}>
        <Text style={styles.icone}>{icone}</Text>
      </View>
      <View style={styles.conteudo}>
        <Text style={styles.titulo}>{titulo}</Text>
        <Text style={styles.texto}>{texto}</Text>
        <TouchableOpacity activeOpacity={0.75} onPress={() => action()}>
          <Text style={styles.acao}>{labelAcao}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: "row",
    marginBottom: 12,
    padding: 14,
  },
  iconeContainer: {
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 16,
    height: 32,
    justifyContent: "center",
    marginRight: 12,
    width: 32,
  },
  icone: {
    color: "#475569",
    fontSize: 16,
    fontWeight: "700",
  },
  conteudo: {
    flex: 1,
  },
  titulo: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 3,
  },
  texto: {
    color: "#64748B",
    fontSize: 14,
    lineHeight: 20,
  },
  acao: {
    color: "#0F172A",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 8,
  },
});
