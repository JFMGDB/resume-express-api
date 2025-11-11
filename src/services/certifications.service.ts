import { Certifications, Prisma } from '@prisma/client';
import { ICertificationsRepository } from '../interfaces/ICertificationsRepository';
import { CertificationsRepository } from '../repositories/certifications.repository';
import { IPeopleRepository } from '../interfaces/IPeopleRepository';
import { PeopleRepository } from '../repositories/people.repository';
import { CreateCertificationsDto } from '../dtos/create-certifications.dto';
import { UpdateCertificationsDto } from '../dtos/update-certifications.dto';
import { NotFoundError } from './people.service';

/**
 * Serviço de Certifications - Contém a lógica de negócios
 * Não conhece detalhes de implementação do repositório (abstração)
 */
export class CertificationsService {
  private certificationsRepository: ICertificationsRepository;
  private peopleRepository: IPeopleRepository;

  constructor(
    certificationsRepository?: ICertificationsRepository,
    peopleRepository?: IPeopleRepository
  ) {
    // Permite injeção de dependência para facilitar testes
    this.certificationsRepository = certificationsRepository || new CertificationsRepository();
    this.peopleRepository = peopleRepository || new PeopleRepository();
  }

  /**
   * Valida se a pessoa existe no banco de dados
   * @param peopleId ID da pessoa a ser validada
   * @throws NotFoundError se a pessoa não for encontrada
   */
  private async validatePersonExists(peopleId: string): Promise<void> {
    const person = await this.peopleRepository.findById(peopleId);
    if (!person) {
      throw new NotFoundError('Person not found');
    }
  }

  /**
   * Cria uma nova certificação
   * @param data Dados da certificação a ser criada
   * @returns Promise com a certificação criada
   * @throws NotFoundError se a pessoa não for encontrada
   */
  async createCertification(data: CreateCertificationsDto): Promise<Certifications> {
    await this.validatePersonExists(data.peopleId);

    const certificationData: Prisma.CertificationsCreateInput = {
      name: data.name,
      issuer: data.issuer,
      issue_date: new Date(data.issue_date),
      ...(data.url && { url: data.url }),
      people: {
        connect: { id: data.peopleId },
      },
    };

    return this.certificationsRepository.create(certificationData);
  }

  /**
   * Busca uma certificação pelo ID
   * @param id ID da certificação
   * @returns Promise com a certificação encontrada
   * @throws NotFoundError se a certificação não for encontrada
   */
  async getCertificationById(id: string): Promise<Certifications> {
    const certification = await this.certificationsRepository.findById(id);

    if (!certification) {
      throw new NotFoundError('Certification not found');
    }

    return certification;
  }

  /**
   * Busca todas as certificações de uma pessoa
   * @param peopleId ID da pessoa
   * @returns Promise com array de certificações
   */
  async getCertificationsByPeopleId(peopleId: string): Promise<Certifications[]> {
    await this.validatePersonExists(peopleId);
    return this.certificationsRepository.findByPeopleId(peopleId);
  }

  /**
   * Atualiza uma certificação existente
   * @param id ID da certificação a ser atualizada
   * @param data Dados parciais para atualização
   * @returns Promise com a certificação atualizada
   * @throws NotFoundError se a certificação não for encontrada
   */
  async updateCertification(id: string, data: UpdateCertificationsDto): Promise<Certifications> {
    // Verifica se a certificação existe antes de atualizar
    await this.getCertificationById(id);

    // Constrói o objeto de atualização apenas com campos definidos
    const updateData: Prisma.CertificationsUpdateInput = {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.issuer !== undefined && { issuer: data.issuer }),
      ...(data.issue_date !== undefined && { issue_date: new Date(data.issue_date) }),
      ...(data.url !== undefined && { url: data.url }),
    };

    return this.certificationsRepository.update(id, updateData);
  }

  /**
   * Deleta uma certificação pelo ID
   * @param id ID da certificação a ser deletada
   * @returns Promise com a certificação deletada
   * @throws NotFoundError se a certificação não for encontrada
   */
  async deleteCertification(id: string): Promise<Certifications> {
    // Verifica se a certificação existe antes de deletar
    const certification = await this.getCertificationById(id);

    await this.certificationsRepository.delete(id);

    return certification;
  }
}

