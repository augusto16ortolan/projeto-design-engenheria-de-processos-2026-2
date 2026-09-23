import { useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import CampoTexto from "../components/CampoTexto";
import LogoMarvel from "../components/LogoMarvel";

export default function Login({ onCadastrar, onEntrar }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  function entrar() {
    if (!email || !senha) {
      return Alert.alert(
        "Campos obrigatórios",
        "Informe e-mail e senha para entrar.",
      );
    }

    if (onEntrar) return onEntrar();

    Alert.alert(
      "Pronto para navegar",
      "Na aula, este botão abrirá o catálogo Marvel.",
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
            Boas-vindas!
          </Text>
          <Text variant="bodyMedium" style={styles.subtitulo}>
            Entre para continuar explorando o catálogo.
          </Text>
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
            icon="login"
            onPress={entrar}
            contentStyle={styles.botao}
          >
            Entrar
          </Button>
          <Button
            mode="text"
            onPress={() =>
              Alert.alert(
                "Recuperar senha",
                "Na aula, este botão pode abrir a recuperação de senha.",
              )
            }
          >
            Esqueci minha senha
          </Button>
        </View>

        <View style={styles.rodape}>
          <Text variant="bodyMedium">Ainda não possui conta?</Text>
          <Button
            mode="text"
            onPress={() =>
              onCadastrar
                ? onCadastrar()
                : Alert.alert(
                    "Cadastro",
                    "Na aula, este botão abrirá a tela de cadastro.",
                  )
            }
          >
            Criar conta
          </Button>
        </View>
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
    paddingBottom: 42,
    paddingTop: 38,
  },
  marca: {
    color: "#FFFFFF",
    fontWeight: "800",
    letterSpacing: 2,
    marginTop: 14,
  },
  chamada: { color: "#FFE7E8", marginTop: 6 },
  formulario: { marginHorizontal: 28, marginTop: 34 },
  titulo: { fontWeight: "800", marginTop: 6 },
  subtitulo: {
    color: "#5F6368",
    lineHeight: 20,
    marginBottom: 28,
    marginTop: 6,
  },
  botao: { paddingVertical: 7 },
  rodape: { alignItems: "center", marginTop: 24 },
});
