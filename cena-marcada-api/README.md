# Cena Marcada API — Express, JSON e JWT

API própria para o aplicativo **Cena Marcada**. Ela substitui a autenticação e a tabela `works` do Supabase por endpoints Express com autenticação Bearer e um arquivo JSON local.

## Executar

```bash
cd cena-marcada-api
npm install
cp .env.example .env
npm run dev
```

A API inicia em `http://localhost:3001`. Para abrir no navegador, acesse [http://localhost:3001/api-docs](http://localhost:3001/api-docs). O documento OpenAPI bruto está em `GET /openapi.json`.

## Conta de demonstração

| E-mail | Senha |
| --- | --- |
| `professor@cenamarcada.dev` | `123456` |

Os dados ficam em `database.json`; senhas são guardadas como hash bcrypt, nunca em texto puro.

## Autenticação

1. Faça `POST /auth/login` ou `POST /auth/register`.
2. Guarde o `token` da resposta.
3. Envie `Authorization: Bearer SEU_TOKEN` nas rotas protegidas.
4. Para sair, o cliente deve descartar o token armazenado.

No Swagger, use **Authorize** e informe somente o token JWT. A API aceita CORS de desenvolvimento para Expo Web e para dispositivos físicos na mesma rede.

## Endpoints

| Método | Rota | Autenticação | Descrição |
| --- | --- | --- | --- |
| `GET` | `/health` | Não | Verifica se a API está ativa. |
| `POST` | `/auth/register` | Não | Cria uma conta e retorna usuário e JWT. |
| `POST` | `/auth/login` | Não | Autentica e retorna usuário e JWT. |
| `GET` | `/auth/me` | Sim | Retorna o usuário autenticado. |
| `GET` | `/works` | Sim | Lista as obras do usuário autenticado. |
| `GET` | `/works/:id` | Sim | Busca uma obra da própria coleção. |
| `POST` | `/works` | Sim | Cria uma obra para o usuário autenticado. |
| `PUT` | `/works/:id` | Sim | Substitui uma obra da própria coleção. |
| `DELETE` | `/works/:id` | Sim | Remove uma obra da própria coleção. |

`GET /works` aceita `type=movie|series` e `status=want_to_watch|watching|watched`; o resultado é ordenado por título. A resposta é `{ "data": [...] }`.

## Contrato de obra

As rotas de leitura retornam o formato já usado nas telas do app:

```json
{
  "id": "uuid",
  "userId": "uuid",
  "type": "movie",
  "title": "Duna: Parte Dois",
  "imageUrl": "https://...",
  "synopsis": "...",
  "status": "watched"
}
```

Para `POST` e `PUT`, envie somente `type`, `title`, `imageUrl`, `synopsis` e `status`. `imageUrl` e `synopsis` são opcionais; o servidor define `userId` a partir do token e ignora qualquer `userId` enviado pelo cliente.

```json
{
  "type": "series",
  "title": "The Last of Us",
  "imageUrl": "",
  "synopsis": "Uma jornada de sobrevivência.",
  "status": "want_to_watch"
}
```

Obras de outra conta são tratadas como não encontradas (`404`). Erros de validação retornam `400` com `error` e `fields`; token ausente, inválido ou expirado retorna `401`.

## Postman e testes

Importe `postman/Cena_Marcada_API.postman_collection.json`. Execute **Login (save token)** antes das rotas protegidas: a coleção salva automaticamente `token` e `workId`.

```bash
npm test
```

Os testes usam um banco temporário e verificam autenticação, UUIDs, filtros, CRUD, validação, isolamento entre contas e CORS.
