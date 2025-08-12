import { Injectable } from '@nestjs/common';
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
    return `This action returns all user`;
  }

  findOne(id: number) {
    return this.ConfigService.get('DATABASE_URL');
  }

  // development
  update(id: number, updateUserDto: UpdateUserDto) {
    return this.ConfigService.get('REDIS_URL');
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
