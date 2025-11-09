# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [1.1.0] - 2025-11-09

### Adicionado

- `DatePicker` para campos de data
- `ClassSelectionModal` para seleção de turmas
- `useProfile` para gerenciamento de perfil
- Serviço `profile.js` e schema `profileSchema.js`

### Alterado

- Ajustes em `Header`, `Modal`, `ConfirmationDialog`
- Refinos na `LandingPage` e `PricingSection`

### Notas

- Sem breaking changes
- Detalhes completos em [docs/release-notes/v1.1.0.md](docs/release-notes/v1.1.0.md)

---

## [1.0.0] - 2025-11-06

### Adicionado

- Interface de autenticação completa (login, cadastro via convite, recuperação de senha)
- Landing page responsiva com seções de features, pricing e testimonials
- Dashboard para estudantes com visão geral de progresso e estatísticas
- Sistema de cursos e módulos para estudantes com visualização de conteúdo
- Gerenciamento de turmas para instrutores (criação, listagem, detalhes)
- Gerenciamento de cursos para instrutores (criação, edição, organização)
- Editor de módulos e conteúdo para instrutores (aulas, quizzes, recursos)
- Gerenciamento de anúncios para instrutores
- Sistema de relatórios e análises para instrutores
- Perfil de estudante detalhado para instrutores
- Gerenciamento de instrutores para administradores (listagem, exclusão, alteração de status)
- Sistema de quizzes interativo com pontuação
- Sistema de progresso de estudantes com rastreamento de aulas completadas
- Componentes reutilizáveis (tabelas, modais, formulários, badges, etc.)
- Layout responsivo com sidebar e header adaptativos
- Sistema de rotas protegidas por role (ADMIN, INSTRUCTOR, STUDENT)
- Integração com React Query para gerenciamento de estado e cache
- Context API para estado global (autenticação, cursos, módulos, etc.)
- Validação de formulários com Zod
- Tratamento de erros centralizado com ErrorBoundary
- Sistema de toasts para notificações
- Sistema de confirmação de ações com diálogos
- Paginação e ordenação em tabelas
- Busca e filtros em listagens
- Integração completa com API REST
- Suporte a mocks para desenvolvimento
- Configuração de ambiente via variáveis (.env)
- Build otimizado com Vite
- Linting e formatação automática (ESLint, Prettier)
- Hooks do Git (Husky) para qualidade de código

### Nota

Funcionalidades anteriores à versão 1.0.0 foram consolidadas nesta versão inicial.
Para documentação detalhada, consulte [docs/release-notes/v1.0.0.md](docs/release-notes/v1.0.0.md).

---

[1.0.0]: https://github.com/issaahr/educa-games/releases/tag/v1.0.0
[1.1.0]: https://github.com/issaahr/educa-games/releases/tag/v1.1.0
