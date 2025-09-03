export interface EnvironmentVariables {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  DATABASE_URL: string;
  REDIS_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  GITHUB_CALLBACK_URL: string;
  QQ_CLIENT_ID: string;
  QQ_CLIENT_SECRET: string;
  QQ_CALLBACK_URL: string;
  FRONTEND_URL: string;
  ENABLE_SWAGGER: boolean;
  ENABLE_CORS: boolean;
  VOICE_API_URL: string;
  YOUDAO_APP_KEY: string;
  YOUDAO_APP_SECRET: string;
}
