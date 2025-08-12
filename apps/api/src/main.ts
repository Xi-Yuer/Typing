import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerSetupModule } from './modules/swagger/swagger.module';

(async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  SwaggerSetupModule.forRoot(app);
  await app.listen(process.env.PORT ?? 3000);
})()
