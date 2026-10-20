import { useCallback, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { FAB, Text } from "react-native-paper";
import CardObra from "../components/CardObra";
import { WORK_TYPES } from "../constants/works";
import { useAuth } from "../context/AuthContext";
import { getMedias } from "../services/mediaService";
import { getErrorMessage } from "../utils/error";

const ALL = "all";
const STATUS_FILTERS = [
  { value: ALL, label: "Todos" },
  { value: "want_to_watch", label: "Quero ver" },
  { value: "watching", label: "Vendo" },
  { value: "watched", label: "Vistos" },
];
const TYPE_FILTERS = [{ value: ALL, label: "Todos" }, ...WORK_TYPES];

export default function ListaObras({ navigation }) {
  const [status, setStatus] = useState(ALL);
  const [type, setType] = useState(ALL);
  const [obras, setObras] = useState([]);
  const [loading, setLoading] = useState(true);
  const { sair, token, user } = useAuth();

  const getObras = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getMedias(token, {
        status: status === ALL ? undefined : status,
        type: type === ALL ? undefined : type,
      });
      if (!response.success)
        return Alert.alert("Não foi possível carregar", response.message);
      setObras(response.medias);
    } catch (error) {
      Alert.alert("Não foi possível carregar", getErrorMessage(error, "Tente atualizar a lista."));
    } finally {
      setLoading(false);
    }
  }, [status, token, type]);

  useFocusEffect(
    useCallback(() => {
      getObras();
    }, [getObras]),
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: `Olá, ${user.name}`,
      headerLeft: () => (
        <TouchableOpacity onPress={sair}>
          <MaterialIcons name="logout" size={24} color="black" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate("InformacoesDesenvolvedor")}
        >
          <MaterialIcons name="info-outline" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, sair, user.name]);

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.titulo}>
        Minha coleção
      </Text>
      <Text variant="bodyMedium" style={styles.subtitulo}>
        Acompanhe o que você quer assistir e o que já viu.
      </Text>
      <Text variant="labelLarge" style={styles.rotuloFiltro}>
        Status
      </Text>
      <View style={styles.filtros}>
        {STATUS_FILTERS.map((item) => (
          <TouchableOpacity
            key={item.value}
            onPress={() => setStatus(item.value)}
            style={[
              styles.botaoFiltro,
              status === item.value && styles.botaoFiltroAtivo,
            ]}
          >
            <Text
              style={[
                styles.textoFiltro,
                status === item.value && styles.textoFiltroAtivo,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text variant="labelLarge" style={styles.rotuloFiltro}>
        Tipo
      </Text>
      <View style={styles.filtros}>
        {TYPE_FILTERS.map((item) => (
          <TouchableOpacity
            key={item.value}
            onPress={() => setType(item.value)}
            style={[
              styles.botaoFiltro,
              type === item.value && styles.botaoFiltroAtivo,
            ]}
          >
            <Text
              style={[
                styles.textoFiltro,
                type === item.value && styles.textoFiltroAtivo,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {loading ? (
        <ActivityIndicator
          style={styles.loading}
          size="large"
          color="#E62429"
        />
      ) : (
        <FlatList
          data={obras}
          renderItem={({ item }) => (
            <CardObra
              obra={item}
              action={(obra) =>
                navigation.navigate("DetalheObra", { obraParam: obra })
              }
            />
          )}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={styles.vazio}>
              Nenhuma obra encontrada nesses filtros.
            </Text>
          }
          onRefresh={getObras}
          refreshing={loading}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.lista}
        />
      )}
      <FAB
        icon="plus"
        label="Adicionar obra"
        style={styles.fab}
        onPress={() => navigation.navigate("FormularioObra")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F5F5",
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  titulo: { fontWeight: "800" },
  subtitulo: { color: "#5F6368", marginBottom: 18, marginTop: 6 },
  rotuloFiltro: { marginBottom: 6 },
  filtros: { flexDirection: "row", gap: 6, marginBottom: 14 },
  botaoFiltro: {
    alignItems: "center",
    borderColor: "#79747E",
    borderRadius: 22,
    borderWidth: 1,
    flex: 1,
    height: 42,
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  botaoFiltroAtivo: { backgroundColor: "#E62429", borderColor: "#E62429" },
  textoFiltro: { color: "#E62429", fontSize: 14, fontWeight: "700" },
  textoFiltroAtivo: { color: "#FFFFFF" },
  lista: { paddingBottom: 100, flexGrow: 1 },
  loading: { marginTop: 32 },
  vazio: { color: "#5F6368", marginTop: 28, textAlign: "center" },
  fab: { bottom: 24, position: "absolute", right: 20 },
});
