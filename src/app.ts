import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/error.middleware';
import healthRoutes from './routes/health.routes';

const app: Application = express();

// Middlewares globais
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api/v1/health', healthRoutes);

// Rota raiz
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'Currículo Express API',
    version: '1.0.0',
    status: 'running',
  });
});

// Middleware de erro (deve ser o último)
app.use(errorHandler);

export default app;

