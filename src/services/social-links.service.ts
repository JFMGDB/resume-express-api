import { SocialLinks, Prisma } from '@prisma/client';
import { ISocialLinksRepository } from '../interfaces/ISocialLinksRepository';
import { SocialLinksRepository } from '../repositories/social-links.repository';
import { IPeopleRepository } from '../interfaces/IPeopleRepository';
import { PeopleRepository } from '../repositories/people.repository';
import { CreateSocialLinksDto } from '../dtos/create-social-links.dto';
import { UpdateSocialLinksDto } from '../dtos/update-social-links.dto';
import { NotFoundError } from './people.service';

/**
 * Serviço de SocialLinks - Contém a lógica de negócios
 * Não conhece detalhes de implementação do repositório (abstração)
 */
export class SocialLinksService {
  private socialLinksRepository: ISocialLinksRepository;
  private peopleRepository: IPeopleRepository;

  constructor(socialLinksRepository?: ISocialLinksRepository, peopleRepository?: IPeopleRepository) {
    // Permite injeção de dependência para facilitar testes
    this.socialLinksRepository = socialLinksRepository || new SocialLinksRepository();
    this.peopleRepository = peopleRepository || new PeopleRepository();
  }

  /**
   * Valida se a pessoa existe no banco de dados
   * @param peopleId ID da pessoa a ser validada
   * @throws NotFoundError se a pessoa não for encontrada
   */
  private async validatePersonExists(peopleId: string): Promise<void> {
    const person = await this.peopleRepository.findById(peopleId);
    if (!person) {
      throw new NotFoundError('Person not found');
    }
  }

  /**
   * Cria um novo link social
   * @param data Dados do link social a ser criado
   * @returns Promise com o link social criado
   * @throws NotFoundError se a pessoa não for encontrada
   */
  async createSocialLink(data: CreateSocialLinksDto): Promise<SocialLinks> {
    await this.validatePersonExists(data.peopleId);

    const socialLinkData: Prisma.SocialLinksCreateInput = {
      platform: data.platform,
      url: data.url,
      people: {
        connect: { id: data.peopleId },
      },
    };

    return this.socialLinksRepository.create(socialLinkData);
  }

  /**
   * Busca um link social pelo ID
   * @param id ID do link social
   * @returns Promise com o link social encontrado
   * @throws NotFoundError se o link social não for encontrado
   */
  async getSocialLinkById(id: string): Promise<SocialLinks> {
    const socialLink = await this.socialLinksRepository.findById(id);

    if (!socialLink) {
      throw new NotFoundError('Social link not found');
    }

    return socialLink;
  }

  /**
   * Busca todos os links sociais de uma pessoa
   * @param peopleId ID da pessoa
   * @returns Promise com array de links sociais
   */
  async getSocialLinksByPeopleId(peopleId: string): Promise<SocialLinks[]> {
    await this.validatePersonExists(peopleId);
    return this.socialLinksRepository.findByPeopleId(peopleId);
  }

  /**
   * Atualiza um link social existente
   * @param id ID do link social a ser atualizado
   * @param data Dados parciais para atualização
   * @returns Promise com o link social atualizado
   * @throws NotFoundError se o link social não for encontrado
   */
  async updateSocialLink(id: string, data: UpdateSocialLinksDto): Promise<SocialLinks> {
    // Verifica se o link social existe antes de atualizar
    await this.getSocialLinkById(id);

    // Constrói o objeto de atualização apenas com campos definidos
    const updateData: Prisma.SocialLinksUpdateInput = {
      ...(data.platform !== undefined && { platform: data.platform }),
      ...(data.url !== undefined && { url: data.url }),
    };

    return this.socialLinksRepository.update(id, updateData);
  }

  /**
   * Deleta um link social pelo ID
   * @param id ID do link social a ser deletado
   * @returns Promise com o link social deletado
   * @throws NotFoundError se o link social não for encontrado
   */
  async deleteSocialLink(id: string): Promise<SocialLinks> {
    // Verifica se o link social existe antes de deletar
    const socialLink = await this.getSocialLinkById(id);

    await this.socialLinksRepository.delete(id);

    return socialLink;
  }
}

