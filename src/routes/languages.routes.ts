import { Router } from 'express';
import { LanguagesController } from '../controllers/languages.controller';
import { validate } from '../middlewares/validation.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { createLanguagesSchema } from '../dtos/create-languages.dto';
import { updateLanguagesSchema } from '../dtos/update-languages.dto';
import { languagesParamsSchema } from '../dtos/languages-params.dto';

const router = Router();
const languagesController = new LanguagesController();

/**
 * POST /api/v1/languages
 * Cria um novo idioma
 */
router.post(
  '/',
  authenticate,
  validate({ body: createLanguagesSchema }),
  languagesController.create
);

/**
 * GET /api/v1/languages/:id
 * Busca um idioma pelo ID
 */
router.get(
  '/:id',
  validate({
    params: languagesParamsSchema,
  }),
  languagesController.getById
);

// Nota: A rota GET /api/v1/people/:id/languages será implementada nas rotas de people

/**
 * PUT /api/v1/languages/:id
 * Atualiza um idioma existente
 */
router.put(
  '/:id',
  authenticate,
  validate({
    params: languagesParamsSchema,
    body: updateLanguagesSchema,
  }),
  languagesController.update
);

/**
 * DELETE /api/v1/languages/:id
 * Deleta um idioma
 */
router.delete(
  '/:id',
  authenticate,
  validate({
    params: languagesParamsSchema,
  }),
  languagesController.delete
);

export default router;

