# Changelog
Todas as mudanças relevantes nesse projeto serão documentadas nesse arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
e este projeto adere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### [Épico 2: CRUD Core (People)]
#### Added
- **Task: (PEOPLE-01) Implementar PeopleRepository (CRUD)**
  - Interface IPeopleRepository definindo contratos de acesso aos dados
  - Implementação PeopleRepository com métodos CRUD completos
  - Métodos: create, findById, findAll, update, delete
  - Única camada que interage diretamente com o Prisma Client
  - Ordenação por createdAt desc no método findAll

- **Task: (PEOPLE-02) Implementar PeopleService (CRUD)**
  - Classe PeopleService contendo a lógica de negócios
  - Classe NotFoundError customizada para erros 404
  - Métodos: createPerson, getPersonById, getAllPeople, updatePerson, deletePerson
  - Validação de existência antes de atualizar ou deletar
  - Suporte para injeção de dependência para facilitar testes
  - Atualizações parciais permitidas no método updatePerson
  - Testes unitários completos (tests/unit/people.service.test.ts) cobrindo 100% do serviço
  - Testes unitários usando jest-mock-extended para mockar o repositório
  - Cobertura de todos os métodos e casos de erro (happy path e sad path)

- **Task: (PEOPLE-03) Criar DTOs Zod e rotas/controller para People (CRUD)**
  - DTOs Zod para validação de entrada: createPersonSchema, updatePersonSchema, personParamsSchema
  - Validações com mensagens de erro em português
  - Validação de tamanho mínimo e máximo para campos de string
  - Campo location opcional no schema de criação
  - Todos os campos opcionais no schema de atualização (permitindo atualizações parciais)
  - PeopleController com métodos: create, getById, getAll, update, delete
  - Rotas RESTful completas: GET /api/v1/people, GET /api/v1/people/:id, POST /api/v1/people, PUT /api/v1/people/:id, DELETE /api/v1/people/:id
  - Middleware de validação Zod aplicado em todas as rotas
  - Rotas registradas no app.ts

- **Task: (PEOPLE-04) Escrever testes de integração (Supertest) para People CRUD**
  - Testes de integração completos para todos os endpoints CRUD
  - Cobertura de casos de sucesso (happy path) e erros (sad path)
  - Testes de validação Zod (campos obrigatórios, tamanhos mínimos/máximos)
  - Testes de erros 404 (pessoa não encontrada)
  - Testes de atualizações parciais
  - Limpeza do banco de dados antes e depois dos testes
  - Verificação de persistência de dados no banco após operações

#### Changed
- **Task: Integração das rotas de People no app.ts**
  - Rotas de People registradas em /api/v1/people
  - Mantida consistência com a estrutura de rotas existente

#### Performance
- **Task: Otimizações de consultas no PeopleRepository**
  - Ordenação por createdAt desc no findAll para retornar registros mais recentes primeiro
  - Uso de findUnique para buscas por ID (mais eficiente que findFirst)

---

### [Épico 1: Fundação (Infra & DB)]
#### Added
- **Task: (INFRA-01) Configurar projeto (npm, TS, ESLint, Prettier, Husky)**
  - Configuração completa do projeto Node.js com TypeScript 5.x
  - Package.json com todas as dependências e scripts necessários
  - Configuração do TypeScript (tsconfig.json) com strict mode
  - Configuração do ESLint com regras TypeScript e Prettier
  - Configuração do Prettier para formatação automática
  - Configuração do Husky com pre-commit hook para lint e format check
  - Configuração do Jest para testes unitários e de integração
  - Configuração do Vercel (vercel.json) para deploy serverless
  - Arquivos de configuração (.gitignore, .prettierignore)

- **Task: (INFRA-02) Definir schema.prisma (V1) e rodar 1ª migração**
  - Schema Prisma completo com todas as entidades do modelo de dados
  - Modelo People (entidade central) com todas as relações
  - Modelos 1:N: Contacts, Education, Experience, Projects, Certifications, Languages, SocialLinks
  - Modelo N:M: Skills
  - Script de seed básico (prisma/seed.ts) preparado para população de dados
  - Configuração do Prisma Client como singleton para evitar múltiplas conexões

- **Task: (INFRA-03) Configurar arquitetura em camadas (pastas) e rota /health**
  - Estrutura de pastas seguindo arquitetura em camadas (Layered Architecture)
  - Camadas: config, controllers, dtos, interfaces, middlewares, repositories, routes, services
  - Rota GET /api/v1/health implementada com controller e retornando status da API
  - Rota raiz GET / implementada com informações básicas da API
  - Configuração do Express app (app.ts) com middlewares globais (CORS, JSON parser)
  - Configuração do servidor (server.ts) com inicialização na porta configurada

- **Task: (INFRA-04) Implementar middlewares (Error Handler e Zod Validation)**
  - Middleware de Error Handler (error.middleware.ts) com tratamento centralizado de erros
  - Tratamento de erros Zod (validação) com resposta 400 estruturada
  - Tratamento de erros Prisma com mapeamento de códigos (P2002, P2025, P2003, P2004)
  - Tratamento de erros customizados da aplicação
  - Logs de erro em desenvolvimento sem expor stack traces em produção
  - Middleware de Validação (validation.middleware.ts) genérico usando Zod
  - Suporte para validação de body, query e params separadamente
  - Suporte para schema único para validação do body
  - Propagação de erros de validação para o error handler

- **Task: (INFRA-05) Configurar Jest (Unit e Integration) e mocks do Prisma**
  - Configuração completa do Jest (jest.config.js) para testes unitários e de integração
  - Setup global de testes (tests/setup.ts) com limpeza de mocks
  - Configuração para uso de jest-mock-extended quando necessário
  - Teste de integração para Health API (tests/integration/health.api.test.ts)
  - Teste unitário para Health Controller (tests/unit/health.controller.test.ts)
  - Scripts npm para execução de testes (test, test:unit, test:integration, test:watch, test:coverage)

#### Changed
- **Task: Otimizações e melhorias de código**
  - Refatoração do Error Handler usando padrão DRY com mapeamento de erros do Prisma
  - Simplificação do Validation Middleware removendo verificações redundantes
  - Remoção de imports não utilizados em todos os arquivos
  - Melhoria na validação de variáveis de ambiente com função getEnvVar
  - Otimização do código seguindo princípios SOLID e DRY

#### Fixed
- **Task: Correções de nomenclatura e qualidade de código**
  - Correção de nomes de variáveis para seguir convenções de mercado (camelCase)
  - Substituição de nomes genéricos (err, e) por nomes descritivos (error)
  - Remoção de redundâncias no Validation Middleware
  - Correção da lógica de validação de variáveis de ambiente

#### Performance
- **Task: Otimizações de performance e eficiência**
  - Implementação de PrismaClient como singleton para evitar múltiplas conexões
  - Otimização do Error Handler com mapeamento de erros ao invés de múltiplos ifs
  - Simplificação da lógica de validação reduzindo verificações desnecessárias
  - Validação de variáveis de ambiente na inicialização (fail-fast)

---

## [0.1.0] - YYYY-MM-DD
### [Epic: Implementação Inicial]
#### Added
- **Task: Configuração do Projeto**
  - Estrutura inicial do projeto
  - Configuração de dependências
  - Setup do ambiente de desenvolvimento

- **Task: Autenticação Básica**
  - Sistema de login com JWT
  - Middleware de autenticação
  - Proteção de rotas privadas