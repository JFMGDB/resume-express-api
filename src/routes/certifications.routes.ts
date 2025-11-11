import { Router } from 'express';
import { CertificationsController } from '../controllers/certifications.controller';
import { validate } from '../middlewares/validation.middleware';
import { createCertificationsSchema } from '../dtos/create-certifications.dto';
import { updateCertificationsSchema } from '../dtos/update-certifications.dto';
import { certificationsParamsSchema } from '../dtos/certifications-params.dto';

const router = Router();
const certificationsController = new CertificationsController();

/**
 * POST /api/v1/certifications
 * Cria uma nova certificação
 */
router.post('/', validate({ body: createCertificationsSchema }), certificationsController.create);

/**
 * GET /api/v1/certifications/:id
 * Busca uma certificação pelo ID
 */
router.get(
  '/:id',
  validate({
    params: certificationsParamsSchema,
  }),
  certificationsController.getById
);

// Nota: A rota GET /api/v1/people/:id/certifications será implementada nas rotas de people

/**
 * PUT /api/v1/certifications/:id
 * Atualiza uma certificação existente
 */
router.put(
  '/:id',
  validate({
    params: certificationsParamsSchema,
    body: updateCertificationsSchema,
  }),
  certificationsController.update
);

/**
 * DELETE /api/v1/certifications/:id
 * Deleta uma certificação
 */
router.delete(
  '/:id',
  validate({
    params: certificationsParamsSchema,
  }),
  certificationsController.delete
);

export default router;

