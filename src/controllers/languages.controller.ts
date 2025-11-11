import { Request, Response, NextFunction } from 'express';
import { LanguagesService } from '../services/languages.service';
import { CreateLanguagesDto } from '../dtos/create-languages.dto';
import { UpdateLanguagesDto } from '../dtos/update-languages.dto';

/**
 * Controller de Languages
 * Responsável por orquestrar as requisições HTTP e chamar o serviço
 */
export class LanguagesController {
  private languagesService: LanguagesService;

  constructor() {
    this.languagesService = new LanguagesService();
  }

  /**
   * Cria um novo idioma
   */
  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const languageData = req.body as CreateLanguagesDto;
      const newLanguage = await this.languagesService.createLanguage(languageData);

      res.status(201).json(newLanguage);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Busca um idioma pelo ID
   */
  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const language = await this.languagesService.getLanguageById(id);

      res.status(200).json(language);
    } catch (error) {
      next(error);
    }
  };

  // Nota: O método getByPeopleId será usado quando a rota GET /api/v1/people/:id/languages for implementada

  /**
   * Atualiza um idioma existente
   */
  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const updateData = req.body as UpdateLanguagesDto;
      const updatedLanguage = await this.languagesService.updateLanguage(id, updateData);

      res.status(200).json(updatedLanguage);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Deleta um idioma
   */
  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.languagesService.deleteLanguage(id);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

