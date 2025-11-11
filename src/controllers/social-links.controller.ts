import { Request, Response, NextFunction } from 'express';
import { SocialLinksService } from '../services/social-links.service';
import { CreateSocialLinksDto } from '../dtos/create-social-links.dto';
import { UpdateSocialLinksDto } from '../dtos/update-social-links.dto';

/**
 * Controller de SocialLinks
 * Responsável por orquestrar as requisições HTTP e chamar o serviço
 */
export class SocialLinksController {
  private socialLinksService: SocialLinksService;

  constructor() {
    this.socialLinksService = new SocialLinksService();
  }

  /**
   * Cria um novo link social
   */
  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const socialLinkData = req.body as CreateSocialLinksDto;
      const newSocialLink = await this.socialLinksService.createSocialLink(socialLinkData);

      res.status(201).json(newSocialLink);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Busca um link social pelo ID
   */
  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const socialLink = await this.socialLinksService.getSocialLinkById(id);

      res.status(200).json(socialLink);
    } catch (error) {
      next(error);
    }
  };

  // Nota: O método getByPeopleId será usado quando a rota GET /api/v1/people/:id/social-links for implementada

  /**
   * Atualiza um link social existente
   */
  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const updateData = req.body as UpdateSocialLinksDto;
      const updatedSocialLink = await this.socialLinksService.updateSocialLink(id, updateData);

      res.status(200).json(updatedSocialLink);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Deleta um link social
   */
  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.socialLinksService.deleteSocialLink(id);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

