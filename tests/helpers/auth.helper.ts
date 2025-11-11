import { config } from '../../src/config/env';

/**
 * Constante para token de autenticação inválido usado em testes
 */
const INVALID_TOKEN = 'invalid-token-for-testing';

/**
 * Constante para o esquema de autenticação Bearer
 */
const BEARER_SCHEME = 'Bearer';

/**
 * Helper para autenticação em testes
 * Fornece funções utilitárias para facilitar testes de autenticação
 *
 * ONDE: tests/helpers/auth.helper.ts
 * POR QUÊ: Reutilizar lógica de autenticação nos testes (DRY)
 * O QUE: Funções helper para obter token de autenticação válido e inválido
 */

/**
 * Obtém o token de autenticação válido para testes
 * @returns Token de autenticação válido (API_SECRET_KEY)
 * @throws Error se API_SECRET_KEY não estiver configurada
 */
export const getAuthToken = (): string => {
  if (!config.apiSecretKey) {
    throw new Error('API_SECRET_KEY não configurada para testes');
  }
  return config.apiSecretKey;
};

/**
 * Obtém um token de autenticação inválido para testes
 * @returns Token de autenticação inválido
 */
export const getInvalidAuthToken = (): string => {
  return INVALID_TOKEN;
};

/**
 * Cria o header Authorization com Bearer token
 * @param token Token de autenticação (opcional, usa token válido por padrão)
 * @returns Objeto com header Authorization
 */
export const getAuthHeader = (token?: string): { Authorization: string } => {
  const authToken = token || getAuthToken();
  return {
    Authorization: `${BEARER_SCHEME} ${authToken}`,
  };
};

