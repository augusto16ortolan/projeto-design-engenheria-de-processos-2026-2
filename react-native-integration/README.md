# Cena Marcada — esqueleto para integração com API

Este projeto contém somente a interface e a estrutura necessária para integrar o aplicativo à `cena-marcada-api` durante a aula. Ele não possui dependências, arquivos ou chamadas de outro serviço — e também ainda não consome a API.

Os arquivos de serviço e contexto foram criados com assinaturas, contratos e comentários para guiar a implementação ao vivo.

## Preparação

```bash
cd react-native-integration
npm install
cp .env.example .env
npm start
```

Configure `EXPO_PUBLIC_API_URL` no `.env`:

- Expo Web no mesmo computador: `http://localhost:3001`
- Expo Go em celular físico: `http://IP-DA-SUA-MAQUINA:3001`

No celular, `localhost` aponta para o próprio dispositivo, não para o computador que executa a API.

## Arquivos para completar na aula

1. `src/services/api.js`: completar o cliente Axios e os headers Bearer.
2. `src/services/authService.js`: implementar cadastro e login usando `/auth/register` e `/auth/login`.
3. `src/context/AuthContext.js`: persistir o JWT no AsyncStorage e restaurar a sessão em `/auth/me`.
4. `src/services/mediaService.js`: implementar listagem, filtros e CRUD em `/works`.

O contexto será responsável por configurar o token no interceptor Axios; as telas não precisam repassá-lo para cada função de serviço. Não há requisições nem persistência implementadas ainda.

## Contratos da Cena Marcada API

- `POST /auth/register` e `POST /auth/login` recebem os dados da conta e retornam `{ user, token }`.
- `GET /auth/me` e as rotas `/works` recebem `Authorization: Bearer TOKEN`.
- `GET /works?type=&status=` retorna `{ data: Work[] }`.
- Uma obra possui `id`, `userId`, `type`, `title`, `imageUrl`, `synopsis` e `status`.
- `userId` é definido pelo servidor a partir do token e não deve ser enviado pelo aplicativo.

Use o Swagger em [http://localhost:3001/api-docs](http://localhost:3001/api-docs) durante a aula para consultar os exemplos de requisição e resposta.
