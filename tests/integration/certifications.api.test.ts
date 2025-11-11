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

describe('Certifications API (Integration)', () => {
  let testPersonId: string;

  beforeEach(async () => {
    if (shouldSkipTests) {
      return;
    }
    await prisma.certifications.deleteMany();
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
    await prisma.certifications.deleteMany();
    await prisma.people.deleteMany();
    await prisma.$disconnect();
  });

  describe('POST /api/v1/certifications', () => {
    it('should create a new certification and return 201', async () => {
      if (shouldSkipTests) {
        return;
      }
      const newCertification = {
        peopleId: testPersonId,
        name: 'AWS Certified Solutions Architect',
        issuer: 'AWS',
        issue_date: '2023-01-15T00:00:00.000Z',
        url: 'https://aws.amazon.com/certification/',
      };

      const response = await request(app).post('/api/v1/certifications').send(newCertification);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(newCertification.name);
      expect(response.body.issuer).toBe(newCertification.issuer);
      expect(response.body.peopleId).toBe(testPersonId);

      const dbCertification = await prisma.certifications.findUnique({
        where: { id: response.body.id },
      });
      expect(dbCertification).not.toBeNull();
      expect(dbCertification?.name).toBe(newCertification.name);
    });

    it('should return 400 on invalid data (Zod validation)', async () => {
      const invalidCertification = {
        name: 'AWS Certified',
        // Faltando peopleId, issuer, issue_date
      };

      const response = await request(app).post('/api/v1/certifications').send(invalidCertification);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Validation failed');
    });

    it('should return 400 on invalid URL format', async () => {
      const invalidCertification = {
        peopleId: testPersonId,
        name: 'AWS Certified',
        issuer: 'AWS',
        issue_date: '2023-01-15T00:00:00.000Z',
        url: 'invalid-url',
      };

      const response = await request(app).post('/api/v1/certifications').send(invalidCertification);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'error');
    });

    it('should create a certification without optional url field', async () => {
      const newCertification = {
        peopleId: testPersonId,
        name: 'Scrum Master Certification',
        issuer: 'Scrum Alliance',
        issue_date: '2023-01-15T00:00:00.000Z',
      };

      const response = await request(app).post('/api/v1/certifications').send(newCertification);

      expect(response.status).toBe(201);
      expect(response.body.url).toBeNull();
    });

    it('should return 404 when peopleId does not exist', async () => {
      const nonExistentPeopleId = 'clxmg9v4o000008l4f3h3g3q3';
      const newCertification = {
        peopleId: nonExistentPeopleId,
        name: 'AWS Certified',
        issuer: 'AWS',
        issue_date: '2023-01-15T00:00:00.000Z',
      };

      const response = await request(app).post('/api/v1/certifications').send(newCertification);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Person not found');
    });
  });

  describe('GET /api/v1/certifications/:id', () => {
    it('should return 200 with certification data when certification exists', async () => {
      const certification = await prisma.certifications.create({
        data: {
          name: 'AWS Certified Solutions Architect',
          issuer: 'AWS',
          issue_date: new Date('2023-01-15'),
          peopleId: testPersonId,
        },
      });

      const response = await request(app).get(`/api/v1/certifications/${certification.id}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(certification.id);
      expect(response.body.name).toBe(certification.name);
    });

    it('should return 404 when certification does not exist', async () => {
      const nonExistentId = 'clxmg9v4o000008l4f3h3g3q3';

      const response = await request(app).get(`/api/v1/certifications/${nonExistentId}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Certification not found');
    });
  });

  describe('PUT /api/v1/certifications/:id', () => {
    it('should return 200 and update certification when certification exists', async () => {
      const certification = await prisma.certifications.create({
        data: {
          name: 'AWS Certified Solutions Architect',
          issuer: 'AWS',
          issue_date: new Date('2023-01-15'),
          peopleId: testPersonId,
        },
      });

      const updateData = {
        name: 'AWS Certified Solutions Architect - Professional',
        url: 'https://aws.amazon.com/certification/',
      };

      const response = await request(app).put(`/api/v1/certifications/${certification.id}`).send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updateData.name);
      expect(response.body.url).toBe(updateData.url);

      const dbCertification = await prisma.certifications.findUnique({
        where: { id: certification.id },
      });
      expect(dbCertification?.name).toBe(updateData.name);
    });

    it('should return 404 when certification does not exist', async () => {
      const nonExistentId = 'clxmg9v4o000008l4f3h3g3q3';
      const updateData = {
        name: 'Updated Certification',
      };

      const response = await request(app).put(`/api/v1/certifications/${nonExistentId}`).send(updateData);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('status', 'error');
    });
  });

  describe('DELETE /api/v1/certifications/:id', () => {
    it('should return 204 and delete certification when certification exists', async () => {
      const certification = await prisma.certifications.create({
        data: {
          name: 'AWS Certified Solutions Architect',
          issuer: 'AWS',
          issue_date: new Date('2023-01-15'),
          peopleId: testPersonId,
        },
      });

      const response = await request(app).delete(`/api/v1/certifications/${certification.id}`);

      expect(response.status).toBe(204);

      const dbCertification = await prisma.certifications.findUnique({
        where: { id: certification.id },
      });
      expect(dbCertification).toBeNull();
    });

    it('should return 404 when certification does not exist', async () => {
      const nonExistentId = 'clxmg9v4o000008l4f3h3g3q3';

      const response = await request(app).delete(`/api/v1/certifications/${nonExistentId}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('status', 'error');
    });
  });
});

