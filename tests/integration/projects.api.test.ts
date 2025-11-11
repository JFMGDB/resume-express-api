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

describe('Projects API (Integration)', () => {
  let testPersonId: string;

  beforeEach(async () => {
    if (shouldSkipTests) {
      return;
    }
    await prisma.projects.deleteMany();
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
    await prisma.projects.deleteMany();
    await prisma.people.deleteMany();
    await prisma.$disconnect();
  });

  describe('POST /api/v1/projects', () => {
    it('should create a new project and return 201', async () => {
      if (shouldSkipTests) {
        return;
      }
      const newProject = {
        peopleId: testPersonId,
        name: 'Portfolio Website',
        description: 'Site de portfólio pessoal desenvolvido com React e TypeScript',
        url: 'https://joaosilva.dev',
        repository_url: 'https://github.com/joaosilva/portfolio',
        start_date: '2023-01-01T00:00:00.000Z',
        end_date: '2023-06-30T23:59:59.999Z',
      };

      const response = await request(app).post('/api/v1/projects').send(newProject);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(newProject.name);
      expect(response.body.description).toBe(newProject.description);
      expect(response.body.peopleId).toBe(testPersonId);

      const dbProject = await prisma.projects.findUnique({
        where: { id: response.body.id },
      });
      expect(dbProject).not.toBeNull();
      expect(dbProject?.name).toBe(newProject.name);
    });

    it('should return 400 on invalid data (Zod validation)', async () => {
      const invalidProject = {
        name: 'Project',
        // Faltando peopleId, description, start_date
      };

      const response = await request(app).post('/api/v1/projects').send(invalidProject);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Validation failed');
    });

    it('should return 400 on invalid URL format', async () => {
      const invalidProject = {
        peopleId: testPersonId,
        name: 'Project',
        description: 'Project description with at least 10 characters',
        url: 'invalid-url',
        start_date: '2023-01-01T00:00:00.000Z',
      };

      const response = await request(app).post('/api/v1/projects').send(invalidProject);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'error');
    });

    it('should create a project without optional fields', async () => {
      const newProject = {
        peopleId: testPersonId,
        name: 'Open Source Project',
        description: 'Projeto open source desenvolvido para a comunidade',
        start_date: '2023-01-01T00:00:00.000Z',
      };

      const response = await request(app).post('/api/v1/projects').send(newProject);

      expect(response.status).toBe(201);
      expect(response.body.url).toBeNull();
      expect(response.body.repository_url).toBeNull();
      expect(response.body.end_date).toBeNull();
    });

    it('should return 404 when peopleId does not exist', async () => {
      const nonExistentPeopleId = 'clxmg9v4o000008l4f3h3g3q3';
      const newProject = {
        peopleId: nonExistentPeopleId,
        name: 'Project',
        description: 'Project description with at least 10 characters',
        start_date: '2023-01-01T00:00:00.000Z',
      };

      const response = await request(app).post('/api/v1/projects').send(newProject);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Person not found');
    });
  });

  describe('GET /api/v1/projects/:id', () => {
    it('should return 200 with project data when project exists', async () => {
      const project = await prisma.projects.create({
        data: {
          name: 'Portfolio Website',
          description: 'Site de portfólio pessoal',
          start_date: new Date('2023-01-01'),
          peopleId: testPersonId,
        },
      });

      const response = await request(app).get(`/api/v1/projects/${project.id}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(project.id);
      expect(response.body.name).toBe(project.name);
    });

    it('should return 404 when project does not exist', async () => {
      const nonExistentId = 'clxmg9v4o000008l4f3h3g3q3';

      const response = await request(app).get(`/api/v1/projects/${nonExistentId}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Project not found');
    });
  });

  describe('PUT /api/v1/projects/:id', () => {
    it('should return 200 and update project when project exists', async () => {
      const project = await prisma.projects.create({
        data: {
          name: 'Portfolio Website',
          description: 'Site de portfólio pessoal',
          start_date: new Date('2023-01-01'),
          peopleId: testPersonId,
        },
      });

      const updateData = {
        name: 'Updated Portfolio Website',
        url: 'https://updated-portfolio.dev',
      };

      const response = await request(app).put(`/api/v1/projects/${project.id}`).send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updateData.name);
      expect(response.body.url).toBe(updateData.url);

      const dbProject = await prisma.projects.findUnique({
        where: { id: project.id },
      });
      expect(dbProject?.name).toBe(updateData.name);
    });

    it('should return 404 when project does not exist', async () => {
      const nonExistentId = 'clxmg9v4o000008l4f3h3g3q3';
      const updateData = {
        name: 'Updated Project',
      };

      const response = await request(app).put(`/api/v1/projects/${nonExistentId}`).send(updateData);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('status', 'error');
    });
  });

  describe('DELETE /api/v1/projects/:id', () => {
    it('should return 204 and delete project when project exists', async () => {
      const project = await prisma.projects.create({
        data: {
          name: 'Portfolio Website',
          description: 'Site de portfólio pessoal',
          start_date: new Date('2023-01-01'),
          peopleId: testPersonId,
        },
      });

      const response = await request(app).delete(`/api/v1/projects/${project.id}`);

      expect(response.status).toBe(204);

      const dbProject = await prisma.projects.findUnique({
        where: { id: project.id },
      });
      expect(dbProject).toBeNull();
    });

    it('should return 404 when project does not exist', async () => {
      const nonExistentId = 'clxmg9v4o000008l4f3h3g3q3';

      const response = await request(app).delete(`/api/v1/projects/${nonExistentId}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('status', 'error');
    });
  });
});

