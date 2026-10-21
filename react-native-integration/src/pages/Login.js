import { useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import CampoTexto from "../components/CampoTexto";
import LogoApp from "../components/LogoApp";

import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../utils/error";
import { hasValidationErrors, validateLogin } from "../utils/validation";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { entrar: login } = useAuth();

  async function entrar() {
    const validationErrors = validateLogin({ email, password: senha });
    setErrors(validationErrors);
    if (hasValidationErrors(validationErrors)) return;

    try {
      setLoading(true);

      const response = await login(email, senha);

      if (!response.success) {
        Alert.alert("Não foi possível entrar", response.message);
        return;
      }
    } catch (error) {
      Alert.alert(
        "Não foi possível entrar",
        getErrorMessage(error, "Tente novamente em instantes."),
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.cabecalho}>
          <LogoApp tamanho="grande" />
          <Text variant="titleLarge" style={styles.marca}>
            CENA MARCADA
          </Text>
          <Text variant="bodyLarge" style={styles.chamada}>
            Seu controle pessoal de filmes e séries.
          </Text>
        </View>

        <View style={styles.formulario}>
          <Text variant="headlineSmall" style={styles.titulo}>
            Boas-vindas!
          </Text>
          <Text variant="bodyMedium" style={styles.subtitulo}>
            Entre para acompanhar sua coleção.
          </Text>
          <CampoTexto
            label="E-mail"
            valor={email}
            setValor={(value) => {
              setEmail(value);
              setErrors((current) => ({ ...current, email: undefined }));
            }}
            erro={errors.email}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <CampoTexto
            label="Senha"
            valor={senha}
            setValor={(value) => {
              setSenha(value);
              setErrors((current) => ({ ...current, password: undefined }));
            }}
            erro={errors.password}
            secureTextEntry
          />
          <Button
            mode="contained"
            icon="login"
            onPress={entrar}
            contentStyle={styles.botao}
            disabled={loading}
            loading={loading}
          >
            Entrar
          </Button>
        </View>

        <View style={styles.rodape}>
          <Text variant="bodyMedium">Ainda não possui conta?</Text>
          <Button mode="text" onPress={() => navigation.navigate("Cadastro")}>
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
