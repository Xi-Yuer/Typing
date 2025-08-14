import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponseDto } from '../dto/api-response.dto';
import { Reflector } from '@nestjs/core';

import { SetMetadata } from '@nestjs/common';

/**
 * 跳过响应包装的装饰器
 */
export const SKIP_RESPONSE_WRAPPER = 'skipResponseWrapper';
export const SkipResponseWrapper = () => SetMetadata(SKIP_RESPONSE_WRAPPER, true);

/**
 * 响应拦截器 - 统一包装响应格式
 */
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponseDto<T>> {
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponseDto<T>> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    
    // 检查是否跳过响应包装
    const skipWrapper = this.reflector.getAllAndOverride<boolean>(
      SKIP_RESPONSE_WRAPPER,
      [context.getHandler(), context.getClass()],
    );

    if (skipWrapper) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        // 如果数据已经是 ApiResponseDto 格式，直接返回
        if (data instanceof ApiResponseDto) {
          return data;
        }

        // 获取响应状态码
        const statusCode = response.statusCode || 200;
        
        // 根据状态码设置默认消息
        let message = '操作成功';
        if (statusCode === 201) {
          message = '创建成功';
        } else if (statusCode === 204) {
          message = '删除成功';
        }

        // 包装响应数据
        return ApiResponseDto.success(
          data,
          message,
          request.url
        );
      }),
    );
  }
}