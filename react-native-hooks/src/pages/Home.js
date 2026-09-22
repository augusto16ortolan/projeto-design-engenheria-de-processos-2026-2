import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ActivityIndicator,
  Button,
  Image,
  Alert,
  FlatList,
} from "react-native";
import { useState, useEffect, useLayoutEffect } from "react";

export default function Home() {
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [loading, setLoading] = useState(false);
  const [visivel, setVisivel] = useState(false);

  const pessoas = [
    {
      id: 1,
      nome: "Ana Souza",
      idade: 24,
      email: "ana.souza@email.com",
      cidade: "Porto Alegre",
      foto: "https://randomuser.me/api/portraits/women/1.jpg",
    },
    {
      id: 2,
      nome: "Bruno Martins",
      idade: 29,
      email: "bruno.martins@email.com",
      cidade: "Passo Fundo",
      foto: "https://randomuser.me/api/portraits/men/2.jpg",
    },
    {
      id: 3,
      nome: "Carolina Lima",
      idade: 21,
      email: "carolina.lima@email.com",
      cidade: "Caxias do Sul",
      foto: "https://randomuser.me/api/portraits/women/3.jpg",
    },
    {
      id: 4,
      nome: "Daniel Oliveira",
      idade: 32,
      email: "daniel.oliveira@email.com",
      cidade: "Florianópolis",
      foto: "https://randomuser.me/api/portraits/men/4.jpg",
    },
    {
      id: 5,
      nome: "Eduarda Ribeiro",
      idade: 27,
      email: "eduarda.ribeiro@email.com",
      cidade: "Curitiba",
      foto: "https://randomuser.me/api/portraits/women/5.jpg",
    },
    {
      id: 6,
      nome: "Felipe Costa",
      idade: 25,
      email: "felipe.costa@email.com",
      cidade: "Chapecó",
      foto: "https://randomuser.me/api/portraits/men/6.jpg",
    },
    {
      id: 7,
      nome: "Gabriela Alves",
      idade: 30,
      email: "gabriela.alves@email.com",
      cidade: "Santa Maria",
      foto: "https://randomuser.me/api/portraits/women/7.jpg",
    },
    {
      id: 8,
      nome: "Henrique Santos",
      idade: 23,
      email: "henrique.santos@email.com",
      cidade: "Erechim",
      foto: "https://randomuser.me/api/portraits/men/8.jpg",
    },
    {
      id: 9,
      nome: "Isabela Ferreira",
      idade: 28,
      email: "isabela.ferreira@email.com",
      cidade: "Lajeado",
      foto: "https://randomuser.me/api/portraits/women/9.jpg",
    },
    {
      id: 10,
      nome: "João Pereira",
      idade: 26,
      email: "joao.pereira@email.com",
      cidade: "Bento Gonçalves",
      foto: "https://randomuser.me/api/portraits/men/10.jpg",
    },
  ];

  useLayoutEffect(() => {
    console.log("Use layout");
  }, []);

  useEffect(() => {
    console.log("Use Effect");
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setNome("Augusto");
    }, 5000);
  }, []);

  function iniciarCarregamento() {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }

  return (
    <View style={styles.container}>
      <View style={styles.containerInput}>
        <Text style={styles.label}>Nome</Text>
        <TextInput
          value={nome}
          onChangeText={setNome}
          style={styles.input}
          placeholder="Digite o seu nome"
        />
      </View>
      <Text>{nome}</Text>

      <Button
        title={"Exibir alert"}
        onPress={() => {
          if (nome == "") {
            Alert.alert("Informe o nome corretamente");
            return;
          }

          Alert.alert(nome);
        }}
      />
      <Button title="Clique aqui" onPress={() => iniciarCarregamento()} />
      {loading && <ActivityIndicator size={"large"} color={"red"} />}

      <Button
        onPress={() => setVisivel(!visivel)}
        title={`Clique aqui para ${visivel ? "ESCONDER" : "APARECER"}`}
      />
      {visivel && (
        <Image
          height={300}
          width={300}
          source={{
            uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdRSUqwJuwo2WPJmxLTJViVLNW9Ihh7KlRt9nKoXL6eg&s=10",
          }}
        />
      )}
      <FlatList
        data={pessoas}
        renderItem={({ item }) => (
          <View
            style={{
              borderWidth: 1,
              width: 300,
              height: 200,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text>{item.nome}</Text>
            <Image
              height={80}
              width={80}
              source={{
                uri: item.foto,
              }}
            />
          </View>
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 22,
    color: "#000",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    width: 300,
    height: 50,
    fontSize: 22,
    paddingLeft: 10,
    borderRadius: 15,
    justifyContent: "center",
  },
  containerInput: {
    alignItems: "flex-start",
    gap: 10,
  },
});
