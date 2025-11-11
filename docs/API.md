# Documentação da API - Currículo Express

API REST para gerenciamento de currículos profissionais. Esta documentação descreve todos os endpoints disponíveis, seus parâmetros, respostas e exemplos de uso.

## Índice

- [Informações Gerais](#informações-gerais)
- [Autenticação](#autenticação)
- [Base URL](#base-url)
- [Códigos de Status HTTP](#códigos-de-status-http)
- [Tratamento de Erros](#tratamento-de-erros)
- [Endpoints](#endpoints)
  - [Health Check](#health-check)
  - [People](#people)
  - [Experience](#experience)
  - [Education](#education)
  - [Projects](#projects)
  - [Contacts](#contacts)
  - [Social Links](#social-links)
  - [Languages](#languages)
  - [Certifications](#certifications)
  - [Skills](#skills)

---

## Informações Gerais

### Versão da API

A versão atual da API é **v1**, acessível através do prefixo `/api/v1`.

### Formato de Dados

- **Content-Type**: `application/json`
- **Accept**: `application/json`
- Todas as requisições e respostas utilizam o formato JSON.

### Timezone

Todas as datas são retornadas no formato ISO 8601 (UTC).

---

## Autenticação

A API utiliza autenticação via **Bearer Token** para proteger endpoints de escrita (POST, PUT, DELETE).

### Como Autenticar

Envie o token no header `Authorization` no formato:

```text
Authorization: Bearer <seu-token>
```

### Endpoints Protegidos

Todos os endpoints de escrita (POST, PUT, DELETE) requerem autenticação. Endpoints de leitura (GET) são públicos.

### Obter o Token

O token de autenticação é definido através da variável de ambiente `API_SECRET_KEY` no servidor.

### Exemplo de Requisição Autenticada

```bash
curl -X POST https://api.exemplo.com/api/v1/people \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer seu-token-aqui" \
  -d '{
    "full_name": "João Silva",
    "headline": "Desenvolvedor Full-Stack",
    "summary": "Desenvolvedor com experiência em Node.js e React"
  }'
```

---

## Base URL

### Ambiente de Produção

```text
https://sua-api.vercel.app
```

### Ambiente de Desenvolvimento

```text
http://localhost:3000
```

---

## Códigos de Status HTTP

A API utiliza os seguintes códigos de status HTTP:

| Código | Descrição | Quando é Retornado |
|--------|-----------|-------------------|
| 200 | OK | Requisição bem-sucedida |
| 201 | Created | Recurso criado com sucesso |
| 204 | No Content | Recurso deletado com sucesso |
| 400 | Bad Request | Dados inválidos ou erro de validação |
| 401 | Unauthorized | Token de autenticação ausente ou formato inválido |
| 403 | Forbidden | Token de autenticação inválido ou expirado |
| 404 | Not Found | Recurso não encontrado |
| 409 | Conflict | Violação de constraint única (ex: email duplicado) |
| 500 | Internal Server Error | Erro interno do servidor |

---

## Tratamento de Erros

### Formato de Erro

Todos os erros retornam um JSON no seguinte formato:

```json
{
  "status": "error",
  "message": "Mensagem de erro descritiva"
}
```

### Erro de Validação (400)

Quando há erro de validação (Zod), a resposta inclui detalhes dos campos inválidos:

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

### Erro de Autenticação (401)

```json
{
  "status": "error",
  "message": "Authorization header is required"
}
```

### Erro de Token Inválido (403)

```json
{
  "status": "error",
  "message": "Invalid or expired token"
}
```

### Erro de Recurso Não Encontrado (404)

```json
{
  "status": "error",
  "message": "Person not found"
}
```

---

## Endpoints

### Health Check

#### GET /api/v1/health

Verifica o status da API.

**Autenticação**: Não requerida

**Resposta de Sucesso (200)**:

```json
{
  "status": "ok",
  "message": "API is running"
}
```

**Exemplo de Requisição**:

```bash
curl -X GET https://api.exemplo.com/api/v1/health
```

---

#### GET /

Retorna informações básicas da API.

**Autenticação**: Não requerida

**Resposta de Sucesso (200)**:

```json
{
  "message": "Currículo Express API",
  "version": "1.0.0",
  "status": "running"
}
```

---

### People

#### GET /api/v1/people

Lista todas as pessoas cadastradas.

**Autenticação**: Não requerida

**Resposta de Sucesso (200)**:

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

**Exemplo de Requisição**:

```bash
curl -X GET https://api.exemplo.com/api/v1/people
```

---

#### GET /api/v1/people/:id

Busca uma pessoa específica pelo ID.

**Autenticação**: Não requerida

**Parâmetros de URL**:

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| id | string | ID único da pessoa (cuid) |

**Resposta de Sucesso (200)**:

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

**Exemplo de Requisição**:

```bash
curl -X GET https://api.exemplo.com/api/v1/people/clxmg9v4o000008l4f3h3g3q3
```

---

#### GET /api/v1/people/:id/full

Busca uma pessoa com todas as suas relações incluídas (currículo completo).

**Autenticação**: Não requerida

**Parâmetros de URL**:

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| id | string | ID único da pessoa (cuid) |

**Resposta de Sucesso (200)**:

```json
{
  "id": "clxmg9v4o000008l4f3h3g3q3",
  "full_name": "João Silva",
  "headline": "Desenvolvedor Full-Stack Sênior",
  "summary": "Engenheiro de software com 8 anos de experiência...",
  "location": "São Paulo, Brasil",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "contacts": [
    {
      "id": "clxmg9v4o000008l4f3h3g3q4",
      "type": "email",
      "value": "joao.silva@email.com",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "social_links": [
    {
      "id": "clxmg9v4o000008l4f3h3g3q5",
      "platform": "linkedin",
      "url": "https://linkedin.com/in/joaosilva",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "skills": [
    {
      "id": "clxmg9v4o000008l4f3h3g3q6",
      "name": "TypeScript"
    }
  ],
  "experience": [],
  "education": [],
  "projects": [],
  "certifications": [],
  "languages": []
}
```

**Exemplo de Requisição**:

```bash
curl -X GET https://api.exemplo.com/api/v1/people/clxmg9v4o000008l4f3h3g3q3/full
```

---

#### POST /api/v1/people

Cria uma nova pessoa.

**Autenticação**: Requerida

**Body da Requisição**:

```json
{
  "full_name": "João Silva",
  "headline": "Desenvolvedor Full-Stack Sênior | React, Node.js & TypeScript",
  "summary": "Engenheiro de software com 8 anos de experiência na construção de aplicações web escaláveis.",
  "location": "São Paulo, Brasil"
}
```

**Campos Obrigatórios**:

| Campo | Tipo | Validação |
|-------|------|-----------|
| full_name | string | Mínimo 3 caracteres, máximo 255 caracteres |
| headline | string | Mínimo 3 caracteres, máximo 255 caracteres |
| summary | string | Mínimo 10 caracteres |

**Campos Opcionais**:

| Campo | Tipo | Validação |
|-------|------|-----------|
| location | string | Máximo 255 caracteres |

**Resposta de Sucesso (201)**:

```json
{
  "id": "clxmg9v4o000008l4f3h3g3q3",
  "full_name": "João Silva",
  "headline": "Desenvolvedor Full-Stack Sênior | React, Node.js & TypeScript",
  "summary": "Engenheiro de software com 8 anos de experiência...",
  "location": "São Paulo, Brasil",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Exemplo de Requisição**:

```bash
curl -X POST https://api.exemplo.com/api/v1/people \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer seu-token-aqui" \
  -d '{
    "full_name": "João Silva",
    "headline": "Desenvolvedor Full-Stack Sênior",
    "summary": "Engenheiro de software com 8 anos de experiência..."
  }'
```

---

#### PUT /api/v1/people/:id

Atualiza uma pessoa existente.

**Autenticação**: Requerida

**Parâmetros de URL**:

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| id | string | ID único da pessoa (cuid) |

**Body da Requisição**:

```json
{
  "headline": "Novo Headline",
  "location": "Rio de Janeiro, Brasil"
}
```

**Nota**: Todos os campos são opcionais. Apenas os campos enviados serão atualizados.

**Resposta de Sucesso (200)**:

```json
{
  "id": "clxmg9v4o000008l4f3h3g3q3",
  "full_name": "João Silva",
  "headline": "Novo Headline",
  "summary": "Engenheiro de software com 8 anos de experiência...",
  "location": "Rio de Janeiro, Brasil",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T12:00:00.000Z"
}
```

**Exemplo de Requisição**:

```bash
curl -X PUT https://api.exemplo.com/api/v1/people/clxmg9v4o000008l4f3h3g3q3 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer seu-token-aqui" \
  -d '{
    "headline": "Novo Headline"
  }'
```

---

#### DELETE /api/v1/people/:id

Deleta uma pessoa e todos os seus dados relacionados (cascata).

**Autenticação**: Requerida

**Parâmetros de URL**:

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| id | string | ID único da pessoa (cuid) |

**Resposta de Sucesso (204)**: Sem conteúdo

**Exemplo de Requisição**:

```bash
curl -X DELETE https://api.exemplo.com/api/v1/people/clxmg9v4o000008l4f3h3g3q3 \
  -H "Authorization: Bearer seu-token-aqui"
```

---

#### POST /api/v1/people/associate-skill

Associa uma skill a uma pessoa.

**Autenticação**: Requerida

**Body da Requisição**:

```json
{
  "peopleId": "clxmg9v4o000008l4f3h3g3q3",
  "skillId": "clxmg9v4o000008l4f3h3g3q6"
}
```

**Campos Obrigatórios**:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| peopleId | string | ID da pessoa |
| skillId | string | ID da skill |

**Resposta de Sucesso (200)**:

Retorna a pessoa atualizada com todas as skills associadas.

**Exemplo de Requisição**:

```bash
curl -X POST https://api.exemplo.com/api/v1/people/associate-skill \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer seu-token-aqui" \
  -d '{
    "peopleId": "clxmg9v4o000008l4f3h3g3q3",
    "skillId": "clxmg9v4o000008l4f3h3g3q6"
  }'
```

---

#### POST /api/v1/people/disassociate-skill

Desassocia uma skill de uma pessoa.

**Autenticação**: Requerida

**Body da Requisição**:

```json
{
  "peopleId": "clxmg9v4o000008l4f3h3g3q3",
  "skillId": "clxmg9v4o000008l4f3h3g3q6"
}
```

**Campos Obrigatórios**:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| peopleId | string | ID da pessoa |
| skillId | string | ID da skill |

**Resposta de Sucesso (200)**:

Retorna a pessoa atualizada sem a skill desassociada.

**Exemplo de Requisição**:

```bash
curl -X POST https://api.exemplo.com/api/v1/people/disassociate-skill \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer seu-token-aqui" \
  -d '{
    "peopleId": "clxmg9v4o000008l4f3h3g3q3",
    "skillId": "clxmg9v4o000008l4f3h3g3q6"
  }'
```

---

### Experience

#### POST /api/v1/experience

Cria uma nova experiência profissional.

**Autenticação**: Requerida

**Body da Requisição**:

```json
{
  "peopleId": "clxmg9v4o000008l4f3h3g3q3",
  "company": "Startup X",
  "position": "Desenvolvedor Full-Stack",
  "start_date": "2020-01-01T00:00:00.000Z",
  "end_date": "2022-12-31T00:00:00.000Z",
  "description": "Desenvolvimento de aplicações web escaláveis...",
  "location": "São Paulo, Brasil"
}
```

**Campos Obrigatórios**:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| peopleId | string | ID da pessoa |
| company | string | Nome da empresa |
| position | string | Cargo ocupado |
| start_date | string (ISO 8601) | Data de início |

**Campos Opcionais**:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| end_date | string (ISO 8601) | Data de término (null se for o emprego atual) |
| description | string | Descrição da experiência |
| location | string | Localização da empresa |

**Resposta de Sucesso (201)**:

```json
{
  "id": "clxmg9v4o000008l4f3h3g3q7",
  "peopleId": "clxmg9v4o000008l4f3h3g3q3",
  "company": "Startup X",
  "position": "Desenvolvedor Full-Stack",
  "start_date": "2020-01-01T00:00:00.000Z",
  "end_date": "2022-12-31T00:00:00.000Z",
  "description": "Desenvolvimento de aplicações web escaláveis...",
  "location": "São Paulo, Brasil",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

#### GET /api/v1/experience/:id

Busca uma experiência específica pelo ID.

**Autenticação**: Não requerida

**Parâmetros de URL**:

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| id | string | ID único da experiência (cuid) |

**Resposta de Sucesso (200)**:

Retorna o objeto Experience completo.

---

#### PUT /api/v1/experience/:id

Atualiza uma experiência existente.

**Autenticação**: Requerida

**Parâmetros de URL**:

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| id | string | ID único da experiência (cuid) |

**Body da Requisição**:

Todos os campos são opcionais. Apenas os campos enviados serão atualizados.

```json
{
  "company": "Nova Empresa",
  "position": "Desenvolvedor Sênior"
}
```

---

#### DELETE /api/v1/experience/:id

Deleta uma experiência.

**Autenticação**: Requerida

**Parâmetros de URL**:

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| id | string | ID único da experiência (cuid) |

**Resposta de Sucesso (204)**: Sem conteúdo

---

### Education

#### POST /api/v1/education

Cria uma nova formação acadêmica.

**Autenticação**: Requerida

**Body da Requisição**:

```json
{
  "peopleId": "clxmg9v4o000008l4f3h3g3q3",
  "institution": "Universidade de São Paulo",
  "degree": "Bacharelado em Ciência da Computação",
  "field_of_study": "Ciência da Computação",
  "start_date": "2016-01-01T00:00:00.000Z",
  "end_date": "2020-12-31T00:00:00.000Z",
  "description": "Formação focada em algoritmos e estruturas de dados..."
}
```

**Campos Obrigatórios**:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| peopleId | string | ID da pessoa |
| institution | string | Nome da instituição |
| degree | string | Grau obtido |
| start_date | string (ISO 8601) | Data de início |

**Campos Opcionais**:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| field_of_study | string | Área de estudo |
| end_date | string (ISO 8601) | Data de término (null se estiver cursando) |
| description | string | Descrição da formação |

---

#### GET /api/v1/education/:id

Busca uma formação específica pelo ID.

**Autenticação**: Não requerida

---

#### PUT /api/v1/education/:id

Atualiza uma formação existente.

**Autenticação**: Requerida

---

#### DELETE /api/v1/education/:id

Deleta uma formação.

**Autenticação**: Requerida

---

### Projects

#### POST /api/v1/projects

Cria um novo projeto.

**Autenticação**: Requerida

**Body da Requisição**:

```json
{
  "peopleId": "clxmg9v4o000008l4f3h3g3q3",
  "name": "Sistema de Gestão",
  "description": "Sistema completo de gestão empresarial...",
  "url": "https://projeto.exemplo.com",
  "repository_url": "https://github.com/usuario/projeto",
  "start_date": "2023-01-01T00:00:00.000Z",
  "end_date": "2023-12-31T00:00:00.000Z"
}
```

**Campos Obrigatórios**:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| peopleId | string | ID da pessoa |
| name | string | Nome do projeto |
| description | string | Descrição do projeto |
| start_date | string (ISO 8601) | Data de início |

**Campos Opcionais**:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| url | string | URL do projeto (deve ser uma URL válida) |
| repository_url | string | URL do repositório (deve ser uma URL válida) |
| end_date | string (ISO 8601) | Data de término |

---

#### GET /api/v1/projects/:id

Busca um projeto específico pelo ID.

**Autenticação**: Não requerida

---

#### PUT /api/v1/projects/:id

Atualiza um projeto existente.

**Autenticação**: Requerida

---

#### DELETE /api/v1/projects/:id

Deleta um projeto.

**Autenticação**: Requerida

---

### Contacts

#### POST /api/v1/contacts

Cria um novo contato.

**Autenticação**: Requerida

**Body da Requisição**:

```json
{
  "peopleId": "clxmg9v4o000008l4f3h3g3q3",
  "type": "email",
  "value": "joao.silva@email.com"
}
```

**Campos Obrigatórios**:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| peopleId | string | ID da pessoa |
| type | string | Tipo de contato (ex: "email", "phone", "website") |
| value | string | Valor do contato |

**Nota**: Uma pessoa só pode ter um contato de cada tipo (constraint única).

---

#### GET /api/v1/contacts/:id

Busca um contato específico pelo ID.

**Autenticação**: Não requerida

---

#### PUT /api/v1/contacts/:id

Atualiza um contato existente.

**Autenticação**: Requerida

---

#### DELETE /api/v1/contacts/:id

Deleta um contato.

**Autenticação**: Requerida

---

### Social Links

#### POST /api/v1/social-links

Cria um novo link social.

**Autenticação**: Requerida

**Body da Requisição**:

```json
{
  "peopleId": "clxmg9v4o000008l4f3h3g3q3",
  "platform": "linkedin",
  "url": "https://linkedin.com/in/joaosilva"
}
```

**Campos Obrigatórios**:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| peopleId | string | ID da pessoa |
| platform | string | Plataforma (ex: "linkedin", "github", "dribbble") |
| url | string | URL do perfil (deve ser uma URL válida) |

**Nota**: Uma pessoa só pode ter um link por plataforma (constraint única).

---

#### GET /api/v1/social-links/:id

Busca um link social específico pelo ID.

**Autenticação**: Não requerida

---

#### PUT /api/v1/social-links/:id

Atualiza um link social existente.

**Autenticação**: Requerida

---

#### DELETE /api/v1/social-links/:id

Deleta um link social.

**Autenticação**: Requerida

---

### Languages

#### POST /api/v1/languages

Cria um novo idioma.

**Autenticação**: Requerida

**Body da Requisição**:

```json
{
  "peopleId": "clxmg9v4o000008l4f3h3g3q3",
  "name": "Inglês",
  "proficiency": "Fluente"
}
```

**Campos Obrigatórios**:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| peopleId | string | ID da pessoa |
| name | string | Nome do idioma |
| proficiency | string | Nível de proficiência (ex: "Nativo", "Fluente", "Básico") |

**Nota**: Uma pessoa só pode ter um nível por idioma (constraint única).

---

#### GET /api/v1/languages/:id

Busca um idioma específico pelo ID.

**Autenticação**: Não requerida

---

#### PUT /api/v1/languages/:id

Atualiza um idioma existente.

**Autenticação**: Requerida

---

#### DELETE /api/v1/languages/:id

Deleta um idioma.

**Autenticação**: Requerida

---

### Certifications

#### POST /api/v1/certifications

Cria uma nova certificação.

**Autenticação**: Requerida

**Body da Requisição**:

```json
{
  "peopleId": "clxmg9v4o000008l4f3h3g3q3",
  "name": "AWS Certified Solutions Architect",
  "issuer": "Amazon Web Services",
  "issue_date": "2023-06-01T00:00:00.000Z",
  "url": "https://aws.amazon.com/certification/"
}
```

**Campos Obrigatórios**:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| peopleId | string | ID da pessoa |
| name | string | Nome da certificação |
| issuer | string | Emissor da certificação |
| issue_date | string (ISO 8601) | Data de emissão |

**Campos Opcionais**:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| url | string | URL da certificação (deve ser uma URL válida) |

---

#### GET /api/v1/certifications/:id

Busca uma certificação específica pelo ID.

**Autenticação**: Não requerida

---

#### PUT /api/v1/certifications/:id

Atualiza uma certificação existente.

**Autenticação**: Requerida

---

#### DELETE /api/v1/certifications/:id

Deleta uma certificação.

**Autenticação**: Requerida

---

### Skills

#### GET /api/v1/skills

Lista todas as skills globais cadastradas.

**Autenticação**: Não requerida

**Resposta de Sucesso (200)**:

```json
[
  {
    "id": "clxmg9v4o000008l4f3h3g3q6",
    "name": "TypeScript"
  },
  {
    "id": "clxmg9v4o000008l4f3h3g3q7",
    "name": "React.js"
  }
]
```

**Nota**: As skills são retornadas ordenadas por nome (asc).

---

#### GET /api/v1/skills/:id

Busca uma skill específica pelo ID.

**Autenticação**: Não requerida

**Parâmetros de URL**:

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| id | string | ID único da skill (cuid) |

**Resposta de Sucesso (200)**:

```json
{
  "id": "clxmg9v4o000008l4f3h3g3q6",
  "name": "TypeScript"
}
```

---

#### POST /api/v1/skills

Cria uma nova skill global.

**Autenticação**: Requerida

**Body da Requisição**:

```json
{
  "name": "Terraform"
}
```

**Campos Obrigatórios**:

| Campo | Tipo | Validação |
|-------|------|-----------|
| name | string | Mínimo 1 caractere, máximo 255 caracteres, único |

**Resposta de Sucesso (201)**:

```json
{
  "id": "clxmg9v4o000008l4f3h3g3q8",
  "name": "Terraform"
}
```

**Erro de Conflito (409)**:

Se a skill já existir, retorna:

```json
{
  "status": "error",
  "message": "Unique constraint violation",
  "field": ["name"]
}
```

---

#### PUT /api/v1/skills/:id

Atualiza uma skill existente.

**Autenticação**: Requerida

**Parâmetros de URL**:

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| id | string | ID único da skill (cuid) |

**Body da Requisição**:

```json
{
  "name": "Terraform 2.0"
}
```

**Campos Opcionais**:

| Campo | Tipo | Validação |
|-------|------|-----------|
| name | string | Mínimo 1 caractere, máximo 255 caracteres, único |

---

#### DELETE /api/v1/skills/:id

Deleta uma skill.

**Autenticação**: Requerida

**Parâmetros de URL**:

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| id | string | ID único da skill (cuid) |

**Resposta de Sucesso (204)**: Sem conteúdo

---

## Coleção Postman

O projeto inclui uma coleção Postman completa (`CurriculoExpress.postman_collection.json`) na pasta `docs` que documenta e permite testar todos os endpoints da API.

### Como Usar

1. **Importar a Coleção:**
   - Abra o Postman
   - Clique em "Import" e selecione o arquivo `CurriculoExpress.postman_collection.json`

2. **Configurar Variáveis de Ambiente:**
   - Na coleção, configure as variáveis:
     - `BASE_URL`: URL base da API (ex: `http://localhost:3000` para local ou `https://sua-api.vercel.app` para produção)
     - `AUTH_TOKEN`: Token de autenticação (valor da variável de ambiente `API_SECRET_KEY`)

3. **Testar os Endpoints:**
   - Navegue pelas pastas organizadas por entidade
   - Todos os endpoints de escrita (POST, PUT, DELETE) já incluem o header `Authorization: Bearer {{AUTH_TOKEN}}`
   - Os endpoints incluem exemplos de request body quando aplicável

---

## Limites e Rate Limiting

Atualmente, a API não possui limites de rate limiting implementados. Em produção, recomenda-se implementar rate limiting para proteger a API contra abuso.

---

## Suporte

Para suporte, dúvidas ou reportar problemas, consulte a documentação do projeto no repositório GitHub.

---

**Última atualização**: Novembro 2025
