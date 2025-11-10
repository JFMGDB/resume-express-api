import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { People } from '@prisma/client';
import { IPeopleRepository } from '../../src/interfaces/IPeopleRepository';
import { PeopleService, NotFoundError } from '../../src/services/people.service';

describe('PeopleService (Unit)', () => {
  let peopleService: PeopleService;
  let mockPeopleRepo: DeepMockProxy<IPeopleRepository>;

  beforeEach(() => {
    // Configura o mock profundo para a interface do repositório
    mockPeopleRepo = mockDeep<IPeopleRepository>();

    // Injeta o repositório mockado no serviço
    peopleService = new PeopleService(mockPeopleRepo);
  });

  describe('createPerson', () => {
    it('should create a new person with valid data', async () => {
      const personData = {
        full_name: 'João Silva',
        headline: 'Desenvolvedor Full-Stack',
        summary: 'Engenheiro de software com experiência em desenvolvimento web.',
        location: 'São Paulo, Brasil',
      };

      const expectedPerson: People = {
        id: 'cuid_123',
        full_name: personData.full_name,
        headline: personData.headline,
        summary: personData.summary,
        location: personData.location,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Configura o mock: quando 'create' for chamado, retorne 'expectedPerson'
      mockPeopleRepo.create.mockResolvedValue(expectedPerson);

      // Executa a função do serviço
      const result = await peopleService.createPerson(personData);

      // Verifica se o resultado está correto
      expect(result).toEqual(expectedPerson);
      // Verifica se o repositório foi chamado com os dados corretos
      expect(mockPeopleRepo.create).toHaveBeenCalledWith({
        full_name: personData.full_name,
        headline: personData.headline,
        summary: personData.summary,
        location: personData.location,
      });
      expect(mockPeopleRepo.create).toHaveBeenCalledTimes(1);
    });

    it('should create a person without location (optional field)', async () => {
      const personData = {
        full_name: 'Mariana Costa',
        headline: 'Product Designer',
        summary: 'Designer de produto focada em criar experiências de usuário.',
      };

      const expectedPerson: People = {
        id: 'cuid_456',
        full_name: personData.full_name,
        headline: personData.headline,
        summary: personData.summary,
        location: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPeopleRepo.create.mockResolvedValue(expectedPerson);

      const result = await peopleService.createPerson(personData);

      expect(result).toEqual(expectedPerson);
      expect(mockPeopleRepo.create).toHaveBeenCalledWith({
        full_name: personData.full_name,
        headline: personData.headline,
        summary: personData.summary,
        location: undefined,
      });
    });
  });

  describe('getPersonById', () => {
    it('should return a person when found', async () => {
      const personId = 'cuid_123';
      const expectedPerson: People = {
        id: personId,
        full_name: 'João Silva',
        headline: 'Desenvolvedor Full-Stack',
        summary: 'Engenheiro de software com experiência em desenvolvimento web.',
        location: 'São Paulo, Brasil',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPeopleRepo.findById.mockResolvedValue(expectedPerson);

      const result = await peopleService.getPersonById(personId);

      expect(result).toEqual(expectedPerson);
      expect(mockPeopleRepo.findById).toHaveBeenCalledWith(personId);
      expect(mockPeopleRepo.findById).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundError if personId does not exist', async () => {
      const nonExistingId = 'non_existing_id';

      // Configura o mock: quando 'findById' for chamado, retorne null
      mockPeopleRepo.findById.mockResolvedValue(null);

      // Verifica se o serviço lança o erro esperado
      await expect(peopleService.getPersonById(nonExistingId)).rejects.toThrow(NotFoundError);
      await expect(peopleService.getPersonById(nonExistingId)).rejects.toThrow('Person not found');

      expect(mockPeopleRepo.findById).toHaveBeenCalledWith(nonExistingId);
    });
  });

  describe('getAllPeople', () => {
    it('should return all people', async () => {
      const expectedPeople: People[] = [
        {
          id: 'cuid_123',
          full_name: 'João Silva',
          headline: 'Desenvolvedor Full-Stack',
          summary: 'Engenheiro de software com experiência em desenvolvimento web.',
          location: 'São Paulo, Brasil',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'cuid_456',
          full_name: 'Mariana Costa',
          headline: 'Product Designer',
          summary: 'Designer de produto focada em criar experiências de usuário.',
          location: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPeopleRepo.findAll.mockResolvedValue(expectedPeople);

      const result = await peopleService.getAllPeople();

      expect(result).toEqual(expectedPeople);
      expect(mockPeopleRepo.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no people exist', async () => {
      mockPeopleRepo.findAll.mockResolvedValue([]);

      const result = await peopleService.getAllPeople();

      expect(result).toEqual([]);
      expect(mockPeopleRepo.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('updatePerson', () => {
    it('should update a person when person exists', async () => {
      const personId = 'cuid_123';
      const existingPerson: People = {
        id: personId,
        full_name: 'João Silva',
        headline: 'Desenvolvedor Full-Stack',
        summary: 'Engenheiro de software com experiência em desenvolvimento web.',
        location: 'São Paulo, Brasil',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updateData = {
        headline: 'Desenvolvedor Full-Stack Sênior',
        location: 'Rio de Janeiro, Brasil',
      };

      const updatedPerson: People = {
        ...existingPerson,
        headline: updateData.headline,
        location: updateData.location,
        updatedAt: new Date(),
      };

      // Mock para getPersonById (chamado internamente)
      mockPeopleRepo.findById.mockResolvedValue(existingPerson);
      // Mock para update
      mockPeopleRepo.update.mockResolvedValue(updatedPerson);

      const result = await peopleService.updatePerson(personId, updateData);

      expect(result).toEqual(updatedPerson);
      expect(mockPeopleRepo.findById).toHaveBeenCalledWith(personId);
      expect(mockPeopleRepo.update).toHaveBeenCalledWith(personId, {
        headline: updateData.headline,
        location: updateData.location,
      });
    });

    it('should throw NotFoundError if person does not exist', async () => {
      const nonExistingId = 'non_existing_id';
      const updateData = {
        headline: 'Novo Headline',
      };

      mockPeopleRepo.findById.mockResolvedValue(null);

      await expect(peopleService.updatePerson(nonExistingId, updateData)).rejects.toThrow(NotFoundError);
      await expect(peopleService.updatePerson(nonExistingId, updateData)).rejects.toThrow('Person not found');

      expect(mockPeopleRepo.findById).toHaveBeenCalledWith(nonExistingId);
      expect(mockPeopleRepo.update).not.toHaveBeenCalled();
    });

    it('should allow partial updates (only some fields)', async () => {
      const personId = 'cuid_123';
      const existingPerson: People = {
        id: personId,
        full_name: 'João Silva',
        headline: 'Desenvolvedor Full-Stack',
        summary: 'Engenheiro de software com experiência em desenvolvimento web.',
        location: 'São Paulo, Brasil',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updateData = {
        headline: 'Desenvolvedor Full-Stack Sênior',
      };

      const updatedPerson: People = {
        ...existingPerson,
        headline: updateData.headline,
        updatedAt: new Date(),
      };

      mockPeopleRepo.findById.mockResolvedValue(existingPerson);
      mockPeopleRepo.update.mockResolvedValue(updatedPerson);

      const result = await peopleService.updatePerson(personId, updateData);

      expect(result).toEqual(updatedPerson);
      expect(mockPeopleRepo.update).toHaveBeenCalledWith(personId, {
        headline: updateData.headline,
      });
    });

    it('should handle update with all fields', async () => {
      const personId = 'cuid_123';
      const existingPerson: People = {
        id: personId,
        full_name: 'João Silva',
        headline: 'Desenvolvedor Full-Stack',
        summary: 'Engenheiro de software com experiência em desenvolvimento web.',
        location: 'São Paulo, Brasil',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updateData = {
        full_name: 'João Silva Santos',
        headline: 'Desenvolvedor Full-Stack Sênior',
        summary: 'Engenheiro de software sênior com experiência em desenvolvimento web.',
        location: 'Rio de Janeiro, Brasil',
      };

      const updatedPerson: People = {
        ...existingPerson,
        ...updateData,
        updatedAt: new Date(),
      };

      mockPeopleRepo.findById.mockResolvedValue(existingPerson);
      mockPeopleRepo.update.mockResolvedValue(updatedPerson);

      const result = await peopleService.updatePerson(personId, updateData);

      expect(result).toEqual(updatedPerson);
      expect(mockPeopleRepo.update).toHaveBeenCalledWith(personId, {
        full_name: updateData.full_name,
        headline: updateData.headline,
        summary: updateData.summary,
        location: updateData.location,
      });
    });
  });

  describe('deletePerson', () => {
    it('should delete a person when person exists', async () => {
      const personId = 'cuid_123';
      const existingPerson: People = {
        id: personId,
        full_name: 'João Silva',
        headline: 'Desenvolvedor Full-Stack',
        summary: 'Engenheiro de software com experiência em desenvolvimento web.',
        location: 'São Paulo, Brasil',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock para getPersonById (chamado internamente)
      mockPeopleRepo.findById.mockResolvedValue(existingPerson);
      // Mock para delete
      mockPeopleRepo.delete.mockResolvedValue(existingPerson);

      const result = await peopleService.deletePerson(personId);

      expect(result).toEqual(existingPerson);
      expect(mockPeopleRepo.findById).toHaveBeenCalledWith(personId);
      expect(mockPeopleRepo.delete).toHaveBeenCalledWith(personId);
      expect(mockPeopleRepo.delete).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundError if person does not exist', async () => {
      const nonExistingId = 'non_existing_id';

      mockPeopleRepo.findById.mockResolvedValue(null);

      await expect(peopleService.deletePerson(nonExistingId)).rejects.toThrow(NotFoundError);
      await expect(peopleService.deletePerson(nonExistingId)).rejects.toThrow('Person not found');

      expect(mockPeopleRepo.findById).toHaveBeenCalledWith(nonExistingId);
      expect(mockPeopleRepo.delete).not.toHaveBeenCalled();
    });
  });
});

