import { Contacts, Prisma } from '@prisma/client';
import { IContactsRepository } from '../interfaces/IContactsRepository';
import { ContactsRepository } from '../repositories/contacts.repository';
import { IPeopleRepository } from '../interfaces/IPeopleRepository';
import { PeopleRepository } from '../repositories/people.repository';
import { CreateContactsDto } from '../dtos/create-contacts.dto';
import { UpdateContactsDto } from '../dtos/update-contacts.dto';
import { NotFoundError } from './people.service';

/**
 * Serviço de Contacts - Contém a lógica de negócios
 * Não conhece detalhes de implementação do repositório (abstração)
 */
export class ContactsService {
  private contactsRepository: IContactsRepository;
  private peopleRepository: IPeopleRepository;

  constructor(contactsRepository?: IContactsRepository, peopleRepository?: IPeopleRepository) {
    // Permite injeção de dependência para facilitar testes
    this.contactsRepository = contactsRepository || new ContactsRepository();
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
   * Cria um novo contato
   * @param data Dados do contato a ser criado
   * @returns Promise com o contato criado
   * @throws NotFoundError se a pessoa não for encontrada
   */
  async createContact(data: CreateContactsDto): Promise<Contacts> {
    await this.validatePersonExists(data.peopleId);

    const contactData: Prisma.ContactsCreateInput = {
      type: data.type,
      value: data.value,
      people: {
        connect: { id: data.peopleId },
      },
    };

    return this.contactsRepository.create(contactData);
  }

  /**
   * Busca um contato pelo ID
   * @param id ID do contato
   * @returns Promise com o contato encontrado
   * @throws NotFoundError se o contato não for encontrado
   */
  async getContactById(id: string): Promise<Contacts> {
    const contact = await this.contactsRepository.findById(id);

    if (!contact) {
      throw new NotFoundError('Contact not found');
    }

    return contact;
  }

  /**
   * Busca todos os contatos de uma pessoa
   * @param peopleId ID da pessoa
   * @returns Promise com array de contatos
   */
  async getContactsByPeopleId(peopleId: string): Promise<Contacts[]> {
    await this.validatePersonExists(peopleId);
    return this.contactsRepository.findByPeopleId(peopleId);
  }

  /**
   * Atualiza um contato existente
   * @param id ID do contato a ser atualizado
   * @param data Dados parciais para atualização
   * @returns Promise com o contato atualizado
   * @throws NotFoundError se o contato não for encontrado
   */
  async updateContact(id: string, data: UpdateContactsDto): Promise<Contacts> {
    // Verifica se o contato existe antes de atualizar
    await this.getContactById(id);

    // Constrói o objeto de atualização apenas com campos definidos
    const updateData: Prisma.ContactsUpdateInput = {
      ...(data.type !== undefined && { type: data.type }),
      ...(data.value !== undefined && { value: data.value }),
    };

    return this.contactsRepository.update(id, updateData);
  }

  /**
   * Deleta um contato pelo ID
   * @param id ID do contato a ser deletado
   * @returns Promise com o contato deletado
   * @throws NotFoundError se o contato não for encontrado
   */
  async deleteContact(id: string): Promise<Contacts> {
    // Verifica se o contato existe antes de deletar
    const contact = await this.getContactById(id);

    await this.contactsRepository.delete(id);

    return contact;
  }
}

