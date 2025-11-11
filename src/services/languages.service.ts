import { Languages, Prisma } from '@prisma/client';
import { ILanguagesRepository } from '../interfaces/ILanguagesRepository';
import { LanguagesRepository } from '../repositories/languages.repository';
import { IPeopleRepository } from '../interfaces/IPeopleRepository';
import { PeopleRepository } from '../repositories/people.repository';
import { CreateLanguagesDto } from '../dtos/create-languages.dto';
import { UpdateLanguagesDto } from '../dtos/update-languages.dto';
import { NotFoundError } from './people.service';

/**
 * Serviço de Languages - Contém a lógica de negócios
 * Não conhece detalhes de implementação do repositório (abstração)
 */
export class LanguagesService {
  private languagesRepository: ILanguagesRepository;
  private peopleRepository: IPeopleRepository;

  constructor(languagesRepository?: ILanguagesRepository, peopleRepository?: IPeopleRepository) {
    // Permite injeção de dependência para facilitar testes
    this.languagesRepository = languagesRepository || new LanguagesRepository();
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
   * Cria um novo idioma
   * @param data Dados do idioma a ser criado
   * @returns Promise com o idioma criado
   * @throws NotFoundError se a pessoa não for encontrada
   */
  async createLanguage(data: CreateLanguagesDto): Promise<Languages> {
    await this.validatePersonExists(data.peopleId);

    const languageData: Prisma.LanguagesCreateInput = {
      name: data.name,
      proficiency: data.proficiency,
      people: {
        connect: { id: data.peopleId },
      },
    };

    return this.languagesRepository.create(languageData);
  }

  /**
   * Busca um idioma pelo ID
   * @param id ID do idioma
   * @returns Promise com o idioma encontrado
   * @throws NotFoundError se o idioma não for encontrado
   */
  async getLanguageById(id: string): Promise<Languages> {
    const language = await this.languagesRepository.findById(id);

    if (!language) {
      throw new NotFoundError('Language not found');
    }

    return language;
  }

  /**
   * Busca todos os idiomas de uma pessoa
   * @param peopleId ID da pessoa
   * @returns Promise com array de idiomas
   */
  async getLanguagesByPeopleId(peopleId: string): Promise<Languages[]> {
    await this.validatePersonExists(peopleId);
    return this.languagesRepository.findByPeopleId(peopleId);
  }

  /**
   * Atualiza um idioma existente
   * @param id ID do idioma a ser atualizado
   * @param data Dados parciais para atualização
   * @returns Promise com o idioma atualizado
   * @throws NotFoundError se o idioma não for encontrado
   */
  async updateLanguage(id: string, data: UpdateLanguagesDto): Promise<Languages> {
    // Verifica se o idioma existe antes de atualizar
    await this.getLanguageById(id);

    // Constrói o objeto de atualização apenas com campos definidos
    const updateData: Prisma.LanguagesUpdateInput = {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.proficiency !== undefined && { proficiency: data.proficiency }),
    };

    return this.languagesRepository.update(id, updateData);
  }

  /**
   * Deleta um idioma pelo ID
   * @param id ID do idioma a ser deletado
   * @returns Promise com o idioma deletado
   * @throws NotFoundError se o idioma não for encontrado
   */
  async deleteLanguage(id: string): Promise<Languages> {
    // Verifica se o idioma existe antes de deletar
    const language = await this.getLanguageById(id);

    await this.languagesRepository.delete(id);

    return language;
  }
}

