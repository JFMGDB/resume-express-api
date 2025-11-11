import {
  People,
  Prisma,
  Contacts,
  Education,
  Experience,
  Projects,
  Certifications,
  Languages,
  SocialLinks,
  Skills,
} from '@prisma/client';

/**
 * Tipo que representa uma pessoa com todas as suas relações incluídas
 * Usado para o endpoint GET /people/:id/full
 */
export type PeopleWithFullResume = People & {
  contacts: Contacts[];
  education: Education[];
  experience: Experience[];
  projects: Projects[];
  certifications: Certifications[];
  languages: Languages[];
  social_links: SocialLinks[];
  skills: Skills[];
};

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

  /**
   * Associa uma skill a uma pessoa
   * @param peopleId ID da pessoa
   * @param skillId ID da skill
   * @returns Promise com a pessoa atualizada
   */
  associateSkill(peopleId: string, skillId: string): Promise<People>;

  /**
   * Desassocia uma skill de uma pessoa
   * @param peopleId ID da pessoa
   * @param skillId ID da skill
   * @returns Promise com a pessoa atualizada
   */
  disassociateSkill(peopleId: string, skillId: string): Promise<People>;

  /**
   * Busca uma pessoa pelo ID com todas as relações incluídas
   * @param id ID da pessoa
   * @returns Promise com a pessoa encontrada com todas as relações ou null se não existir
   */
  findFullById(id: string): Promise<PeopleWithFullResume | null>;
}

