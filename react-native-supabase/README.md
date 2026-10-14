# Cena Marcada

Aplicativo Expo para controlar filmes e séries que cada pessoa quer assistir, está assistindo ou já assistiu. A versão atual é totalmente local e foi preparada para uma aula posterior de Supabase.

## Executar

```bash
npm install
npm start
```

Use uma das contas mockadas abaixo (senha: `123456`):

| Nome | E-mail |
| --- | --- |
| Ana Silva | `ana@exemplo.com` |
| Bruno Costa | `bruno@exemplo.com` |

Também é possível criar uma conta. Usuários e obras adicionados existem somente enquanto o aplicativo permanece aberto; recarregar o bundle restaura `src/data/mockDatabase.json`.

## Organização

- `src/data/mockDatabase.json`: origem dos dados de demonstração.
- `src/services/authService.js`: login e cadastro mockados.
- `src/services/mediaService.js`: operações de listar, buscar, criar, atualizar e excluir obras.
- `src/services/mockStore.js`: estado em memória e isolamento das obras por usuário.
- `src/services/supabaseMappers.js`: conversão entre o formato das telas e as colunas do Supabase.
- `src/pages/FormularioObra.js`: formulário único para criação e edição.

Cada obra segue este contrato:

```js
{
  id: "work-1",
  userId: "user-demo-1",
  type: "movie", // ou "series"
  title: "Duna: Parte Dois",
  imageUrl: "https://...", // opcional; sem URL usa a imagem padrão do app
  synopsis: "...", // opcional
  status: "watched" // want_to_watch | watching | watched
}
```

## Próxima aula: Supabase

A migração deve preservar os contratos dos serviços e substituir apenas sua implementação por `@supabase/supabase-js`:

1. Executar [supabase/schema.sql](supabase/schema.sql) no SQL Editor para criar a tabela, índices, grants e políticas RLS.
2. No cadastro, usar `options.data.name`; para exibir o usuário, converter o retorno de Auth com `userFromSupabase`.
3. Trocar as quatro operações do `mockStore` em `mediaService.js` pelas consultas equivalentes, usando `workToSupabase` antes de inserir/atualizar e `workFromSupabase` após ler dados.
4. Nunca expor uma chave `service_role` no aplicativo; usar somente a URL e a chave pública/publicável por variáveis `EXPO_PUBLIC_`.

Assim, a navegação, os formulários e o contrato de dados permanecem os mesmos, enquanto persistência, sessão e autorização passam a ser fornecidas pelo Supabase.
