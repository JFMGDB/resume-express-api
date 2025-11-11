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

### Experience (Experiências Profissionais)

#### Criar Nova Experiência

- `POST /api/v1/experience`: Cria uma nova experiência profissional

**Body (JSON):**
```json
{
  "peopleId": "clxmg9v4o000008l4f3h3g3q3",
  "company": "Tech Corp",
  "position": "Desenvolvedor Full-Stack",
  "start_date": "2020-01-01T00:00:00.000Z",
  "end_date": "2022-12-31T23:59:59.999Z",
  "description": "Desenvolvimento de aplicações web escaláveis usando React e Node.js",
  "location": "São Paulo, Brasil"
}
```

**Campos:**
- `peopleId` (string, obrigatório): ID da pessoa (cuid)
- `company` (string, obrigatório): Nome da empresa (mínimo 2 caracteres, máximo 255)
- `position` (string, obrigatório): Cargo ocupado (mínimo 2 caracteres, máximo 255)
- `start_date` (string, obrigatório): Data de início (formato ISO 8601)
- `end_date` (string, opcional): Data de término (formato ISO 8601, null se for o emprego atual)
- `description` (string, opcional): Descrição da experiência
- `location` (string, opcional): Localização (máximo 255 caracteres)

**Resposta de Sucesso (201):** Retorna o objeto Experience criado

**Resposta de Erro (404):** Se `peopleId` não existir

#### Buscar Experiência por ID

- `GET /api/v1/experience/:id`: Busca uma experiência específica pelo ID

**Parâmetros:**
- `id` (string, obrigatório): ID da experiência (cuid)

**Resposta de Sucesso (200):** Retorna o objeto Experience

**Resposta de Erro (404):** Se a experiência não existir

#### Atualizar Experiência

- `PUT /api/v1/experience/:id`: Atualiza uma experiência existente

**Parâmetros:**
- `id` (string, obrigatório): ID da experiência (cuid)

**Body (JSON) - Todos os campos são opcionais:**
```json
{
  "company": "New Tech Corp",
  "position": "Desenvolvedor Full-Stack Sênior",
  "description": "Nova descrição"
}
```

**Resposta de Sucesso (200):** Retorna o objeto Experience atualizado

**Resposta de Erro (404):** Se a experiência não existir

#### Deletar Experiência

- `DELETE /api/v1/experience/:id`: Deleta uma experiência

**Parâmetros:**
- `id` (string, obrigatório): ID da experiência (cuid)

**Resposta de Sucesso (204):** Sem conteúdo

**Resposta de Erro (404):** Se a experiência não existir

### Education (Formação Acadêmica)

#### Criar Nova Educação

- `POST /api/v1/education`: Cria uma nova formação acadêmica

**Body (JSON):**
```json
{
  "peopleId": "clxmg9v4o000008l4f3h3g3q3",
  "institution": "Universidade Federal",
  "degree": "Bacharelado em Ciência da Computação",
  "field_of_study": "Ciência da Computação",
  "start_date": "2015-01-01T00:00:00.000Z",
  "end_date": "2019-12-31T23:59:59.999Z",
  "description": "Formação com foco em desenvolvimento de software"
}
```

**Campos:**
- `peopleId` (string, obrigatório): ID da pessoa (cuid)
- `institution` (string, obrigatório): Nome da instituição (mínimo 2 caracteres, máximo 255)
- `degree` (string, obrigatório): Grau obtido (mínimo 2 caracteres, máximo 255)
- `field_of_study` (string, opcional): Área de estudo (máximo 255 caracteres)
- `start_date` (string, obrigatório): Data de início (formato ISO 8601)
- `end_date` (string, opcional): Data de término (formato ISO 8601, null se estiver cursando)
- `description` (string, opcional): Descrição adicional

**Resposta de Sucesso (201):** Retorna o objeto Education criado

#### Buscar Educação por ID

- `GET /api/v1/education/:id`: Busca uma educação específica pelo ID

**Parâmetros:**
- `id` (string, obrigatório): ID da educação (cuid)

**Resposta de Sucesso (200):** Retorna o objeto Education

#### Atualizar Educação

- `PUT /api/v1/education/:id`: Atualiza uma educação existente

**Parâmetros:**
- `id` (string, obrigatório): ID da educação (cuid)

**Body (JSON) - Todos os campos são opcionais**

**Resposta de Sucesso (200):** Retorna o objeto Education atualizado

#### Deletar Educação

- `DELETE /api/v1/education/:id`: Deleta uma educação

**Parâmetros:**
- `id` (string, obrigatório): ID da educação (cuid)

**Resposta de Sucesso (204):** Sem conteúdo

### Projects (Projetos)

#### Criar Novo Projeto

- `POST /api/v1/projects`: Cria um novo projeto

**Body (JSON):**
```json
{
  "peopleId": "clxmg9v4o000008l4f3h3g3q3",
  "name": "Portfolio Website",
  "description": "Site de portfólio pessoal desenvolvido com React e TypeScript",
  "url": "https://joaosilva.dev",
  "repository_url": "https://github.com/joaosilva/portfolio",
  "start_date": "2023-01-01T00:00:00.000Z",
  "end_date": "2023-06-30T23:59:59.999Z"
}
```

**Campos:**
- `peopleId` (string, obrigatório): ID da pessoa (cuid)
- `name` (string, obrigatório): Nome do projeto (mínimo 2 caracteres, máximo 255)
- `description` (string, obrigatório): Descrição do projeto (mínimo 10 caracteres)
- `url` (string, opcional): URL do projeto (deve ser uma URL válida)
- `repository_url` (string, opcional): URL do repositório (deve ser uma URL válida)
- `start_date` (string, obrigatório): Data de início (formato ISO 8601)
- `end_date` (string, opcional): Data de término (formato ISO 8601)

**Resposta de Sucesso (201):** Retorna o objeto Projects criado

#### Buscar Projeto por ID

- `GET /api/v1/projects/:id`: Busca um projeto específico pelo ID

**Parâmetros:**
- `id` (string, obrigatório): ID do projeto (cuid)

**Resposta de Sucesso (200):** Retorna o objeto Projects

#### Atualizar Projeto

- `PUT /api/v1/projects/:id`: Atualiza um projeto existente

**Parâmetros:**
- `id` (string, obrigatório): ID do projeto (cuid)

**Body (JSON) - Todos os campos são opcionais**

**Resposta de Sucesso (200):** Retorna o objeto Projects atualizado

#### Deletar Projeto

- `DELETE /api/v1/projects/:id`: Deleta um projeto

**Parâmetros:**
- `id` (string, obrigatório): ID do projeto (cuid)

**Resposta de Sucesso (204):** Sem conteúdo

### Contacts (Contatos)

#### Criar Novo Contato

- `POST /api/v1/contacts`: Cria um novo contato

**Body (JSON):**
```json
{
  "peopleId": "clxmg9v4o000008l4f3h3g3q3",
  "type": "email",
  "value": "joao.silva@email.com"
}
```

**Campos:**
- `peopleId` (string, obrigatório): ID da pessoa (cuid)
- `type` (string, obrigatório): Tipo de contato (ex: "email", "phone", "website")
- `value` (string, obrigatório): Valor do contato

**Resposta de Sucesso (201):** Retorna o objeto Contacts criado

#### Buscar Contato por ID

- `GET /api/v1/contacts/:id`: Busca um contato específico pelo ID

**Parâmetros:**
- `id` (string, obrigatório): ID do contato (cuid)

**Resposta de Sucesso (200):** Retorna o objeto Contacts

#### Atualizar Contato

- `PUT /api/v1/contacts/:id`: Atualiza um contato existente

**Parâmetros:**
- `id` (string, obrigatório): ID do contato (cuid)

**Body (JSON) - Todos os campos são opcionais**

**Resposta de Sucesso (200):** Retorna o objeto Contacts atualizado

#### Deletar Contato

- `DELETE /api/v1/contacts/:id`: Deleta um contato

**Parâmetros:**
- `id` (string, obrigatório): ID do contato (cuid)

**Resposta de Sucesso (204):** Sem conteúdo

### SocialLinks (Links Sociais)

#### Criar Novo Link Social

- `POST /api/v1/social-links`: Cria um novo link social

**Body (JSON):**
```json
{
  "peopleId": "clxmg9v4o000008l4f3h3g3q3",
  "platform": "linkedin",
  "url": "https://linkedin.com/in/joaosilva"
}
```

**Campos:**
- `peopleId` (string, obrigatório): ID da pessoa (cuid)
- `platform` (string, obrigatório): Plataforma (ex: "linkedin", "github", "twitter")
- `url` (string, obrigatório): URL do perfil (deve ser uma URL válida)

**Resposta de Sucesso (201):** Retorna o objeto SocialLinks criado

#### Buscar Link Social por ID

- `GET /api/v1/social-links/:id`: Busca um link social específico pelo ID

**Parâmetros:**
- `id` (string, obrigatório): ID do link social (cuid)

**Resposta de Sucesso (200):** Retorna o objeto SocialLinks

#### Atualizar Link Social

- `PUT /api/v1/social-links/:id`: Atualiza um link social existente

**Parâmetros:**
- `id` (string, obrigatório): ID do link social (cuid)

**Body (JSON) - Todos os campos são opcionais**

**Resposta de Sucesso (200):** Retorna o objeto SocialLinks atualizado

#### Deletar Link Social

- `DELETE /api/v1/social-links/:id`: Deleta um link social

**Parâmetros:**
- `id` (string, obrigatório): ID do link social (cuid)

**Resposta de Sucesso (204):** Sem conteúdo

### Languages (Idiomas)

#### Criar Novo Idioma

- `POST /api/v1/languages`: Cria um novo idioma

**Body (JSON):**
```json
{
  "peopleId": "clxmg9v4o000008l4f3h3g3q3",
  "name": "Inglês",
  "proficiency": "Fluente (C1)"
}
```

**Campos:**
- `peopleId` (string, obrigatório): ID da pessoa (cuid)
- `name` (string, obrigatório): Nome do idioma
- `proficiency` (string, obrigatório): Nível de proficiência

**Resposta de Sucesso (201):** Retorna o objeto Languages criado

#### Buscar Idioma por ID

- `GET /api/v1/languages/:id`: Busca um idioma específico pelo ID

**Parâmetros:**
- `id` (string, obrigatório): ID do idioma (cuid)

**Resposta de Sucesso (200):** Retorna o objeto Languages

#### Atualizar Idioma

- `PUT /api/v1/languages/:id`: Atualiza um idioma existente

**Parâmetros:**
- `id` (string, obrigatório): ID do idioma (cuid)

**Body (JSON) - Todos os campos são opcionais**

**Resposta de Sucesso (200):** Retorna o objeto Languages atualizado

#### Deletar Idioma

- `DELETE /api/v1/languages/:id`: Deleta um idioma

**Parâmetros:**
- `id` (string, obrigatório): ID do idioma (cuid)

**Resposta de Sucesso (204):** Sem conteúdo

### Certifications (Certificações)

#### Criar Nova Certificação

- `POST /api/v1/certifications`: Cria uma nova certificação

**Body (JSON):**
```json
{
  "peopleId": "clxmg9v4o000008l4f3h3g3q3",
  "name": "AWS Certified Solutions Architect",
  "issuer": "AWS",
  "issue_date": "2023-01-15T00:00:00.000Z",
  "url": "https://aws.amazon.com/certification/"
}
```

**Campos:**
- `peopleId` (string, obrigatório): ID da pessoa (cuid)
- `name` (string, obrigatório): Nome da certificação
- `issuer` (string, obrigatório): Emissor da certificação
- `issue_date` (string, obrigatório): Data de emissão (formato ISO 8601)
- `url` (string, opcional): URL da certificação (deve ser uma URL válida)

**Resposta de Sucesso (201):** Retorna o objeto Certifications criado

#### Buscar Certificação por ID

- `GET /api/v1/certifications/:id`: Busca uma certificação específica pelo ID

**Parâmetros:**
- `id` (string, obrigatório): ID da certificação (cuid)

**Resposta de Sucesso (200):** Retorna o objeto Certifications

#### Atualizar Certificação

- `PUT /api/v1/certifications/:id`: Atualiza uma certificação existente

**Parâmetros:**
- `id` (string, obrigatório): ID da certificação (cuid)

**Body (JSON) - Todos os campos são opcionais**

**Resposta de Sucesso (200):** Retorna o objeto Certifications atualizado

#### Deletar Certificação

- `DELETE /api/v1/certifications/:id`: Deleta uma certificação

**Parâmetros:**
- `id` (string, obrigatório): ID da certificação (cuid)

**Resposta de Sucesso (204):** Sem conteúdo

#### Associar Skill a Pessoa

- `POST /api/v1/people/associate-skill`: Associa uma skill a uma pessoa

**Body (JSON):**
```json
{
  "peopleId": "clxmg9v4o000008l4f3h3g3q3",
  "skillId": "clxmg9v4o000008l4f3h3g4q4"
}
```

**Campos:**
- `peopleId` (string, obrigatório): ID da pessoa (cuid)
- `skillId` (string, obrigatório): ID da skill (cuid)

**Resposta de Sucesso (200):** Retorna o objeto People atualizado com a skill associada

**Resposta de Erro (404):** Se `peopleId` ou `skillId` não existirem

#### Desassociar Skill de Pessoa

- `POST /api/v1/people/disassociate-skill`: Desassocia uma skill de uma pessoa

**Body (JSON):**
```json
{
  "peopleId": "clxmg9v4o000008l4f3h3g3q3",
  "skillId": "clxmg9v4o000008l4f3h3g4q4"
}
```

**Campos:**
- `peopleId` (string, obrigatório): ID da pessoa (cuid)
- `skillId` (string, obrigatório): ID da skill (cuid)

**Resposta de Sucesso (200):** Retorna o objeto People atualizado sem a skill desassociada

**Resposta de Erro (404):** Se `peopleId` ou `skillId` não existirem

### Skills (Habilidades)

#### Listar Todas as Skills

- `GET /api/v1/skills`: Lista todas as skills cadastradas (ordenadas por nome)

**Resposta de Sucesso (200):**
```json
[
  {
    "id": "clxmg9v4o000008l4f3h3g4q4",
    "name": "TypeScript",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": "clxmg9v4o000008l4f3h3g5q5",
    "name": "React",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Buscar Skill por ID

- `GET /api/v1/skills/:id`: Busca uma skill específica pelo ID

**Parâmetros:**
- `id` (string, obrigatório): ID da skill (cuid)

**Resposta de Sucesso (200):**
```json
{
  "id": "clxmg9v4o000008l4f3h3g4q4",
  "name": "TypeScript",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Resposta de Erro (404):**
```json
{
  "status": "error",
  "message": "Skill not found"
}
```

#### Criar Nova Skill

- `POST /api/v1/skills`: Cria uma nova skill

**Body (JSON):**
```json
{
  "name": "TypeScript"
}
```

**Campos:**
- `name` (string, obrigatório): Nome da skill (mínimo 2 caracteres, máximo 255, único)

**Resposta de Sucesso (201):**
```json
{
  "id": "clxmg9v4o000008l4f3h3g4q4",
  "name": "TypeScript",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Resposta de Erro (409) - Nome já existe:**
```json
{
  "status": "error",
  "message": "Skill with this name already exists"
}
```

#### Atualizar Skill

- `PUT /api/v1/skills/:id`: Atualiza uma skill existente

**Parâmetros:**
- `id` (string, obrigatório): ID da skill (cuid)

**Body (JSON) - Campo opcional:**
```json
{
  "name": "JavaScript"
}
```

**Campos:**
- `name` (string, opcional): Nome da skill (mínimo 2 caracteres, máximo 255, único)

**Resposta de Sucesso (200):** Retorna o objeto Skill atualizado

**Resposta de Erro (404):** Se a skill não existir

**Resposta de Erro (409):** Se o novo nome já existir

#### Deletar Skill

- `DELETE /api/v1/skills/:id`: Deleta uma skill

**Parâmetros:**
- `id` (string, obrigatório): ID da skill (cuid)

**Resposta de Sucesso (204):** Sem conteúdo

**Resposta de Erro (404):** Se a skill não existir

**Nota:** Todos os endpoints de entidades 1:N (Experience, Education, Projects, Contacts, SocialLinks, Languages, Certifications) seguem o mesmo padrão:
- Requerem `peopleId` no body do POST para associar à pessoa
- Retornam 404 se `peopleId` não existir
- Suportam atualizações parciais no PUT
- Retornam 204 (No Content) no DELETE bem-sucedido

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
- `409`: Conflict - Violação de constraint única (ex: nome de skill duplicado)
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
- `tests/unit/skills.service.test.ts` - Testes do Skills Service (100% de cobertura)

### Testes de Integração

Testam o fluxo completo da API, incluindo banco de dados:

```bash
npm run test:integration
```

**Localização:** `tests/integration/`

**Exemplos:**
- `tests/integration/health.api.test.ts` - Testes da Health API
- `tests/integration/people.api.test.ts` - Testes completos da People API (todos os endpoints CRUD)
- `tests/integration/experience.api.test.ts` - Testes completos da Experience API
- `tests/integration/education.api.test.ts` - Testes completos da Education API
- `tests/integration/projects.api.test.ts` - Testes completos da Projects API
- `tests/integration/contacts.api.test.ts` - Testes completos da Contacts API
- `tests/integration/social-links.api.test.ts` - Testes completos da SocialLinks API
- `tests/integration/languages.api.test.ts` - Testes completos da Languages API
- `tests/integration/certifications.api.test.ts` - Testes completos da Certifications API
- `tests/integration/skills.api.test.ts` - Testes completos da Skills API
- `tests/integration/people-associate-skill.api.test.ts` - Testes de associação/desassociação de skills

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