import { Education, Prisma } from '@prisma/client';
import { IEducationRepository } from '../interfaces/IEducationRepository';
import { EducationRepository } from '../repositories/education.repository';
import { IPeopleRepository } from '../interfaces/IPeopleRepository';
import { PeopleRepository } from '../repositories/people.repository';
import { CreateEducationDto } from '../dtos/create-education.dto';
import { UpdateEducationDto } from '../dtos/update-education.dto';
import { NotFoundError } from './people.service';

/**
 * Serviço de Education - Contém a lógica de negócios
 * Não conhece detalhes de implementação do repositório (abstração)
 */
export class EducationService {
  private educationRepository: IEducationRepository;
  private peopleRepository: IPeopleRepository;

  constructor(educationRepository?: IEducationRepository, peopleRepository?: IPeopleRepository) {
    // Permite injeção de dependência para facilitar testes
    this.educationRepository = educationRepository || new EducationRepository();
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
   * Cria uma nova educação
   * @param data Dados da educação a ser criada
   * @returns Promise com a educação criada
   * @throws NotFoundError se a pessoa não for encontrada
   */
  async createEducation(data: CreateEducationDto): Promise<Education> {
    await this.validatePersonExists(data.peopleId);

    const educationData: Prisma.EducationCreateInput = {
      institution: data.institution,
      degree: data.degree,
      ...(data.field_of_study && { field_of_study: data.field_of_study }),
      start_date: new Date(data.start_date),
      ...(data.end_date && { end_date: new Date(data.end_date) }),
      ...(data.description && { description: data.description }),
      people: {
        connect: { id: data.peopleId },
      },
    };

    return this.educationRepository.create(educationData);
  }

  /**
   * Busca uma educação pelo ID
   * @param id ID da educação
   * @returns Promise com a educação encontrada
   * @throws NotFoundError se a educação não for encontrada
   */
  async getEducationById(id: string): Promise<Education> {
    const education = await this.educationRepository.findById(id);

    if (!education) {
      throw new NotFoundError('Education not found');
    }

    return education;
  }

  /**
   * Busca todas as educações de uma pessoa
   * @param peopleId ID da pessoa
   * @returns Promise com array de educações
   */
  async getEducationsByPeopleId(peopleId: string): Promise<Education[]> {
    await this.validatePersonExists(peopleId);
    return this.educationRepository.findByPeopleId(peopleId);
  }

  /**
   * Atualiza uma educação existente
   * @param id ID da educação a ser atualizada
   * @param data Dados parciais para atualização
   * @returns Promise com a educação atualizada
   * @throws NotFoundError se a educação não for encontrada
   */
  async updateEducation(id: string, data: UpdateEducationDto): Promise<Education> {
    // Verifica se a educação existe antes de atualizar
    await this.getEducationById(id);

    // Constrói o objeto de atualização apenas com campos definidos
    const updateData: Prisma.EducationUpdateInput = {
      ...(data.institution !== undefined && { institution: data.institution }),
      ...(data.degree !== undefined && { degree: data.degree }),
      ...(data.field_of_study !== undefined && { field_of_study: data.field_of_study }),
      ...(data.start_date !== undefined && { start_date: new Date(data.start_date) }),
      ...(data.end_date !== undefined && { end_date: data.end_date ? new Date(data.end_date) : null }),
      ...(data.description !== undefined && { description: data.description }),
    };

    return this.educationRepository.update(id, updateData);
  }

  /**
   * Deleta uma educação pelo ID
   * @param id ID da educação a ser deletada
   * @returns Promise com a educação deletada
   * @throws NotFoundError se a educação não for encontrada
   */
  async deleteEducation(id: string): Promise<Education> {
    // Verifica se a educação existe antes de deletar
    const education = await this.getEducationById(id);

    await this.educationRepository.delete(id);

    return education;
  }
}

