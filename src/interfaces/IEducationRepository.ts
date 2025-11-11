import { Education, Prisma } from '@prisma/client';

/**
 * Interface para o repositório de Education
 * Define os contratos de acesso aos dados sem expor detalhes de implementação
 */
export interface IEducationRepository {
  /**
   * Cria uma nova educação no banco de dados
   * @param data Dados da educação a ser criada
   * @returns Promise com a educação criada
   */
  create(data: Prisma.EducationCreateInput): Promise<Education>;

  /**
   * Busca uma educação pelo ID
   * @param id ID da educação
   * @returns Promise com a educação encontrada ou null se não existir
   */
  findById(id: string): Promise<Education | null>;

  /**
   * Busca todas as educações de uma pessoa
   * @param peopleId ID da pessoa
   * @returns Promise com array de educações
   */
  findByPeopleId(peopleId: string): Promise<Education[]>;

  /**
   * Atualiza uma educação existente
   * @param id ID da educação a ser atualizada
   * @param data Dados parciais para atualização
   * @returns Promise com a educação atualizada
   */
  update(id: string, data: Prisma.EducationUpdateInput): Promise<Education>;

  /**
   * Deleta uma educação pelo ID
   * @param id ID da educação a ser deletada
   * @returns Promise com a educação deletada
   */
  delete(id: string): Promise<Education>;
}

