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

describe('Contacts API (Integration)', () => {
  let testPersonId: string;

  beforeEach(async () => {
    if (shouldSkipTests) {
      return;
    }
    await prisma.contacts.deleteMany();
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
    await prisma.contacts.deleteMany();
    await prisma.people.deleteMany();
    await prisma.$disconnect();
  });

  describe('POST /api/v1/contacts', () => {
    it('should create a new contact and return 201', async () => {
      if (shouldSkipTests) {
        return;
      }
      const newContact = {
        peopleId: testPersonId,
        type: 'email',
        value: 'joao.silva@email.com',
      };

      const response = await request(app).post('/api/v1/contacts').send(newContact);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.type).toBe(newContact.type);
      expect(response.body.value).toBe(newContact.value);
      expect(response.body.peopleId).toBe(testPersonId);

      const dbContact = await prisma.contacts.findUnique({
        where: { id: response.body.id },
      });
      expect(dbContact).not.toBeNull();
      expect(dbContact?.type).toBe(newContact.type);
    });

    it('should return 400 on invalid data (Zod validation)', async () => {
      const invalidContact = {
        type: 'email',
        // Faltando peopleId, value
      };

      const response = await request(app).post('/api/v1/contacts').send(invalidContact);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Validation failed');
    });

    it('should return 404 when peopleId does not exist', async () => {
      const nonExistentPeopleId = 'clxmg9v4o000008l4f3h3g3q3';
      const newContact = {
        peopleId: nonExistentPeopleId,
        type: 'email',
        value: 'test@email.com',
      };

      const response = await request(app).post('/api/v1/contacts').send(newContact);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Person not found');
    });
  });

  describe('GET /api/v1/contacts/:id', () => {
    it('should return 200 with contact data when contact exists', async () => {
      const contact = await prisma.contacts.create({
        data: {
          type: 'email',
          value: 'joao.silva@email.com',
          peopleId: testPersonId,
        },
      });

      const response = await request(app).get(`/api/v1/contacts/${contact.id}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(contact.id);
      expect(response.body.type).toBe(contact.type);
    });

    it('should return 404 when contact does not exist', async () => {
      const nonExistentId = 'clxmg9v4o000008l4f3h3g3q3';

      const response = await request(app).get(`/api/v1/contacts/${nonExistentId}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Contact not found');
    });
  });

  describe('PUT /api/v1/contacts/:id', () => {
    it('should return 200 and update contact when contact exists', async () => {
      const contact = await prisma.contacts.create({
        data: {
          type: 'email',
          value: 'joao.silva@email.com',
          peopleId: testPersonId,
        },
      });

      const updateData = {
        value: 'joao.silva.updated@email.com',
      };

      const response = await request(app).put(`/api/v1/contacts/${contact.id}`).send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.value).toBe(updateData.value);

      const dbContact = await prisma.contacts.findUnique({
        where: { id: contact.id },
      });
      expect(dbContact?.value).toBe(updateData.value);
    });

    it('should return 404 when contact does not exist', async () => {
      const nonExistentId = 'clxmg9v4o000008l4f3h3g3q3';
      const updateData = {
        value: 'updated@email.com',
      };

      const response = await request(app).put(`/api/v1/contacts/${nonExistentId}`).send(updateData);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('status', 'error');
    });
  });

  describe('DELETE /api/v1/contacts/:id', () => {
    it('should return 204 and delete contact when contact exists', async () => {
      const contact = await prisma.contacts.create({
        data: {
          type: 'email',
          value: 'joao.silva@email.com',
          peopleId: testPersonId,
        },
      });

      const response = await request(app).delete(`/api/v1/contacts/${contact.id}`);

      expect(response.status).toBe(204);

      const dbContact = await prisma.contacts.findUnique({
        where: { id: contact.id },
      });
      expect(dbContact).toBeNull();
    });

    it('should return 404 when contact does not exist', async () => {
      const nonExistentId = 'clxmg9v4o000008l4f3h3g3q3';

      const response = await request(app).delete(`/api/v1/contacts/${nonExistentId}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('status', 'error');
    });
  });
});

