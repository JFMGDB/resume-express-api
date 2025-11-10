// Configuração global de testes
// Este arquivo é executado antes de cada teste (configurado em jest.config.js)

// Limpar mocks após cada teste
afterEach(() => {
  jest.clearAllMocks();
});

// Configuração para usar jest-mock-extended quando necessário
// Os mocks específicos do Prisma serão criados nos testes unitários
// usando mockDeep do jest-mock-extended conforme especificado no PRD

