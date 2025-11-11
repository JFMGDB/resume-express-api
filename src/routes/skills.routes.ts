import { Router } from 'express';
import { SkillsController } from '../controllers/skills.controller';
import { validate } from '../middlewares/validation.middleware';
import { createSkillSchema } from '../dtos/create-skill.dto';
import { updateSkillSchema } from '../dtos/update-skill.dto';
import { skillParamsSchema } from '../dtos/skill-params.dto';

const router = Router();
const skillsController = new SkillsController();

/**
 * GET /api/v1/skills
 * Lista todas as skills
 */
router.get('/', skillsController.getAll);

/**
 * GET /api/v1/skills/:id
 * Busca uma skill pelo ID
 */
router.get(
  '/:id',
  validate({
    params: skillParamsSchema,
  }),
  skillsController.getById
);

/**
 * POST /api/v1/skills
 * Cria uma nova skill
 */
router.post('/', validate({ body: createSkillSchema }), skillsController.create);

/**
 * PUT /api/v1/skills/:id
 * Atualiza uma skill existente
 */
router.put(
  '/:id',
  validate({
    params: skillParamsSchema,
    body: updateSkillSchema,
  }),
  skillsController.update
);

/**
 * DELETE /api/v1/skills/:id
 * Deleta uma skill
 */
router.delete(
  '/:id',
  validate({
    params: skillParamsSchema,
  }),
  skillsController.delete
);

export default router;

