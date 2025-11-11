import request from 'supertest';
import app from '../../src/app';

const shouldSkipTests = !process.env.DATABASE_URL && !process.env.DATABASE_URL_TEST;

let prisma: any;
if (!shouldSkipTests) {
  try {
    prisma = require('../../src/config/database').default;
  } catch (error) {
    console.warn('Prisma não pôde ser importado. Testes de integração serão pulados.');
  }
}

describe('Languages API (Integration)', () => {
  let testPersonId: string;

  beforeEach(async () => {
    if (shouldSkipTests) {
      return;
    }
    await prisma.languages.deleteMany();
    await prisma.people.deleteMany();

    const person = await prisma.people.create({
      data: {
        full_name: 'João Silva',
        headline: 'Desenvolvedor Full-Stack Sênior',
        summary: 'Engenheiro de software com 8 anos de experiência.',
        location: 'São Paulo, Brasil',
      },
    });
    testPersonId = person.id;
  });

  afterAll(async () => {
    if (shouldSkipTests) {
      return;
    }
    await prisma.languages.deleteMany();
    await prisma.people.deleteMany();
    await prisma.$disconnect();
  });

  describe('POST /api/v1/languages', () => {
    it('should create a new language and return 201', async () => {
      if (shouldSkipTests) {
        return;
      }
      const newLanguage = {
        peopleId: testPersonId,
        name: 'Inglês',
        proficiency: 'Fluente (C1)',
      };

      const response = await request(app).post('/api/v1/languages').send(newLanguage);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(newLanguage.name);
      expect(response.body.proficiency).toBe(newLanguage.proficiency);
      expect(response.body.peopleId).toBe(testPersonId);

      const dbLanguage = await prisma.languages.findUnique({
        where: { id: response.body.id },
      });
      expect(dbLanguage).not.toBeNull();
      expect(dbLanguage?.name).toBe(newLanguage.name);
    });

    it('should return 400 on invalid data (Zod validation)', async () => {
      const invalidLanguage = {
        name: 'Inglês',
        // Faltando peopleId, proficiency
      };

      const response = await request(app).post('/api/v1/languages').send(invalidLanguage);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Validation failed');
    });

    it('should return 404 when peopleId does not exist', async () => {
      const nonExistentPeopleId = 'clxmg9v4o000008l4f3h3g3q3';
      const newLanguage = {
        peopleId: nonExistentPeopleId,
        name: 'Inglês',
        proficiency: 'Fluente',
      };

      const response = await request(app).post('/api/v1/languages').send(newLanguage);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Person not found');
    });
  });

  describe('GET /api/v1/languages/:id', () => {
    it('should return 200 with language data when language exists', async () => {
      const language = await prisma.languages.create({
        data: {
          name: 'Inglês',
          proficiency: 'Fluente (C1)',
          peopleId: testPersonId,
        },
      });

      const response = await request(app).get(`/api/v1/languages/${language.id}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(language.id);
      expect(response.body.name).toBe(language.name);
    });

    it('should return 404 when language does not exist', async () => {
      const nonExistentId = 'clxmg9v4o000008l4f3h3g3q3';

      const response = await request(app).get(`/api/v1/languages/${nonExistentId}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Language not found');
    });
  });

  describe('PUT /api/v1/languages/:id', () => {
    it('should return 200 and update language when language exists', async () => {
      const language = await prisma.languages.create({
        data: {
          name: 'Inglês',
          proficiency: 'Intermediário',
          peopleId: testPersonId,
        },
      });

      const updateData = {
        proficiency: 'Fluente (C1)',
      };

      const response = await request(app).put(`/api/v1/languages/${language.id}`).send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.proficiency).toBe(updateData.proficiency);

      const dbLanguage = await prisma.languages.findUnique({
        where: { id: language.id },
      });
      expect(dbLanguage?.proficiency).toBe(updateData.proficiency);
    });

    it('should return 404 when language does not exist', async () => {
      const nonExistentId = 'clxmg9v4o000008l4f3h3g3q3';
      const updateData = {
        proficiency: 'Fluente',
      };

      const response = await request(app).put(`/api/v1/languages/${nonExistentId}`).send(updateData);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('status', 'error');
    });
  });

  describe('DELETE /api/v1/languages/:id', () => {
    it('should return 204 and delete language when language exists', async () => {
      const language = await prisma.languages.create({
        data: {
          name: 'Inglês',
          proficiency: 'Fluente (C1)',
          peopleId: testPersonId,
        },
      });

      const response = await request(app).delete(`/api/v1/languages/${language.id}`);

      expect(response.status).toBe(204);

      const dbLanguage = await prisma.languages.findUnique({
        where: { id: language.id },
      });
      expect(dbLanguage).toBeNull();
    });

    it('should return 404 when language does not exist', async () => {
      const nonExistentId = 'clxmg9v4o000008l4f3h3g3q3';

      const response = await request(app).delete(`/api/v1/languages/${nonExistentId}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('status', 'error');
    });
  });
});

