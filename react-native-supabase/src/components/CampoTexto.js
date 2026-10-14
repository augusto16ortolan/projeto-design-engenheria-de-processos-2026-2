import { TextInput } from "react-native-paper";

export default function CampoTexto({ label, valor, setValor, ...rest }) {
  return (
    <TextInput
      label={label}
      mode="outlined"
      value={valor}
      onChangeText={setValor}
      style={{ marginBottom: 14 }}
      theme={{ colors: { background: "#FFFFFF" } }}
      {...rest}
    />
  );
}
