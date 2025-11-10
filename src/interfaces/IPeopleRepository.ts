import { People, Prisma } from '@prisma/client';

/**
 * Interface para o repositório de People
 * Define os contratos de acesso aos dados sem expor detalhes de implementação
 */
export interface IPeopleRepository {
  /**
   * Cria uma nova pessoa no banco de dados
   * @param data Dados da pessoa a ser criada
   * @returns Promise com a pessoa criada
   */
  create(data: Prisma.PeopleCreateInput): Promise<People>;

  /**
   * Busca uma pessoa pelo ID
   * @param id ID da pessoa
   * @returns Promise com a pessoa encontrada ou null se não existir
   */
  findById(id: string): Promise<People | null>;

  /**
   * Busca todas as pessoas
   * @returns Promise com array de pessoas
   */
  findAll(): Promise<People[]>;

  /**
   * Atualiza uma pessoa existente
   * @param id ID da pessoa a ser atualizada
   * @param data Dados parciais para atualização
   * @returns Promise com a pessoa atualizada
   */
  update(id: string, data: Prisma.PeopleUpdateInput): Promise<People>;

  /**
   * Deleta uma pessoa pelo ID
   * @param id ID da pessoa a ser deletada
   * @returns Promise com a pessoa deletada
   */
  delete(id: string): Promise<People>;
}

