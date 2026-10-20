# Cena Marcada

Aplicativo Expo para controlar filmes e séries que cada pessoa quer assistir, está assistindo ou já assistiu. Autenticação, sessão e obras são persistidas no Supabase.

## Configuração e execução

1. Crie um projeto no Supabase e, em **Authentication > Providers > Email**, mantenha e-mail habilitado e desative **Confirm email** para que o cadastro entre automaticamente.
2. Execute [supabase/schema.sql](supabase/schema.sql) no SQL Editor do projeto.
3. Crie um arquivo `.env` local, que não deve ser versionado:

```env
EXPO_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=sua-chave-publica-ou-publicavel
```

Use somente uma chave pública/publicável. Nunca inclua uma chave `service_role` no aplicativo.

4. Instale e execute:

```bash
npm install
npm start
```

Crie uma conta pelo aplicativo. O cadastro inicia a sessão imediatamente e cada pessoa só pode acessar as próprias obras.

## Organização

- `supabase/supabase.js`: cliente Supabase com sessão persistida em AsyncStorage.
- `supabase/schema.sql`: tabela `works`, índices, grants e políticas RLS.
- `src/services/authService.js`: login, cadastro e logout pelo Supabase Auth.
- `src/services/mediaService.js`: operações de listar, buscar, criar, atualizar e excluir obras no Supabase.
- `src/services/supabaseMappers.js`: conversão entre o formato das telas e as colunas do PostgreSQL.
- `src/pages/FormularioObra.js`: formulário único para criação e edição.

Cada obra segue este contrato:

```js
{
  id: "uuid",
  userId: "uuid",
  type: "movie", // ou "series"
  title: "Duna: Parte Dois",
  imageUrl: "https://...", // opcional; sem URL usa a imagem padrão do app
  synopsis: "...", // opcional
  status: "watched" // want_to_watch | watching | watched
}
```
