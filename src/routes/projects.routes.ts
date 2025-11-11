import { Router } from 'express';
import { ProjectsController } from '../controllers/projects.controller';
import { validate } from '../middlewares/validation.middleware';
import { createProjectsSchema } from '../dtos/create-projects.dto';
import { updateProjectsSchema } from '../dtos/update-projects.dto';
import { projectsParamsSchema } from '../dtos/projects-params.dto';

const router = Router();
const projectsController = new ProjectsController();

/**
 * POST /api/v1/projects
 * Cria um novo projeto
 */
router.post('/', validate({ body: createProjectsSchema }), projectsController.create);

/**
 * GET /api/v1/projects/:id
 * Busca um projeto pelo ID
 */
router.get(
  '/:id',
  validate({
    params: projectsParamsSchema,
  }),
  projectsController.getById
);

// Nota: A rota GET /api/v1/people/:id/projects será implementada nas rotas de people

/**
 * PUT /api/v1/projects/:id
 * Atualiza um projeto existente
 */
router.put(
  '/:id',
  validate({
    params: projectsParamsSchema,
    body: updateProjectsSchema,
  }),
  projectsController.update
);

/**
 * DELETE /api/v1/projects/:id
 * Deleta um projeto
 */
router.delete(
  '/:id',
  validate({
    params: projectsParamsSchema,
  }),
  projectsController.delete
);

export default router;

