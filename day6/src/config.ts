import dotenv from 'dotenv';
dotenv.config();
type AppConfig = {
  port: number;
  db: {
    host: string;
    port: number;
    name: string;
  };
  paths: {
    uploads: string;
    logs: string;
  };
};

export const config = loadConfig();


export function loadConfig(): AppConfig {
  return {
    port: Number(process.env.PORT ?? 3000),
    db: {
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 5432),
      name: process.env.DB_NAME ?? 'myapp',
    },
    paths: {
      uploads: process.env.UPLOAD_PATH ?? './uploads',
      logs:    process.env.LOG_PATH    ?? './logs',
    },
  };
}

