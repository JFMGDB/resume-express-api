import { Languages, Prisma } from '@prisma/client';
import prisma from '../config/database';
import { ILanguagesRepository } from '../interfaces/ILanguagesRepository';

/**
 * Implementação do repositório de Languages
 * Única camada que interage diretamente com o Prisma Client
 */
export class LanguagesRepository implements ILanguagesRepository {
  /**
   * Cria um novo idioma no banco de dados
   */
  async create(data: Prisma.LanguagesCreateInput): Promise<Languages> {
    return prisma.languages.create({
      data,
    });
  }

  /**
   * Busca um idioma pelo ID
   */
  async findById(id: string): Promise<Languages | null> {
    return prisma.languages.findUnique({
      where: { id },
    });
  }

  /**
   * Busca todos os idiomas de uma pessoa
   */
  async findByPeopleId(peopleId: string): Promise<Languages[]> {
    return prisma.languages.findMany({
      where: { peopleId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Atualiza um idioma existente
   */
  async update(id: string, data: Prisma.LanguagesUpdateInput): Promise<Languages> {
    return prisma.languages.update({
      where: { id },
      data,
    });
  }

  /**
   * Deleta um idioma pelo ID
   */
  async delete(id: string): Promise<Languages> {
    return prisma.languages.delete({
      where: { id },
    });
  }
}

