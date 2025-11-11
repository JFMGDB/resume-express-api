import { Certifications, Prisma } from '@prisma/client';

/**
 * Interface para o repositório de Certifications
 * Define os contratos de acesso aos dados sem expor detalhes de implementação
 */
export interface ICertificationsRepository {
  /**
   * Cria uma nova certificação no banco de dados
   * @param data Dados da certificação a ser criada
   * @returns Promise com a certificação criada
   */
  create(data: Prisma.CertificationsCreateInput): Promise<Certifications>;

  /**
   * Busca uma certificação pelo ID
   * @param id ID da certificação
   * @returns Promise com a certificação encontrada ou null se não existir
   */
  findById(id: string): Promise<Certifications | null>;

  /**
   * Busca todas as certificações de uma pessoa
   * @param peopleId ID da pessoa
   * @returns Promise com array de certificações
   */
  findByPeopleId(peopleId: string): Promise<Certifications[]>;

  /**
   * Atualiza uma certificação existente
   * @param id ID da certificação a ser atualizada
   * @param data Dados parciais para atualização
   * @returns Promise com a certificação atualizada
   */
  update(id: string, data: Prisma.CertificationsUpdateInput): Promise<Certifications>;

  /**
   * Deleta uma certificação pelo ID
   * @param id ID da certificação a ser deletada
   * @returns Promise com a certificação deletada
   */
  delete(id: string): Promise<Certifications>;
}

