import { Request, Response, NextFunction } from 'express';
import { CertificationsService } from '../services/certifications.service';
import { CreateCertificationsDto } from '../dtos/create-certifications.dto';
import { UpdateCertificationsDto } from '../dtos/update-certifications.dto';

/**
 * Controller de Certifications
 * Responsável por orquestrar as requisições HTTP e chamar o serviço
 */
export class CertificationsController {
  private certificationsService: CertificationsService;

  constructor() {
    this.certificationsService = new CertificationsService();
  }

  /**
   * Cria uma nova certificação
   */
  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const certificationData = req.body as CreateCertificationsDto;
      const newCertification = await this.certificationsService.createCertification(certificationData);

      res.status(201).json(newCertification);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Busca uma certificação pelo ID
   */
  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const certification = await this.certificationsService.getCertificationById(id);

      res.status(200).json(certification);
    } catch (error) {
      next(error);
    }
  };

  // Nota: O método getByPeopleId será usado quando a rota GET /api/v1/people/:id/certifications for implementada

  /**
   * Atualiza uma certificação existente
   */
  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const updateData = req.body as UpdateCertificationsDto;
      const updatedCertification = await this.certificationsService.updateCertification(id, updateData);

      res.status(200).json(updatedCertification);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Deleta uma certificação
   */
  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.certificationsService.deleteCertification(id);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

