import { People, Prisma } from '@prisma/client';
import prisma from '../config/database';
import { IPeopleRepository } from '../interfaces/IPeopleRepository';

/**
 * Implementação do repositório de People
 * Única camada que interage diretamente com o Prisma Client
 */
export class PeopleRepository implements IPeopleRepository {
  /**
   * Cria uma nova pessoa no banco de dados
   */
  async create(data: Prisma.PeopleCreateInput): Promise<People> {
    return prisma.people.create({
      data,
    });
  }

  /**
   * Busca uma pessoa pelo ID
   */
  async findById(id: string): Promise<People | null> {
    return prisma.people.findUnique({
      where: { id },
    });
  }

  /**
   * Busca todas as pessoas
   */
  async findAll(): Promise<People[]> {
    return prisma.people.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Atualiza uma pessoa existente
   */
  async update(id: string, data: Prisma.PeopleUpdateInput): Promise<People> {
    return prisma.people.update({
      where: { id },
      data,
    });
  }

  /**
   * Deleta uma pessoa pelo ID
   */
  async delete(id: string): Promise<People> {
    return prisma.people.delete({
      where: { id },
    });
  }

  /**
   * Associa uma skill a uma pessoa
   */
  async associateSkill(peopleId: string, skillId: string): Promise<People> {
    return prisma.people.update({
      where: { id: peopleId },
      data: {
        skills: {
          connect: { id: skillId },
        },
      },
    });
  }

  /**
   * Desassocia uma skill de uma pessoa
   */
  async disassociateSkill(peopleId: string, skillId: string): Promise<People> {
    return prisma.people.update({
      where: { id: peopleId },
      data: {
        skills: {
          disconnect: { id: skillId },
        },
      },
    });
  }
}

