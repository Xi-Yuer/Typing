import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSettings } from './entities/user-settings.entity';
import { UserSettingsService } from './user-settings.service';
import { UserSettingsController } from './user-settings.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserSettings])],
  controllers: [UserSettingsController],
  providers: [UserSettingsService],
  exports: [UserSettingsService]
})
export class UserSettingsModule {}
