import { useState } from "react";
import { Alert, FlatList, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";

import CardObra from "../components/CardObra";
import obras from "../data/obras";

const filtros = ["Todos", "Filmes", "Séries"];
const tiposPorFiltro = { Filmes: "Filme", Séries: "Série" };

export default function ListaObras({ onSelecionarObra }) {
  const [filtroAtivo, setFiltroAtivo] = useState("Todos");

  const obrasFiltradas = obras.filter((obra) => {
    if (filtroAtivo === "Todos") return true;
    return obra.tipo === tiposPorFiltro[filtroAtivo];
  });

  function selecionarObra(obra) {
    if (onSelecionarObra) onSelecionarObra(obra);
    else
      Alert.alert(
        obra.titulo,
        "Na aula, este toque abrirá a tela de detalhes.",
      );
  }

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.titulo}>
        Catálogo Marvel
      </Text>
      <Text variant="bodyMedium" style={styles.subtitulo}>
        Escolha filmes, séries ou veja todas as obras.
      </Text>
      <View style={styles.filtros}>
        {filtros.map((filtro) => (
          <Button
            key={filtro}
            mode={filtroAtivo === filtro ? "contained" : "outlined"}
            onPress={() => setFiltroAtivo(filtro)}
            style={styles.botaoFiltro}
          >
            {filtro}
          </Button>
        ))}
      </View>
      <FlatList
        data={obrasFiltradas}
        renderItem={({ item }) => (
          <CardObra obra={item} action={selecionarObra} />
        )}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.lista}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F5F5",
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 58,
  },
  titulo: { fontWeight: "800" },
  subtitulo: { color: "#5F6368", marginBottom: 18, marginTop: 6 },
  filtros: { flexDirection: "row", gap: 8, marginBottom: 18 },
  botaoFiltro: { flex: 1 },
  lista: { paddingBottom: 30 },
});
