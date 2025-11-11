# Currículo Express API

![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.18.x-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-6.x-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16.x-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Serverless-000000?style=for-the-badge&logo=vercel&logoColor=white)

API REST para gerenciamento de currículos profissionais. Este projeto é um backend headless que serve como uma única fonte de verdade para dados de currículo.

## Índice

- [Sobre](#sobre)
- [Tecnologias](#tecnologias)
- [Instalação](#instalação)
- [Scripts](#scripts)
- [Documentação](#documentação)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Testes](#testes)
- [Deploy](#deploy)
- [Contribuindo](#contribuindo)

## Sobre

O **Currículo Express** é uma API REST que gerencia, armazena e expõe dados de currículos de forma estruturada. Ele atua como um "Headless CMS" focado exclusivamente em currículos profissionais, permitindo que qualquer aplicação front-end (sites de portfólio, aplicações móveis, geradores de PDF) consuma esses dados de maneira programática.

### Características Principais

- **API RESTful** completa com CRUD para todas as entidades
- **Autenticação Bearer Token** para proteger endpoints de escrita
- **Validação Schema-First** usando Zod
- **Type-Safety** completo com TypeScript e Prisma
- **Arquitetura em Camadas** seguindo princípios SOLID e DRY
- **Testes Unitários e de Integração** com Jest e Supertest
- **Deploy Serverless** na Vercel

## Tecnologias

- **Runtime:** Node.js 20.x (LTS)
- **Framework:** Express.js 4.18.x
- **Linguagem:** TypeScript 5.x
- **ORM:** Prisma 6.x
- **Banco de Dados:** PostgreSQL 16.x
- **Validação:** Zod 3.x
- **Testes:** Jest 29.x, Supertest 6.x
- **Deploy:** Vercel (Serverless)

## Instalação

### Pré-requisitos

- Node.js 20.x ou superior
- PostgreSQL 16.x ou superior
- npm ou yarn

### Passos

1. **Clone o repositório:**

   ```bash
   git clone <repository-url>
   cd resume-express-api
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**

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

4. **Configure o banco de dados:**

```bash
# Gerar o Prisma Client
npm run prisma:generate

# Executar migrações
npm run prisma:migrate

# Popular o banco com dados de exemplo (opcional)
npm run prisma:seed
```

**Nota:** O script de seed cria dados de exemplo incluindo:

- 10 skills comuns (TypeScript, React.js, Node.js, Prisma, PostgreSQL, Figma, Design System, User Research, UX Writing, Docker)
- Pessoa João Silva (Desenvolvedor Full-Stack Sênior) com currículo completo
- Pessoa Mariana Costa (Product Designer Sênior) com currículo completo

## Scripts

### Desenvolvimento

- `npm run dev`: Inicia o servidor em modo desenvolvimento com hot-reload
- `npm run build`: Compila o TypeScript para JavaScript
- `npm start`: Inicia o servidor em produção

### Executar Testes

- `npm test`: Executa todos os testes
- `npm run test:unit`: Executa apenas testes unitários
- `npm run test:integration`: Executa apenas testes de integração
- `npm run test:watch`: Executa testes em modo watch
- `npm run test:coverage`: Gera relatório de cobertura de testes

### Qualidade de Código

- `npm run lint`: Verifica erros de lint
- `npm run lint:fix`: Corrige erros de lint automaticamente
- `npm run format`: Formata o código com Prettier
- `npm run format:check`: Verifica se o código está formatado

### Prisma

- `npm run prisma:generate`: Gera o Prisma Client
- `npm run prisma:migrate`: Executa migrações do banco de dados
- `npm run prisma:seed`: Popula o banco com dados de exemplo
- `npm run prisma:studio`: Abre o Prisma Studio (GUI para o banco)

## Documentação

A documentação completa do projeto está disponível na pasta `docs/`:

- **[Documentação da API](./docs/API.md)**: Documentação completa de todos os endpoints, autenticação, exemplos de requisições e respostas
- **[Documentação da Arquitetura](./docs/ARQUITETURA.md)**: Documentação completa da arquitetura da aplicação, padrões de design, fluxo de dados e decisões técnicas
- **[Changelog](./docs/CHANGELOG.md)**: Histórico de mudanças do projeto

### Coleção Postman

O projeto inclui uma coleção Postman completa (`docs/CurriculoExpress.postman_collection.json`) que documenta e permite testar todos os endpoints da API.

**Como usar:**

1. Importe a coleção no Postman
2. Configure as variáveis de ambiente:
   - `BASE_URL`: URL base da API (ex: `http://localhost:3000`)
   - `AUTH_TOKEN`: Token de autenticação (valor da variável `API_SECRET_KEY`)
3. Teste os endpoints navegando pelas pastas organizadas por entidade

## Estrutura do Projeto

```text
resume-express-api/
├── api/
│   └── index.ts                    # Entry point para Vercel (serverless)
├── prisma/
│   ├── schema.prisma               # Definição do modelo de dados
│   ├── migrations/                 # Migrações SQL geradas pelo Prisma
│   └── seed.ts                     # Script de seed para popular o banco
├── src/
│   ├── config/                     # Configuração (database, env)
│   ├── controllers/                # Camada de Controladores
│   ├── dtos/                       # DTOs (Data Transfer Objects) - Zod schemas
│   ├── interfaces/                 # Interfaces TypeScript
│   ├── middlewares/                # Middlewares (error, validation, auth)
│   ├── repositories/               # Camada de Repositórios
│   ├── routes/                     # Definição das rotas da API
│   ├── services/                   # Camada de Serviços (Lógica de Negócios)
│   ├── app.ts                      # Criação e configuração do app Express
│   └── server.ts                   # Ponto de entrada: inicializa o servidor
├── tests/
│   ├── integration/                # Testes de Integração (Jest + Supertest)
│   ├── unit/                       # Testes Unitários (Jest + Mocks)
│   ├── helpers/                    # Helpers para testes
│   └── setup.ts                    # Configuração global de testes
├── docs/
│   ├── API.md                      # Documentação da API
│   ├── ARQUITETURA.md              # Documentação da Arquitetura
│   ├── CHANGELOG.md                # Changelog do projeto
│   └── CurriculoExpress.postman_collection.json
├── .env                            # Variáveis de ambiente (não versionado)
├── .env.example                    # Template das variáveis de ambiente
├── vercel.json                     # Configuração do deploy Vercel
├── tsconfig.json                   # Configuração do TypeScript
├── jest.config.js                  # Configuração do Jest
└── package.json                    # Dependências e scripts
```

### Arquitetura

O projeto segue uma **Arquitetura em Camadas (Layered Architecture)**:

1. **Routes Layer** (`src/routes`): Define as rotas da API
2. **Middlewares** (`src/middlewares`): Validação, autenticação, tratamento de erros
3. **Controllers Layer** (`src/controllers`): Orquestra as chamadas para a camada de serviços
4. **Services Layer** (`src/services`): Contém a lógica de negócios
5. **Repositories Layer** (`src/repositories`): Abstrai o acesso ao banco de dados (única camada que usa Prisma)

Para mais detalhes sobre a arquitetura, consulte a [Documentação da Arquitetura](./docs/ARQUITETURA.md).

## Testes

### Testes Unitários

Testam a lógica de negócios isoladamente, usando mocks do repositório:

```bash
npm run test:unit
```

**Localização:** `tests/unit/`

### Testes de Integração

Testam o fluxo completo da API, incluindo banco de dados:

```bash
npm run test:integration
```

**Localização:** `tests/integration/`

**Nota:** Os testes de integração requerem um banco de dados de teste configurado em `DATABASE_URL_TEST` e a variável `API_SECRET_KEY` configurada.

## Deploy

O projeto está configurado para deploy na Vercel como função serverless. O arquivo `vercel.json` define a configuração de deploy e o script `vercel-build` garante que:

1. O Prisma Client seja gerado
2. As migrações sejam aplicadas
3. O TypeScript seja compilado

### Variáveis de Ambiente no Vercel

Configure as seguintes variáveis de ambiente no painel da Vercel:

- `DATABASE_URL`: URL de conexão do PostgreSQL (obrigatório)
- `API_SECRET_KEY`: Chave secreta para autenticação da API (obrigatório)
- `NODE_ENV`: Ambiente (opcional, padrão: production)

### Como Fazer Deploy

Para fazer deploy na Vercel:

```bash
# Instalar Vercel CLI (se ainda não tiver)
npm i -g vercel

# Fazer deploy
vercel

# Ou fazer deploy de produção
vercel --prod
```

O deploy automático ocorre quando você faz push para a branch principal (se configurado no Vercel).

## Contribuindo

Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
