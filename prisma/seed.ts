import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Limpar dados antigos
  await prisma.people.deleteMany();
  await prisma.skills.deleteMany();

  // --- Seed de Skills Comuns ---
  const skillTypeScript = await prisma.skills.create({ data: { name: 'TypeScript' } });
  const skillReact = await prisma.skills.create({ data: { name: 'React.js' } });
  const skillNode = await prisma.skills.create({ data: { name: 'Node.js' } });
  const skillPrisma = await prisma.skills.create({ data: { name: 'Prisma' } });
  const skillPostgres = await prisma.skills.create({ data: { name: 'PostgreSQL' } });
  const skillFigma = await prisma.skills.create({ data: { name: 'Figma' } });
  const skillDesignSystem = await prisma.skills.create({ data: { name: 'Design System' } });
  const skillUserResearch = await prisma.skills.create({ data: { name: 'User Research' } });
  const skillUxWriting = await prisma.skills.create({ data: { name: 'UX Writing' } });
  const skillDocker = await prisma.skills.create({ data: { name: 'Docker' } });

  // --- Pessoa A: João Silva (Desenvolvedor Full-Stack) ---
  const joao = await prisma.people.create({
    data: {
      full_name: 'João Silva',
      headline: 'Desenvolvedor Full-Stack Sênior | React, Node.js & TypeScript',
      summary:
        'Engenheiro de software com 8 anos de experiência na construção de aplicações web escaláveis. Especialista em ecossistemas JavaScript/TypeScript e arquiteturas baseadas em nuvem.',
      location: 'São Paulo, Brasil',
      contacts: {
        create: [
          { type: 'email', value: 'joao.silva@email.com' },
          { type: 'phone', value: '+55 11 98765-4321' },
          { type: 'website', value: 'joaosilva.dev' },
        ],
      },
      social_links: {
        create: [
          { platform: 'linkedin', url: 'https://linkedin.com/in/joaosilva' },
          { platform: 'github', url: 'https://github.com/joaosilva' },
        ],
      },
      skills: {
        connect: [
          { id: skillTypeScript.id },
          { id: skillReact.id },
          { id: skillNode.id },
          { id: skillPrisma.id },
          { id: skillPostgres.id },
          { id: skillDocker.id },
        ],
      },
      experience: {
        create: [
          {
            company: 'TechCorp Brasil',
            position: 'Desenvolvedor Full-Stack Sênior',
            start_date: new Date('2020-03-01'),
            end_date: null, // Emprego atual
            description:
              'Liderança técnica de equipe de 5 desenvolvedores. Desenvolvimento de APIs RESTful escaláveis usando Node.js e TypeScript. Implementação de arquitetura microserviços com Docker e Kubernetes.',
            location: 'São Paulo, Brasil',
          },
          {
            company: 'StartupX',
            position: 'Desenvolvedor Full-Stack Pleno',
            start_date: new Date('2017-06-01'),
            end_date: new Date('2020-02-28'),
            description:
              'Desenvolvimento de aplicações web com React e Node.js. Implementação de testes automatizados (Jest, Supertest). Otimização de performance e escalabilidade de aplicações.',
            location: 'São Paulo, Brasil',
          },
          {
            company: 'DevStudio',
            position: 'Desenvolvedor Front-end Júnior',
            start_date: new Date('2016-01-01'),
            end_date: new Date('2017-05-31'),
            description:
              'Primeiro contato com Node.js e APIs REST. Desenvolvimento de interfaces com React. Aprendizado de boas práticas de desenvolvimento e versionamento com Git.',
            location: 'São Paulo, Brasil',
          },
        ],
      },
      education: {
        create: [
          {
            institution: 'Universidade de São Paulo (USP)',
            degree: 'Bacharelado em Ciência da Computação',
            field_of_study: 'Ciência da Computação',
            start_date: new Date('2012-01-01'),
            end_date: new Date('2015-12-31'),
            description:
              'Formação sólida em algoritmos, estruturas de dados e arquitetura de software. Participação em projetos de pesquisa em inteligência artificial.',
          },
        ],
      },
      languages: {
        create: [
          { name: 'Português', proficiency: 'Nativo' },
          { name: 'Inglês', proficiency: 'Fluente (C1)' },
        ],
      },
      certifications: {
        create: [
          {
            name: 'AWS Certified Solutions Architect',
            issuer: 'Amazon Web Services',
            issue_date: new Date('2021-06-15'),
            url: 'https://aws.amazon.com/certification/',
          },
          {
            name: 'Docker Certified Associate',
            issuer: 'Docker Inc.',
            issue_date: new Date('2020-09-20'),
            url: 'https://www.docker.com/certification/',
          },
        ],
      },
      projects: {
        create: [
          {
            name: 'E-commerce Platform',
            description:
              'Plataforma de e-commerce completa desenvolvida com React, Node.js e PostgreSQL. Sistema de pagamento integrado, gestão de estoque e dashboard administrativo.',
            url: 'https://github.com/joaosilva/ecommerce-platform',
            repository_url: 'https://github.com/joaosilva/ecommerce-platform',
            start_date: new Date('2021-01-01'),
            end_date: new Date('2021-12-31'),
          },
          {
            name: 'API de Gerenciamento de Tarefas',
            description:
              'API RESTful para gerenciamento de tarefas com autenticação JWT, validação de dados e testes automatizados. Documentação completa com Swagger.',
            url: 'https://github.com/joaosilva/task-manager-api',
            repository_url: 'https://github.com/joaosilva/task-manager-api',
            start_date: new Date('2022-03-01'),
            end_date: new Date('2022-06-30'),
          },
        ],
      },
    },
  });
  console.log(`Created person: ${joao.full_name} (ID: ${joao.id})`);

  // --- Pessoa B: Mariana Costa (Product Designer) ---
  const mariana = await prisma.people.create({
    data: {
      full_name: 'Mariana Costa',
      headline: 'Product Designer Sênior | UX/UI & Design Systems',
      summary:
        'Designer de produto focada em criar experiências de usuário intuitivas e acessíveis. Especialista em pesquisa de usuário, prototipação e liderança de equipes de design.',
      location: 'Lisboa, Portugal',
      contacts: {
        create: [
          { type: 'email', value: 'mariana.costa@email.com' },
          { type: 'website', value: 'marianacosta.design' },
        ],
      },
      social_links: {
        create: [
          { platform: 'linkedin', url: 'https://linkedin.com/in/marianacosta' },
          { platform: 'dribbble', url: 'https://dribbble.com/marianacosta' },
        ],
      },
      skills: {
        connect: [
          { id: skillFigma.id },
          { id: skillDesignSystem.id },
          { id: skillUserResearch.id },
          { id: skillUxWriting.id },
        ],
      },
      experience: {
        create: [
          {
            company: 'DesignStudio Europe',
            position: 'Product Designer Sênior',
            start_date: new Date('2019-04-01'),
            end_date: null, // Emprego atual
            description:
              'Liderança de equipe de design de 4 designers. Criação e manutenção de design system utilizado por toda a empresa. Realização de pesquisas de usuário e testes de usabilidade.',
            location: 'Lisboa, Portugal',
          },
          {
            company: 'TechStart Lisboa',
            position: 'UX/UI Designer',
            start_date: new Date('2017-02-01'),
            end_date: new Date('2019-03-31'),
            description:
              'Design de interfaces para aplicações web e mobile. Criação de wireframes, protótipos de alta fidelidade e design systems. Colaboração estreita com desenvolvedores front-end.',
            location: 'Lisboa, Portugal',
          },
          {
            company: 'Agency Creative',
            position: 'Designer Júnior',
            start_date: new Date('2015-07-01'),
            end_date: new Date('2017-01-31'),
            description:
              'Design de interfaces para clientes diversos. Aprendizado de ferramentas de design (Figma, Sketch) e princípios de UX/UI.',
            location: 'Porto, Portugal',
          },
        ],
      },
      education: {
        create: [
          {
            institution: 'Universidade do Porto',
            degree: 'Bacharelado em Design',
            field_of_study: 'Design de Comunicação',
            start_date: new Date('2012-09-01'),
            end_date: new Date('2015-07-31'),
            description:
              'Formação em design gráfico, tipografia e comunicação visual. Especialização em design de interfaces e experiência do usuário.',
          },
        ],
      },
      languages: {
        create: [
          { name: 'Português', proficiency: 'Nativo' },
          { name: 'Inglês', proficiency: 'Fluente (C1)' },
          { name: 'Espanhol', proficiency: 'Intermediário (B2)' },
        ],
      },
      certifications: {
        create: [
          {
            name: 'Google UX Design Certificate',
            issuer: 'Google',
            issue_date: new Date('2020-11-10'),
            url: 'https://www.coursera.org/professional-certificates/google-ux-design',
          },
        ],
      },
      projects: {
        create: [
          {
            name: 'Design System - DesignStudio',
            description:
              'Criação de design system completo para empresa com mais de 50 componentes reutilizáveis. Documentação detalhada e guia de uso para desenvolvedores.',
            url: 'https://dribbble.com/marianacosta/design-system',
            repository_url: null,
            start_date: new Date('2020-01-01'),
            end_date: new Date('2021-06-30'),
          },
          {
            name: 'App de Gestão Financeira',
            description:
              'Design completo de aplicativo mobile para gestão financeira pessoal. Pesquisa de usuários, criação de personas, wireframes e protótipos interativos.',
            url: 'https://dribbble.com/marianacosta/finance-app',
            repository_url: null,
            start_date: new Date('2021-09-01'),
            end_date: new Date('2022-03-31'),
          },
        ],
      },
    },
  });
  console.log(`Created person: ${mariana.full_name} (ID: ${mariana.id})`);

  console.log('Seeding finished.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

