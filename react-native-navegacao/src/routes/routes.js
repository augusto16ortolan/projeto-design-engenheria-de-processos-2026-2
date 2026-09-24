import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Button, Alert } from "react-native";

const StackApp = createNativeStackNavigator();

import Login from "../pages/Login";
import Cadastro from "../pages/Cadastro";
import ListaObras from "../pages/ListaObras";
import DetalheObra from "../pages/DetalheObra";
import InformacoesDesenvolvedor from "../pages/InformacoesDesenvolvedor";

export default function Routes() {
  return (
    <StackApp.Navigator
      initialRouteName="Login"
      screenOptions={{
        //headerShown: false,
        headerBackTitle: "Voltar",
      }}
    >
      <StackApp.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false,
          headerTitle: "Entrar",
          headerTitleAlign: "center",
          headerRight: () => {
            return <Button title="Info" onPress={() => Alert.alert("Info")} />;
          },
        }}
      />
      <StackApp.Screen name="Cadastro" component={Cadastro} />
      <StackApp.Screen
        name="ListaObras"
        component={ListaObras}
        options={{
          headerBackVisible: false,
          headerTitle: "Filmes e Séries",
        }}
      />
      <StackApp.Screen name="DetalheObra" component={DetalheObra} />
      <StackApp.Screen
        options={{
          headerTitle: "Informações",
        }}
        name="InformacoesDesenvolvedor"
        component={InformacoesDesenvolvedor}
      />
    </StackApp.Navigator>
  );
}
