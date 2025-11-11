import { Projects, Prisma } from '@prisma/client';

/**
 * Interface para o repositório de Projects
 * Define os contratos de acesso aos dados sem expor detalhes de implementação
 */
export interface IProjectsRepository {
  /**
   * Cria um novo projeto no banco de dados
   * @param data Dados do projeto a ser criado
   * @returns Promise com o projeto criado
   */
  create(data: Prisma.ProjectsCreateInput): Promise<Projects>;

  /**
   * Busca um projeto pelo ID
   * @param id ID do projeto
   * @returns Promise com o projeto encontrado ou null se não existir
   */
  findById(id: string): Promise<Projects | null>;

  /**
   * Busca todos os projetos de uma pessoa
   * @param peopleId ID da pessoa
   * @returns Promise com array de projetos
   */
  findByPeopleId(peopleId: string): Promise<Projects[]>;

  /**
   * Atualiza um projeto existente
   * @param id ID do projeto a ser atualizado
   * @param data Dados parciais para atualização
   * @returns Promise com o projeto atualizado
   */
  update(id: string, data: Prisma.ProjectsUpdateInput): Promise<Projects>;

  /**
   * Deleta um projeto pelo ID
   * @param id ID do projeto a ser deletado
   * @returns Promise com o projeto deletado
   */
  delete(id: string): Promise<Projects>;
}

