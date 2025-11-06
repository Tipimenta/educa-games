# EducaGames Frontend

Frontend do projeto EducaGames, baseado em React + Vite com Tailwind.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black&style=for-the-badge)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white&style=for-the-badge)](https://vitejs.dev)
[![React Query](https://img.shields.io/badge/React%20Query-5-FF4154?logo=reactquery&logoColor=white&style=for-the-badge)](https://tanstack.com/query)
[![Zod](https://img.shields.io/badge/Zod-4-2F2F2F?logo=semanticweb&logoColor=white&style=for-the-badge)](https://zod.dev)

## Pré-requisitos

- Node.js 18+ e npm (ou Yarn)

## Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/Tipimenta/educa-games.git
   cd educa-games
   ```

2. Instale as dependências:

   ```bash
   npm install
   # ou yarn install
   ```

3. Configure o ambiente:
   - Copie `.env.example` para `.env` e ajuste conforme necessário.
   - **Variáveis obrigatórias:**
     - `VITE_API_BASE_URL`: URL base da API (obrigatória)
       - Produção: `VITE_API_BASE_URL`
       - Desenvolvimento: `VITE_API_BASE_URL`
   - **Variáveis opcionais:**
     - `VITE_DEV_SERVER_PORT`: porta do dev server (default: 5173).
     - `VITE_USE_MOCKS`: `true/false` para habilitar mocks no `src/services/api.js`.

## Executando o Projeto

```bash
npm run dev
# ou yarn dev
```

- Por padrão roda em `http://localhost:5173`.
- Se você definir `VITE_DEV_SERVER_PORT`, a porta muda (verifique o output do terminal).

## Scripts Disponíveis

- `npm run dev`: inicia o servidor de desenvolvimento.
- `npm run build`: compila para produção.
- `npm run preview`: serve a build de produção localmente.
- `npm run lint`: executa o linter.
- `npm run lint:fix`: executa o linter com correções automáticas.
- `npm run format`: formata o código com Prettier.
- `npm run prepare`: configura hooks do Husky.

## Estrutura de Pastas

```
├── .editorconfig
├── .env.example
├── .eslintcache
├── .gitattributes
├── .gitignore
├── .husky\
│   ├── _\
│   └── pre-commit
├── .prettierrc.json
├── .vscode\
├── LICENSE
├── README.md
├── components.json
├── eslint.config.mjs
├── index.html
├── jsconfig.json
├── package-lock.json
├── package.json
├── public\
├── src\
│   ├── App.jsx
│   ├── assets\
│   ├── components\
│   ├── constants\
│   ├── context\
│   ├── hooks\
│   ├── index.css
│   ├── lib\
│   ├── main.jsx
│   ├── mocks\
│   ├── pages\
│   ├── providers\
│   ├── routes\
│   ├── schemas\
│   ├── services\
│   └── utils\
└── vite.config.js
```

Nota rápida sobre imports: há alias `@` para `src/*` (ver `jsconfig.json`). Prefira importar via diretórios, ex.: `import { Button } from '@/components'`.

## Arquitetura de Dados

O projeto utiliza **React Query (TanStack Query)** para gerenciamento de estado de servidor, cache e mutations.

### Padrões de Código

- **Serviços (`src/services/`)**: Centraliza todas as chamadas de API usando Axios. Cada entidade possui seu próprio serviço (ex: `users.js`, `courses.js`, `invites.js`).
- **Hooks customizados (`src/hooks/`)**: Encapsulam lógica de React Query para consumo de dados. Exemplos: `useUsers()`, `useCourses()`, `useClassrooms()`, `useInvites()`.
- **Componentes**: Nenhum componente deve usar `fetch`/`axios`/`useEffect` diretamente para carregar dados. Use apenas hooks customizados.
- **Mutations**: Todas as mutações (create, update, delete) invalidam o cache automaticamente usando `queryClient.invalidateQueries()`.

### Exemplo de Uso

```javascript
// ❌ NÃO fazer isso em componentes
useEffect(() => {
  fetch(`${import.meta.env.VITE_API_BASE_URL}/users`).then(...)
}, [])

// ✅ Fazer isso
import { useUsers } from '@/hooks';
const { data, isLoading, error } = useUsers();
```

### Configuração do React Query

O `QueryClient` está configurado em `src/App.jsx` com:

- `staleTime`: 5 minutos
- `refetchOnWindowFocus`: false
- `retry`: 1 para queries, 0 para mutations

## Configuração da API e Mocks

- A URL base da API é configurada via `VITE_API_BASE_URL` em `src/services/api.js` (variável obrigatória).
- `VITE_USE_MOCKS=true` habilita respostas mock para autenticação em `src/services/api.js`.
- **Importante:** Configure CORS no backend para aceitar requisições do frontend em desenvolvimento (ex: `http://localhost:5173`).

## Contribuição

Sinta-se à vontade para contribuir. Ajuste lint/format antes do commit.

## Licença

MIT. Veja `LICENSE`.
