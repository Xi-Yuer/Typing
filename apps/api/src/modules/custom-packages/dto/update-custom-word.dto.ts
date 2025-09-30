import { PartialType } from '@nestjs/swagger';
import { CreateCustomWordDto } from './create-custom-word.dto';

export class UpdateCustomWordDto extends PartialType(CreateCustomWordDto) {}
