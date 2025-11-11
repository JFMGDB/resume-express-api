import { Request, Response, NextFunction } from 'express';
import { ProjectsService } from '../services/projects.service';
import { CreateProjectsDto } from '../dtos/create-projects.dto';
import { UpdateProjectsDto } from '../dtos/update-projects.dto';

/**
 * Controller de Projects
 * Responsável por orquestrar as requisições HTTP e chamar o serviço
 */
export class ProjectsController {
  private projectsService: ProjectsService;

  constructor() {
    this.projectsService = new ProjectsService();
  }

  /**
   * Cria um novo projeto
   */
  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const projectData = req.body as CreateProjectsDto;
      const newProject = await this.projectsService.createProject(projectData);

      res.status(201).json(newProject);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Busca um projeto pelo ID
   */
  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const project = await this.projectsService.getProjectById(id);

      res.status(200).json(project);
    } catch (error) {
      next(error);
    }
  };

  // Nota: O método getByPeopleId será usado quando a rota GET /api/v1/people/:id/projects for implementada

  /**
   * Atualiza um projeto existente
   */
  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const updateData = req.body as UpdateProjectsDto;
      const updatedProject = await this.projectsService.updateProject(id, updateData);

      res.status(200).json(updatedProject);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Deleta um projeto
   */
  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.projectsService.deleteProject(id);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

