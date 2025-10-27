# EducaGames Frontend

Frontend do projeto EducaGames, baseado em React + Vite com Tailwind.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black&style=for-the-badge)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white&style=for-the-badge)](https://vitejs.dev)
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
   - Variáveis disponíveis:
     - `VITE_API_PROXY_TARGET`: URL do backend para proxy (`/api`).
     - `VITE_DEV_SERVER_PORT`: porta do dev server (default: 5172).
     - `VITE_USE_MOCKS`: `true/false` para habilitar mocks no `src/services/api.js`.

## Executando o Projeto

```bash
npm run dev
# ou yarn dev
```

- Por padrão roda em `http://localhost:5172`.
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
// Directory tree (3 levels, limitado a 200 entradas)
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
│   ├── android-chrome-192x192.png
│   ├── android-chrome-512x512.png
│   ├── apple-touch-icon.png
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   ├── favicon.ico
│   └── site.webmanifest
├── src\
│   ├── App.jsx
│   ├── assets\
│   │   ├── +.svg
│   │   └── +EducaGames.svg
│   ├── components\
│   │   ├── AuthLayout.jsx
│   │   ├── Button.jsx
│   │   ├── DashboardCard.jsx
│   │   ├── ErrorMessage.jsx
│   │   ├── Header.jsx
│   │   ├── Icons.jsx
│   │   ├── Input.jsx
│   │   ├── Modal.jsx
│   │   ├── PasswordInput.jsx
│   │   ├── Quiz.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Stepper.jsx
│   │   ├── Toast.jsx
│   │   └── index.js
│   ├── constants\
│   │   ├── index.js
│   │   └── roles.js
│   ├── context\
│   │   ├── AuthContext.jsx
│   │   ├── ToastContext.jsx
│   │   └── index.js
│   ├── hooks\
│   │   ├── index.js
│   │   ├── useAuth.js
│   │   └── useToast.js
│   ├── index.css
│   ├── lib\
│   │   ├── errors.js
│   │   └── utils.js
│   ├── main.jsx
│   ├── mocks\
│   │   └── data.js
│   ├── pages\
│   │   ├── Admin\
│   │   ├── Cadastro.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   ├── Profile.jsx
│   │   ├── RecuperarSenha.jsx
│   │   ├── RedefinirSenha.jsx
│   │   └── StudentCourses.jsx
│   ├── routes\
│   │   ├── AppRoutes.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── index.js
│   ├── schemas\
│   │   ├── cadastroSchema.js
│   │   ├── helpers.js
│   │   ├── index.js
│   │   └── loginSchema.js
│   └── services\
│       ├── api.js
│       └── index.js
└── vite.config.js
```

Nota rápida sobre imports: há alias `@` para `src/*` (ver `jsconfig.json`). Prefira importar via diretórios, ex.: `import { Button } from '@/components'`.

## Proxy e Mocks

- Proxy `/api` é configurado em `vite.config.js` via `VITE_API_PROXY_TARGET`.
- `VITE_USE_MOCKS=true` habilita respostas mock para autenticação em `src/services/api.js`.

## Contribuição

Sinta-se à vontade para contribuir. Ajuste lint/format antes do commit.

## Licença

MIT. Veja `LICENSE`.
