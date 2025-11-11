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

describe('Skills API (Integration)', () => {
  // Limpa o banco antes de cada teste
  beforeEach(async () => {
    if (shouldSkipTests) {
      return;
    }
    await prisma.skills.deleteMany();
  });

  afterAll(async () => {
    if (shouldSkipTests) {
      return;
    }
    await prisma.skills.deleteMany();
    await prisma.$disconnect();
  });

  describe('GET /api/v1/skills', () => {
    it('should return 200 with empty array when no skills exist', async () => {
      if (shouldSkipTests) {
        return;
      }

      const response = await request(app).get('/api/v1/skills');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });

    it('should return 200 with all skills when skills exist', async () => {
      if (shouldSkipTests) {
        return;
      }

      // Cria algumas skills de teste
      const skill1 = await prisma.skills.create({
        data: { name: 'TypeScript' },
      });
      const skill2 = await prisma.skills.create({
        data: { name: 'React' },
      });

      const response = await request(app).get('/api/v1/skills');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body.some((s: any) => s.id === skill1.id)).toBe(true);
      expect(response.body.some((s: any) => s.id === skill2.id)).toBe(true);
    });

    it('should return skills ordered by name', async () => {
      if (shouldSkipTests) {
        return;
      }

      await prisma.skills.create({ data: { name: 'Zebra' } });
      await prisma.skills.create({ data: { name: 'Alpha' } });
      await prisma.skills.create({ data: { name: 'Beta' } });

      const response = await request(app).get('/api/v1/skills');

      expect(response.status).toBe(200);
      expect(response.body[0].name).toBe('Alpha');
      expect(response.body[1].name).toBe('Beta');
      expect(response.body[2].name).toBe('Zebra');
    });
  });

  describe('GET /api/v1/skills/:id', () => {
    it('should return 200 with skill data when skill exists', async () => {
      if (shouldSkipTests) {
        return;
      }

      const skill = await prisma.skills.create({
        data: { name: 'TypeScript' },
      });

      const response = await request(app).get(`/api/v1/skills/${skill.id}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(skill.id);
      expect(response.body.name).toBe(skill.name);
    });

    it('should return 404 when skill does not exist', async () => {
      const nonExistentId = 'clxmg9v4o000008l4f3h3g3q3';

      const response = await request(app).get(`/api/v1/skills/${nonExistentId}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Skill not found');
    });
  });

  describe('POST /api/v1/skills', () => {
    it('should create a new skill and return 201', async () => {
      if (shouldSkipTests) {
        return;
      }

      const newSkill = {
        name: 'TypeScript',
      };

      const response = await request(app).post('/api/v1/skills').send(newSkill);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(newSkill.name);

      // Verifica se o dado foi realmente salvo no banco
      const dbSkill = await prisma.skills.findUnique({
        where: { id: response.body.id },
      });
      expect(dbSkill).not.toBeNull();
      expect(dbSkill?.name).toBe(newSkill.name);
    });

    it('should return 400 on invalid data (Zod validation) - missing name', async () => {
      const invalidSkill = {};

      const response = await request(app).post('/api/v1/skills').send(invalidSkill);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Validation failed');
      expect(response.body).toHaveProperty('errors');
      expect(Array.isArray(response.body.errors)).toBe(true);
    });

    it('should return 400 on invalid data (Zod validation) - name too short', async () => {
      const invalidSkill = {
        name: 'T', // Muito curto (mínimo 2 caracteres)
      };

      const response = await request(app).post('/api/v1/skills').send(invalidSkill);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Validation failed');
    });

    it('should return 400 on invalid data (Zod validation) - name too long', async () => {
      const invalidSkill = {
        name: 'A'.repeat(256), // Muito longo (máximo 255 caracteres)
      };

      const response = await request(app).post('/api/v1/skills').send(invalidSkill);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Validation failed');
    });

    it('should return 409 when skill with same name already exists', async () => {
      if (shouldSkipTests) {
        return;
      }

      // Cria uma skill primeiro
      await prisma.skills.create({
        data: { name: 'TypeScript' },
      });

      // Tenta criar outra com o mesmo nome
      const duplicateSkill = {
        name: 'TypeScript',
      };

      const response = await request(app).post('/api/v1/skills').send(duplicateSkill);

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('status', 'error');
    });

    it('should trim whitespace from name', async () => {
      if (shouldSkipTests) {
        return;
      }

      const newSkill = {
        name: '  TypeScript  ',
      };

      const response = await request(app).post('/api/v1/skills').send(newSkill);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe('TypeScript');
    });
  });

  describe('PUT /api/v1/skills/:id', () => {
    it('should return 200 and update skill when skill exists', async () => {
      if (shouldSkipTests) {
        return;
      }

      const skill = await prisma.skills.create({
        data: { name: 'TypeScript' },
      });

      const updateData = {
        name: 'JavaScript',
      };

      const response = await request(app).put(`/api/v1/skills/${skill.id}`).send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(skill.id);
      expect(response.body.name).toBe(updateData.name);

      // Verifica se foi atualizado no banco
      const dbSkill = await prisma.skills.findUnique({
        where: { id: skill.id },
      });
      expect(dbSkill?.name).toBe(updateData.name);
    });

    it('should return 404 when skill does not exist', async () => {
      const nonExistentId = 'clxmg9v4o000008l4f3h3g3q3';
      const updateData = {
        name: 'New Name',
      };

      const response = await request(app).put(`/api/v1/skills/${nonExistentId}`).send(updateData);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Skill not found');
    });

    it('should return 400 on invalid update data (Zod validation)', async () => {
      if (shouldSkipTests) {
        return;
      }

      const skill = await prisma.skills.create({
        data: { name: 'TypeScript' },
      });

      const invalidUpdateData = {
        name: 'T', // Muito curto
      };

      const response = await request(app).put(`/api/v1/skills/${skill.id}`).send(invalidUpdateData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Validation failed');
    });

    it('should return 409 when updating to a name that already exists', async () => {
      if (shouldSkipTests) {
        return;
      }

      // Cria uma skill com o nome 'TypeScript'
      await prisma.skills.create({
        data: { name: 'TypeScript' },
      });
      const skill2 = await prisma.skills.create({
        data: { name: 'JavaScript' },
      });

      // Tenta atualizar skill2 para o nome 'TypeScript' (que já existe)
      const updateData = {
        name: 'TypeScript',
      };

      const response = await request(app).put(`/api/v1/skills/${skill2.id}`).send(updateData);

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('status', 'error');
    });

    it('should allow partial updates (only name field)', async () => {
      if (shouldSkipTests) {
        return;
      }

      const skill = await prisma.skills.create({
        data: { name: 'TypeScript' },
      });

      const updateData = {
        name: 'JavaScript',
      };

      const response = await request(app).put(`/api/v1/skills/${skill.id}`).send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updateData.name);
    });
  });

  describe('DELETE /api/v1/skills/:id', () => {
    it('should return 204 and delete skill when skill exists', async () => {
      if (shouldSkipTests) {
        return;
      }

      const skill = await prisma.skills.create({
        data: { name: 'TypeScript' },
      });

      const response = await request(app).delete(`/api/v1/skills/${skill.id}`);

      expect(response.status).toBe(204);

      // Verifica se foi deletado do banco
      const dbSkill = await prisma.skills.findUnique({
        where: { id: skill.id },
      });
      expect(dbSkill).toBeNull();
    });

    it('should return 404 when skill does not exist', async () => {
      const nonExistentId = 'clxmg9v4o000008l4f3h3g3q3';

      const response = await request(app).delete(`/api/v1/skills/${nonExistentId}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Skill not found');
    });
  });
});

