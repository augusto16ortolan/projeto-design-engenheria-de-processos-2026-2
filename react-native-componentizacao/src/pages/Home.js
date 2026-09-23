import { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";

import { Button, TextInput } from "react-native-paper";

import AcaoRapida from "../components/AcaoRapida";
import Aviso from "../components/Aviso";
import BotaoFiltro from "../components/BotaoFiltro";
import CardEstatistica from "../components/CardEstatistica";
import CampoTexto from "../components/CampoTexto";
import Botao from "../components/Botao";
import TituloSecao from "../components/TituloSecao";
import CardPessoa from "../components/CardPessoa";

import pessoas from "../data/pessoas";

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

      <Button
        icon="camera"
        mode="contained"
        onPress={() => console.log("Pressed")}
      >
        Press me
      </Button>

      <TextInput
        label="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />

      <CampoTexto
        label={"Buscar pessoa"}
        valor={busca}
        setValor={setBusca}
        placeholder={"Digite um nome"}
      />

      <CampoTexto
        label={"Seu nome"}
        valor={nome}
        setValor={setNome}
        placeholder={"Digite o seu nome"}
      />

      <CampoTexto
        label={"Seu email"}
        valor={email}
        setValor={setEmail}
        placeholder="nome@email.com"
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Botao
        label={"Cadastrar pessoa"}
        action={() =>
          Alert.alert("Cadastro", `Nome: ${nome}\nE-mail: ${email}`)
        }
      />

      <Botao
        label={"Visualizar cadastro"}
        action={() =>
          Alert.alert(
            "Dados preenchidos",
            `Busca: ${busca}\nNome: ${nome}\nE-mail: ${email}`,
          )
        }
      />

      <Botao
        label={"Limpar campos"}
        action={() => {
          setBusca("");
          setNome("");
          setEmail("");
        }}
        type="secondary"
      />

      <Botao
        label={"Preencher exemplo"}
        action={() => {
          setBusca("Ana");
          setNome("Ana Souza");
          setEmail("ana.souza@email.com");
        }}
        type="secondary"
      />

      <TituloSecao titulo="Resumo da turma" />

      <View style={styles.statisticsContainer}>
        <CardEstatistica
          numero="32"
          label="Alunos"
          action={() => Alert.alert("Alunos", "Ha 32 alunos cadastrados.")}
        />

        <CardEstatistica
          numero="4"
          label="Cidades"
          action={() =>
            Alert.alert("Cidades", "A turma possui alunos de 4 cidades.")
          }
        />

        <CardEstatistica
          numero="8"
          label="Projetos"
          action={() => Alert.alert("Projetos", "Ha 8 projetos em andamento.")}
        />
      </View>

      <TituloSecao titulo="Filtrar por cidade" />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterList}
      >
        <BotaoFiltro
          label="Todos"
          ativo
          action={() => Alert.alert("Filtro", "Exibindo todas as pessoas.")}
        />
        <BotaoFiltro
          label="Porto Alegre"
          action={() =>
            Alert.alert("Filtro", "Exibindo pessoas de Porto Alegre.")
          }
        />
        <BotaoFiltro
          label="Caxias do Sul"
          action={() =>
            Alert.alert("Filtro", "Exibindo pessoas de Caxias do Sul.")
          }
        />
        <BotaoFiltro
          label="Passo Fundo"
          action={() =>
            Alert.alert("Filtro", "Exibindo pessoas de Passo Fundo.")
          }
        />
      </ScrollView>

      <TituloSecao titulo="Acoes rapidas" />

      <View style={styles.quickActionsContainer}>
        <AcaoRapida
          icone="+"
          label="Adicionar"
          action={() => Alert.alert("Nova pessoa", "Abra o formulario acima.")}
        />
        <AcaoRapida
          icone="#"
          label="Projetos"
          action={() => Alert.alert("Projetos", "Nenhum projeto selecionado.")}
        />
        <AcaoRapida
          icone="@"
          label="Mensagens"
          action={() =>
            Alert.alert("Mensagens", "Voce nao possui novas mensagens.")
          }
        />
      </View>

      <TituloSecao titulo="Avisos" />

      <Aviso
        icone="!"
        titulo="Entrega do projeto"
        texto="Prazo: sexta-feira, 26 de setembro."
        labelAcao="Ver detalhes"
        action={() =>
          Alert.alert("Projeto", "Lembre-se de enviar o link do repositorio.")
        }
      />
      <Aviso
        icone="i"
        titulo="Proxima aula"
        texto="Vamos praticar a criacao de componentes."
        labelAcao="Ver agenda"
        action={() =>
          Alert.alert("Aula", "Prepare seu projeto para a pratica.")
        }
      />

      <TituloSecao titulo="Lista da turma" />

      {pessoas.map((pessoa) => {
        return <CardPessoa key={pessoa.id} pessoa={pessoa} />;
      })}
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
  statisticsContainer: {
    flexDirection: "row",
    gap: 10,
  },
  filterList: {
    flexGrow: 0,
  },
  quickActionsContainer: {
    flexDirection: "row",
    gap: 10,
  },
});
