import { Logger, Module, ValidationPipe } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

@Module({})
export class SwaggerSetupModule {
  private static readonly logger = new Logger(SwaggerSetupModule.name);

  static forRoot(app: INestApplication): void {
   {
     const config = new DocumentBuilder()
        .setTitle('Typing API')
        .setDescription('Typing应用的API文档')
        .setVersion('1.0')
        .addTag('typing')
        .addBearerAuth({
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: '输入JWT令牌',
          in: 'header',
        }) // 如果需要认证
        .build();

      const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup('doc', app, document);
   }

   {
    // 全局管道
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }))
   }
      
      this.logger.log('Swagger文档已启用，访问地址: http://localhost:3000/doc');
  }
}