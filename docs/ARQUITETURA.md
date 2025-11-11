# Documentação da Arquitetura - Currículo Express

Esta documentação descreve a arquitetura completa da aplicação Currículo Express, incluindo padrões arquiteturais, estrutura de camadas, fluxo de dados e decisões de design.

## Índice

- [Visão Geral](#visão-geral)
- [Padrão Arquitetural](#padrão-arquitetural)
- [Arquitetura em Camadas](#arquitetura-em-camadas)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Fluxo de Requisição](#fluxo-de-requisição)
- [Camadas Detalhadas](#arquitetura-em-camadas)
- [Padrões de Design](#padrões-de-design)
- [Tratamento de Erros](#tratamento-de-erros)
- [Validação de Dados](#validação-de-dados)
- [Autenticação e Autorização](#autenticação-e-autorização)
- [Banco de Dados](#banco-de-dados)
- [Testes](#testes)
- [Deploy e Infraestrutura](#deploy-e-infraestrutura)

---

## Visão Geral

O Currículo Express é uma API REST monolítica construída com **Express.js** e **TypeScript**, seguindo uma **Arquitetura em Camadas (Layered Architecture)**. A aplicação implementa o **Padrão de Repositório (Repository Pattern)** para abstrair o acesso aos dados e utiliza **Prisma** como ORM.

### Características Principais

- **Monolito em Camadas**: Arquitetura monolítica com separação clara de responsabilidades
- **Serverless Deployment**: Deploy na Vercel como funções serverless
- **Type-Safety**: TypeScript em todas as camadas
- **Validação Schema-First**: Zod para validação de entrada
- **ORM Type-Safe**: Prisma para acesso ao banco de dados
- **Testabilidade**: Arquitetura preparada para testes unitários e de integração

---

## Padrão Arquitetural

### Arquitetura em Camadas (Layered Architecture)

A aplicação segue o padrão de **Arquitetura em Camadas**, onde cada camada tem responsabilidades bem definidas e comunica-se apenas com camadas adjacentes.

#### Princípios

1. **Separação de Preocupações (SoC)**: Cada camada tem uma responsabilidade única e bem definida
2. **Dependência Unidirecional**: Camadas superiores dependem de camadas inferiores, mas não o contrário
3. **Abstração**: Camadas superiores não conhecem detalhes de implementação das camadas inferiores
4. **Testabilidade**: Cada camada pode ser testada independentemente através de mocks

#### Camadas da Aplicação

```text
┌─────────────────────────────────────┐
│      Routes Layer (Express)         │  ← Definição de rotas HTTP
├─────────────────────────────────────┤
│      Middlewares                     │  ← Validação, Autenticação, CORS
├─────────────────────────────────────┤
│      Controllers Layer              │  ← Orquestração de requisições
├─────────────────────────────────────┤
│      Services Layer                 │  ← Lógica de Negócios
├─────────────────────────────────────┤
│      Repositories Layer             │  ← Acesso aos Dados (Prisma)
├─────────────────────────────────────┤
│      Database (PostgreSQL)         │  ← Persistência
└─────────────────────────────────────┘
```

---

## Arquitetura em Camadas

### 1. Routes Layer (`src/routes`)

**Responsabilidade**: Definir as rotas HTTP da API e conectar middlewares e controllers.

**Características**:

- Define os endpoints da API
- Aplica middlewares (validação, autenticação)
- Conecta rotas aos controllers correspondentes
- Organiza rotas por entidade (people, experience, education, etc.)

**Exemplo**:

```typescript
// src/routes/people.routes.ts
router.post(
  '/',
  authenticate,                    // Middleware de autenticação
  validate({ body: createPersonSchema }),  // Middleware de validação
  peopleController.create          // Controller
);
```

**O QUE**: Define as rotas HTTP da API  
**POR QUÊ**: Centraliza a configuração de rotas e facilita manutenção  
**ONDE**: `src/routes/*.routes.ts`

---

### 2. Middlewares (`src/middlewares`)

**Responsabilidade**: Processar requisições antes de chegarem aos controllers.

#### Middlewares Implementados

##### Error Handler (`error.middleware.ts`)

Trata erros de forma centralizada, mapeando diferentes tipos de erro para respostas HTTP apropriadas.

**Tratamento de Erros**:

- **ZodError**: Erros de validação → 400 Bad Request
- **Prisma Errors**: Erros do banco de dados → Mapeamento de códigos (P2002 → 409, P2025 → 404, etc.)
- **AppError**: Erros customizados → Status code personalizado
- **Erros Genéricos**: Erros não tratados → 500 Internal Server Error

**O QUE**: Middleware centralizado de tratamento de erros  
**POR QUÊ**: Evita duplicação de código de tratamento de erros e padroniza respostas  
**ONDE**: `src/middlewares/error.middleware.ts`

##### Validation Middleware (`validation.middleware.ts`)

Valida dados de entrada usando schemas Zod.

**Funcionalidades**:

- Valida `body`, `params` e `query` separadamente
- Retorna erros detalhados de validação
- Propaga erros para o error handler

**O QUE**: Middleware genérico de validação usando Zod  
**POR QUÊ**: Reutilizável e type-safe, seguindo princípio DRY  
**ONDE**: `src/middlewares/validation.middleware.ts`

##### Authentication Middleware (`auth.middleware.ts`)

Protege endpoints de escrita (POST, PUT, DELETE) com autenticação Bearer Token.

**Funcionalidades**:

- Valida presença do header `Authorization`
- Valida formato `Bearer <token>`
- Compara token com `API_SECRET_KEY`
- Retorna 401 para header ausente/formato inválido
- Retorna 403 para token inválido

**O QUE**: Middleware de autenticação Bearer Token  
**POR QUÊ**: Protege endpoints de escrita conforme requisito RF-06 do PRD  
**ONDE**: `src/middlewares/auth.middleware.ts`

##### Middlewares Globais (`app.ts`)

- **CORS**: Habilita Cross-Origin Resource Sharing
- **JSON Parser**: Parse de requisições JSON
- **URL Encoded**: Parse de requisições URL-encoded

---

### 3. Controllers Layer (`src/controllers`)

**Responsabilidade**: Orquestrar requisições HTTP e chamar a camada de serviços.

**Características**:

- Extrai dados de `req` (body, params, query)
- Chama métodos do Service correspondente
- Formata respostas HTTP (status code, JSON)
- Propaga erros para o error handler via `next()`

**Princípios**:

- **Thin Controllers**: Controllers devem ser "finos", apenas orquestrando chamadas
- **Sem Lógica de Negócios**: Toda lógica de negócios fica na camada de Services
- **Tratamento de Erros**: Usa `try/catch` e propaga erros via `next(error)`

**Exemplo**:

```typescript
// src/controllers/people.controller.ts
create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const personData = req.body as CreatePersonDto;
    const newPerson = await this.peopleService.createPerson(personData);
    res.status(201).json(newPerson);
  } catch (error) {
    next(error);
  }
};
```

**O QUE**: Camada de orquestração de requisições HTTP  
**POR QUÊ**: Separa responsabilidades HTTP da lógica de negócios  
**ONDE**: `src/controllers/*.controller.ts`

---

### 4. Services Layer (`src/services`)

**Responsabilidade**: Contém toda a lógica de negócios da aplicação.

**Características**:

- Implementa regras de negócio
- Valida existência de entidades relacionadas
- Coordena chamadas a múltiplos repositórios
- Lança erros customizados (ex: `NotFoundError`)

**Princípios**:

- **Business Logic Only**: Apenas lógica de negócios, sem conhecimento de HTTP
- **Dependency Injection**: Aceita repositórios via construtor para facilitar testes
- **Error Handling**: Lança erros customizados que serão tratados pelo error handler

**Exemplo**:

```typescript
// src/services/people.service.ts
async getPersonById(id: string): Promise<People> {
  const person = await this.peopleRepository.findById(id);
  
  if (!person) {
    throw new NotFoundError('Person not found');
  }
  
  return person;
}
```

**O QUE**: Camada de lógica de negócios  
**POR QUÊ**: Centraliza regras de negócio e facilita reutilização  
**ONDE**: `src/services/*.service.ts`

---

### 5. Repositories Layer (`src/repositories`)

**Responsabilidade**: Abstrair o acesso ao banco de dados. **Única camada que usa Prisma**.

**Características**:

- Implementa interfaces de repositório (`IPeopleRepository`, etc.)
- Usa Prisma Client para operações no banco
- Retorna tipos do Prisma
- Não contém lógica de negócios

**Princípios**:

- **Repository Pattern**: Abstrai acesso aos dados através de interfaces
- **Prisma Only**: Única camada que importa e usa Prisma Client
- **Type-Safe**: Utiliza tipos gerados pelo Prisma

**Exemplo**:

```typescript
// src/repositories/people.repository.ts
async findById(id: string): Promise<People | null> {
  return prisma.people.findUnique({
    where: { id },
  });
}
```

**O QUE**: Camada de acesso aos dados usando Repository Pattern  
**POR QUÊ**: Abstrai Prisma da camada de serviços, facilitando testes e manutenção  
**ONDE**: `src/repositories/*.repository.ts`

---

## Estrutura de Pastas

```text
resume-express-api/
├── api/
│   └── index.ts                    # Entry point para Vercel (serverless)
├── prisma/
│   ├── schema.prisma               # Schema do banco de dados
│   ├── migrations/                 # Migrações SQL
│   └── seed.ts                     # Script de seed
├── src/
│   ├── config/
│   │   ├── database.ts             # Configuração do Prisma Client (singleton)
│   │   └── env.ts                  # Validação de variáveis de ambiente
│   ├── controllers/                # Camada de Controllers
│   │   ├── people.controller.ts
│   │   ├── experience.controller.ts
│   │   └── ...
│   ├── dtos/                       # DTOs (Data Transfer Objects) - Schemas Zod
│   │   ├── create-person.dto.ts
│   │   ├── update-person.dto.ts
│   │   └── ...
│   ├── interfaces/                # Interfaces TypeScript
│   │   ├── IPeopleRepository.ts
│   │   ├── IExperienceRepository.ts
│   │   └── ...
│   ├── middlewares/                # Middlewares
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── validation.middleware.ts
│   │   └── index.ts
│   ├── repositories/               # Camada de Repositórios
│   │   ├── people.repository.ts
│   │   ├── experience.repository.ts
│   │   └── ...
│   ├── routes/                     # Definição de Rotas
│   │   ├── people.routes.ts
│   │   ├── experience.routes.ts
│   │   └── ...
│   ├── services/                   # Camada de Serviços
│   │   ├── people.service.ts
│   │   ├── experience.service.ts
│   │   └── ...
│   ├── app.ts                      # Configuração do app Express
│   └── server.ts                   # Entry point para desenvolvimento local
├── tests/
│   ├── integration/                # Testes de Integração
│   │   ├── people.api.test.ts
│   │   └── ...
│   ├── unit/                        # Testes Unitários
│   │   ├── people.service.test.ts
│   │   └── ...
│   ├── helpers/                     # Helpers para testes
│   │   └── auth.helper.ts
│   └── setup.ts                     # Setup global de testes
├── docs/
│   ├── API.md                      # Documentação da API
│   ├── ARQUITETURA.md              # Esta documentação
│   ├── CHANGELOG.md                # Changelog do projeto
│   └── CurriculoExpress.postman_collection.json
├── .env                            # Variáveis de ambiente (não versionado)
├── .env.example                    # Template de variáveis de ambiente
├── vercel.json                     # Configuração do deploy Vercel
├── tsconfig.json                   # Configuração do TypeScript
├── jest.config.js                  # Configuração do Jest
└── package.json                    # Dependências e scripts
```

---

## Fluxo de Requisição

### Fluxo Completo (Exemplo: POST /api/v1/people)

```text
1. Cliente HTTP
   ↓
   POST /api/v1/people
   Headers: { Authorization: "Bearer token", Content-Type: "application/json" }
   Body: { full_name: "João", headline: "...", summary: "..." }
   ↓
2. Express App (app.ts)
   ↓
   Middlewares Globais:
   - CORS
   - JSON Parser
   ↓
3. Routes Layer (people.routes.ts)
   ↓
   Middlewares de Rota:
   - authenticate (valida token)
   - validate (valida body com Zod)
   ↓
4. Controller (people.controller.ts)
   ↓
   Extrai dados de req.body
   Chama: peopleService.createPerson(data)
   ↓
5. Service (people.service.ts)
   ↓
   Lógica de negócios:
   - Validações adicionais (se necessário)
   - Chama: peopleRepository.create(data)
   ↓
6. Repository (people.repository.ts)
   ↓
   Acesso ao banco:
   - prisma.people.create({ data })
   ↓
7. Prisma Client
   ↓
   Gera SQL e executa no PostgreSQL
   ↓
8. PostgreSQL
   ↓
   Retorna dados inseridos
   ↓
9. Repository
   ↓
   Retorna People (tipo Prisma)
   ↓
10. Service
    ↓
    Retorna People
    ↓
11. Controller
    ↓
    Responde: res.status(201).json(newPerson)
    ↓
12. Cliente HTTP
    Recebe: 201 Created + JSON
```

### Fluxo de Erro

Se ocorrer um erro em qualquer camada:

```text
1. Erro lançado (throw error)
   ↓
2. Controller captura (catch) e propaga (next(error))
   ↓
3. Error Handler Middleware (error.middleware.ts)
   ↓
   Mapeia erro para resposta HTTP:
   - ZodError → 400 Bad Request
   - NotFoundError → 404 Not Found
   - Prisma P2002 → 409 Conflict
   - Erro genérico → 500 Internal Server Error
   ↓
4. Cliente HTTP
   Recebe: Status Code + JSON de erro
```

---

## Padrões de Design

### 1. Repository Pattern

**O QUE**: Abstrai acesso aos dados através de interfaces  
**POR QUÊ**: Facilita testes (mock de repositórios) e permite trocar ORM sem afetar Services  
**ONDE**: `src/interfaces/*.ts` e `src/repositories/*.ts`

**Exemplo**:

```typescript
// Interface
interface IPeopleRepository {
  findById(id: string): Promise<People | null>;
  create(data: Prisma.PeopleCreateInput): Promise<People>;
}

// Implementação
class PeopleRepository implements IPeopleRepository {
  async findById(id: string): Promise<People | null> {
    return prisma.people.findUnique({ where: { id } });
  }
}
```

---

### 2. Dependency Injection

**O QUE**: Injeção de dependências via construtor  
**POR QUÊ**: Facilita testes unitários (mock de dependências)  
**ONDE**: `src/services/*.service.ts`

**Exemplo**:

```typescript
class PeopleService {
  constructor(
    peopleRepository?: IPeopleRepository,
    skillsRepository?: ISkillsRepository
  ) {
    this.peopleRepository = peopleRepository || new PeopleRepository();
    this.skillsRepository = skillsRepository || new SkillsRepository();
  }
}
```

---

### 3. DTO Pattern (Data Transfer Objects)

**O QUE**: Schemas Zod para validação e transferência de dados  
**POR QUÊ**: Validação type-safe e reutilizável, seguindo schema-first  
**ONDE**: `src/dtos/*.dto.ts`

**Exemplo**:

```typescript
export const createPersonSchema = z.object({
  full_name: z.string().min(3).max(255),
  headline: z.string().min(3).max(255),
  summary: z.string().min(10),
  location: z.string().max(255).optional(),
});

export type CreatePersonDto = z.infer<typeof createPersonSchema>;
```

---

### 4. Singleton Pattern

**O QUE**: Prisma Client como singleton  
**POR QUÊ**: Evita múltiplas conexões ao banco de dados  
**ONDE**: `src/config/database.ts`

**Exemplo**:

```typescript
const prisma = new PrismaClient();

export default prisma;
```

---

## Tratamento de Erros

### Estratégia de Tratamento

1. **Erros de Validação (Zod)**: Capturados pelo Validation Middleware → 400
2. **Erros de Negócio**: Lançados pelos Services (ex: `NotFoundError`) → 404
3. **Erros do Prisma**: Capturados pelo Error Handler → Mapeamento de códigos
4. **Erros Genéricos**: Capturados pelo Error Handler → 500

### Mapeamento de Erros do Prisma

| Código Prisma | Status HTTP | Descrição |
|---------------|-------------|-----------|
| P2002 | 409 Conflict | Violação de constraint única |
| P2025 | 404 Not Found | Registro não encontrado |
| P2003 | 400 Bad Request | Violação de foreign key |
| P2004 | 400 Bad Request | Valor inválido para tipo de campo |

**O QUE**: Tratamento centralizado de erros  
**POR QUÊ**: Padroniza respostas e evita duplicação de código  
**ONDE**: `src/middlewares/error.middleware.ts`

---

## Validação de Dados

### Schema-First com Zod

A aplicação utiliza **Zod** para validação schema-first, onde os schemas definem tanto a validação quanto os tipos TypeScript.

**Vantagens**:

- **Type-Safety**: Tipos inferidos automaticamente dos schemas
- **Validação em Runtime**: Valida dados em tempo de execução
- **Mensagens Personalizadas**: Mensagens de erro em português
- **Reutilização**: Schemas podem ser compostos e reutilizados

**Exemplo**:

```typescript
// Schema
const createPersonSchema = z.object({
  full_name: z.string().min(3, 'Nome completo deve ter pelo menos 3 caracteres'),
  headline: z.string().min(3),
  summary: z.string().min(10),
});

// Tipo inferido
type CreatePersonDto = z.infer<typeof createPersonSchema>;
```

**O QUE**: Validação schema-first usando Zod  
**POR QUÊ**: Type-safety e validação em runtime, seguindo requisito RF-08 do PRD  
**ONDE**: `src/dtos/*.dto.ts` e `src/middlewares/validation.middleware.ts`

---

## Autenticação e Autorização

### Bearer Token Authentication

A aplicação utiliza autenticação via **Bearer Token** para proteger endpoints de escrita.

**Funcionamento**:

1. Cliente envia token no header `Authorization: Bearer <token>`
2. Middleware `authenticate` valida o token
3. Token é comparado com `API_SECRET_KEY` (variável de ambiente)
4. Se válido, requisição prossegue; se inválido, retorna 401/403

**Endpoints Protegidos**:

- Todos os POST, PUT, DELETE
- Endpoints de associação/desassociação de skills

**Endpoints Públicos**:

- Todos os GET (leitura)

**O QUE**: Autenticação Bearer Token para endpoints de escrita  
**POR QUÊ**: Protege endpoints de escrita conforme requisito RF-06 do PRD  
**ONDE**: `src/middlewares/auth.middleware.ts`

---

## Banco de Dados

### Modelo de Dados

O banco de dados utiliza **PostgreSQL** com schema definido via **Prisma**.

#### Entidade Central

- **People**: Entidade central que representa uma pessoa

#### Relações 1:N (One-to-Many)

- **Contacts**: Contatos da pessoa (email, phone, website)
- **Education**: Formação acadêmica
- **Experience**: Experiências profissionais
- **Projects**: Projetos
- **Certifications**: Certificações
- **Languages**: Idiomas
- **SocialLinks**: Links sociais

#### Relação N:M (Many-to-Many)

- **Skills**: Skills globais associadas a pessoas

### Prisma Client

O Prisma Client é configurado como singleton para evitar múltiplas conexões:

```typescript
// src/config/database.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;
```

**O QUE**: ORM Prisma para acesso type-safe ao banco de dados  
**POR QUÊ**: Type-safety superior e DX excelente para TypeScript  
**ONDE**: `prisma/schema.prisma` e `src/config/database.ts`

---

## Testes

### Estratégia de Testes

A aplicação utiliza uma estratégia de testes em duas camadas:

#### 1. Testes Unitários

**Objetivo**: Testar lógica de negócios isoladamente  
**Ferramentas**: Jest, jest-mock-extended  
**Estratégia**: Mock de repositórios para isolar Services

**Exemplo**:

```typescript
// tests/unit/people.service.test.ts
const mockRepo = mockDeep<IPeopleRepository>();
const service = new PeopleService(mockRepo);

mockRepo.findById.mockResolvedValue(null);
await expect(service.getPersonById('id')).rejects.toThrow('Person not found');
```

**O QUE**: Testes unitários da camada de serviços  
**POR QUÊ**: Testes rápidos e isolados da lógica de negócios  
**ONDE**: `tests/unit/*.test.ts`

#### 2. Testes de Integração

**Objetivo**: Testar fluxo completo da API  
**Ferramentas**: Jest, Supertest  
**Estratégia**: Banco de dados de teste, requisições HTTP reais

**Exemplo**:

```typescript
// tests/integration/people.api.test.ts
const response = await request(app)
  .post('/api/v1/people')
  .set('Authorization', `Bearer ${token}`)
  .send(personData);

expect(response.status).toBe(201);
expect(response.body.full_name).toBe(personData.full_name);
```

**O QUE**: Testes de integração dos endpoints da API  
**POR QUÊ**: Garante que toda a stack funciona corretamente  
**ONDE**: `tests/integration/*.test.ts`

---

## Deploy e Infraestrutura

### Arquitetura de Deploy: Serverless (Vercel)

A aplicação é deployada na **Vercel** como funções serverless.

#### Como Funciona

1. **Build**: Vercel executa `vercel-build` (gera Prisma Client, aplica migrações, compila TypeScript)
2. **Deploy**: Cada rota é convertida em uma Vercel Function (serverless)
3. **Execução**: Cada requisição invoca uma função independente e stateless

#### Configuração

**vercel.json**:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "api/index.ts"
    }
  ]
}
```

**api/index.ts** (Entry Point para Vercel):

```typescript
import app from '../src/app';

export default app;
```

**O QUE**: Deploy serverless na Vercel  
**POR QUÊ**: Escalabilidade automática e sem gerenciamento de servidor  
**ONDE**: `vercel.json` e `api/index.ts`

---

## Princípios SOLID e DRY

### SOLID

A aplicação segue os princípios SOLID:

- **S (Single Responsibility)**: Cada classe tem uma única responsabilidade
- **O (Open/Closed)**: Extensível via interfaces (ex: `IPeopleRepository`)
- **L (Liskov Substitution)**: Implementações respeitam contratos de interfaces
- **I (Interface Segregation)**: Interfaces específicas por entidade
- **D (Dependency Inversion)**: Services dependem de abstrações (interfaces), não implementações

### DRY (Don't Repeat Yourself)

- **Middlewares Reutilizáveis**: Validation e Error Handler genéricos
- **Helpers de Teste**: Funções auxiliares reutilizáveis
- **Schemas Compostos**: Schemas Zod podem ser compostos
- **Mapeamento de Erros**: Mapeamento centralizado de erros do Prisma

---

## Decisões de Design

### 1. Por que Arquitetura em Camadas?

**Decisão**: Utilizar Arquitetura em Camadas ao invés de Clean Architecture ou Hexagonal  
**Razão**: Simplicidade e adequação ao escopo da V1. Facilita manutenção e testes.

### 2. Por que Repository Pattern?

**Decisão**: Abstrair Prisma através de interfaces de repositório  
**Razão**: Facilita testes unitários (mock de repositórios) e permite trocar ORM no futuro.

### 3. Por que Zod ao invés de Joi/Yup?

**Decisão**: Utilizar Zod para validação  
**Razão**: Integração nativa com TypeScript, inferência de tipos e schema-first.

### 4. Por que Prisma ao invés de Sequelize/Knex?

**Decisão**: Utilizar Prisma como ORM  
**Razão**: Type-safety superior, DX excelente e geração automática de tipos.

### 5. Por que Vercel ao invés de AWS Lambda/Heroku?

**Decisão**: Deploy na Vercel  
**Razão**: Integração nativa com Express, deploy simples e escalabilidade automática.

---

## Melhorias Futuras

### Possíveis Melhorias

1. **Rate Limiting**: Implementar rate limiting para proteger a API
2. **Caching**: Implementar cache para endpoints de leitura frequentes
3. **Logging**: Sistema de logging estruturado (ex: Winston, Pino)
4. **Monitoring**: Integração com ferramentas de monitoramento (ex: Sentry)
5. **Documentação Automática**: Swagger/OpenAPI para documentação automática
6. **Multi-tenancy**: Suporte a múltiplos tenants/organizações
7. **OAuth2**: Autenticação OAuth2 ao invés de Bearer Token estático

---

## Referências

- [PRD.md](../PRD.md) - Documento de Requisitos de Produto
- [API.md](./API.md) - Documentação completa da API
- [Prisma Documentation](https://www.prisma.io/docs)
- [Express.js Documentation](https://expressjs.com/)
- [Zod Documentation](https://zod.dev/)

---

**Última atualização**: Novembro 2025
