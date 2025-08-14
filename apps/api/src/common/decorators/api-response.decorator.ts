import { applyDecorators, Type } from '@nestjs/common';
import { ApiResponse, ApiResponseOptions, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { ApiResponseDto, PaginationResponseDto } from '../dto/api-response.dto';

/**
 * 统一成功响应装饰器
 */
export function ApiSuccessResponse<T>(
  dataType?: Type<T> | Function | [Function] | string,
  options?: Omit<ApiResponseOptions, 'type' | 'status'>
) {
  if (!dataType) {
    return applyDecorators(
      ApiResponse({
        status: 200,
        description: options?.description || '操作成功',
        type: ApiResponseDto,
        ...options,
      })
    );
  }

  if (Array.isArray(dataType)) {
    const itemType = dataType[0] as Type<T>;
    return applyDecorators(
      ApiExtraModels(ApiResponseDto, itemType),
      ApiResponse({
        status: 200,
        description: options?.description || '操作成功',
        schema: {
          allOf: [
            { $ref: getSchemaPath(ApiResponseDto) },
            {
              properties: {
                data: {
                  type: 'array',
                  items: { $ref: getSchemaPath(itemType) },
                },
              },
            },
          ],
        },
        ...options,
      })
    );
  }

  return applyDecorators(
    ApiExtraModels(ApiResponseDto, dataType as Type<T>),
    ApiResponse({
      status: 200,
      description: options?.description || '操作成功',
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseDto) },
          {
            properties: {
              data: { $ref: getSchemaPath(dataType as Type<T>) },
            },
          },
        ],
      },
      ...options,
    })
  );
}

/**
 * 统一创建响应装饰器
 */
export function ApiCreatedResponse<T>(
  dataType?: Type<T> | Function | [Function] | string,
  options?: Omit<ApiResponseOptions, 'type' | 'status'>
) {
  if (!dataType) {
    return applyDecorators(
      ApiResponse({
        status: 201,
        description: options?.description || '创建成功',
        type: ApiResponseDto,
        ...options,
      })
    );
  }

  return applyDecorators(
    ApiExtraModels(ApiResponseDto, dataType as Type<T>),
    ApiResponse({
      status: 201,
      description: options?.description || '创建成功',
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseDto) },
          {
            properties: {
              data: { $ref: getSchemaPath(dataType as Type<T>) },
            },
          },
        ],
      },
      ...options,
    })
  );
}

/**
 * 统一分页响应装饰器
 */
export function ApiPaginationResponse<T>(
  dataType: Type<T> | Function,
  options?: Omit<ApiResponseOptions, 'type' | 'status'>
) {
  return applyDecorators(
    ApiExtraModels(PaginationResponseDto, dataType as Type<T>),
    ApiResponse({
      status: 200,
      description: options?.description || '查询成功',
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginationResponseDto) },
          {
            properties: {
              data: {
                properties: {
                  list: {
                    type: 'array',
                    items: { $ref: getSchemaPath(dataType as Type<T>) },
                  },
                },
              },
            },
          },
        ],
      },
      ...options,
    })
  );
}

/**
 * 统一错误响应装饰器
 */
export function ApiErrorResponse(
  status: number,
  description: string,
  options?: Omit<ApiResponseOptions, 'type' | 'status' | 'description'>
) {
  return applyDecorators(
    ApiResponse({
      status,
      description,
      type: ApiResponseDto,
      ...options,
    })
  );
}