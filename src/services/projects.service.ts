import { Projects, Prisma } from '@prisma/client';
import { IProjectsRepository } from '../interfaces/IProjectsRepository';
import { ProjectsRepository } from '../repositories/projects.repository';
import { IPeopleRepository } from '../interfaces/IPeopleRepository';
import { PeopleRepository } from '../repositories/people.repository';
import { CreateProjectsDto } from '../dtos/create-projects.dto';
import { UpdateProjectsDto } from '../dtos/update-projects.dto';
import { NotFoundError } from './people.service';

/**
 * Serviço de Projects - Contém a lógica de negócios
 * Não conhece detalhes de implementação do repositório (abstração)
 */
export class ProjectsService {
  private projectsRepository: IProjectsRepository;
  private peopleRepository: IPeopleRepository;

  constructor(projectsRepository?: IProjectsRepository, peopleRepository?: IPeopleRepository) {
    // Permite injeção de dependência para facilitar testes
    this.projectsRepository = projectsRepository || new ProjectsRepository();
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
   * Cria um novo projeto
   * @param data Dados do projeto a ser criado
   * @returns Promise com o projeto criado
   * @throws NotFoundError se a pessoa não for encontrada
   */
  async createProject(data: CreateProjectsDto): Promise<Projects> {
    await this.validatePersonExists(data.peopleId);

    const projectData: Prisma.ProjectsCreateInput = {
      name: data.name,
      description: data.description,
      ...(data.url && { url: data.url }),
      ...(data.repository_url && { repository_url: data.repository_url }),
      start_date: new Date(data.start_date),
      ...(data.end_date && { end_date: new Date(data.end_date) }),
      people: {
        connect: { id: data.peopleId },
      },
    };

    return this.projectsRepository.create(projectData);
  }

  /**
   * Busca um projeto pelo ID
   * @param id ID do projeto
   * @returns Promise com o projeto encontrado
   * @throws NotFoundError se o projeto não for encontrado
   */
  async getProjectById(id: string): Promise<Projects> {
    const project = await this.projectsRepository.findById(id);

    if (!project) {
      throw new NotFoundError('Project not found');
    }

    return project;
  }

  /**
   * Busca todos os projetos de uma pessoa
   * @param peopleId ID da pessoa
   * @returns Promise com array de projetos
   */
  async getProjectsByPeopleId(peopleId: string): Promise<Projects[]> {
    await this.validatePersonExists(peopleId);
    return this.projectsRepository.findByPeopleId(peopleId);
  }

  /**
   * Atualiza um projeto existente
   * @param id ID do projeto a ser atualizado
   * @param data Dados parciais para atualização
   * @returns Promise com o projeto atualizado
   * @throws NotFoundError se o projeto não for encontrado
   */
  async updateProject(id: string, data: UpdateProjectsDto): Promise<Projects> {
    // Verifica se o projeto existe antes de atualizar
    await this.getProjectById(id);

    // Constrói o objeto de atualização apenas com campos definidos
    const updateData: Prisma.ProjectsUpdateInput = {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.url !== undefined && { url: data.url }),
      ...(data.repository_url !== undefined && { repository_url: data.repository_url }),
      ...(data.start_date !== undefined && { start_date: new Date(data.start_date) }),
      ...(data.end_date !== undefined && { end_date: data.end_date ? new Date(data.end_date) : null }),
    };

    return this.projectsRepository.update(id, updateData);
  }

  /**
   * Deleta um projeto pelo ID
   * @param id ID do projeto a ser deletado
   * @returns Promise com o projeto deletado
   * @throws NotFoundError se o projeto não for encontrado
   */
  async deleteProject(id: string): Promise<Projects> {
    // Verifica se o projeto existe antes de deletar
    const project = await this.getProjectById(id);

    await this.projectsRepository.delete(id);

    return project;
  }
}

