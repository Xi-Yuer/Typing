import { Logger, Module } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

@Module({})
export class SwaggerSetupModule {
  private static readonly logger = new Logger(SwaggerSetupModule.name);

  static forRoot(app: INestApplication): void {
    // 检查是否启用Swagger（开发环境默认启用）
    const enableSwagger = process.env.ENABLE_SWAGGER === 'true' || process.env.NODE_ENV === 'development';
    
    if (enableSwagger) {
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
      SwaggerModule.setup('api', app, document);
      
      this.logger.log('Swagger文档已启用，访问地址: http://localhost:3000/api');
    } else {
      this.logger.log('Swagger文档已禁用');
    }
  }
}