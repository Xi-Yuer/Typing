import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomPackagesService } from './custom-packages.service';
import { CustomPackagesController } from './custom-packages.controller';
import { CustomPackage } from './entities/custom-package.entity';
import { CustomWord } from './entities/custom-word.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([CustomPackage, CustomWord]), UserModule],
  controllers: [CustomPackagesController],
  providers: [CustomPackagesService],
  exports: [CustomPackagesService]
})
export class CustomPackagesModule {}
