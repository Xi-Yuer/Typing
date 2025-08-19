import { PartialType } from '@nestjs/swagger';
import { CreateSpeechDto } from './create-speech.dto';

export class UpdateSpeechDto extends PartialType(CreateSpeechDto) {}
