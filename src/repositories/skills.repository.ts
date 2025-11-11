import { Skills, Prisma } from '@prisma/client';
import prisma from '../config/database';
import { ISkillsRepository } from '../interfaces/ISkillsRepository';

/**
 * Implementação do repositório de Skills
 * Única camada que interage diretamente com o Prisma Client
 */
export class SkillsRepository implements ISkillsRepository {
  /**
   * Cria uma nova skill no banco de dados
   */
  async create(data: Prisma.SkillsCreateInput): Promise<Skills> {
    return prisma.skills.create({
      data,
    });
  }

  /**
   * Busca uma skill pelo ID
   */
  async findById(id: string): Promise<Skills | null> {
    return prisma.skills.findUnique({
      where: { id },
    });
  }

  /**
   * Busca uma skill pelo nome
   */
  async findByName(name: string): Promise<Skills | null> {
    return prisma.skills.findUnique({
      where: { name },
    });
  }

  /**
   * Busca todas as skills
   */
  async findAll(): Promise<Skills[]> {
    return prisma.skills.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  /**
   * Atualiza uma skill existente
   */
  async update(id: string, data: Prisma.SkillsUpdateInput): Promise<Skills> {
    return prisma.skills.update({
      where: { id },
      data,
    });
  }

  /**
   * Deleta uma skill pelo ID
   */
  async delete(id: string): Promise<Skills> {
    return prisma.skills.delete({
      where: { id },
    });
  }
}

