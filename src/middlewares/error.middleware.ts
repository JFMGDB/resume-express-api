import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export interface AppError extends Error {
  statusCode?: number;
  status?: string;
}

export const errorHandler = (
  error: AppError | ZodError | Prisma.PrismaClientKnownRequestError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Erro de validação Zod
  if (error instanceof ZodError) {
    res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: error.errors.map((validationError) => ({
        code: validationError.code,
        path: validationError.path,
        message: validationError.message,
      })),
    });
    return;
  }

  // Erro do Prisma
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Mapeamento de códigos de erro do Prisma para respostas HTTP
    const prismaErrorMap: Record<string, { status: number; message: string; getField?: (meta: unknown) => unknown }> = {
      P2002: {
        status: 409,
        message: 'Unique constraint violation',
        getField: (meta) => (meta as { target?: unknown })?.target,
      },
      P2025: {
        status: 404,
        message: 'Record not found',
      },
      P2003: {
        status: 400,
        message: 'Foreign key constraint violation',
        getField: (meta) => (meta as { field_name?: unknown })?.field_name,
      },
      P2004: {
        status: 400,
        message: 'Invalid value for field type',
      },
    };

    const errorConfig = prismaErrorMap[error.code];

    if (errorConfig) {
      const responseBody: { status: string; message: string; field?: unknown } = {
        status: 'error',
        message: errorConfig.message,
      };

      if (errorConfig.getField && error.meta) {
        responseBody.field = errorConfig.getField(error.meta);
      }

      res.status(errorConfig.status).json(responseBody);
      return;
    }

    // Erro genérico do Prisma
    res.status(500).json({
      status: 'error',
      message: 'Database error',
    });
    return;
  }

  // Erro customizado da aplicação
  const statusCode = error.statusCode || 500;
  const errorMessage = error.message || 'Internal server error';

  // Log do erro em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', error);
  }

  res.status(statusCode).json({
    status: 'error',
    message: errorMessage,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};

