import { HelperText, TextInput } from "react-native-paper";

export default function CampoTexto({ label, valor, setValor, erro, ...rest }) {
  return (
    <>
      <TextInput
        label={label}
        mode="outlined"
        value={valor}
        onChangeText={setValor}
        error={Boolean(erro)}
        style={{ marginBottom: erro ? 0 : 14 }}
        theme={{ colors: { background: "#FFFFFF" } }}
        {...rest}
      />
      {erro ? <HelperText type="error">{erro}</HelperText> : null}
    </>
  );
}
