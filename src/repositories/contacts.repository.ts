import { Contacts, Prisma } from '@prisma/client';
import prisma from '../config/database';
import { IContactsRepository } from '../interfaces/IContactsRepository';

/**
 * Implementação do repositório de Contacts
 * Única camada que interage diretamente com o Prisma Client
 */
export class ContactsRepository implements IContactsRepository {
  /**
   * Cria um novo contato no banco de dados
   */
  async create(data: Prisma.ContactsCreateInput): Promise<Contacts> {
    return prisma.contacts.create({
      data,
    });
  }

  /**
   * Busca um contato pelo ID
   */
  async findById(id: string): Promise<Contacts | null> {
    return prisma.contacts.findUnique({
      where: { id },
    });
  }

  /**
   * Busca todos os contatos de uma pessoa
   */
  async findByPeopleId(peopleId: string): Promise<Contacts[]> {
    return prisma.contacts.findMany({
      where: { peopleId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Atualiza um contato existente
   */
  async update(id: string, data: Prisma.ContactsUpdateInput): Promise<Contacts> {
    return prisma.contacts.update({
      where: { id },
      data,
    });
  }

  /**
   * Deleta um contato pelo ID
   */
  async delete(id: string): Promise<Contacts> {
    return prisma.contacts.delete({
      where: { id },
    });
  }
}

