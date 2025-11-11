import request from 'supertest';
import app from '../../src/app';
import { getAuthHeader, getInvalidAuthToken } from '../helpers/auth.helper';

// Pula os testes de integração se DATABASE_URL não estiver configurada
const shouldSkipTests = !process.env.DATABASE_URL && !process.env.DATABASE_URL_TEST;

/**
 * Testes de integração para autenticação
 *
 * ONDE: tests/integration/auth.api.test.ts
 * POR QUÊ: Garantir que a autenticação funciona corretamente nas rotas da API
 * O QUE: Testa autenticação em rotas protegidas e verifica que rotas públicas permanecem acessíveis
 */
describe('Authentication API (Integration)', () => {
  describe('Rotas protegidas (POST, PUT, DELETE)', () => {
    it('deve retornar 401 quando tentar criar pessoa sem autenticação', async () => {
      const newPerson = {
        full_name: 'Test User',
        headline: 'Test Headline',
        summary: 'Test summary',
      };

      const response = await request(app).post('/api/v1/people').send(newPerson);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Authorization header is required');
    });

    it('deve retornar 401 quando o header Authorization está ausente em PUT', async () => {
      const response = await request(app)
        .put('/api/v1/people/non-existent-id')
        .send({ headline: 'Updated' });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Authorization header is required');
    });

    it('deve retornar 401 quando o header Authorization está ausente em DELETE', async () => {
      const response = await request(app).delete('/api/v1/people/non-existent-id');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Authorization header is required');
    });

    it('deve retornar 401 quando o formato do token é inválido (sem Bearer)', async () => {
      const response = await request(app)
        .post('/api/v1/people')
        .set('Authorization', 'invalid-format')
        .send({
          full_name: 'Test User',
          headline: 'Test Headline',
          summary: 'Test summary',
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Invalid authorization format. Expected: Bearer <token>');
    });

    it('deve retornar 403 quando o token é inválido', async () => {
      const invalidToken = getInvalidAuthToken();
      const response = await request(app)
        .post('/api/v1/people')
        .set('Authorization', `Bearer ${invalidToken}`)
        .send({
          full_name: 'Test User',
          headline: 'Test Headline',
          summary: 'Test summary',
        });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Invalid or expired token');
    });
  });

  describe('Rotas públicas (GET)', () => {
    it('deve permitir acesso sem autenticação em GET /api/v1/people', async () => {
      const response = await request(app).get('/api/v1/people');

      // Pode retornar 200 (com lista vazia) ou outro status, mas não deve ser 401/403
      expect([200, 404, 500]).toContain(response.status);
      expect(response.status).not.toBe(401);
      expect(response.status).not.toBe(403);
    });

    it('deve permitir acesso sem autenticação em GET /api/v1/health', async () => {
      const response = await request(app).get('/api/v1/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
    });

    it('deve permitir acesso sem autenticação em GET /api/v1/skills', async () => {
      const response = await request(app).get('/api/v1/skills');

      // Pode retornar 200 (com lista vazia) ou outro status, mas não deve ser 401/403
      expect([200, 404, 500]).toContain(response.status);
      expect(response.status).not.toBe(401);
      expect(response.status).not.toBe(403);
    });
  });

  describe('Autenticação bem-sucedida', () => {
    it('deve permitir criar pessoa com token válido', async () => {
      if (shouldSkipTests) {
        return;
      }

      let prisma: any;
      try {
        prisma = require('../../src/config/database').default;
      } catch (error) {
        return;
      }

      // Limpa o banco antes do teste
      await prisma.people.deleteMany();

      const newPerson = {
        full_name: 'Test User',
        headline: 'Test Headline',
        summary: 'Test summary',
      };

      const response = await request(app)
        .post('/api/v1/people')
        .set(getAuthHeader())
        .send(newPerson);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.full_name).toBe(newPerson.full_name);

      // Limpa após o teste
      await prisma.people.deleteMany();
      await prisma.$disconnect();
    });
  });
});

