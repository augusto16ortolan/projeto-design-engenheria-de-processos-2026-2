import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, Alert, Button, StyleSheet, View } from "react-native";

const StackAuth = createNativeStackNavigator();
const StackApp = createNativeStackNavigator();

import Login from "../pages/Login";
import Cadastro from "../pages/Cadastro";
import ListaObras from "../pages/ListaObras";
import DetalheObra from "../pages/DetalheObra";
import FormularioObra from "../pages/FormularioObra";
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
          headerTitle: "Minha coleção",
        }}
      />
      <StackApp.Screen name="DetalheObra" component={DetalheObra} />
      <StackApp.Screen name="FormularioObra" component={FormularioObra} />
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
  const { authenticated, initializing } = useAuth();

  if (initializing) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#E62429" />
      </View>
    );
  }

  return authenticated ? <AppRoutes /> : <AuthRoutes />;
}

const styles = StyleSheet.create({
  loading: { alignItems: "center", flex: 1, justifyContent: "center" },
});
