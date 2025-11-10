import dotenv from 'dotenv';

dotenv.config();

// Validação e configuração das variáveis de ambiente
const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key];
  if (value) {
    return value;
  }
  if (defaultValue !== undefined) {
    return defaultValue;
  }
  throw new Error(`Variável de ambiente ${key} não encontrada`);
};

export const config = {
  port: parseInt(getEnvVar('PORT', '3000'), 10),
  nodeEnv: getEnvVar('NODE_ENV', 'development'),
  databaseUrl: getEnvVar('DATABASE_URL'),
  databaseUrlTest: getEnvVar('DATABASE_URL_TEST', ''),
  apiSecretKey: getEnvVar('API_SECRET_KEY'),
};

