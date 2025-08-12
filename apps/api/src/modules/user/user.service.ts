import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../config/env.interface';

@Injectable()
export class UserService {
  constructor(private ConfigService: ConfigService<EnvironmentVariables>) {}
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
     throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }

  findOne(id: number) {
    return this.ConfigService.get('DATABASE_URL');
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.ConfigService.get('REDIS_URL');
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
