import { StyleSheet, Text, View } from "react-native";

export default function LogoMarvel({ tamanho = "normal" }) {
  return (
    <View style={tamanho === "grande" ? styles.logoGrande : styles.logo}>
      <Text style={tamanho === "grande" ? styles.textoGrande : styles.texto}>
        MARVEL
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  texto: {
    color: "#E62429",
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -1,
  },
  logoGrande: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  textoGrande: {
    color: "#E62429",
    fontSize: 31,
    fontWeight: "900",
    letterSpacing: -1.5,
  },
});
