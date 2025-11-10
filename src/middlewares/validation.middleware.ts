import { Request, Response, NextFunction } from 'express';
import { ZodSchema, z } from 'zod';

export interface ValidationSchemas {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

/**
 * Middleware de validação genérico usando Zod
 * Suporta validação de body, query e params separadamente ou um schema único para o body
 */
export const validate = (schemas: ZodSchema | ValidationSchemas) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      // Verifica se é um schema único (ZodSchema) ou um objeto com schemas separados
      const isSingleSchema = schemas instanceof z.ZodType;

      if (isSingleSchema) {
        // Se for um schema único, assume que é para o body
        (schemas as ZodSchema).parse(req.body);
      } else {
        // Se for um objeto com schemas separados
        const validationSchemas = schemas as ValidationSchemas;

        if (validationSchemas.body) {
          validationSchemas.body.parse(req.body);
        }

        if (validationSchemas.query) {
          validationSchemas.query.parse(req.query);
        }

        if (validationSchemas.params) {
          validationSchemas.params.parse(req.params);
        }
      }

      next();
    } catch (error) {
      // Propaga o erro para o error handler
      next(error);
    }
  };
};

