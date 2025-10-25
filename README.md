# EducaGames Frontend

Este é o repositório do frontend do projeto EducaGames.

## Configuração do Projeto

Para configurar e rodar o projeto localmente, siga os passos abaixo:

### Pré-requisitos

Certifique-se de ter o Node.js e o npm (ou Yarn) instalados em sua máquina.

### Instalação

1. Clone este repositório (se ainda não o fez):

    ```bash
    git clone https://github.com/Tipimenta/educa-games.git
    cd educa-games
    ```

2. Instale as dependências do projeto:

    ```bash
    npm install
    # ou yarn install
    ```

3. Configure as variáveis de ambiente:

    - Copie `.env.example` para `.env`
    - Ajuste conforme necessário:

    Observações:
    - `VITE_USE_MOCKS=true` ativa respostas mock no `src/services/api.js`.
    - Defina `VITE_USE_MOCKS=false` quando usar backend.

### Executando o Projeto

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
# ou yarn dev
```

O aplicativo estará disponível em `http://localhost:5172` (ou outra porta, se configurado).

## Estrutura de Pastas

- `src/`: Contém o código fonte da aplicação.
  - `assets/`: Imagens, ícones e outros recursos estáticos.
  - `components/`: Componentes React reutilizáveis.
  - `constants/`: Constantes e configurações globais.
  - `context/`: Contextos React para gerenciamento de estado global.
  - `hooks/`: Hooks React personalizados.
  - `lib/`: Funções utilitárias e bibliotecas auxiliares.
  - `pages/`: Páginas da aplicação, incluindo a subpasta `Admin` para funcionalidades administrativas.
  - `services/`: Serviços para comunicação com a API.
- `public/`: Arquivos estáticos que são servidos diretamente.
- `vite.config.js`: Configuração do Vite.
- `package.json`: Gerenciamento de dependências e scripts do projeto.

## Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento.
- `npm run build`: Compila o projeto para produção.
- `npm run lint`: Executa o linter para verificar problemas de código.
- `npm run preview`: Serve a build de produção localmente.

## Contribuição

Sinta-se à vontade para contribuir com o projeto. Por favor, siga as diretrizes de contribuição (se houver).

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
