# Changelog
Todas as mudanças relevantes nesse projeto serão documentadas nesse arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
e este projeto adere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
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