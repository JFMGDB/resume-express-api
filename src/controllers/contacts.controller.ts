import { Request, Response, NextFunction } from 'express';
import { ContactsService } from '../services/contacts.service';
import { CreateContactsDto } from '../dtos/create-contacts.dto';
import { UpdateContactsDto } from '../dtos/update-contacts.dto';

/**
 * Controller de Contacts
 * Responsável por orquestrar as requisições HTTP e chamar o serviço
 */
export class ContactsController {
  private contactsService: ContactsService;

  constructor() {
    this.contactsService = new ContactsService();
  }

  /**
   * Cria um novo contato
   */
  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const contactData = req.body as CreateContactsDto;
      const newContact = await this.contactsService.createContact(contactData);

      res.status(201).json(newContact);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Busca um contato pelo ID
   */
  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const contact = await this.contactsService.getContactById(id);

      res.status(200).json(contact);
    } catch (error) {
      next(error);
    }
  };

  // Nota: O método getByPeopleId será usado quando a rota GET /api/v1/people/:id/contacts for implementada

  /**
   * Atualiza um contato existente
   */
  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const updateData = req.body as UpdateContactsDto;
      const updatedContact = await this.contactsService.updateContact(id, updateData);

      res.status(200).json(updatedContact);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Deleta um contato
   */
  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.contactsService.deleteContact(id);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

