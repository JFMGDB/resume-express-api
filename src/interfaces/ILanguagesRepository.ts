import { Languages, Prisma } from '@prisma/client';

/**
 * Interface para o repositório de Languages
 * Define os contratos de acesso aos dados sem expor detalhes de implementação
 */
export interface ILanguagesRepository {
  /**
   * Cria um novo idioma no banco de dados
   * @param data Dados do idioma a ser criado
   * @returns Promise com o idioma criado
   */
  create(data: Prisma.LanguagesCreateInput): Promise<Languages>;

  /**
   * Busca um idioma pelo ID
   * @param id ID do idioma
   * @returns Promise com o idioma encontrado ou null se não existir
   */
  findById(id: string): Promise<Languages | null>;

  /**
   * Busca todos os idiomas de uma pessoa
   * @param peopleId ID da pessoa
   * @returns Promise com array de idiomas
   */
  findByPeopleId(peopleId: string): Promise<Languages[]>;

  /**
   * Atualiza um idioma existente
   * @param id ID do idioma a ser atualizado
   * @param data Dados parciais para atualização
   * @returns Promise com o idioma atualizado
   */
  update(id: string, data: Prisma.LanguagesUpdateInput): Promise<Languages>;

  /**
   * Deleta um idioma pelo ID
   * @param id ID do idioma a ser deletado
   * @returns Promise com o idioma deletado
   */
  delete(id: string): Promise<Languages>;
}

