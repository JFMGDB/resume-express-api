import { Skills, Prisma } from '@prisma/client';
import { ISkillsRepository } from '../interfaces/ISkillsRepository';
import { SkillsRepository } from '../repositories/skills.repository';
import { CreateSkillDto } from '../dtos/create-skill.dto';
import { UpdateSkillDto } from '../dtos/update-skill.dto';
import { NotFoundError } from './people.service';

/**
 * Classe de erro customizada para quando uma skill já existe (conflito)
 */
export class ConflictError extends Error {
  statusCode: number;
  status: string;

  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
    this.statusCode = 409;
    this.status = 'error';
  }
}

/**
 * Serviço de Skills - Contém a lógica de negócios
 * Não conhece detalhes de implementação do repositório (abstração)
 */
export class SkillsService {
  private skillsRepository: ISkillsRepository;

  constructor(skillsRepository?: ISkillsRepository) {
    // Permite injeção de dependência para facilitar testes
    this.skillsRepository = skillsRepository || new SkillsRepository();
  }

  /**
   * Valida se o nome da skill já existe no banco de dados
   * @param name Nome da skill a ser validada
   * @param excludeId ID da skill a ser excluída da validação (útil para updates)
   * @throws ConflictError se o nome já existir
   */
  private async validateSkillNameUnique(name: string, excludeId?: string): Promise<void> {
    const existingSkill = await this.skillsRepository.findByName(name);
    if (existingSkill && existingSkill.id !== excludeId) {
      throw new ConflictError('Skill with this name already exists');
    }
  }

  /**
   * Cria uma nova skill
   * @param data Dados da skill a ser criada
   * @returns Promise com a skill criada
   * @throws ConflictError se o nome da skill já existir
   */
  async createSkill(data: CreateSkillDto): Promise<Skills> {
    // Verifica se já existe uma skill com o mesmo nome
    await this.validateSkillNameUnique(data.name);

    const skillData: Prisma.SkillsCreateInput = {
      name: data.name,
    };

    return this.skillsRepository.create(skillData);
  }

  /**
   * Busca uma skill pelo ID
   * @param id ID da skill
   * @returns Promise com a skill encontrada
   * @throws NotFoundError se a skill não for encontrada
   */
  async getSkillById(id: string): Promise<Skills> {
    const skill = await this.skillsRepository.findById(id);

    if (!skill) {
      throw new NotFoundError('Skill not found');
    }

    return skill;
  }

  /**
   * Busca todas as skills
   * @returns Promise com array de skills
   */
  async getAllSkills(): Promise<Skills[]> {
    return this.skillsRepository.findAll();
  }

  /**
   * Atualiza uma skill existente
   * @param id ID da skill a ser atualizada
   * @param data Dados parciais para atualização
   * @returns Promise com a skill atualizada
   * @throws NotFoundError se a skill não for encontrada
   * @throws ConflictError se o novo nome já existir
   */
  async updateSkill(id: string, data: UpdateSkillDto): Promise<Skills> {
    // Verifica se a skill existe antes de atualizar
    await this.getSkillById(id);

    // Se o nome está sendo atualizado, verifica se já existe outra skill com esse nome
    if (data.name !== undefined) {
      await this.validateSkillNameUnique(data.name, id);
    }

    // Constrói o objeto de atualização apenas com campos definidos
    const updateData: Prisma.SkillsUpdateInput = {
      ...(data.name !== undefined && { name: data.name }),
    };

    return this.skillsRepository.update(id, updateData);
  }

  /**
   * Deleta uma skill pelo ID
   * @param id ID da skill a ser deletada
   * @returns Promise com a skill deletada
   * @throws NotFoundError se a skill não for encontrada
   */
  async deleteSkill(id: string): Promise<Skills> {
    // Verifica se a skill existe antes de deletar
    const skill = await this.getSkillById(id);

    await this.skillsRepository.delete(id);

    return skill;
  }
}

