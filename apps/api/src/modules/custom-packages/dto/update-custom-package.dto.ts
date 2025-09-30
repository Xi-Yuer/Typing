import { PartialType } from '@nestjs/swagger';
import { CreateCustomPackageDto } from './create-custom-package.dto';

export class UpdateCustomPackageDto extends PartialType(
  CreateCustomPackageDto
) {}
