import { Router } from 'express';
import { SocialLinksController } from '../controllers/social-links.controller';
import { validate } from '../middlewares/validation.middleware';
import { createSocialLinksSchema } from '../dtos/create-social-links.dto';
import { updateSocialLinksSchema } from '../dtos/update-social-links.dto';
import { socialLinksParamsSchema } from '../dtos/social-links-params.dto';

const router = Router();
const socialLinksController = new SocialLinksController();

/**
 * POST /api/v1/social-links
 * Cria um novo link social
 */
router.post('/', validate({ body: createSocialLinksSchema }), socialLinksController.create);

/**
 * GET /api/v1/social-links/:id
 * Busca um link social pelo ID
 */
router.get(
  '/:id',
  validate({
    params: socialLinksParamsSchema,
  }),
  socialLinksController.getById
);

// Nota: A rota GET /api/v1/people/:id/social-links será implementada nas rotas de people

/**
 * PUT /api/v1/social-links/:id
 * Atualiza um link social existente
 */
router.put(
  '/:id',
  validate({
    params: socialLinksParamsSchema,
    body: updateSocialLinksSchema,
  }),
  socialLinksController.update
);

/**
 * DELETE /api/v1/social-links/:id
 * Deleta um link social
 */
router.delete(
  '/:id',
  validate({
    params: socialLinksParamsSchema,
  }),
  socialLinksController.delete
);

export default router;

