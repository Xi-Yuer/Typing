import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SetupModule } from './modules/setup/setup.module';

void (async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  SetupModule.forRoot(app);
  await app.listen(process.env.PORT || 80);
})();
