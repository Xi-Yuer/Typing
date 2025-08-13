import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        
        if (!databaseUrl) {
          throw new Error('DATABASE_URL environment variable is not set');
        }

        // 解析数据库 URL
        const url = new URL(databaseUrl);
        
        return {
          type: 'mysql',
          host: url.hostname,
          port: parseInt(url.port) || 3306,
          username: url.username,
          password: url.password,
          database: url.pathname.slice(1), // 移除开头的 '/'
          entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
          synchronize: configService.get('NODE_ENV') === 'development',
          logging: configService.get('NODE_ENV') === 'development' ? ['error','warn'] : false,
          timezone: '+08:00',
          charset: 'utf8mb4',
        };
      },
      inject: [ConfigService],
      dataSourceFactory: async (options: DataSourceOptions) => {
        const dataSource = new DataSource(options);
        return dataSource.initialize();
      },
    }),
  ],
})
export class DatabaseModule {}