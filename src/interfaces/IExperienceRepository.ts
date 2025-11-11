import { Experience, Prisma } from '@prisma/client';

/**
 * Interface para o repositório de Experience
 * Define os contratos de acesso aos dados sem expor detalhes de implementação
 */
export interface IExperienceRepository {
  /**
   * Cria uma nova experiência no banco de dados
   * @param data Dados da experiência a ser criada
   * @returns Promise com a experiência criada
   */
  create(data: Prisma.ExperienceCreateInput): Promise<Experience>;

  /**
   * Busca uma experiência pelo ID
   * @param id ID da experiência
   * @returns Promise com a experiência encontrada ou null se não existir
   */
  findById(id: string): Promise<Experience | null>;

  /**
   * Busca todas as experiências de uma pessoa
   * @param peopleId ID da pessoa
   * @returns Promise com array de experiências
   */
  findByPeopleId(peopleId: string): Promise<Experience[]>;

  /**
   * Atualiza uma experiência existente
   * @param id ID da experiência a ser atualizada
   * @param data Dados parciais para atualização
   * @returns Promise com a experiência atualizada
   */
  update(id: string, data: Prisma.ExperienceUpdateInput): Promise<Experience>;

  /**
   * Deleta uma experiência pelo ID
   * @param id ID da experiência a ser deletada
   * @returns Promise com a experiência deletada
   */
  delete(id: string): Promise<Experience>;
}

