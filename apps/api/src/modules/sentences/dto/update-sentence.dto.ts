import { PartialType } from '@nestjs/swagger';
import { CreateSentenceDto } from './create-sentence.dto';

export class UpdateSentenceDto extends PartialType(CreateSentenceDto) {}
