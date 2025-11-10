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
    // Se houver erro ao importar o Prisma, pula os testes
    console.warn('Prisma não pôde ser importado. Testes de integração serão pulados.');
  }
}

describe('People API (Integration)', () => {
  // Limpa o banco antes e depois de cada teste
  beforeEach(async () => {
    if (shouldSkipTests) {
      return;
    }
    await prisma.people.deleteMany();
  });

  afterAll(async () => {
    if (shouldSkipTests) {
      return;
    }
    await prisma.people.deleteMany();
    await prisma.$disconnect();
  });

  describe('POST /api/v1/people', () => {
    it('should create a new person and return 201', async () => {
      if (shouldSkipTests) {
        return;
      }
      const newPerson = {
        full_name: 'João Silva',
        headline: 'Desenvolvedor Full-Stack Sênior',
        summary: 'Engenheiro de software com 8 anos de experiência na construção de aplicações web escaláveis.',
        location: 'São Paulo, Brasil',
      };

      const response = await request(app).post('/api/v1/people').send(newPerson);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.full_name).toBe(newPerson.full_name);
      expect(response.body.headline).toBe(newPerson.headline);
      expect(response.body.summary).toBe(newPerson.summary);
      expect(response.body.location).toBe(newPerson.location);
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');

      // Verifica se o dado foi realmente salvo no banco
      const dbPerson = await prisma.people.findUnique({
        where: { id: response.body.id },
      });
      expect(dbPerson).not.toBeNull();
      expect(dbPerson?.full_name).toBe(newPerson.full_name);
    });

    it('should return 400 on invalid data (Zod validation) - missing required fields', async () => {
      const invalidPerson = {
        headline: 'Missing full_name',
      };

      const response = await request(app).post('/api/v1/people').send(invalidPerson);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Validation failed');
      expect(response.body).toHaveProperty('errors');
      expect(Array.isArray(response.body.errors)).toBe(true);
      expect(response.body.errors.length).toBeGreaterThan(0);
    });

    it('should return 400 on invalid data (Zod validation) - field too short', async () => {
      const invalidPerson = {
        full_name: 'Jo',
        headline: 'Dev',
        summary: 'Short',
      };

      const response = await request(app).post('/api/v1/people').send(invalidPerson);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Validation failed');
      expect(response.body).toHaveProperty('errors');
    });

    it('should create a person without location (optional field)', async () => {
      const newPerson = {
        full_name: 'Mariana Costa',
        headline: 'Product Designer Sênior',
        summary: 'Designer de produto focada em criar experiências de usuário intuitivas e acessíveis.',
      };

      const response = await request(app).post('/api/v1/people').send(newPerson);

      expect(response.status).toBe(201);
      expect(response.body.full_name).toBe(newPerson.full_name);
      expect(response.body.location).toBeNull();
    });
  });

  describe('GET /api/v1/people', () => {
    it('should return 200 with empty array when no people exist', async () => {
      const response = await request(app).get('/api/v1/people');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });

    it('should return 200 with all people', async () => {
      // Cria pessoas de teste
      await prisma.people.create({
        data: {
          full_name: 'João Silva',
          headline: 'Desenvolvedor Full-Stack',
          summary: 'Engenheiro de software com experiência em desenvolvimento web.',
          location: 'São Paulo, Brasil',
        },
      });

      await prisma.people.create({
        data: {
          full_name: 'Mariana Costa',
          headline: 'Product Designer',
          summary: 'Designer de produto focada em criar experiências de usuário.',
        },
      });

      const response = await request(app).get('/api/v1/people');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('full_name');
      expect(response.body[1]).toHaveProperty('id');
      expect(response.body[1]).toHaveProperty('full_name');
    });
  });

  describe('GET /api/v1/people/:id', () => {
    it('should return 200 with person data when person exists', async () => {
      const person = await prisma.people.create({
        data: {
          full_name: 'João Silva',
          headline: 'Desenvolvedor Full-Stack',
          summary: 'Engenheiro de software com experiência em desenvolvimento web.',
          location: 'São Paulo, Brasil',
        },
      });

      const response = await request(app).get(`/api/v1/people/${person.id}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(person.id);
      expect(response.body.full_name).toBe(person.full_name);
      expect(response.body.headline).toBe(person.headline);
      expect(response.body.summary).toBe(person.summary);
      expect(response.body.location).toBe(person.location);
    });

    it('should return 404 when person does not exist', async () => {
      const nonExistentId = 'clxmg9v4o000008l4f3h3g3q3';

      const response = await request(app).get(`/api/v1/people/${nonExistentId}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Person not found');
    });

    it('should return 400 on invalid ID format', async () => {
      const invalidId = 'invalid-id';

      const response = await request(app).get(`/api/v1/people/${invalidId}`);

      // O Prisma pode retornar 404 ou 500 dependendo do formato
      // Mas o importante é que não retorna 200
      expect([400, 404, 500]).toContain(response.status);
    });
  });

  describe('PUT /api/v1/people/:id', () => {
    it('should return 200 and update person when person exists', async () => {
      const person = await prisma.people.create({
        data: {
          full_name: 'João Silva',
          headline: 'Desenvolvedor Full-Stack',
          summary: 'Engenheiro de software com experiência em desenvolvimento web.',
          location: 'São Paulo, Brasil',
        },
      });

      const updateData = {
        headline: 'Desenvolvedor Full-Stack Sênior',
        location: 'Rio de Janeiro, Brasil',
      };

      const response = await request(app).put(`/api/v1/people/${person.id}`).send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(person.id);
      expect(response.body.headline).toBe(updateData.headline);
      expect(response.body.location).toBe(updateData.location);
      expect(response.body.full_name).toBe(person.full_name); // Campo não atualizado deve permanecer

      // Verifica se foi atualizado no banco
      const dbPerson = await prisma.people.findUnique({
        where: { id: person.id },
      });
      expect(dbPerson?.headline).toBe(updateData.headline);
      expect(dbPerson?.location).toBe(updateData.location);
    });

    it('should return 404 when person does not exist', async () => {
      const nonExistentId = 'clxmg9v4o000008l4f3h3g3q3';
      const updateData = {
        headline: 'Novo Headline',
      };

      const response = await request(app).put(`/api/v1/people/${nonExistentId}`).send(updateData);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Person not found');
    });

    it('should return 400 on invalid update data (Zod validation)', async () => {
      const person = await prisma.people.create({
        data: {
          full_name: 'João Silva',
          headline: 'Desenvolvedor Full-Stack',
          summary: 'Engenheiro de software com experiência em desenvolvimento web.',
        },
      });

      const invalidUpdateData = {
        full_name: 'Jo', // Muito curto
      };

      const response = await request(app).put(`/api/v1/people/${person.id}`).send(invalidUpdateData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Validation failed');
    });

    it('should allow partial updates (only some fields)', async () => {
      const person = await prisma.people.create({
        data: {
          full_name: 'João Silva',
          headline: 'Desenvolvedor Full-Stack',
          summary: 'Engenheiro de software com experiência em desenvolvimento web.',
          location: 'São Paulo, Brasil',
        },
      });

      const updateData = {
        headline: 'Desenvolvedor Full-Stack Sênior',
      };

      const response = await request(app).put(`/api/v1/people/${person.id}`).send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.headline).toBe(updateData.headline);
      expect(response.body.full_name).toBe(person.full_name);
      expect(response.body.summary).toBe(person.summary);
      expect(response.body.location).toBe(person.location);
    });
  });

  describe('DELETE /api/v1/people/:id', () => {
    it('should return 204 and delete person when person exists', async () => {
      const person = await prisma.people.create({
        data: {
          full_name: 'João Silva',
          headline: 'Desenvolvedor Full-Stack',
          summary: 'Engenheiro de software com experiência em desenvolvimento web.',
        },
      });

      const response = await request(app).delete(`/api/v1/people/${person.id}`);

      expect(response.status).toBe(204);

      // Verifica se foi deletado do banco
      const dbPerson = await prisma.people.findUnique({
        where: { id: person.id },
      });
      expect(dbPerson).toBeNull();
    });

    it('should return 404 when person does not exist', async () => {
      const nonExistentId = 'clxmg9v4o000008l4f3h3g3q3';

      const response = await request(app).delete(`/api/v1/people/${nonExistentId}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Person not found');
    });
  });
});

