import request from 'supertest';
import app from '../../src/app';
import { getAuthHeader } from '../helpers/auth.helper';

// Pula os testes de integração se DATABASE_URL não estiver configurada
const shouldSkipTests = !process.env.DATABASE_URL && !process.env.DATABASE_URL_TEST;

// Importa o Prisma apenas se os testes não forem pulados
let prisma: any;
if (!shouldSkipTests) {
  try {
    prisma = require('../../src/config/database').default;
  } catch (error) {
    // Se houver erro ao importar o Prisma, pula os testes
    console.warn('Prisma não pôde ser importado. Testes de integração serão pulados.');
  }
}

describe('Experience API (Integration)', () => {
  let testPersonId: string;

  // Limpa o banco e cria uma pessoa de teste antes de cada teste
  beforeEach(async () => {
    if (shouldSkipTests) {
      return;
    }
    await prisma.experience.deleteMany();
    await prisma.people.deleteMany();

    // Cria uma pessoa de teste para associar experiências
    const person = await prisma.people.create({
      data: {
        full_name: 'João Silva',
        headline: 'Desenvolvedor Full-Stack Sênior',
        summary: 'Engenheiro de software com 8 anos de experiência na construção de aplicações web escaláveis.',
        location: 'São Paulo, Brasil',
      },
    });
    testPersonId = person.id;
  });

  afterAll(async () => {
    if (shouldSkipTests) {
      return;
    }
    await prisma.experience.deleteMany();
    await prisma.people.deleteMany();
    await prisma.$disconnect();
  });

  describe('POST /api/v1/experience', () => {
    it('should create a new experience and return 201', async () => {
      if (shouldSkipTests) {
        return;
      }
      const newExperience = {
        peopleId: testPersonId,
        company: 'Tech Corp',
        position: 'Desenvolvedor Full-Stack',
        start_date: '2020-01-01T00:00:00.000Z',
        end_date: '2022-12-31T23:59:59.999Z',
        description: 'Desenvolvimento de aplicações web escaláveis usando React e Node.js',
        location: 'São Paulo, Brasil',
      };

      const response = await request(app)
        .post('/api/v1/experience')
        .set(getAuthHeader())
        .send(newExperience);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.company).toBe(newExperience.company);
      expect(response.body.position).toBe(newExperience.position);
      expect(response.body.peopleId).toBe(testPersonId);
      expect(response.body).toHaveProperty('createdAt');

      // Verifica se o dado foi realmente salvo no banco
      const dbExperience = await prisma.experience.findUnique({
        where: { id: response.body.id },
      });
      expect(dbExperience).not.toBeNull();
      expect(dbExperience?.company).toBe(newExperience.company);
    });

    it('should return 400 on invalid data (Zod validation) - missing required fields', async () => {
      const invalidExperience = {
        company: 'Tech Corp',
        // Faltando peopleId, position, start_date
      };

      const response = await request(app).post('/api/v1/experience').send(invalidExperience);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Validation failed');
      expect(response.body).toHaveProperty('errors');
      expect(Array.isArray(response.body.errors)).toBe(true);
    });

    it('should return 400 on invalid data (Zod validation) - invalid date format', async () => {
      const invalidExperience = {
        peopleId: testPersonId,
        company: 'Tech Corp',
        position: 'Desenvolvedor',
        start_date: 'invalid-date',
      };

      const response = await request(app).post('/api/v1/experience').send(invalidExperience);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Validation failed');
    });

    it('should create an experience without optional fields', async () => {
      const newExperience = {
        peopleId: testPersonId,
        company: 'Startup X',
        position: 'Estagiário',
        start_date: '2019-01-01T00:00:00.000Z',
      };

      const response = await request(app)
        .post('/api/v1/experience')
        .set(getAuthHeader())
        .send(newExperience);

      expect(response.status).toBe(201);
      expect(response.body.company).toBe(newExperience.company);
      expect(response.body.end_date).toBeNull();
      expect(response.body.description).toBe('');
      expect(response.body.location).toBeNull();
    });

    it('should return 404 when peopleId does not exist', async () => {
      const nonExistentPeopleId = 'clxmg9v4o000008l4f3h3g3q3';
      const newExperience = {
        peopleId: nonExistentPeopleId,
        company: 'Tech Corp',
        position: 'Desenvolvedor',
        start_date: '2020-01-01T00:00:00.000Z',
      };

      const response = await request(app)
        .post('/api/v1/experience')
        .set(getAuthHeader())
        .send(newExperience);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Person not found');
    });
  });

  describe('GET /api/v1/experience/:id', () => {
    it('should return 200 with experience data when experience exists', async () => {
      const experience = await prisma.experience.create({
        data: {
          company: 'Tech Corp',
          position: 'Desenvolvedor Full-Stack',
          start_date: new Date('2020-01-01'),
          end_date: new Date('2022-12-31'),
          description: 'Desenvolvimento de aplicações web',
          location: 'São Paulo, Brasil',
          peopleId: testPersonId,
        },
      });

      const response = await request(app).get(`/api/v1/experience/${experience.id}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(experience.id);
      expect(response.body.company).toBe(experience.company);
      expect(response.body.position).toBe(experience.position);
      expect(response.body.peopleId).toBe(testPersonId);
    });

    it('should return 404 when experience does not exist', async () => {
      const nonExistentId = 'clxmg9v4o000008l4f3h3g3q3';

      const response = await request(app).get(`/api/v1/experience/${nonExistentId}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Experience not found');
    });
  });

  describe('PUT /api/v1/experience/:id', () => {
    it('should return 200 and update experience when experience exists', async () => {
      const experience = await prisma.experience.create({
        data: {
          company: 'Tech Corp',
          position: 'Desenvolvedor Full-Stack',
          start_date: new Date('2020-01-01'),
          description: 'Desenvolvimento de aplicações web',
          peopleId: testPersonId,
        },
      });

      const updateData = {
        company: 'New Tech Corp',
        position: 'Desenvolvedor Full-Stack Sênior',
      };

      const response = await request(app).put(`/api/v1/experience/${experience.id}`).send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(experience.id);
      expect(response.body.company).toBe(updateData.company);
      expect(response.body.position).toBe(updateData.position);

      // Verifica se foi atualizado no banco
      const dbExperience = await prisma.experience.findUnique({
        where: { id: experience.id },
      });
      expect(dbExperience?.company).toBe(updateData.company);
      expect(dbExperience?.position).toBe(updateData.position);
    });

    it('should return 404 when experience does not exist', async () => {
      const nonExistentId = 'clxmg9v4o000008l4f3h3g3q3';
      const updateData = {
        company: 'New Company',
      };

      const response = await request(app).put(`/api/v1/experience/${nonExistentId}`).send(updateData);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Experience not found');
    });

    it('should return 400 on invalid update data (Zod validation)', async () => {
      const experience = await prisma.experience.create({
        data: {
          company: 'Tech Corp',
          position: 'Desenvolvedor',
          start_date: new Date('2020-01-01'),
          description: 'Desenvolvimento de aplicações',
          peopleId: testPersonId,
        },
      });

      const invalidUpdateData = {
        company: 'T', // Muito curto
      };

      const response = await request(app).put(`/api/v1/experience/${experience.id}`).send(invalidUpdateData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Validation failed');
    });

    it('should allow partial updates (only some fields)', async () => {
      const experience = await prisma.experience.create({
        data: {
          company: 'Tech Corp',
          position: 'Desenvolvedor Full-Stack',
          start_date: new Date('2020-01-01'),
          description: 'Desenvolvimento de aplicações web',
          peopleId: testPersonId,
        },
      });

      const updateData = {
        company: 'New Tech Corp',
      };

      const response = await request(app).put(`/api/v1/experience/${experience.id}`).send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.company).toBe(updateData.company);
      expect(response.body.position).toBe(experience.position);
    });

    it('should allow setting end_date to null', async () => {
      const experience = await prisma.experience.create({
        data: {
          company: 'Tech Corp',
          position: 'Desenvolvedor',
          start_date: new Date('2020-01-01'),
          end_date: new Date('2022-12-31'),
          description: 'Desenvolvimento de aplicações',
          peopleId: testPersonId,
        },
      });

      const updateData = {
        end_date: null,
      };

      const response = await request(app).put(`/api/v1/experience/${experience.id}`).send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.end_date).toBeNull();
    });
  });

  describe('DELETE /api/v1/experience/:id', () => {
    it('should return 204 and delete experience when experience exists', async () => {
      const experience = await prisma.experience.create({
        data: {
          company: 'Tech Corp',
          position: 'Desenvolvedor Full-Stack',
          start_date: new Date('2020-01-01'),
          description: 'Desenvolvimento de aplicações web',
          peopleId: testPersonId,
        },
      });

      const response = await request(app).delete(`/api/v1/experience/${experience.id}`);

      expect(response.status).toBe(204);

      // Verifica se foi deletado do banco
      const dbExperience = await prisma.experience.findUnique({
        where: { id: experience.id },
      });
      expect(dbExperience).toBeNull();
    });

    it('should return 404 when experience does not exist', async () => {
      const nonExistentId = 'clxmg9v4o000008l4f3h3g3q3';

      const response = await request(app).delete(`/api/v1/experience/${nonExistentId}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Experience not found');
    });
  });
});

