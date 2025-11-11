import { Request, Response, NextFunction } from 'express';
import { SkillsService } from '../services/skills.service';
import { CreateSkillDto } from '../dtos/create-skill.dto';
import { UpdateSkillDto } from '../dtos/update-skill.dto';

/**
 * Controller de Skills
 * Responsável por orquestrar as requisições HTTP e chamar o serviço
 */
export class SkillsController {
  private skillsService: SkillsService;

  constructor() {
    this.skillsService = new SkillsService();
  }

  /**
   * Cria uma nova skill
   */
  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const skillData = req.body as CreateSkillDto;
      const newSkill = await this.skillsService.createSkill(skillData);

      res.status(201).json(newSkill);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Busca uma skill pelo ID
   */
  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const skill = await this.skillsService.getSkillById(id);

      res.status(200).json(skill);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Busca todas as skills
   */
  getAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const skills = await this.skillsService.getAllSkills();

      res.status(200).json(skills);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Atualiza uma skill existente
   */
  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const updateData = req.body as UpdateSkillDto;
      const updatedSkill = await this.skillsService.updateSkill(id, updateData);

      res.status(200).json(updatedSkill);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Deleta uma skill
   */
  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.skillsService.deleteSkill(id);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

