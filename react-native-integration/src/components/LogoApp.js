import { StyleSheet, Text, View } from "react-native";

export default function LogoApp({ tamanho = "normal" }) {
  const grande = tamanho === "grande";
  return (
    <View style={grande ? styles.logoGrande : styles.logo}>
      <Text style={grande ? styles.textoGrande : styles.texto}>CM</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: { alignItems: "center", backgroundColor: "#FFFFFF", borderRadius: 12, justifyContent: "center", paddingHorizontal: 10, paddingVertical: 3 },
  texto: { color: "#E62429", fontSize: 22, fontWeight: "900" },
  logoGrande: { alignItems: "center", backgroundColor: "#FFFFFF", borderRadius: 18, justifyContent: "center", paddingHorizontal: 17, paddingVertical: 6 },
  textoGrande: { color: "#E62429", fontSize: 31, fontWeight: "900" },
});
