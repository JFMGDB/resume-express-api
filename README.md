# Currículo Express API

API REST para gerenciamento de currículos profissionais. Este projeto é um backend headless que serve como uma única fonte de verdade para dados de currículo.

## Tecnologias

- **Runtime:** Node.js 20.x (LTS)
- **Framework:** Express.js 4.18.x
- **Linguagem:** TypeScript 5.x
- **ORM:** Prisma 6.x
- **Banco de Dados:** PostgreSQL 16.x
- **Validação:** Zod 3.x
- **Testes:** Jest 29.x, Supertest 6.x
- **Deploy:** Vercel (Serverless)

## Estrutura do Projeto

```
resume-express-api/
├── prisma/
│   ├── schema.prisma       # Definição do modelo de dados
│   ├── migrations/         # Migrações SQL geradas pelo Prisma
│   └── seed.ts             # Script de seed para popular o banco
├── src/
│   ├── config/             # Configuração (database, env)
│   ├── controllers/        # Camada de Controladores
│   ├── dtos/              # DTOs (Data Transfer Objects) - Zod schemas
│   ├── interfaces/        # Interfaces TypeScript
│   ├── middlewares/       # Middlewares (error, validation, auth)
│   ├── repositories/      # Camada de Repositórios
│   ├── routes/            # Definição das rotas da API
│   ├── services/          # Camada de Serviços (Lógica de Negócios)
│   ├── app.ts             # Criação e configuração do app Express
│   └── server.ts          # Ponto de entrada: inicializa o servidor
├── tests/
│   ├── integration/       # Testes de Integração (Jest + Supertest)
│   ├── unit/              # Testes Unitários (Jest + Mocks)
│   └── setup.ts           # Configuração global de testes
├── .env                   # Variáveis de ambiente (secretas)
├── .env.example           # Template das variáveis de ambiente
├── .eslintrc.js           # Configuração do ESLint
├── .prettierrc            # Configuração do Prettier
├── jest.config.js         # Configuração do Jest
├── tsconfig.json          # Configuração do TypeScript
└── package.json
```

## Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd resume-express-api
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` e configure:
- `DATABASE_URL`: URL de conexão do PostgreSQL (obrigatório)
- `API_SECRET_KEY`: Chave secreta para autenticação da API (obrigatório)
- `PORT`: Porta do servidor (opcional, padrão: 3000)
- `NODE_ENV`: Ambiente (opcional, padrão: development)
- `DATABASE_URL_TEST`: URL de conexão do PostgreSQL para testes (opcional)

**Nota:** As variáveis de ambiente obrigatórias são validadas na inicialização da aplicação. Se alguma variável obrigatória não for encontrada, a aplicação lançará um erro.

4. Configure o banco de dados:
```bash
# Gerar o Prisma Client
npm run prisma:generate

# Executar migrações
npm run prisma:migrate

# Popular o banco com dados de exemplo (opcional)
npm run prisma:seed
```

## Scripts Disponíveis

- `npm run dev`: Inicia o servidor em modo desenvolvimento com hot-reload
- `npm run build`: Compila o TypeScript para JavaScript
- `npm start`: Inicia o servidor em produção
- `npm test`: Executa todos os testes
- `npm run test:unit`: Executa apenas testes unitários
- `npm run test:integration`: Executa apenas testes de integração
- `npm run test:watch`: Executa testes em modo watch
- `npm run test:coverage`: Gera relatório de cobertura de testes
- `npm run lint`: Verifica erros de lint
- `npm run lint:fix`: Corrige erros de lint automaticamente
- `npm run format`: Formata o código com Prettier
- `npm run format:check`: Verifica se o código está formatado
- `npm run prisma:generate`: Gera o Prisma Client
- `npm run prisma:migrate`: Executa migrações do banco de dados
- `npm run prisma:seed`: Popula o banco com dados de exemplo
- `npm run prisma:studio`: Abre o Prisma Studio (GUI para o banco)

## Arquitetura

O projeto segue uma **Arquitetura em Camadas (Layered Architecture)**:

1. **Routes Layer** (`src/routes`): Define as rotas da API
2. **Controllers Layer** (`src/controllers`): Orquestra as chamadas para a camada de serviços
3. **Services Layer** (`src/services`): Contém a lógica de negócios
4. **Repositories Layer** (`src/repositories`): Abstrai o acesso ao banco de dados (única camada que usa Prisma)

### Fluxo de Requisição

1. Request HTTP → Routes
2. Routes → Middleware de Validação (Zod)
3. Middleware → Controller
4. Controller → Service
5. Service → Repository
6. Repository → Prisma Client → Database
7. Resposta retorna pela mesma cadeia
8. Em caso de erro → Middleware de Error Handler

### Middlewares

O projeto implementa os seguintes middlewares globais:

- **Error Handler** (`src/middlewares/error.middleware.ts`): Trata erros de forma centralizada, incluindo:
  - Erros de validação Zod (400)
  - Erros do Prisma (P2002, P2025, P2003, P2004, etc.)
  - Erros customizados da aplicação (ex: `NotFoundError` - 404)
  - Logs de erro em desenvolvimento

- **Validation Middleware** (`src/middlewares/validation.middleware.ts`): Validação genérica usando Zod:
  - Suporta validação de body, query e params separadamente
  - Suporta schema único para validação do body
  - Propaga erros de validação para o error handler

## Endpoints

### Health Check

- `GET /api/v1/health`: Retorna o status da API

**Resposta de Sucesso (200):**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

### Rota Raiz

- `GET /`: Retorna informações básicas da API

**Resposta de Sucesso (200):**
```json
{
  "message": "Currículo Express API",
  "version": "1.0.0",
  "status": "running"
}
```

### People (Pessoas)

#### Listar Todas as Pessoas

- `GET /api/v1/people`: Lista todas as pessoas cadastradas

**Resposta de Sucesso (200):**
```json
[
  {
    "id": "clxmg9v4o000008l4f3h3g3q3",
    "full_name": "João Silva",
    "headline": "Desenvolvedor Full-Stack Sênior",
    "summary": "Engenheiro de software com 8 anos de experiência...",
    "location": "São Paulo, Brasil",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Buscar Pessoa por ID

- `GET /api/v1/people/:id`: Busca uma pessoa específica pelo ID

**Parâmetros:**
- `id` (string, obrigatório): ID da pessoa (cuid)

**Resposta de Sucesso (200):**
```json
{
  "id": "clxmg9v4o000008l4f3h3g3q3",
  "full_name": "João Silva",
  "headline": "Desenvolvedor Full-Stack Sênior",
  "summary": "Engenheiro de software com 8 anos de experiência...",
  "location": "São Paulo, Brasil",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Resposta de Erro (404):**
```json
{
  "status": "error",
  "message": "Person not found"
}
```

#### Criar Nova Pessoa

- `POST /api/v1/people`: Cria uma nova pessoa

**Body (JSON):**
```json
{
  "full_name": "João Silva",
  "headline": "Desenvolvedor Full-Stack Sênior",
  "summary": "Engenheiro de software com 8 anos de experiência na construção de aplicações web escaláveis.",
  "location": "São Paulo, Brasil"
}
```

**Campos:**
- `full_name` (string, obrigatório): Nome completo (mínimo 3 caracteres, máximo 255)
- `headline` (string, obrigatório): Título profissional (mínimo 3 caracteres, máximo 255)
- `summary` (string, obrigatório): Resumo profissional (mínimo 10 caracteres)
- `location` (string, opcional): Localização (máximo 255 caracteres)

**Resposta de Sucesso (201):**
```json
{
  "id": "clxmg9v4o000008l4f3h3g3q3",
  "full_name": "João Silva",
  "headline": "Desenvolvedor Full-Stack Sênior",
  "summary": "Engenheiro de software com 8 anos de experiência...",
  "location": "São Paulo, Brasil",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Resposta de Erro (400) - Validação:**
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "code": "too_small",
      "path": ["body", "full_name"],
      "message": "Nome completo deve ter pelo menos 3 caracteres"
    }
  ]
}
```

#### Atualizar Pessoa

- `PUT /api/v1/people/:id`: Atualiza uma pessoa existente

**Parâmetros:**
- `id` (string, obrigatório): ID da pessoa (cuid)

**Body (JSON) - Todos os campos são opcionais:**
```json
{
  "headline": "Desenvolvedor Full-Stack Sênior | Node.js & TypeScript",
  "location": "Rio de Janeiro, Brasil"
}
```

**Campos:**
- `full_name` (string, opcional): Nome completo (mínimo 3 caracteres, máximo 255)
- `headline` (string, opcional): Título profissional (mínimo 3 caracteres, máximo 255)
- `summary` (string, opcional): Resumo profissional (mínimo 10 caracteres)
- `location` (string, opcional): Localização (máximo 255 caracteres)

**Resposta de Sucesso (200):**
```json
{
  "id": "clxmg9v4o000008l4f3h3g3q3",
  "full_name": "João Silva",
  "headline": "Desenvolvedor Full-Stack Sênior | Node.js & TypeScript",
  "summary": "Engenheiro de software com 8 anos de experiência...",
  "location": "Rio de Janeiro, Brasil",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T12:00:00.000Z"
}
```

**Resposta de Erro (404):**
```json
{
  "status": "error",
  "message": "Person not found"
}
```

#### Deletar Pessoa

- `DELETE /api/v1/people/:id`: Deleta uma pessoa e todos os seus dados relacionados (cascata)

**Parâmetros:**
- `id` (string, obrigatório): ID da pessoa (cuid)

**Resposta de Sucesso (204):** Sem conteúdo

**Resposta de Erro (404):**
```json
{
  "status": "error",
  "message": "Person not found"
}
```

## Tratamento de Erros

A API retorna erros padronizados no seguinte formato:

```json
{
  "status": "error",
  "message": "Descrição do erro",
  "errors": [] // Apenas para erros de validação
}
```

### Códigos de Status HTTP

- `400`: Bad Request - Erro de validação (Zod) ou constraint do banco
- `404`: Not Found - Registro não encontrado
- `409`: Conflict - Violação de constraint única
- `500`: Internal Server Error - Erro genérico do servidor ou banco de dados

### Erros do Prisma Tratados

- `P2002`: Unique constraint violation (409)
- `P2025`: Record not found (404)
- `P2003`: Foreign key constraint violation (400)
- `P2004`: Invalid value for field type (400)

## Testes

### Testes Unitários

Testam a lógica de negócios isoladamente, usando mocks do repositório com `jest-mock-extended`:

```bash
npm run test:unit
```

**Localização:** `tests/unit/`

**Exemplos:**
- `tests/unit/health.controller.test.ts` - Testes do Health Controller
- `tests/unit/people.service.test.ts` - Testes do People Service (100% de cobertura)

### Testes de Integração

Testam o fluxo completo da API, incluindo banco de dados:

```bash
npm run test:integration
```

**Localização:** `tests/integration/`

**Exemplos:**
- `tests/integration/health.api.test.ts` - Testes da Health API
- `tests/integration/people.api.test.ts` - Testes completos da People API (todos os endpoints CRUD)

**Nota:** Os testes de integração requerem um banco de dados de teste configurado em `DATABASE_URL_TEST`.

### Configuração de Testes

O arquivo `tests/setup.ts` configura o ambiente de testes globalmente, incluindo:
- Limpeza de mocks após cada teste
- Configuração para uso de `jest-mock-extended` quando necessário

## Deploy

O projeto está configurado para deploy na Vercel. O script `vercel-build` garante que:

1. O Prisma Client seja gerado
2. As migrações sejam aplicadas
3. O TypeScript seja compilado


