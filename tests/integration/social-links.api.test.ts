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

describe('SocialLinks API (Integration)', () => {
  let testPersonId: string;

  beforeEach(async () => {
    if (shouldSkipTests) {
      return;
    }
    await prisma.socialLinks.deleteMany();
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
    await prisma.socialLinks.deleteMany();
    await prisma.people.deleteMany();
    await prisma.$disconnect();
  });

  describe('POST /api/v1/social-links', () => {
    it('should create a new social link and return 201', async () => {
      if (shouldSkipTests) {
        return;
      }
      const newSocialLink = {
        peopleId: testPersonId,
        platform: 'linkedin',
        url: 'https://linkedin.com/in/joaosilva',
      };

      const response = await request(app).post('/api/v1/social-links').send(newSocialLink);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.platform).toBe(newSocialLink.platform);
      expect(response.body.url).toBe(newSocialLink.url);
      expect(response.body.peopleId).toBe(testPersonId);

      const dbSocialLink = await prisma.socialLinks.findUnique({
        where: { id: response.body.id },
      });
      expect(dbSocialLink).not.toBeNull();
      expect(dbSocialLink?.platform).toBe(newSocialLink.platform);
    });

    it('should return 400 on invalid data (Zod validation)', async () => {
      const invalidSocialLink = {
        platform: 'linkedin',
        // Faltando peopleId, url
      };

      const response = await request(app).post('/api/v1/social-links').send(invalidSocialLink);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Validation failed');
    });

    it('should return 400 on invalid URL format', async () => {
      const invalidSocialLink = {
        peopleId: testPersonId,
        platform: 'linkedin',
        url: 'invalid-url',
      };

      const response = await request(app).post('/api/v1/social-links').send(invalidSocialLink);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'error');
    });

    it('should return 404 when peopleId does not exist', async () => {
      const nonExistentPeopleId = 'clxmg9v4o000008l4f3h3g3q3';
      const newSocialLink = {
        peopleId: nonExistentPeopleId,
        platform: 'linkedin',
        url: 'https://linkedin.com/in/test',
      };

      const response = await request(app).post('/api/v1/social-links').send(newSocialLink);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Person not found');
    });
  });

  describe('GET /api/v1/social-links/:id', () => {
    it('should return 200 with social link data when social link exists', async () => {
      const socialLink = await prisma.socialLinks.create({
        data: {
          platform: 'linkedin',
          url: 'https://linkedin.com/in/joaosilva',
          peopleId: testPersonId,
        },
      });

      const response = await request(app).get(`/api/v1/social-links/${socialLink.id}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(socialLink.id);
      expect(response.body.platform).toBe(socialLink.platform);
    });

    it('should return 404 when social link does not exist', async () => {
      const nonExistentId = 'clxmg9v4o000008l4f3h3g3q3';

      const response = await request(app).get(`/api/v1/social-links/${nonExistentId}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Social link not found');
    });
  });

  describe('PUT /api/v1/social-links/:id', () => {
    it('should return 200 and update social link when social link exists', async () => {
      const socialLink = await prisma.socialLinks.create({
        data: {
          platform: 'linkedin',
          url: 'https://linkedin.com/in/joaosilva',
          peopleId: testPersonId,
        },
      });

      const updateData = {
        url: 'https://linkedin.com/in/joaosilva-updated',
      };

      const response = await request(app).put(`/api/v1/social-links/${socialLink.id}`).send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.url).toBe(updateData.url);

      const dbSocialLink = await prisma.socialLinks.findUnique({
        where: { id: socialLink.id },
      });
      expect(dbSocialLink?.url).toBe(updateData.url);
    });

    it('should return 404 when social link does not exist', async () => {
      const nonExistentId = 'clxmg9v4o000008l4f3h3g3q3';
      const updateData = {
        url: 'https://linkedin.com/in/updated',
      };

      const response = await request(app).put(`/api/v1/social-links/${nonExistentId}`).send(updateData);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('status', 'error');
    });
  });

  describe('DELETE /api/v1/social-links/:id', () => {
    it('should return 204 and delete social link when social link exists', async () => {
      const socialLink = await prisma.socialLinks.create({
        data: {
          platform: 'linkedin',
          url: 'https://linkedin.com/in/joaosilva',
          peopleId: testPersonId,
        },
      });

      const response = await request(app).delete(`/api/v1/social-links/${socialLink.id}`);

      expect(response.status).toBe(204);

      const dbSocialLink = await prisma.socialLinks.findUnique({
        where: { id: socialLink.id },
      });
      expect(dbSocialLink).toBeNull();
    });

    it('should return 404 when social link does not exist', async () => {
      const nonExistentId = 'clxmg9v4o000008l4f3h3g3q3';

      const response = await request(app).delete(`/api/v1/social-links/${nonExistentId}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('status', 'error');
    });
  });
});

