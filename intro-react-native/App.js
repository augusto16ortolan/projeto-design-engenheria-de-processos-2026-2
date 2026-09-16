import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";

export default function App() {
  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.texto}>Gremio nao tem mundial</Text>
        <StatusBar style="auto" />
        <Button
          title="Clique aqui"
          onPress={() => {
            Alert.alert("Teste");
            alert("teste");
          }}
        />
        <TouchableOpacity
          onPress={() => {
            Alert.alert("Produto teste");
          }}
        >
          <Image
            height={300}
            width={300}
            source={{
              uri: "https://images.tcdn.com.br/img/img_prod/829162/produto_teste_nao_compre_81_1_2d7f0b8fa031db8286665740dd8de217.jpg",
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: "red",
            width: 300,
            height: 60,
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => {
            Alert.alert("Produto teste");
          }}
        >
          <Text
            style={{
              fontSize: 20,
              color: "#fff",
            }}
          >
            Exibir alert
          </Text>
        </TouchableOpacity>

        <Image
          height={300}
          width={300}
          source={{
            uri: "https://images.tcdn.com.br/img/img_prod/829162/produto_teste_nao_compre_81_1_2d7f0b8fa031db8286665740dd8de217.jpg",
          }}
        />
        <Image
          height={300}
          width={300}
          source={{
            uri: "https://images.tcdn.com.br/img/img_prod/829162/produto_teste_nao_compre_81_1_2d7f0b8fa031db8286665740dd8de217.jpg",
          }}
        />
        <Image
          height={300}
          width={300}
          source={{
            uri: "https://images.tcdn.com.br/img/img_prod/829162/produto_teste_nao_compre_81_1_2d7f0b8fa031db8286665740dd8de217.jpg",
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  texto: {
    fontSize: 30,
    fontWeight: "bold",
    color: "blue",
    marginBottom: 50,
  },
});
