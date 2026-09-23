import { useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import CampoTexto from "../components/CampoTexto";
import LogoMarvel from "../components/LogoMarvel";

export default function Cadastro({ onCadastrar }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  function cadastrar() {
    if (!nome || !email || !senha) {
      return Alert.alert("Campos obrigatórios", "Preencha todos os campos.");
    }

    if (onCadastrar) return onCadastrar();

    Alert.alert(
      "Conta criada",
      "Na aula, volte para a tela de login após o cadastro.",
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.cabecalho}>
          <LogoMarvel tamanho="grande" />
          <Text variant="titleLarge" style={styles.marca}>
            CINE MARVEL
          </Text>
          <Text variant="bodyLarge" style={styles.chamada}>
            Seu universo de filmes e séries.
          </Text>
        </View>

        <View style={styles.formulario}>
          <Text variant="headlineSmall" style={styles.titulo}>
            Crie sua conta
          </Text>
          <Text variant="bodyMedium" style={styles.subtitulo}>
            Monte sua lista de favoritos e acompanhe as aventuras do universo
            Marvel.
          </Text>
          <CampoTexto
            label="Nome completo"
            valor={nome}
            setValor={setNome}
            autoCapitalize="words"
          />
          <CampoTexto
            label="E-mail"
            valor={email}
            setValor={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <CampoTexto
            label="Senha"
            valor={senha}
            setValor={setSenha}
            secureTextEntry
          />
          <Button
            mode="contained"
            icon="account-plus"
            onPress={cadastrar}
            contentStyle={styles.botao}
          >
            Criar conta
          </Button>
        </View>

        <Text variant="bodySmall" style={styles.termos}>
          Ao criar uma conta, você poderá salvar suas obras favoritas.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#FFFFFF", flex: 1 },
  scroll: { flexGrow: 1, paddingBottom: 32 },
  cabecalho: {
    alignItems: "center",
    backgroundColor: "#E62429",
    borderBottomLeftRadius: 38,
    borderBottomRightRadius: 38,
    paddingBottom: 30,
    paddingTop: 28,
  },
  marca: {
    color: "#FFFFFF",
    fontWeight: "800",
    letterSpacing: 2,
    marginTop: 10,
  },
  chamada: { color: "#FFE7E8", marginTop: 6 },
  formulario: { marginHorizontal: 28, marginTop: 30 },
  titulo: { fontWeight: "800", marginTop: 6 },
  subtitulo: {
    color: "#5F6368",
    lineHeight: 20,
    marginBottom: 28,
    marginTop: 6,
  },
  botao: { paddingVertical: 7 },
  termos: {
    color: "#6B6B70",
    lineHeight: 18,
    marginHorizontal: 30,
    marginTop: 20,
    textAlign: "center",
  },
});
