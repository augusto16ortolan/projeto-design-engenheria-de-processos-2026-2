import { ScrollView, StyleSheet, View } from "react-native";
import { Avatar, Chip, Divider, List, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function InformacoesDesenvolvedor() {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.cabecalho}>
          <Avatar.Icon size={92} icon="account" style={styles.avatar} />
          <Text variant="headlineMedium" style={styles.titulo}>
            Informações do desenvolvedor
          </Text>
          <Text variant="bodyLarge" style={styles.subtitulo}>
            Conheça quem desenvolveu o Cine Marvel.
          </Text>
        </View>

        <Chip icon="code-tags" style={styles.chip}>
          React Native com Expo
        </Chip>
        <Divider style={styles.divisor} />

        <List.Item
          title="Nome"
          description="Augusto Ortolan"
          left={(props) => <List.Icon {...props} icon="account" />}
        />
        <List.Item
          title="E-mail"
          description="augusto.ortolan@atitus.edu.br"
          left={(props) => <List.Icon {...props} icon="email-outline" />}
        />
        <List.Item
          title="Curso"
          description="Projeto de Design e Engenharia de Processos"
          left={(props) => <List.Icon {...props} icon="school-outline" />}
        />
        <List.Item
          title="Tecnologias"
          description="React Native, Expo, JavaScript e React Native Paper"
          left={(props) => <List.Icon {...props} icon="tools" />}
        />
        <List.Item
          title="Versão do aplicativo"
          description="1.0.0"
          left={(props) => <List.Icon {...props} icon="information-outline" />}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#FFFFFF", flex: 1 },
  container: { padding: 24, paddingBottom: 42 },
  cabecalho: { alignItems: "center", marginBottom: 24 },
  avatar: { backgroundColor: "#E62429", marginBottom: 16 },
  titulo: { fontWeight: "800", textAlign: "center" },
  subtitulo: { color: "#5F6368", marginTop: 8, textAlign: "center" },
  chip: { alignSelf: "center" },
  divisor: { marginVertical: 24 },
});
