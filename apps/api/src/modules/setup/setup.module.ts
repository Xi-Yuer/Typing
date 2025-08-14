import { Logger, Module, ValidationPipe } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from '../../common/interceptors/response.interceptor';
import { HttpExceptionFilter } from '../../common/filters/http-exception.filter';
import { Reflector } from '@nestjs/core';

@Module({})
export class SetupModule {
  private static readonly logger = new Logger(SetupModule.name);

  static forRoot(app: INestApplication): void {
   {
     const config = new DocumentBuilder()
        .setTitle('Typing API')
        .setDescription('Typing应用的API文档')
        .setVersion('1.0')
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
      this.logger.log('Swagger文档已启用，访问地址: http://localhost:3000/doc');
   }

   {
    // 全局管道
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true, // 自动删除非白名单属性
      forbidNonWhitelisted: true, // 禁止非白名单属性
      transform: true, // 自动转换为DTO类型
    }));
   }

   {
    // 全局响应拦截器
    app.useGlobalInterceptors(new ResponseInterceptor(app.get(Reflector)));
   }

   {
    // 全局异常过滤器
    app.useGlobalFilters(new HttpExceptionFilter());
   }

   {
    // 跨域
    app.enableCors({
      origin: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });
   }
  }
}