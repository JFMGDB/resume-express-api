import { Experience, Prisma } from '@prisma/client';
import prisma from '../config/database';
import { IExperienceRepository } from '../interfaces/IExperienceRepository';

/**
 * Implementação do repositório de Experience
 * Única camada que interage diretamente com o Prisma Client
 */
export class ExperienceRepository implements IExperienceRepository {
  /**
   * Cria uma nova experiência no banco de dados
   */
  async create(data: Prisma.ExperienceCreateInput): Promise<Experience> {
    return prisma.experience.create({
      data,
    });
  }

  /**
   * Busca uma experiência pelo ID
   */
  async findById(id: string): Promise<Experience | null> {
    return prisma.experience.findUnique({
      where: { id },
    });
  }

  /**
   * Busca todas as experiências de uma pessoa
   */
  async findByPeopleId(peopleId: string): Promise<Experience[]> {
    return prisma.experience.findMany({
      where: { peopleId },
      orderBy: {
        start_date: 'desc',
      },
    });
  }

  /**
   * Atualiza uma experiência existente
   */
  async update(id: string, data: Prisma.ExperienceUpdateInput): Promise<Experience> {
    return prisma.experience.update({
      where: { id },
      data,
    });
  }

  /**
   * Deleta uma experiência pelo ID
   */
  async delete(id: string): Promise<Experience> {
    return prisma.experience.delete({
      where: { id },
    });
  }
}

