import { Request, Response, NextFunction } from 'express';
import { ExperienceService } from '../services/experience.service';
import { CreateExperienceDto } from '../dtos/create-experience.dto';
import { UpdateExperienceDto } from '../dtos/update-experience.dto';

/**
 * Controller de Experience
 * Responsável por orquestrar as requisições HTTP e chamar o serviço
 */
export class ExperienceController {
  private experienceService: ExperienceService;

  constructor() {
    this.experienceService = new ExperienceService();
  }

  /**
   * Cria uma nova experiência
   */
  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const experienceData = req.body as CreateExperienceDto;
      const newExperience = await this.experienceService.createExperience(experienceData);

      res.status(201).json(newExperience);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Busca uma experiência pelo ID
   */
  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const experience = await this.experienceService.getExperienceById(id);

      res.status(200).json(experience);
    } catch (error) {
      next(error);
    }
  };

  // Nota: O método getByPeopleId será usado quando a rota GET /api/v1/people/:id/experience for implementada

  /**
   * Atualiza uma experiência existente
   */
  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const updateData = req.body as UpdateExperienceDto;
      const updatedExperience = await this.experienceService.updateExperience(id, updateData);

      res.status(200).json(updatedExperience);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Deleta uma experiência
   */
  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.experienceService.deleteExperience(id);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

