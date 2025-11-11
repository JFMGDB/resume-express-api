import { Request, Response, NextFunction } from 'express';
import { config } from '../config/env';

/**
 * Constantes para mensagens de erro de autenticação
 */
const AUTH_ERRORS = {
  MISSING_HEADER: 'Authorization header is required',
  INVALID_FORMAT: 'Invalid authorization format. Expected: Bearer <token>',
  INVALID_TOKEN: 'Invalid or expired token',
} as const;

/**
 * Constante para o esquema de autenticação Bearer
 */
const BEARER_SCHEME = 'Bearer';

/**
 * Middleware de autenticação para proteger endpoints de escrita (POST, PUT, DELETE)
 * Valida o Bearer Token no header Authorization
 *
 * ONDE: src/middlewares/auth.middleware.ts
 * POR QUÊ: Proteger endpoints de escrita conforme requisito RF-06 do PRD
 * O QUE: Valida se o token Bearer enviado no header Authorization corresponde à API_SECRET_KEY
 */
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({
      status: 'error',
      message: AUTH_ERRORS.MISSING_HEADER,
    });
    return;
  }

  // Verifica se o formato é "Bearer <token>"
  const authHeaderParts = authHeader.split(' ');

  if (authHeaderParts.length !== 2 || authHeaderParts[0] !== BEARER_SCHEME) {
    res.status(401).json({
      status: 'error',
      message: AUTH_ERRORS.INVALID_FORMAT,
    });
    return;
  }

  const token = authHeaderParts[1];

  // Valida se o token corresponde à API_SECRET_KEY
  if (token !== config.apiSecretKey) {
    res.status(403).json({
      status: 'error',
      message: AUTH_ERRORS.INVALID_TOKEN,
    });
    return;
  }

  // Autenticação bem-sucedida, continua para o próximo middleware
  next();
};

