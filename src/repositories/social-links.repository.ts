import { SocialLinks, Prisma } from '@prisma/client';
import prisma from '../config/database';
import { ISocialLinksRepository } from '../interfaces/ISocialLinksRepository';

/**
 * Implementação do repositório de SocialLinks
 * Única camada que interage diretamente com o Prisma Client
 */
export class SocialLinksRepository implements ISocialLinksRepository {
  /**
   * Cria um novo link social no banco de dados
   */
  async create(data: Prisma.SocialLinksCreateInput): Promise<SocialLinks> {
    return prisma.socialLinks.create({
      data,
    });
  }

  /**
   * Busca um link social pelo ID
   */
  async findById(id: string): Promise<SocialLinks | null> {
    return prisma.socialLinks.findUnique({
      where: { id },
    });
  }

  /**
   * Busca todos os links sociais de uma pessoa
   */
  async findByPeopleId(peopleId: string): Promise<SocialLinks[]> {
    return prisma.socialLinks.findMany({
      where: { peopleId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Atualiza um link social existente
   */
  async update(id: string, data: Prisma.SocialLinksUpdateInput): Promise<SocialLinks> {
    return prisma.socialLinks.update({
      where: { id },
      data,
    });
  }

  /**
   * Deleta um link social pelo ID
   */
  async delete(id: string): Promise<SocialLinks> {
    return prisma.socialLinks.delete({
      where: { id },
    });
  }
}

