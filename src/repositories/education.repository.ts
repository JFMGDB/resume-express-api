import { Education, Prisma } from '@prisma/client';
import prisma from '../config/database';
import { IEducationRepository } from '../interfaces/IEducationRepository';

/**
 * Implementação do repositório de Education
 * Única camada que interage diretamente com o Prisma Client
 */
export class EducationRepository implements IEducationRepository {
  /**
   * Cria uma nova educação no banco de dados
   */
  async create(data: Prisma.EducationCreateInput): Promise<Education> {
    return prisma.education.create({
      data,
    });
  }

  /**
   * Busca uma educação pelo ID
   */
  async findById(id: string): Promise<Education | null> {
    return prisma.education.findUnique({
      where: { id },
    });
  }

  /**
   * Busca todas as educações de uma pessoa
   */
  async findByPeopleId(peopleId: string): Promise<Education[]> {
    return prisma.education.findMany({
      where: { peopleId },
      orderBy: {
        start_date: 'desc',
      },
    });
  }

  /**
   * Atualiza uma educação existente
   */
  async update(id: string, data: Prisma.EducationUpdateInput): Promise<Education> {
    return prisma.education.update({
      where: { id },
      data,
    });
  }

  /**
   * Deleta uma educação pelo ID
   */
  async delete(id: string): Promise<Education> {
    return prisma.education.delete({
      where: { id },
    });
  }
}

