import { Request, Response, NextFunction } from 'express';
import { EducationService } from '../services/education.service';
import { CreateEducationDto } from '../dtos/create-education.dto';
import { UpdateEducationDto } from '../dtos/update-education.dto';

/**
 * Controller de Education
 * Responsável por orquestrar as requisições HTTP e chamar o serviço
 */
export class EducationController {
  private educationService: EducationService;

  constructor() {
    this.educationService = new EducationService();
  }

  /**
   * Cria uma nova educação
   */
  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const educationData = req.body as CreateEducationDto;
      const newEducation = await this.educationService.createEducation(educationData);

      res.status(201).json(newEducation);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Busca uma educação pelo ID
   */
  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const education = await this.educationService.getEducationById(id);

      res.status(200).json(education);
    } catch (error) {
      next(error);
    }
  };

  // Nota: O método getByPeopleId será usado quando a rota GET /api/v1/people/:id/education for implementada

  /**
   * Atualiza uma educação existente
   */
  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const updateData = req.body as UpdateEducationDto;
      const updatedEducation = await this.educationService.updateEducation(id, updateData);

      res.status(200).json(updatedEducation);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Deleta uma educação
   */
  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.educationService.deleteEducation(id);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

