import { Request, Response, NextFunction } from 'express';
import { PeopleService } from '../services/people.service';
import { CreatePersonDto } from '../dtos/create-person.dto';
import { UpdatePersonDto } from '../dtos/update-person.dto';
import { AssociateSkillDto } from '../dtos/associate-skill.dto';
import { DisassociateSkillDto } from '../dtos/disassociate-skill.dto';

/**
 * Controller de People
 * Responsável por orquestrar as requisições HTTP e chamar o serviço
 */
export class PeopleController {
  private peopleService: PeopleService;

  constructor() {
    this.peopleService = new PeopleService();
  }

  /**
   * Cria uma nova pessoa
   */
  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const personData = req.body as CreatePersonDto;
      const newPerson = await this.peopleService.createPerson(personData);

      res.status(201).json(newPerson);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Busca uma pessoa pelo ID
   */
  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const person = await this.peopleService.getPersonById(id);

      res.status(200).json(person);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Busca todas as pessoas
   */
  getAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const people = await this.peopleService.getAllPeople();

      res.status(200).json(people);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Atualiza uma pessoa existente
   */
  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const updateData = req.body as UpdatePersonDto;
      const updatedPerson = await this.peopleService.updatePerson(id, updateData);

      res.status(200).json(updatedPerson);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Deleta uma pessoa
   */
  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.peopleService.deletePerson(id);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  /**
   * Associa uma skill a uma pessoa
   */
  associateSkill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const associateData = req.body as AssociateSkillDto;
      const updatedPerson = await this.peopleService.associateSkill(
        associateData.peopleId,
        associateData.skillId
      );

      res.status(200).json(updatedPerson);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Desassocia uma skill de uma pessoa
   */
  disassociateSkill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const disassociateData = req.body as DisassociateSkillDto;
      const updatedPerson = await this.peopleService.disassociateSkill(
        disassociateData.peopleId,
        disassociateData.skillId
      );

      res.status(200).json(updatedPerson);
    } catch (error) {
      next(error);
    }
  };
}

