import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/error.middleware';
import healthRoutes from './routes/health.routes';
import peopleRoutes from './routes/people.routes';
import experienceRoutes from './routes/experience.routes';
import educationRoutes from './routes/education.routes';
import projectsRoutes from './routes/projects.routes';
import contactsRoutes from './routes/contacts.routes';
import socialLinksRoutes from './routes/social-links.routes';
import languagesRoutes from './routes/languages.routes';
import certificationsRoutes from './routes/certifications.routes';

const app: Application = express();

// Middlewares globais
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/people', peopleRoutes);
app.use('/api/v1/experience', experienceRoutes);
app.use('/api/v1/education', educationRoutes);
app.use('/api/v1/projects', projectsRoutes);
app.use('/api/v1/contacts', contactsRoutes);
app.use('/api/v1/social-links', socialLinksRoutes);
app.use('/api/v1/languages', languagesRoutes);
app.use('/api/v1/certifications', certificationsRoutes);

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

