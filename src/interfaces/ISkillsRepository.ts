import { Skills, Prisma } from '@prisma/client';

/**
 * Interface para o repositório de Skills
 * Define os contratos de acesso aos dados sem expor detalhes de implementação
 */
export interface ISkillsRepository {
  /**
   * Cria uma nova skill no banco de dados
   * @param data Dados da skill a ser criada
   * @returns Promise com a skill criada
   */
  create(data: Prisma.SkillsCreateInput): Promise<Skills>;

  /**
   * Busca uma skill pelo ID
   * @param id ID da skill
   * @returns Promise com a skill encontrada ou null se não existir
   */
  findById(id: string): Promise<Skills | null>;

  /**
   * Busca uma skill pelo nome
   * @param name Nome da skill
   * @returns Promise com a skill encontrada ou null se não existir
   */
  findByName(name: string): Promise<Skills | null>;

  /**
   * Busca todas as skills
   * @returns Promise com array de skills
   */
  findAll(): Promise<Skills[]>;

  /**
   * Atualiza uma skill existente
   * @param id ID da skill a ser atualizada
   * @param data Dados parciais para atualização
   * @returns Promise com a skill atualizada
   */
  update(id: string, data: Prisma.SkillsUpdateInput): Promise<Skills>;

  /**
   * Deleta uma skill pelo ID
   * @param id ID da skill a ser deletada
   * @returns Promise com a skill deletada
   */
  delete(id: string): Promise<Skills>;
}

