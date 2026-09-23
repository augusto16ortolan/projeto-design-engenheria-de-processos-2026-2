import { StatusBar } from "expo-status-bar";
import { MD3LightTheme, PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

import Login from "./src/pages/Login";
import Cadastro from "./src/pages/Cadastro";
import ListaObras from "./src/pages/ListaObras";
import DetalheObra from "./src/pages/DetalheObra";
import InformacoesDesenvolvedor from "./src/pages/InformacoesDesenvolvedor";

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={tema}>
        <StatusBar style="light" />
        <Login />
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const tema = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#E62429",
    secondary: "#F9AA0C",
    background: "#FFFFFF",
    surface: "#FFFFFF",
  },
};
