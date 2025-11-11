import { Contacts, Prisma } from '@prisma/client';

/**
 * Interface para o repositório de Contacts
 * Define os contratos de acesso aos dados sem expor detalhes de implementação
 */
export interface IContactsRepository {
  /**
   * Cria um novo contato no banco de dados
   * @param data Dados do contato a ser criado
   * @returns Promise com o contato criado
   */
  create(data: Prisma.ContactsCreateInput): Promise<Contacts>;

  /**
   * Busca um contato pelo ID
   * @param id ID do contato
   * @returns Promise com o contato encontrado ou null se não existir
   */
  findById(id: string): Promise<Contacts | null>;

  /**
   * Busca todos os contatos de uma pessoa
   * @param peopleId ID da pessoa
   * @returns Promise com array de contatos
   */
  findByPeopleId(peopleId: string): Promise<Contacts[]>;

  /**
   * Atualiza um contato existente
   * @param id ID do contato a ser atualizado
   * @param data Dados parciais para atualização
   * @returns Promise com o contato atualizado
   */
  update(id: string, data: Prisma.ContactsUpdateInput): Promise<Contacts>;

  /**
   * Deleta um contato pelo ID
   * @param id ID do contato a ser deletado
   * @returns Promise com o contato deletado
   */
  delete(id: string): Promise<Contacts>;
}

