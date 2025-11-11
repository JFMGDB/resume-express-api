import { SocialLinks, Prisma } from '@prisma/client';

/**
 * Interface para o repositório de SocialLinks
 * Define os contratos de acesso aos dados sem expor detalhes de implementação
 */
export interface ISocialLinksRepository {
  /**
   * Cria um novo link social no banco de dados
   * @param data Dados do link social a ser criado
   * @returns Promise com o link social criado
   */
  create(data: Prisma.SocialLinksCreateInput): Promise<SocialLinks>;

  /**
   * Busca um link social pelo ID
   * @param id ID do link social
   * @returns Promise com o link social encontrado ou null se não existir
   */
  findById(id: string): Promise<SocialLinks | null>;

  /**
   * Busca todos os links sociais de uma pessoa
   * @param peopleId ID da pessoa
   * @returns Promise com array de links sociais
   */
  findByPeopleId(peopleId: string): Promise<SocialLinks[]>;

  /**
   * Atualiza um link social existente
   * @param id ID do link social a ser atualizado
   * @param data Dados parciais para atualização
   * @returns Promise com o link social atualizado
   */
  update(id: string, data: Prisma.SocialLinksUpdateInput): Promise<SocialLinks>;

  /**
   * Deleta um link social pelo ID
   * @param id ID do link social a ser deletado
   * @returns Promise com o link social deletado
   */
  delete(id: string): Promise<SocialLinks>;
}

