import { People, Prisma } from '@prisma/client';
import { IPeopleRepository } from '../interfaces/IPeopleRepository';
import { PeopleRepository } from '../repositories/people.repository';
import { CreatePersonDto } from '../dtos/create-person.dto';
import { UpdatePersonDto } from '../dtos/update-person.dto';

/**
 * Classe de erro customizada para quando uma pessoa não é encontrada
 */
export class NotFoundError extends Error {
  statusCode: number;
  status: string;

  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
    this.status = 'error';
  }
}

/**
 * Serviço de People - Contém a lógica de negócios
 * Não conhece detalhes de implementação do repositório (abstração)
 */
export class PeopleService {
  private peopleRepository: IPeopleRepository;

  constructor(peopleRepository?: IPeopleRepository) {
    // Permite injeção de dependência para facilitar testes
    this.peopleRepository = peopleRepository || new PeopleRepository();
  }

  /**
   * Cria uma nova pessoa
   * @param data Dados da pessoa a ser criada
   * @returns Promise com a pessoa criada
   */
  async createPerson(data: CreatePersonDto): Promise<People> {
    const personData: Prisma.PeopleCreateInput = {
      full_name: data.full_name,
      headline: data.headline,
      summary: data.summary,
      ...(data.location && { location: data.location }),
    };

    return this.peopleRepository.create(personData);
  }

  /**
   * Busca uma pessoa pelo ID
   * @param id ID da pessoa
   * @returns Promise com a pessoa encontrada
   * @throws NotFoundError se a pessoa não for encontrada
   */
  async getPersonById(id: string): Promise<People> {
    const person = await this.peopleRepository.findById(id);

    if (!person) {
      throw new NotFoundError('Person not found');
    }

    return person;
  }

  /**
   * Busca todas as pessoas
   * @returns Promise com array de pessoas
   */
  async getAllPeople(): Promise<People[]> {
    return this.peopleRepository.findAll();
  }

  /**
   * Atualiza uma pessoa existente
   * @param id ID da pessoa a ser atualizada
   * @param data Dados parciais para atualização
   * @returns Promise com a pessoa atualizada
   * @throws NotFoundError se a pessoa não for encontrada
   */
  async updatePerson(id: string, data: UpdatePersonDto): Promise<People> {
    // Verifica se a pessoa existe antes de atualizar
    await this.getPersonById(id);

    // Constrói o objeto de atualização apenas com campos definidos
    const updateData: Prisma.PeopleUpdateInput = {
      ...(data.full_name !== undefined && { full_name: data.full_name }),
      ...(data.headline !== undefined && { headline: data.headline }),
      ...(data.summary !== undefined && { summary: data.summary }),
      ...(data.location !== undefined && { location: data.location }),
    };

    return this.peopleRepository.update(id, updateData);
  }

  /**
   * Deleta uma pessoa pelo ID
   * @param id ID da pessoa a ser deletada
   * @returns Promise com a pessoa deletada
   * @throws NotFoundError se a pessoa não for encontrada
   */
  async deletePerson(id: string): Promise<People> {
    // Verifica se a pessoa existe antes de deletar
    const person = await this.getPersonById(id);

    await this.peopleRepository.delete(id);

    return person;
  }
}

