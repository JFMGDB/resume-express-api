import { Certifications, Prisma } from '@prisma/client';
import prisma from '../config/database';
import { ICertificationsRepository } from '../interfaces/ICertificationsRepository';

/**
 * Implementação do repositório de Certifications
 * Única camada que interage diretamente com o Prisma Client
 */
export class CertificationsRepository implements ICertificationsRepository {
  /**
   * Cria uma nova certificação no banco de dados
   */
  async create(data: Prisma.CertificationsCreateInput): Promise<Certifications> {
    return prisma.certifications.create({
      data,
    });
  }

  /**
   * Busca uma certificação pelo ID
   */
  async findById(id: string): Promise<Certifications | null> {
    return prisma.certifications.findUnique({
      where: { id },
    });
  }

  /**
   * Busca todas as certificações de uma pessoa
   */
  async findByPeopleId(peopleId: string): Promise<Certifications[]> {
    return prisma.certifications.findMany({
      where: { peopleId },
      orderBy: {
        issue_date: 'desc',
      },
    });
  }

  /**
   * Atualiza uma certificação existente
   */
  async update(id: string, data: Prisma.CertificationsUpdateInput): Promise<Certifications> {
    return prisma.certifications.update({
      where: { id },
      data,
    });
  }

  /**
   * Deleta uma certificação pelo ID
   */
  async delete(id: string): Promise<Certifications> {
    return prisma.certifications.delete({
      where: { id },
    });
  }
}

