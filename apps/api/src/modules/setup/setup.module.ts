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
        .setTitle('拼写鸭 API')
        .setDescription('拼写鸭')
        .setVersion('1.0')
        .addBearerAuth({
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: '输入JWT令牌',
          in: 'header'
        }) // 如果需要认证
        .build();

      const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup('/api/doc', app, document);

      // 添加JSON文档端点（跳过速率限制）
      app.use('/api/doc-json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(document);
      });

      this.logger.log(
        `Swagger文档已启用，访问地址: http://localhost:${process.env.BACKEND_PORT}/api/doc`
      );
      this.logger.log(
        `Swagger JSON文档已启用，访问地址: http://localhost:${process.env.BACKEND_PORT}/api/doc-json`
      );
    }

    {
      // 全局管道
      app.useGlobalPipes(
        new ValidationPipe({
          whitelist: true, // 自动删除非白名单属性
          forbidNonWhitelisted: true, // 禁止非白名单属性
          transform: true // 自动转换为DTO类型
        })
      );
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
      // 跨域配置
      app.enableCors({
        origin: [
          'https://keycikeyci.com',
          'https://www.keycikeyci.com',
          'https://admin.keycikeyci.com',
          'http://localhost:3000',
          'http://localhost:8080'
        ],
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
        allowedHeaders: [
          'Origin',
          'X-Requested-With',
          'Content-Type',
          'Accept',
          'Authorization',
          'Cache-Control',
          'Pragma'
        ],
        credentials: true,
        preflightContinue: false,
        optionsSuccessStatus: 204
      });
    }
  }
}
