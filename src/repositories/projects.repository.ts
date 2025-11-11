import { Projects, Prisma } from '@prisma/client';
import prisma from '../config/database';
import { IProjectsRepository } from '../interfaces/IProjectsRepository';

/**
 * Implementação do repositório de Projects
 * Única camada que interage diretamente com o Prisma Client
 */
export class ProjectsRepository implements IProjectsRepository {
  /**
   * Cria um novo projeto no banco de dados
   */
  async create(data: Prisma.ProjectsCreateInput): Promise<Projects> {
    return prisma.projects.create({
      data,
    });
  }

  /**
   * Busca um projeto pelo ID
   */
  async findById(id: string): Promise<Projects | null> {
    return prisma.projects.findUnique({
      where: { id },
    });
  }

  /**
   * Busca todos os projetos de uma pessoa
   */
  async findByPeopleId(peopleId: string): Promise<Projects[]> {
    return prisma.projects.findMany({
      where: { peopleId },
      orderBy: {
        start_date: 'desc',
      },
    });
  }

  /**
   * Atualiza um projeto existente
   */
  async update(id: string, data: Prisma.ProjectsUpdateInput): Promise<Projects> {
    return prisma.projects.update({
      where: { id },
      data,
    });
  }

  /**
   * Deleta um projeto pelo ID
   */
  async delete(id: string): Promise<Projects> {
    return prisma.projects.delete({
      where: { id },
    });
  }
}

