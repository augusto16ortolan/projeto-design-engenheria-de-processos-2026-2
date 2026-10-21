# Material de apoio — integração React Native + Cena Marcada API

Este roteiro acompanha o projeto `react-native-integration`. Ele está propositalmente sem chamadas prontas: a implementação é feita em aula, passo a passo.

## Objetivo da aula

Ao final, o aplicativo deve:

1. Cadastrar e autenticar uma pessoa pela API.
2. Guardar dados de sessão no dispositivo e tentar entrar automaticamente ao reabrir o app.
3. Enviar o JWT em toda rota protegida.
4. Listar, filtrar, criar, editar e excluir obras da coleção da pessoa autenticada.

## 0. Preparação do ambiente

Em um terminal, inicie a API:

```bash
cd cena-marcada-api
npm start
```

Ela fica disponível em `http://localhost:3001` e o Swagger está em `http://localhost:3001/api-docs`.

No projeto mobile, copie o arquivo de ambiente:

```bash
cd react-native-integration
cp .env.example .env
```

Configure a URL conforme o destino:

```env
# Expo Web no mesmo computador
EXPO_PUBLIC_API_URL=http://localhost:3001

# Expo Go em celular físico: troque pelo IP local do computador
# EXPO_PUBLIC_API_URL=http://192.168.0.10:3001
```

`localhost` no celular aponta para o próprio celular, não para a máquina que executa a API. Celular e computador também precisam estar na mesma rede.

Conta de demonstração da API:

| E-mail | Senha |
| --- | --- |
| `professor@cenamarcada.dev` | `123456` |

## 1. Conhecer os contratos

### Autenticação

| Método | Rota | Body | Resposta principal |
| --- | --- | --- |
| `POST` | `/auth/register` | `name`, `email`, `password` | `user`, `token` |
| `POST` | `/auth/login` | `email`, `password` | `user`, `token` |
| `GET` | `/auth/me` | — | `user` |

Exemplo de login:

```json
POST /auth/login

{
  "email": "professor@cenamarcada.dev",
  "password": "123456"
}
```

```json
{
  "message": "Login successful.",
  "user": {
    "id": "a4fbfb49-2d4e-4a01-8ee3-12976d0d48ed",
    "name": "Professor",
    "email": "professor@cenamarcada.dev"
  },
  "token": "eyJ..."
}
```

O `token` é um JWT válido por uma hora. Nas rotas protegidas, o cabeçalho é:

```http
Authorization: Bearer eyJ...
```

### Obras

Uma obra retornada pela API possui:

```js
{
  id: "uuid",
  userId: "uuid",
  type: "movie", // movie | series
  title: "Duna: Parte Dois",
  imageUrl: "", // opcional
  synopsis: "", // opcional
  status: "want_to_watch" // want_to_watch | watching | watched
}
```

O aplicativo **não envia `userId`**. A API determina o dono pelo JWT recebido.

| Método | Rota | Uso |
| --- | --- | --- |
| `GET` | `/works` | Lista as obras da pessoa autenticada. |
| `GET` | `/works/:id` | Busca uma obra da própria coleção. |
| `POST` | `/works` | Cria uma obra. |
| `PUT` | `/works/:id` | Substitui uma obra. |
| `DELETE` | `/works/:id` | Exclui uma obra. |

## 2. Preparar o cliente Axios

Arquivo: `src/services/api.js`.

O objetivo é centralizar Axios, URL base, JSON, Bearer token e erros. Assim os outros serviços não repetem essa lógica. O projeto segue o mesmo padrão de `react-native-navegacao/src/services/api.js`.

```js
import axios from "axios";

const baseURL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "");
let authToken = null;

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

export function setAuthToken(token) {
  authToken = token;
}

export default api;
```

Pontos para explicar:

- Axios transforma respostas JSON automaticamente em `response.data`.
- Axios rejeita automaticamente status fora da faixa `2xx`; a mensagem da API está em `error.response?.data?.error`.
- O interceptor adiciona o token a uma única configuração, sem repeti-lo nas chamadas.
- `DELETE` retorna `204`, então `response.data` será `undefined` — e isso é esperado.
- A URL fica no `.env`, não espalhada pelas telas.

## 3. Cadastro e login

Arquivo: `src/services/authService.js`.

Implemente as duas funções usando Axios:

```js
import api from "./api";
import { getErrorMessage } from "../utils/error";

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

export async function login(email, password) {
  try {
    const { data } = await api.post("/auth/login", {
      email: normalizeEmail(email),
      password,
    });

    return { success: true, user: data.user, token: data.token };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.error || getErrorMessage(error, "Não foi possível entrar agora."),
    };
  }
}

export async function register(name, email, password) {
  try {
    const { data } = await api.post("/auth/register", {
      name: name.trim(),
      email: normalizeEmail(email),
      password,
    });

    return { success: true, user: data.user, token: data.token };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.error || getErrorMessage(error, "Não foi possível criar a conta agora."),
    };
  }
}
```

Teste sugerido antes de conectar as telas:

1. Login com a conta demo retorna `success: true` e um token.
2. Senha errada retorna `success: false` e a mensagem da API.
3. Cadastro com e-mail já existente retorna `409` e uma mensagem compreensível.

## 4. Sessão e login automático com AsyncStorage

Arquivo: `src/context/AuthContext.js`.

`AsyncStorage` é um armazenamento chave-valor persistente no dispositivo. A dependência já está instalada.

### Demonstração didática: guardar e-mail e senha

Para demonstrar login automático rapidamente, podemos salvar as credenciais após um login bem-sucedido e chamar login novamente ao abrir o aplicativo.

> **Atenção para explicar à turma:** guardar senha em `AsyncStorage` é inseguro e não deve ser usado em aplicações reais. O armazenamento não é criptografado; uma pessoa com acesso ao dispositivo ou a um backup pode obter a senha. Esta técnica é apenas uma demonstração didática temporária.

Chaves sugeridas:

```js
const CREDENTIALS_KEY = "@cena-marcada/credentials";
```

Importe as dependências:

```js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import api, { setAuthToken } from "../services/api";
```

Após login ou cadastro, salve as credenciais **somente na demonstração**:

```js
async function saveDemoCredentials(email, password) {
  await AsyncStorage.setItem(
    CREDENTIALS_KEY,
    JSON.stringify({ email, password }),
  );
}
```

No login, depois de receber sucesso:

```js
if (response.success) {
  await saveDemoCredentials(email, password);
  setAuthToken(response.token);
  setToken(response.token);
  setUser(response.user);
}
```

Para entrar automaticamente ao abrir o app:

```js
useEffect(() => {
  let active = true;

  async function restoreSession() {
    try {
      const rawCredentials = await AsyncStorage.getItem(CREDENTIALS_KEY);
      if (!rawCredentials) return;

      const { email, password } = JSON.parse(rawCredentials);
      const response = await login(email, password);

      if (active && response.success) {
        setAuthToken(response.token);
        setToken(response.token);
        setUser(response.user);
      }
    } catch (_error) {
      await AsyncStorage.removeItem(CREDENTIALS_KEY);
    } finally {
      if (active) setInitializing(false);
    }
  }

  restoreSession();
  return () => {
    active = false;
  };
}, []);
```

### JWT somente em memória

Neste roteiro, o JWT não é salvo no AsyncStorage. Depois de login ou cadastro, `setAuthToken(response.token)` o mantém apenas no interceptor Axios enquanto o app está aberto. Ao abrir o app outra vez, o login automático usa as credenciais armazenadas para pedir um novo token à API.

Para produção, a estratégia deve mudar: não persistir senha e usar uma sessão/refresh token protegido pelo armazenamento seguro do sistema operacional (Keychain no iOS e Keystore no Android).

### Logout

O logout da API JWT é local: apagamos o estado e os dados persistidos.

```js
async function sair() {
  await AsyncStorage.removeItem(CREDENTIALS_KEY);
  setAuthToken(null);
  setToken(null);
  setUser(null);
  return { success: true };
}
```

Se a aula usar apenas o fluxo recomendado com token, remova `CREDENTIALS_KEY` da lista.

## 5. CRUD das obras

Arquivo: `src/services/mediaService.js`.

Importe `api` de `./api`; o interceptor já envia o token definido por `setAuthToken`.

### Dados enviados no POST e PUT

```js
{
  type: "movie",
  title: "A Chegada",
  imageUrl: "",
  synopsis: "Contato com alienígenas.",
  status: "watching"
}
```

Validações que vale manter antes da chamada:

```js
const VALID_TYPES = ["movie", "series"];
const VALID_STATUSES = ["want_to_watch", "watching", "watched"];

function validateWork(data) {
  if (!VALID_TYPES.includes(data.type)) return "Selecione o tipo da obra.";
  if (!data.title?.trim()) return "Informe o título.";
  if (data.imageUrl?.trim() && !/^https?:\/\/.+/.test(data.imageUrl.trim())) {
    return "Informe uma URL de imagem válida (http ou https).";
  }
  if (!VALID_STATUSES.includes(data.status)) return "Selecione o status.";
  return null;
}
```

### Criar

```js
export async function createMedia(data) {
  const validation = validateWork(data);
  if (validation) return { success: false, message: validation };

  try {
    const response = await api.post("/works", {
      type: data.type,
      title: data.title.trim(),
      imageUrl: data.imageUrl?.trim() || "",
      synopsis: data.synopsis?.trim() || "",
      status: data.status,
    });
    return { success: true, media: response.data };
  } catch (error) {
    return { success: false, message: error.response?.data?.error || getErrorMessage(error, "Não foi possível adicionar a obra.") };
  }
}
```

### Buscar, editar e excluir

```js
export async function getMediaById(id) {
  try {
    const response = await api.get(`/works/${id}`);
    return { success: true, media: response.data };
  } catch (error) {
    return { success: false, message: error.response?.data?.error || getErrorMessage(error, "Não foi possível carregar esta obra.") };
  }
}

export async function updateMedia(id, data) {
  const validation = validateWork(data);
  if (validation) return { success: false, message: validation };

  try {
    const response = await api.put(`/works/${id}`, {
      type: data.type,
      title: data.title.trim(),
      imageUrl: data.imageUrl?.trim() || "",
      synopsis: data.synopsis?.trim() || "",
      status: data.status,
    });
    return { success: true, media: response.data };
  } catch (error) {
    return { success: false, message: error.response?.data?.error || getErrorMessage(error, "Não foi possível salvar as alterações.") };
  }
}

export async function deleteMedia(id) {
  try {
    await api.delete(`/works/${id}`);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.response?.data?.error || getErrorMessage(error, "Não foi possível excluir a obra.") };
  }
}
```

`DELETE` retorna `204`, por isso o `response.data` do Axios será `undefined`; a operação ainda foi concluída corretamente.

## 6. Listagem e filtros

Sim, a API já possui filtros. `GET /works` aceita:

| Query parameter | Valores | Exemplo |
| --- | --- | --- |
| `type` | `movie`, `series` | `/works?type=series` |
| `status` | `want_to_watch`, `watching`, `watched` | `/works?status=watched` |

Eles podem ser combinados:

```text
GET /works?type=series&status=want_to_watch
```

A API já limita os resultados ao usuário do token e os ordena por título.

Implementação sugerida:

```js
export async function getMedias(filters) {
  try {
    const response = await api.get("/works", { params: filters });
    return { success: true, medias: response.data.data };
  } catch (error) {
    return { success: false, message: error.response?.data?.error || getErrorMessage(error, "Não foi possível carregar suas obras.") };
  }
}
```

No contexto, chame `setAuthToken(token)` depois de login, cadastro ou restauração de sessão. O interceptor envia o header Bearer automaticamente; as telas não recebem nem repassam token. Não passe `userId` para a API.

## 7. Ordem sugerida da demonstração

1. Abrir o Swagger e testar login manualmente; mostrar o token.
2. Configurar Axios e observar a primeira chamada no console de rede.
3. Implementar login e cadastro em `authService`.
4. Atualizar `AuthContext` para guardar usuário/token em memória.
5. Demonstrar o login automático com e-mail e senha no AsyncStorage e explicar por que é inseguro.
6. Mostrar a alternativa: persistir somente o JWT e validar com `/auth/me`.
7. Implementar a listagem simples de obras.
8. Adicionar os filtros por tipo e status.
9. Implementar criação, edição e exclusão.
10. Fechar com logout e limpeza do armazenamento local.

## 8. Checklist de teste em aula

- [ ] API está em execução e o Swagger abre.
- [ ] `EXPO_PUBLIC_API_URL` aponta para a máquina correta.
- [ ] Login com a conta demo funciona.
- [ ] Login com senha inválida mostra a mensagem da API.
- [ ] Cadastro cria uma conta e autentica a pessoa.
- [ ] Ao reabrir o app, a estratégia de login automático funciona.
- [ ] Logout remove os dados persistidos e retorna para login.
- [ ] Lista mostra apenas as obras do usuário autenticado.
- [ ] Filtro por tipo funciona.
- [ ] Filtro por status funciona.
- [ ] Criar, editar e excluir uma obra atualiza a lista.
- [ ] Token ausente ou expirado direciona a pessoa de volta ao login.

## 9. Problemas comuns

| Sintoma | Possível causa | Ação |
| --- | --- | --- |
| `Network request failed` no celular | URL com `localhost` ou dispositivos em redes diferentes | Usar o IP local do computador e confirmar a mesma rede. |
| `401 Token is invalid or expired` | Token ausente, inválido ou vencido | Limpar a sessão e autenticar novamente. |
| `404 Work was not found` | ID inexistente ou obra de outra pessoa | Atualizar a lista e usar uma obra da conta atual. |
| `400 Invalid data` | Campos obrigatórios ou valores inválidos | Conferir `type`, `title`, `status` e URL da imagem. |
| App continua com valor antigo do `.env` | Metro manteve cache | Reiniciar com `npx expo start -c`. |

## 10. Mensagens-chave para reforçar

- A tela conversa com serviços; o serviço conversa com a API.
- O token identifica a pessoa no servidor; o cliente não escolhe o `userId`.
- Persistência de sessão e persistência de senha são problemas diferentes.
- Armazenar senha localmente é uma simplificação didática, não uma prática de produção.
- A validação no aplicativo melhora a experiência, mas a validação no servidor continua obrigatória.
