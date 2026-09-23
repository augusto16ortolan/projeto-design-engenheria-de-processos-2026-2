# Cine Marvel — preparação para a aula de navegação

Este projeto ainda **não possui uma biblioteca de navegação instalada**. As telas, os nomes das rotas e os dados locais já estão prontos para a demonstração em aula.

- `src/pages/Login.js`: entrada do aplicativo.
- `src/pages/Cadastro.js`: criação de conta.
- `src/pages/ListaObras.js`: catálogo de filmes e séries Marvel, com filtro.
- `src/pages/DetalheObra.js`: detalhes da obra selecionada.
- `src/pages/InformacoesDesenvolvedor.js`: informações do desenvolvedor, pronta para ser acessada por outra tela.
- `src/components`: campo e cartão reutilizáveis.
- `src/data`: fontes locais de filmes, séries e catálogo unificado.

`App.js` renderiza somente `Login`, para continuar executável antes da aula. Os callbacks opcionais das telas são os pontos claros para conectar o React Navigation depois.

O visual usa `react-native-paper` (`PaperProvider`, `Button`, `TextInput`, `Card`, `Chip` e `Avatar`). Nenhum pacote de navegação foi adicionado.
