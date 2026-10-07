import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Button, Alert } from "react-native";

const StackAuth = createNativeStackNavigator();
const StackApp = createNativeStackNavigator();

import Login from "../pages/Login";
import Cadastro from "../pages/Cadastro";
import ListaObras from "../pages/ListaObras";
import DetalheObra from "../pages/DetalheObra";
import InformacoesDesenvolvedor from "../pages/InformacoesDesenvolvedor";

import { useAuth } from "../context/AuthContext";

function AuthRoutes() {
  return (
    <StackAuth.Navigator
      initialRouteName="Login"
      screenOptions={{
        //headerShown: false,
        headerBackTitle: "Voltar",
      }}
    >
      <StackAuth.Screen
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
      <StackAuth.Screen name="Cadastro" component={Cadastro} />
    </StackAuth.Navigator>
  );
}

function AppRoutes() {
  return (
    <StackApp.Navigator initialRouteName="ListaObras">
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
          headerBackTitle: "Voltar",
        }}
        name="InformacoesDesenvolvedor"
        component={InformacoesDesenvolvedor}
      />
    </StackApp.Navigator>
  );
}

export default function Routes() {
  const { authenticated } = useAuth();

  return authenticated ? <AppRoutes /> : <AuthRoutes />;
}
