import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponseDto } from '../dto/api-response.dto';

/**
 * HTTP异常过滤器 - 统一处理异常响应格式
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = '服务器内部错误';
    let details: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || responseObj.error || message;
        details = responseObj.details || responseObj.message;
        
        // 处理验证错误
        if (Array.isArray(responseObj.message)) {
          message = '请求参数验证失败';
          details = responseObj.message;
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      details = exception.stack;
    }

    // 记录错误日志
    this.logger.error(`HTTP Exception: ${status} - ${message}`);

    // 构造错误响应
    const errorResponse = {
      code: status,
      message,
      data: details,
      timestamp: Date.now(),
      path: request.url,
    };

    response.status(status).json(errorResponse);
  }
}