import { Request, Response, NextFunction } from 'express';
import { authenticate } from '../../src/middlewares/auth.middleware';
import { config } from '../../src/config/env';

/**
 * Testes unitários para o middleware de autenticação
 *
 * ONDE: tests/unit/auth.middleware.test.ts
 * POR QUÊ: Garantir que o middleware de autenticação funciona corretamente
 * O QUE: Testa todos os cenários de autenticação (sucesso, falhas, formatos inválidos)
 */
describe('Auth Middleware (Unit)', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    // Mock do objeto Request
    mockRequest = {
      headers: {},
    };

    // Mock do objeto Response
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    // Mock da função next
    mockNext = jest.fn();
  });

  describe('Autenticação bem-sucedida', () => {
    it('deve chamar next() quando o token Bearer é válido', () => {
      const validToken = config.apiSecretKey;
      mockRequest.headers = {
        authorization: `Bearer ${validToken}`,
      };

      authenticate(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });

  describe('Falhas de autenticação', () => {
    /**
     * Helper para testar falhas de autenticação
     * Reduz duplicação de código nos testes (DRY)
     */
    const testAuthFailure = (
      headers: Record<string, string>,
      expectedStatus: number,
      expectedMessage: string
    ): void => {
      mockRequest.headers = headers;

      authenticate(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(expectedStatus);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'error',
        message: expectedMessage,
      });
      expect(mockNext).not.toHaveBeenCalled();
    };

    it('deve retornar 401 quando o header Authorization está ausente', () => {
      testAuthFailure({}, 401, 'Authorization header is required');
    });

    it('deve retornar 401 quando o formato do header é inválido (sem Bearer)', () => {
      testAuthFailure(
        { authorization: config.apiSecretKey },
        401,
        'Invalid authorization format. Expected: Bearer <token>'
      );
    });

    it('deve retornar 401 quando o formato do header tem mais de 2 partes', () => {
      testAuthFailure(
        { authorization: `Bearer ${config.apiSecretKey} extra` },
        401,
        'Invalid authorization format. Expected: Bearer <token>'
      );
    });

    it('deve retornar 403 quando o token é inválido', () => {
      testAuthFailure(
        { authorization: 'Bearer invalid-token' },
        403,
        'Invalid or expired token'
      );
    });

    it('deve retornar 403 quando o token está vazio', () => {
      testAuthFailure(
        { authorization: 'Bearer ' },
        403,
        'Invalid or expired token'
      );
    });
  });
});

