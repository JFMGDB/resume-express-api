import { Experience, Prisma } from '@prisma/client';
import { IExperienceRepository } from '../interfaces/IExperienceRepository';
import { ExperienceRepository } from '../repositories/experience.repository';
import { IPeopleRepository } from '../interfaces/IPeopleRepository';
import { PeopleRepository } from '../repositories/people.repository';
import { CreateExperienceDto } from '../dtos/create-experience.dto';
import { UpdateExperienceDto } from '../dtos/update-experience.dto';
import { NotFoundError } from './people.service';

/**
 * Serviço de Experience - Contém a lógica de negócios
 * Não conhece detalhes de implementação do repositório (abstração)
 */
export class ExperienceService {
  private experienceRepository: IExperienceRepository;
  private peopleRepository: IPeopleRepository;

  constructor(experienceRepository?: IExperienceRepository, peopleRepository?: IPeopleRepository) {
    // Permite injeção de dependência para facilitar testes
    this.experienceRepository = experienceRepository || new ExperienceRepository();
    this.peopleRepository = peopleRepository || new PeopleRepository();
  }

  /**
   * Valida se a pessoa existe no banco de dados
   * @param peopleId ID da pessoa a ser validada
   * @throws NotFoundError se a pessoa não for encontrada
   */
  private async validatePersonExists(peopleId: string): Promise<void> {
    const person = await this.peopleRepository.findById(peopleId);
    if (!person) {
      throw new NotFoundError('Person not found');
    }
  }

  /**
   * Cria uma nova experiência
   * @param data Dados da experiência a ser criada
   * @returns Promise com a experiência criada
   * @throws NotFoundError se a pessoa não for encontrada
   */
  async createExperience(data: CreateExperienceDto): Promise<Experience> {
    await this.validatePersonExists(data.peopleId);

    const experienceData: Prisma.ExperienceCreateInput = {
      company: data.company,
      position: data.position,
      start_date: new Date(data.start_date),
      description: data.description || '',
      ...(data.end_date && { end_date: new Date(data.end_date) }),
      ...(data.location !== undefined && data.location !== null && { location: data.location }),
      people: {
        connect: { id: data.peopleId },
      },
    };

    return this.experienceRepository.create(experienceData);
  }

  /**
   * Busca uma experiência pelo ID
   * @param id ID da experiência
   * @returns Promise com a experiência encontrada
   * @throws NotFoundError se a experiência não for encontrada
   */
  async getExperienceById(id: string): Promise<Experience> {
    const experience = await this.experienceRepository.findById(id);

    if (!experience) {
      throw new NotFoundError('Experience not found');
    }

    return experience;
  }

  /**
   * Busca todas as experiências de uma pessoa
   * @param peopleId ID da pessoa
   * @returns Promise com array de experiências
   */
  async getExperiencesByPeopleId(peopleId: string): Promise<Experience[]> {
    await this.validatePersonExists(peopleId);
    return this.experienceRepository.findByPeopleId(peopleId);
  }

  /**
   * Atualiza uma experiência existente
   * @param id ID da experiência a ser atualizada
   * @param data Dados parciais para atualização
   * @returns Promise com a experiência atualizada
   * @throws NotFoundError se a experiência não for encontrada
   */
  async updateExperience(id: string, data: UpdateExperienceDto): Promise<Experience> {
    // Verifica se a experiência existe antes de atualizar
    await this.getExperienceById(id);

    // Constrói o objeto de atualização apenas com campos definidos
    const updateData: Prisma.ExperienceUpdateInput = {
      ...(data.company !== undefined && { company: data.company }),
      ...(data.position !== undefined && { position: data.position }),
      ...(data.start_date !== undefined && { start_date: new Date(data.start_date) }),
      ...(data.end_date !== undefined && { end_date: data.end_date ? new Date(data.end_date) : null }),
      ...(data.description !== undefined && { description: data.description ?? '' }),
      ...(data.location !== undefined && { location: data.location }),
    };

    return this.experienceRepository.update(id, updateData);
  }

  /**
   * Deleta uma experiência pelo ID
   * @param id ID da experiência a ser deletada
   * @returns Promise com a experiência deletada
   * @throws NotFoundError se a experiência não for encontrada
   */
  async deleteExperience(id: string): Promise<Experience> {
    // Verifica se a experiência existe antes de deletar
    const experience = await this.getExperienceById(id);

    await this.experienceRepository.delete(id);

    return experience;
  }
}

