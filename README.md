# EducaGames Frontend

Frontend do projeto EducaGames, baseado em React + Vite com Tailwind.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black&style=for-the-badge)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white&style=for-the-badge)](https://vitejs.dev)
[![React Query](https://img.shields.io/badge/React%20Query-5-FF4154?logo=reactquery&logoColor=white&style=for-the-badge)](https://tanstack.com/query)
[![Zod](https://img.shields.io/badge/Zod-4-2F2F2F?logo=semanticweb&logoColor=white&style=for-the-badge)](https://zod.dev)
[![React Router](https://img.shields.io/badge/React%20Router-7-CA4245?logo=reactrouter&logoColor=white&style=for-the-badge)](https://reactrouter.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwindcss&logoColor=white&style=for-the-badge)](https://tailwindcss.com)

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
   - Crie um arquivo `.env` na raiz do projeto e ajuste conforme necessário.
   - **Variáveis obrigatórias:**
     - `VITE_API_BASE_URL`: URL base da API (obrigatória)
       - Exemplo produção: `https://api.educagames.com`
       - Exemplo desenvolvimento: `http://localhost:3000`
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
├── .eslintcache
├── .gitattributes
├── .gitignore
├── .husky\
│   ├── _\
│   └── pre-commit
├── .prettierrc.json
├── .vscode\
├── CHANGELOG.md
├── LICENSE
├── README.md
├── components.json          
├── docs\                   
│   └── release-notes\
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
├── vercel.json             
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

## Tecnologias e Bibliotecas Principais

### Core

- **React 19** - Biblioteca principal
- **Vite 6** - Build tool e dev server
- **React Router DOM 7** - Roteamento
- **React Query (TanStack Query) 5** - Gerenciamento de estado de servidor e cache

### UI e Estilização

- **Tailwind CSS 4** - Framework CSS utilitário
- **shadcn/ui** - Componentes UI baseados em Radix UI
- **Radix UI** - Componentes acessíveis (Popover, Slot)
- **Lucide React** - Biblioteca de ícones
- **Recharts** - Gráficos e visualizações
- **React Day Picker** - Seletor de datas

### Editor e Conteúdo

- **TipTap** - Editor de texto rico
- **Highlight.js** - Syntax highlighting para blocos de código
- **Lowlight** - Integração do Highlight.js com TipTap

### Utilitários

- **Axios** - Cliente HTTP
- **Zod 4** - Validação de schemas
- **@dnd-kit** - Drag and drop para ordenação
- **class-variance-authority** - Gerenciamento de variantes de componentes
- **clsx** e **tailwind-merge** - Utilitários para classes CSS

## Configuração da API e Mocks

- A URL base da API é configurada via `VITE_API_BASE_URL` em `src/services/api.js` (variável obrigatória).
- `VITE_USE_MOCKS=true` habilita respostas mock para autenticação em `src/services/api.js`.
- **Importante:** Configure CORS no backend para aceitar requisições do frontend em desenvolvimento (ex: `http://localhost:5173`).

## Deploy

O projeto está configurado para deploy no **Vercel** através do arquivo `vercel.json`. Para fazer deploy:

1. Conecte o repositório à Vercel
2. Configure as variáveis de ambiente na plataforma
3. O build será executado automaticamente com `npm run build`

## Changelog

Para ver todas as mudanças do projeto, consulte o [CHANGELOG.md](CHANGELOG.md). Release notes detalhadas estão disponíveis em `docs/release-notes/`.

## Contribuição

Sinta-se à vontade para contribuir. Ajuste lint/format antes do commit.

## Licença

MIT. Veja `LICENSE`.
