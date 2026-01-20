# Blog API

API REST para gerenciamento de blog construída com NestJS, TypeScript e TypeORM. Oferece funcionalidades completas de autenticação, gerenciamento de usuários, posts e upload de imagens.

## 🚀 Funcionalidades

- **Autenticação JWT**: Sistema completo de autenticação com tokens JWT
- **Gerenciamento de Usuários**: CRUD completo de usuários com hash de senhas usando bcrypt
- **Gerenciamento de Posts**: Criação, edição, listagem e exclusão de posts
- **Sistema de Slug**: Geração automática de slugs únicos para posts
- **Upload de Imagens**: Upload e servir imagens com validação de tipo
- **Posts Públicos/Privados**: Controle de visibilidade de posts (publicado/rascunho)
- **Proteção de Rotas**: Guards JWT para rotas protegidas
- **Rate Limiting**: Throttling para proteção contra abuso de API
- **Segurança**: Helmet, CORS configurável e validação de dados
- **Banco de Dados**: SQLite com TypeORM

## 🛠️ Tecnologias

- **Framework**: NestJS 11.x
- **Linguagem**: TypeScript
- **ORM**: TypeORM
- **Banco de Dados**: SQLite (better-sqlite3)
- **Autenticação**: Passport + JWT
- **Validação**: class-validator + class-transformer
- **Segurança**: Helmet, bcryptjs
- **Upload**: Multer (integrado ao NestJS)

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn

## ⚙️ Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd blog-api
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto:
```env
PORT=3000
JWT_SECRET=sua_chave_secreta_jwt
JWT_EXPIRATION_TIME=1d
CORS_WHITELIST=http://localhost:3000,http://localhost:4200
```

## 🚀 Executando a aplicação

```bash
# Modo desenvolvimento
npm run start:dev

# Modo produção
npm run build
npm run start:prod

# Modo debug
npm run start:debug
```

A API estará disponível em `http://localhost:3000`

## 📚 Estrutura do Projeto

```
src/
├── auth/               # Módulo de autenticação
│   ├── guards/        # JWT Guards
│   ├── dto/           # DTOs de autenticação
│   └── types/         # Tipos TypeScript
├── user/              # Módulo de usuários
│   ├── dto/           # DTOs de usuário
│   └── entities/      # Entidade User
├── post/              # Módulo de posts
│   ├── dto/           # DTOs de post
│   └── entities/      # Entidade Post
├── upload/            # Módulo de upload
├── common/            # Módulos compartilhados
│   ├── filters/       # Exception filters
│   ├── hashing/       # Serviços de hash
│   ├── pipes/         # Pipes customizados
│   └── utils/         # Utilitários
└── main.ts            # Entry point
```

## 🔑 Endpoints Principais

### Autenticação
- `POST /auth/login` - Login de usuário

### Usuários
- `POST /user` - Criar novo usuário
- `GET /user/me` - Obter usuário autenticado (protegido)
- `PATCH /user/me` - Atualizar usuário autenticado (protegido)
- `PATCH /user/me/password` - Alterar senha (protegido)
- `DELETE /user/me` - Deletar conta (protegido)

### Posts
- `GET /post` - Listar posts públicos
- `GET /post/:slug` - Obter post público por slug
- `POST /post/me` - Criar post (protegido)
- `GET /post/me` - Listar posts do usuário (protegido)
- `GET /post/me/:id` - Obter post do usuário por ID (protegido)
- `PATCH /post/me/:id` - Atualizar post (protegido)
- `DELETE /post/me/:id` - Deletar post (protegido)

### Upload
- `POST /upload/image` - Upload de imagem (protegido)
- `GET /uploads/*` - Servir arquivos estáticos

## 📝 Scripts REST Client

O projeto inclui arquivos `.http` na pasta `rest-client/` para testar os endpoints:
- `user-requests.http` - Requisições de usuários
- `post-requests.http` - Requisições de posts
- `upload-requests.http` - Requisições de upload

Use a extensão REST Client do VS Code para executá-los.