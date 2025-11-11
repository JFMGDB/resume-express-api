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

describe('People Associate/Disassociate Skill API (Integration)', () => {
  let testPersonId: string;
  let testSkillId: string;
  let testSkill2Id: string;

  // Limpa o banco e cria dados de teste antes de cada teste
  beforeEach(async () => {
    if (shouldSkipTests) {
      return;
    }
    await prisma.skills.deleteMany();
    await prisma.people.deleteMany();

    // Cria uma pessoa de teste
    const person = await prisma.people.create({
      data: {
        full_name: 'João Silva',
        headline: 'Desenvolvedor Full-Stack Sênior',
        summary: 'Engenheiro de software com 8 anos de experiência na construção de aplicações web escaláveis.',
        location: 'São Paulo, Brasil',
      },
    });
    testPersonId = person.id;

    // Cria skills de teste
    const skill1 = await prisma.skills.create({
      data: { name: 'TypeScript' },
    });
    testSkillId = skill1.id;

    const skill2 = await prisma.skills.create({
      data: { name: 'React' },
    });
    testSkill2Id = skill2.id;
  });

  afterAll(async () => {
    if (shouldSkipTests) {
      return;
    }
    await prisma.skills.deleteMany();
    await prisma.people.deleteMany();
    await prisma.$disconnect();
  });

  describe('POST /api/v1/people/associate-skill', () => {
    it('should associate a skill to a person and return 200', async () => {
      if (shouldSkipTests) {
        return;
      }

      const associateData = {
        peopleId: testPersonId,
        skillId: testSkillId,
      };

      const response = await request(app).post('/api/v1/people/associate-skill').send(associateData);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(testPersonId);

      // Verifica se a skill foi associada no banco
      const person = await prisma.people.findUnique({
        where: { id: testPersonId },
        include: { skills: true },
      });
      expect(person?.skills).toHaveLength(1);
      expect(person?.skills[0].id).toBe(testSkillId);
    });

    it('should associate multiple skills to a person', async () => {
      if (shouldSkipTests) {
        return;
      }

      // Associa primeira skill
      await request(app)
        .post('/api/v1/people/associate-skill')
        .send({ peopleId: testPersonId, skillId: testSkillId });

      // Associa segunda skill
      const response = await request(app)
        .post('/api/v1/people/associate-skill')
        .send({ peopleId: testPersonId, skillId: testSkill2Id });

      expect(response.status).toBe(200);

      // Verifica se ambas as skills foram associadas
      const person = await prisma.people.findUnique({
        where: { id: testPersonId },
        include: { skills: true },
      });
      expect(person?.skills).toHaveLength(2);
      expect(person?.skills.some((s: any) => s.id === testSkillId)).toBe(true);
      expect(person?.skills.some((s: any) => s.id === testSkill2Id)).toBe(true);
    });

    it('should return 400 on invalid data (Zod validation) - missing peopleId', async () => {
      const invalidData = {
        skillId: testSkillId,
      };

      const response = await request(app).post('/api/v1/people/associate-skill').send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Validation failed');
    });

    it('should return 400 on invalid data (Zod validation) - missing skillId', async () => {
      const invalidData = {
        peopleId: testPersonId,
      };

      const response = await request(app).post('/api/v1/people/associate-skill').send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Validation failed');
    });

    it('should return 404 when peopleId does not exist', async () => {
      const nonExistentPeopleId = 'clxmg9v4o000008l4f3h3g3q3';
      const associateData = {
        peopleId: nonExistentPeopleId,
        skillId: testSkillId,
      };

      const response = await request(app).post('/api/v1/people/associate-skill').send(associateData);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Person not found');
    });

    it('should return 404 when skillId does not exist', async () => {
      const nonExistentSkillId = 'clxmg9v4o000008l4f3h3g3q3';
      const associateData = {
        peopleId: testPersonId,
        skillId: nonExistentSkillId,
      };

      const response = await request(app).post('/api/v1/people/associate-skill').send(associateData);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Skill not found');
    });

    it('should not duplicate skills when associating the same skill twice', async () => {
      if (shouldSkipTests) {
        return;
      }

      // Associa a skill pela primeira vez
      await request(app)
        .post('/api/v1/people/associate-skill')
        .send({ peopleId: testPersonId, skillId: testSkillId });

      // Tenta associar a mesma skill novamente
      const response = await request(app)
        .post('/api/v1/people/associate-skill')
        .send({ peopleId: testPersonId, skillId: testSkillId });

      // Deve retornar sucesso (Prisma não duplica relações N:M)
      expect(response.status).toBe(200);

      // Verifica que a skill aparece apenas uma vez
      const person = await prisma.people.findUnique({
        where: { id: testPersonId },
        include: { skills: true },
      });
      expect(person?.skills).toHaveLength(1);
    });
  });

  describe('POST /api/v1/people/disassociate-skill', () => {
    it('should disassociate a skill from a person and return 200', async () => {
      if (shouldSkipTests) {
        return;
      }

      // Primeiro associa a skill
      await prisma.people.update({
        where: { id: testPersonId },
        data: {
          skills: {
            connect: { id: testSkillId },
          },
        },
      });

      // Desassocia a skill
      const disassociateData = {
        peopleId: testPersonId,
        skillId: testSkillId,
      };

      const response = await request(app)
        .post('/api/v1/people/disassociate-skill')
        .send(disassociateData);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(testPersonId);

      // Verifica se a skill foi desassociada no banco
      const person = await prisma.people.findUnique({
        where: { id: testPersonId },
        include: { skills: true },
      });
      expect(person?.skills).toHaveLength(0);
    });

    it('should disassociate one skill while keeping others', async () => {
      if (shouldSkipTests) {
        return;
      }

      // Associa duas skills
      await prisma.people.update({
        where: { id: testPersonId },
        data: {
          skills: {
            connect: [{ id: testSkillId }, { id: testSkill2Id }],
          },
        },
      });

      // Desassocia apenas uma skill
      const response = await request(app)
        .post('/api/v1/people/disassociate-skill')
        .send({ peopleId: testPersonId, skillId: testSkillId });

      expect(response.status).toBe(200);

      // Verifica se apenas uma skill permanece
      const person = await prisma.people.findUnique({
        where: { id: testPersonId },
        include: { skills: true },
      });
      expect(person?.skills).toHaveLength(1);
      expect(person?.skills[0].id).toBe(testSkill2Id);
    });

    it('should return 400 on invalid data (Zod validation) - missing peopleId', async () => {
      const invalidData = {
        skillId: testSkillId,
      };

      const response = await request(app)
        .post('/api/v1/people/disassociate-skill')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Validation failed');
    });

    it('should return 400 on invalid data (Zod validation) - missing skillId', async () => {
      const invalidData = {
        peopleId: testPersonId,
      };

      const response = await request(app)
        .post('/api/v1/people/disassociate-skill')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Validation failed');
    });

    it('should return 404 when peopleId does not exist', async () => {
      const nonExistentPeopleId = 'clxmg9v4o000008l4f3h3g3q3';
      const disassociateData = {
        peopleId: nonExistentPeopleId,
        skillId: testSkillId,
      };

      const response = await request(app)
        .post('/api/v1/people/disassociate-skill')
        .send(disassociateData);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Person not found');
    });

    it('should return 404 when skillId does not exist', async () => {
      const nonExistentSkillId = 'clxmg9v4o000008l4f3h3g3q3';
      const disassociateData = {
        peopleId: testPersonId,
        skillId: nonExistentSkillId,
      };

      const response = await request(app)
        .post('/api/v1/people/disassociate-skill')
        .send(disassociateData);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Skill not found');
    });

    it('should handle disassociating a skill that is not associated (no error)', async () => {
      if (shouldSkipTests) {
        return;
      }

      // Tenta desassociar uma skill que não está associada
      const disassociateData = {
        peopleId: testPersonId,
        skillId: testSkillId,
      };

      const response = await request(app)
        .post('/api/v1/people/disassociate-skill')
        .send(disassociateData);

      // Deve retornar sucesso (Prisma não lança erro ao desconectar algo que não está conectado)
      expect(response.status).toBe(200);
    });
  });
});

