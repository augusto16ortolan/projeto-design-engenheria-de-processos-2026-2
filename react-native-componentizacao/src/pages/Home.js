import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Home() {
  const [busca, setBusca] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Pessoas da turma</Text>
      <Text style={styles.subtitle}>
        Encontre os trechos que se repetem e transforme-os em componentes.
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Buscar pessoa</Text>
        <TextInput
          value={busca}
          onChangeText={setBusca}
          placeholder="Digite um nome"
          placeholderTextColor="#94A3B8"
          style={styles.input}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Seu nome</Text>
        <TextInput
          value={nome}
          onChangeText={setNome}
          placeholder="Digite seu nome"
          placeholderTextColor="#94A3B8"
          style={styles.input}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Seu e-mail</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="nome@email.com"
          placeholderTextColor="#94A3B8"
          style={styles.input}
        />
      </View>

      <TouchableOpacity
        activeOpacity={0.75}
        style={styles.primaryButton}
        onPress={() =>
          Alert.alert("Cadastro", `Nome: ${nome}\nE-mail: ${email}`)
        }
      >
        <Text style={styles.primaryButtonText}>Cadastrar pessoa</Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.75}
        style={styles.primaryButton}
        onPress={() =>
          Alert.alert(
            "Dados preenchidos",
            `Busca: ${busca}\nNome: ${nome}\nE-mail: ${email}`,
          )
        }
      >
        <Text style={styles.primaryButtonText}>Visualizar cadastro</Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.75}
        style={styles.secondaryButton}
        onPress={() => {
          setBusca("");
          setNome("");
          setEmail("");
        }}
      >
        <Text style={styles.secondaryButtonText}>Limpar campos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.75}
        style={styles.secondaryButton}
        onPress={() => {
          setBusca("Ana");
          setNome("Ana Souza");
          setEmail("ana.souza@email.com");
        }}
      >
        <Text style={styles.secondaryButtonText}>Preencher exemplo</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Resumo da turma</Text>

      <View style={styles.statisticsContainer}>
        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.statisticsCard}
          onPress={() => Alert.alert("Alunos", "Ha 32 alunos cadastrados.")}
        >
          <Text style={styles.statisticsNumber}>32</Text>
          <Text style={styles.statisticsLabel}>Alunos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.statisticsCard}
          onPress={() =>
            Alert.alert("Cidades", "A turma possui alunos de 4 cidades.")
          }
        >
          <Text style={styles.statisticsNumber}>4</Text>
          <Text style={styles.statisticsLabel}>Cidades</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.statisticsCard}
          onPress={() => Alert.alert("Projetos", "Ha 8 projetos em andamento.")}
        >
          <Text style={styles.statisticsNumber}>8</Text>
          <Text style={styles.statisticsLabel}>Projetos</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Filtrar por cidade</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterList}
      >
        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.filterActive}
          onPress={() => Alert.alert("Filtro", "Exibindo todas as pessoas.")}
        >
          <Text style={styles.filterActiveText}>Todos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.filterButton}
          onPress={() =>
            Alert.alert("Filtro", "Exibindo pessoas de Porto Alegre.")
          }
        >
          <Text style={styles.filterButtonText}>Porto Alegre</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.filterButton}
          onPress={() =>
            Alert.alert("Filtro", "Exibindo pessoas de Caxias do Sul.")
          }
        >
          <Text style={styles.filterButtonText}>Caxias do Sul</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.filterButton}
          onPress={() =>
            Alert.alert("Filtro", "Exibindo pessoas de Passo Fundo.")
          }
        >
          <Text style={styles.filterButtonText}>Passo Fundo</Text>
        </TouchableOpacity>
      </ScrollView>

      <Text style={styles.sectionTitle}>Acoes rapidas</Text>

      <View style={styles.quickActionsContainer}>
        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.quickAction}
          onPress={() => Alert.alert("Nova pessoa", "Abra o formulario acima.")}
        >
          <Text style={styles.quickActionIcon}>+</Text>
          <Text style={styles.quickActionText}>Adicionar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.quickAction}
          onPress={() => Alert.alert("Projetos", "Nenhum projeto selecionado.")}
        >
          <Text style={styles.quickActionIcon}>#</Text>
          <Text style={styles.quickActionText}>Projetos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.quickAction}
          onPress={() =>
            Alert.alert("Mensagens", "Voce nao possui novas mensagens.")
          }
        >
          <Text style={styles.quickActionIcon}>@</Text>
          <Text style={styles.quickActionText}>Mensagens</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Avisos</Text>

      <View style={styles.noticeCard}>
        <View style={styles.noticeIcon}>
          <Text style={styles.noticeIconText}>!</Text>
        </View>
        <View style={styles.noticeContent}>
          <Text style={styles.noticeTitle}>Entrega do projeto</Text>
          <Text style={styles.noticeText}>
            Prazo: sexta-feira, 26 de setembro.
          </Text>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() =>
              Alert.alert(
                "Projeto",
                "Lembre-se de enviar o link do repositorio.",
              )
            }
          >
            <Text style={styles.noticeAction}>Ver detalhes</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.noticeCard}>
        <View style={styles.noticeIcon}>
          <Text style={styles.noticeIconText}>i</Text>
        </View>
        <View style={styles.noticeContent}>
          <Text style={styles.noticeTitle}>Proxima aula</Text>
          <Text style={styles.noticeText}>
            Vamos praticar a criacao de componentes.
          </Text>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() =>
              Alert.alert("Aula", "Prepare seu projeto para a pratica.")
            }
          >
            <Text style={styles.noticeAction}>Ver agenda</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Lista da turma</Text>

      <View style={styles.card}>
        <Image
          source={{ uri: "https://randomuser.me/api/portraits/women/44.jpg" }}
          style={styles.avatar}
        />
        <View style={styles.cardContent}>
          <Text style={styles.name}>Ana Souza</Text>
          <Text style={styles.detail}>24 anos</Text>
          <Text style={styles.detail}>Porto Alegre - RS</Text>
          <TouchableOpacity
            activeOpacity={0.75}
            style={styles.cardButton}
            onPress={() => Alert.alert("Ana Souza", "Perfil selecionado.")}
          >
            <Text style={styles.cardButtonText}>Ver perfil</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.card}>
        <Image
          source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }}
          style={styles.avatar}
        />
        <View style={styles.cardContent}>
          <Text style={styles.name}>Bruno Martins</Text>
          <Text style={styles.detail}>29 anos</Text>
          <Text style={styles.detail}>Passo Fundo - RS</Text>
          <TouchableOpacity
            activeOpacity={0.75}
            style={styles.cardButton}
            onPress={() => Alert.alert("Bruno Martins", "Perfil selecionado.")}
          >
            <Text style={styles.cardButtonText}>Ver perfil</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.card}>
        <Image
          source={{ uri: "https://randomuser.me/api/portraits/women/68.jpg" }}
          style={styles.avatar}
        />
        <View style={styles.cardContent}>
          <Text style={styles.name}>Carolina Lima</Text>
          <Text style={styles.detail}>21 anos</Text>
          <Text style={styles.detail}>Caxias do Sul - RS</Text>
          <TouchableOpacity
            activeOpacity={0.75}
            style={styles.cardButton}
            onPress={() => Alert.alert("Carolina Lima", "Perfil selecionado.")}
          >
            <Text style={styles.cardButtonText}>Ver perfil</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.card}>
        <Image
          source={{ uri: "https://randomuser.me/api/portraits/men/46.jpg" }}
          style={styles.avatar}
        />
        <View style={styles.cardContent}>
          <Text style={styles.name}>Daniel Oliveira</Text>
          <Text style={styles.detail}>32 anos</Text>
          <Text style={styles.detail}>Florianopolis - SC</Text>
          <TouchableOpacity
            activeOpacity={0.75}
            style={styles.cardButton}
            onPress={() =>
              Alert.alert("Daniel Oliveira", "Perfil selecionado.")
            }
          >
            <Text style={styles.cardButtonText}>Ver perfil</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F8FAFC",
    padding: 20,
    paddingBottom: 40,
    paddingTop: 56,
  },
  title: {
    color: "#0F172A",
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.6,
  },
  subtitle: {
    color: "#64748B",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    color: "#334155",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
    borderRadius: 10,
    borderWidth: 1,
    color: "#0F172A",
    fontSize: 15,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#0F172A",
    borderRadius: 10,
    marginTop: 12,
    padding: 16,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  secondaryButton: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#CBD5E1",
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 12,
    padding: 15,
  },
  secondaryButtonText: {
    color: "#334155",
    fontSize: 15,
    fontWeight: "700",
  },
  sectionTitle: {
    color: "#0F172A",
    fontSize: 19,
    fontWeight: "800",
    letterSpacing: -0.2,
    marginBottom: 14,
    marginTop: 32,
  },
  statisticsContainer: {
    flexDirection: "row",
    gap: 10,
  },
  statisticsCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
    borderRadius: 10,
    borderWidth: 1,
    flex: 1,
    paddingVertical: 18,
  },
  statisticsNumber: {
    color: "#0F172A",
    fontSize: 23,
    fontWeight: "800",
  },
  statisticsLabel: {
    color: "#64748B",
    fontSize: 13,
    marginTop: 4,
  },
  filterList: {
    flexGrow: 0,
  },
  filterActive: {
    backgroundColor: "#0F172A",
    borderRadius: 8,
    marginRight: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  filterActiveText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  filterButton: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  filterButtonText: {
    color: "#475569",
    fontSize: 14,
    fontWeight: "600",
  },
  quickActionsContainer: {
    flexDirection: "row",
    gap: 10,
  },
  quickAction: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
    borderRadius: 10,
    borderWidth: 1,
    flex: 1,
    paddingHorizontal: 6,
    paddingVertical: 14,
  },
  quickActionIcon: {
    color: "#0F172A",
    fontSize: 22,
    fontWeight: "700",
  },
  quickActionText: {
    color: "#475569",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 5,
  },
  noticeCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: "row",
    marginBottom: 12,
    padding: 14,
  },
  noticeIcon: {
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 16,
    height: 32,
    justifyContent: "center",
    marginRight: 12,
    width: 32,
  },
  noticeIconText: {
    color: "#475569",
    fontSize: 16,
    fontWeight: "700",
  },
  noticeContent: {
    flex: 1,
  },
  noticeTitle: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 3,
  },
  noticeText: {
    color: "#64748B",
    fontSize: 14,
    lineHeight: 20,
  },
  noticeAction: {
    color: "#0F172A",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 8,
  },
  card: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    marginBottom: 16,
    padding: 16,
  },
  avatar: {
    borderRadius: 36,
    height: 72,
    marginRight: 16,
    width: 72,
  },
  cardContent: {
    flex: 1,
  },
  name: {
    color: "#0F172A",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  detail: {
    color: "#64748B",
    fontSize: 15,
    lineHeight: 21,
  },
  cardButton: {
    alignSelf: "flex-start",
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  cardButtonText: {
    color: "#334155",
    fontSize: 14,
    fontWeight: "700",
  },
});
