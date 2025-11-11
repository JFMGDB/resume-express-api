import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { Skills } from '@prisma/client';
import { ISkillsRepository } from '../../src/interfaces/ISkillsRepository';
import { SkillsService, ConflictError } from '../../src/services/skills.service';
import { NotFoundError } from '../../src/services/people.service';

describe('SkillsService (Unit)', () => {
  let skillsService: SkillsService;
  let mockSkillsRepo: DeepMockProxy<ISkillsRepository>;

  beforeEach(() => {
    // Configura o mock profundo para a interface do repositório
    mockSkillsRepo = mockDeep<ISkillsRepository>();

    // Injeta o repositório mockado no serviço
    skillsService = new SkillsService(mockSkillsRepo);
  });

  describe('createSkill', () => {
    it('should create a new skill with valid data', async () => {
      const skillData = {
        name: 'TypeScript',
      };

      const expectedSkill: Skills = {
        id: 'cuid_123',
        name: skillData.name,
      };

      // Configura o mock: findByName retorna null (não existe), create retorna a skill criada
      mockSkillsRepo.findByName.mockResolvedValue(null);
      mockSkillsRepo.create.mockResolvedValue(expectedSkill);

      // Executa a função do serviço
      const result = await skillsService.createSkill(skillData);

      // Verifica se o resultado está correto
      expect(result).toEqual(expectedSkill);
      // Verifica se o repositório foi chamado corretamente
      expect(mockSkillsRepo.findByName).toHaveBeenCalledWith(skillData.name);
      expect(mockSkillsRepo.findByName).toHaveBeenCalledTimes(1);
      expect(mockSkillsRepo.create).toHaveBeenCalledWith({
        name: skillData.name,
      });
      expect(mockSkillsRepo.create).toHaveBeenCalledTimes(1);
    });

    it('should throw ConflictError if skill with same name already exists', async () => {
      const skillData = {
        name: 'TypeScript',
      };

      const existingSkill: Skills = {
        id: 'cuid_existing',
        name: skillData.name,
      };

      // Configura o mock: findByName retorna uma skill existente
      mockSkillsRepo.findByName.mockResolvedValue(existingSkill);

      // Verifica se o serviço lança o erro esperado
      await expect(skillsService.createSkill(skillData)).rejects.toThrow(ConflictError);
      await expect(skillsService.createSkill(skillData)).rejects.toThrow(
        'Skill with this name already exists'
      );

      expect(mockSkillsRepo.findByName).toHaveBeenCalledWith(skillData.name);
      expect(mockSkillsRepo.create).not.toHaveBeenCalled();
    });
  });

  describe('getSkillById', () => {
    it('should return a skill when found', async () => {
      const skillId = 'cuid_123';
      const expectedSkill: Skills = {
        id: skillId,
        name: 'TypeScript',
      };

      mockSkillsRepo.findById.mockResolvedValue(expectedSkill);

      const result = await skillsService.getSkillById(skillId);

      expect(result).toEqual(expectedSkill);
      expect(mockSkillsRepo.findById).toHaveBeenCalledWith(skillId);
      expect(mockSkillsRepo.findById).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundError if skillId does not exist', async () => {
      const nonExistingId = 'non_existing_id';

      // Configura o mock: quando 'findById' for chamado, retorne null
      mockSkillsRepo.findById.mockResolvedValue(null);

      // Verifica se o serviço lança o erro esperado
      await expect(skillsService.getSkillById(nonExistingId)).rejects.toThrow(NotFoundError);
      await expect(skillsService.getSkillById(nonExistingId)).rejects.toThrow('Skill not found');

      expect(mockSkillsRepo.findById).toHaveBeenCalledWith(nonExistingId);
    });
  });

  describe('getAllSkills', () => {
    it('should return all skills', async () => {
      const expectedSkills: Skills[] = [
        {
          id: 'cuid_123',
          name: 'React',
        },
        {
          id: 'cuid_456',
          name: 'TypeScript',
        },
      ];

      mockSkillsRepo.findAll.mockResolvedValue(expectedSkills);

      const result = await skillsService.getAllSkills();

      expect(result).toEqual(expectedSkills);
      expect(mockSkillsRepo.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no skills exist', async () => {
      mockSkillsRepo.findAll.mockResolvedValue([]);

      const result = await skillsService.getAllSkills();

      expect(result).toEqual([]);
      expect(mockSkillsRepo.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateSkill', () => {
    it('should update a skill when skill exists', async () => {
      const skillId = 'cuid_123';
      const existingSkill: Skills = {
        id: skillId,
        name: 'TypeScript',
      };

      const updateData = {
        name: 'JavaScript',
      };

      const updatedSkill: Skills = {
        ...existingSkill,
        name: updateData.name,
      };

      // Mock para getSkillById (chamado internamente)
      mockSkillsRepo.findById.mockResolvedValue(existingSkill);
      // Mock para findByName (verificação de nome único)
      mockSkillsRepo.findByName.mockResolvedValue(null);
      // Mock para update
      mockSkillsRepo.update.mockResolvedValue(updatedSkill);

      const result = await skillsService.updateSkill(skillId, updateData);

      expect(result).toEqual(updatedSkill);
      expect(mockSkillsRepo.findById).toHaveBeenCalledWith(skillId);
      expect(mockSkillsRepo.findByName).toHaveBeenCalledWith(updateData.name);
      expect(mockSkillsRepo.update).toHaveBeenCalledWith(skillId, {
        name: updateData.name,
      });
    });

    it('should throw NotFoundError if skill does not exist', async () => {
      const nonExistingId = 'non_existing_id';
      const updateData = {
        name: 'New Name',
      };

      mockSkillsRepo.findById.mockResolvedValue(null);

      await expect(skillsService.updateSkill(nonExistingId, updateData)).rejects.toThrow(NotFoundError);
      await expect(skillsService.updateSkill(nonExistingId, updateData)).rejects.toThrow('Skill not found');

      expect(mockSkillsRepo.findById).toHaveBeenCalledWith(nonExistingId);
      expect(mockSkillsRepo.update).not.toHaveBeenCalled();
    });

    it('should throw ConflictError when updating to a name that already exists', async () => {
      const skillId = 'cuid_123';
      const existingSkill: Skills = {
        id: skillId,
        name: 'TypeScript',
      };

      const updateData = {
        name: 'JavaScript',
      };

      const conflictingSkill: Skills = {
        id: 'cuid_456', // ID diferente
        name: updateData.name,
      };

      // Mock para getSkillById (chamado internamente)
      mockSkillsRepo.findById.mockResolvedValue(existingSkill);
      // Mock para findByName retorna uma skill com nome conflitante
      mockSkillsRepo.findByName.mockResolvedValue(conflictingSkill);

      await expect(skillsService.updateSkill(skillId, updateData)).rejects.toThrow(ConflictError);
      await expect(skillsService.updateSkill(skillId, updateData)).rejects.toThrow(
        'Skill with this name already exists'
      );

      expect(mockSkillsRepo.findById).toHaveBeenCalledWith(skillId);
      expect(mockSkillsRepo.findByName).toHaveBeenCalledWith(updateData.name);
      expect(mockSkillsRepo.update).not.toHaveBeenCalled();
    });

    it('should allow updating to the same name (no conflict)', async () => {
      const skillId = 'cuid_123';
      const existingSkill: Skills = {
        id: skillId,
        name: 'TypeScript',
      };

      const updateData = {
        name: 'TypeScript', // Mesmo nome
      };

      const updatedSkill: Skills = {
        ...existingSkill,
        name: updateData.name,
      };

      // Mock para getSkillById (chamado internamente)
      mockSkillsRepo.findById.mockResolvedValue(existingSkill);
      // Mock para findByName retorna a mesma skill (mesmo ID)
      mockSkillsRepo.findByName.mockResolvedValue(existingSkill);
      // Mock para update
      mockSkillsRepo.update.mockResolvedValue(updatedSkill);

      const result = await skillsService.updateSkill(skillId, updateData);

      expect(result).toEqual(updatedSkill);
      expect(mockSkillsRepo.update).toHaveBeenCalledWith(skillId, {
        name: updateData.name,
      });
    });

    it('should allow partial updates (only name field)', async () => {
      const skillId = 'cuid_123';
      const existingSkill: Skills = {
        id: skillId,
        name: 'TypeScript',
      };

      const updateData = {
        name: 'JavaScript',
      };

      const updatedSkill: Skills = {
        ...existingSkill,
        name: updateData.name,
      };

      mockSkillsRepo.findById.mockResolvedValue(existingSkill);
      mockSkillsRepo.findByName.mockResolvedValue(null);
      mockSkillsRepo.update.mockResolvedValue(updatedSkill);

      const result = await skillsService.updateSkill(skillId, updateData);

      expect(result).toEqual(updatedSkill);
      expect(mockSkillsRepo.update).toHaveBeenCalledWith(skillId, {
        name: updateData.name,
      });
    });

    it('should not check name uniqueness if name is not being updated', async () => {
      const skillId = 'cuid_123';
      const existingSkill: Skills = {
        id: skillId,
        name: 'TypeScript',
      };

      const updateData = {}; // Sem campo name

      const updatedSkill: Skills = {
        ...existingSkill,
      };

      mockSkillsRepo.findById.mockResolvedValue(existingSkill);
      mockSkillsRepo.update.mockResolvedValue(updatedSkill);

      const result = await skillsService.updateSkill(skillId, updateData);

      expect(result).toEqual(updatedSkill);
      expect(mockSkillsRepo.findByName).not.toHaveBeenCalled();
      expect(mockSkillsRepo.update).toHaveBeenCalledWith(skillId, {});
    });
  });

  describe('deleteSkill', () => {
    it('should delete a skill when skill exists', async () => {
      const skillId = 'cuid_123';
      const existingSkill: Skills = {
        id: skillId,
        name: 'TypeScript',
      };

      // Mock para getSkillById (chamado internamente)
      mockSkillsRepo.findById.mockResolvedValue(existingSkill);
      // Mock para delete
      mockSkillsRepo.delete.mockResolvedValue(existingSkill);

      const result = await skillsService.deleteSkill(skillId);

      expect(result).toEqual(existingSkill);
      expect(mockSkillsRepo.findById).toHaveBeenCalledWith(skillId);
      expect(mockSkillsRepo.delete).toHaveBeenCalledWith(skillId);
      expect(mockSkillsRepo.delete).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundError if skill does not exist', async () => {
      const nonExistingId = 'non_existing_id';

      mockSkillsRepo.findById.mockResolvedValue(null);

      await expect(skillsService.deleteSkill(nonExistingId)).rejects.toThrow(NotFoundError);
      await expect(skillsService.deleteSkill(nonExistingId)).rejects.toThrow('Skill not found');

      expect(mockSkillsRepo.findById).toHaveBeenCalledWith(nonExistingId);
      expect(mockSkillsRepo.delete).not.toHaveBeenCalled();
    });
  });
});

