import request from 'supertest';
import app from '../../src/app';

// Pula os testes de integração se DATABASE_URL não estiver configurada
const shouldSkipTests = !process.env.DATABASE_URL && !process.env.DATABASE_URL_TEST;

// Importa o Prisma apenas se os testes não forem pulados
let prisma: any;
if (!shouldSkipTests) {
  try {
    prisma = require('../../src/config/database').default;
  } catch (error) {
    console.warn('Prisma não pôde ser importado. Testes de integração serão pulados.');
  }
}

describe('Education API (Integration)', () => {
  let testPersonId: string;

  beforeEach(async () => {
    if (shouldSkipTests) {
      return;
    }
    await prisma.education.deleteMany();
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
    await prisma.education.deleteMany();
    await prisma.people.deleteMany();
    await prisma.$disconnect();
  });

  describe('POST /api/v1/education', () => {
    it('should create a new education and return 201', async () => {
      if (shouldSkipTests) {
        return;
      }
      const newEducation = {
        peopleId: testPersonId,
        institution: 'Universidade de São Paulo',
        degree: 'Bacharelado em Ciência da Computação',
        field_of_study: 'Ciência da Computação',
        start_date: '2015-01-01T00:00:00.000Z',
        end_date: '2019-12-31T23:59:59.999Z',
        description: 'Graduação em Ciência da Computação com foco em desenvolvimento de software',
      };

      const response = await request(app).post('/api/v1/education').send(newEducation);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.institution).toBe(newEducation.institution);
      expect(response.body.degree).toBe(newEducation.degree);
      expect(response.body.peopleId).toBe(testPersonId);
    });

    it('should return 400 on invalid data (Zod validation)', async () => {
      const invalidEducation = {
        institution: 'USP',
        // Faltando peopleId, degree, start_date
      };

      const response = await request(app).post('/api/v1/education').send(invalidEducation);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Validation failed');
    });

    it('should create an education without optional fields', async () => {
      const newEducation = {
        peopleId: testPersonId,
        institution: 'Universidade Federal',
        degree: 'Mestrado',
        start_date: '2020-01-01T00:00:00.000Z',
      };

      const response = await request(app).post('/api/v1/education').send(newEducation);

      expect(response.status).toBe(201);
      expect(response.body.field_of_study).toBeNull();
      expect(response.body.end_date).toBeNull();
      expect(response.body.description).toBeNull();
    });

    it('should return 404 when peopleId does not exist', async () => {
      const nonExistentPeopleId = 'clxmg9v4o000008l4f3h3g3q3';
      const newEducation = {
        peopleId: nonExistentPeopleId,
        institution: 'Universidade',
        degree: 'Bacharelado',
        start_date: '2020-01-01T00:00:00.000Z',
      };

      const response = await request(app).post('/api/v1/education').send(newEducation);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Person not found');
    });
  });

  describe('GET /api/v1/education/:id', () => {
    it('should return 200 with education data when education exists', async () => {
      const education = await prisma.education.create({
        data: {
          institution: 'Universidade de São Paulo',
          degree: 'Bacharelado',
          start_date: new Date('2015-01-01'),
          peopleId: testPersonId,
        },
      });

      const response = await request(app).get(`/api/v1/education/${education.id}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(education.id);
      expect(response.body.institution).toBe(education.institution);
    });

    it('should return 404 when education does not exist', async () => {
      const nonExistentId = 'clxmg9v4o000008l4f3h3g3q3';

      const response = await request(app).get(`/api/v1/education/${nonExistentId}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Education not found');
    });
  });

  describe('PUT /api/v1/education/:id', () => {
    it('should return 200 and update education when education exists', async () => {
      const education = await prisma.education.create({
        data: {
          institution: 'Universidade de São Paulo',
          degree: 'Bacharelado',
          start_date: new Date('2015-01-01'),
          peopleId: testPersonId,
        },
      });

      const updateData = {
        degree: 'Mestrado',
        field_of_study: 'Engenharia de Software',
      };

      const response = await request(app).put(`/api/v1/education/${education.id}`).send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.degree).toBe(updateData.degree);
      expect(response.body.field_of_study).toBe(updateData.field_of_study);
    });

    it('should return 404 when education does not exist', async () => {
      const nonExistentId = 'clxmg9v4o000008l4f3h3g3q3';
      const updateData = {
        degree: 'Mestrado',
      };

      const response = await request(app).put(`/api/v1/education/${nonExistentId}`).send(updateData);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('status', 'error');
    });
  });

  describe('DELETE /api/v1/education/:id', () => {
    it('should return 204 and delete education when education exists', async () => {
      const education = await prisma.education.create({
        data: {
          institution: 'Universidade de São Paulo',
          degree: 'Bacharelado',
          start_date: new Date('2015-01-01'),
          peopleId: testPersonId,
        },
      });

      const response = await request(app).delete(`/api/v1/education/${education.id}`);

      expect(response.status).toBe(204);

      const dbEducation = await prisma.education.findUnique({
        where: { id: education.id },
      });
      expect(dbEducation).toBeNull();
    });

    it('should return 404 when education does not exist', async () => {
      const nonExistentId = 'clxmg9v4o000008l4f3h3g3q3';

      const response = await request(app).delete(`/api/v1/education/${nonExistentId}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('status', 'error');
    });
  });
});

