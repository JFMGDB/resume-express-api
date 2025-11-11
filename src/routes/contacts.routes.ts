import { Router } from 'express';
import { ContactsController } from '../controllers/contacts.controller';
import { validate } from '../middlewares/validation.middleware';
import { createContactsSchema } from '../dtos/create-contacts.dto';
import { updateContactsSchema } from '../dtos/update-contacts.dto';
import { contactsParamsSchema } from '../dtos/contacts-params.dto';

const router = Router();
const contactsController = new ContactsController();

/**
 * POST /api/v1/contacts
 * Cria um novo contato
 */
router.post('/', validate({ body: createContactsSchema }), contactsController.create);

/**
 * GET /api/v1/contacts/:id
 * Busca um contato pelo ID
 */
router.get(
  '/:id',
  validate({
    params: contactsParamsSchema,
  }),
  contactsController.getById
);

// Nota: A rota GET /api/v1/people/:id/contacts será implementada nas rotas de people

/**
 * PUT /api/v1/contacts/:id
 * Atualiza um contato existente
 */
router.put(
  '/:id',
  validate({
    params: contactsParamsSchema,
    body: updateContactsSchema,
  }),
  contactsController.update
);

/**
 * DELETE /api/v1/contacts/:id
 * Deleta um contato
 */
router.delete(
  '/:id',
  validate({
    params: contactsParamsSchema,
  }),
  contactsController.delete
);

export default router;

