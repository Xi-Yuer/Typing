import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = this.userRepository.create(createUserDto);
      return await this.userRepository.save(user);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException('用户名或邮箱已存在', HttpStatus.CONFLICT);
      }
      throw new HttpException('创建用户失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      where: { isActive: true },
      order: { createTime: 'DESC' },
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id, isActive: true },
    });
    
    if (!user) {
      throw new NotFoundException(`用户 ID ${id} 不存在`);
    }
    
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    
    try {
      Object.assign(user, updateUserDto);
      return await this.userRepository.save(user);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException('用户名或邮箱已存在', HttpStatus.CONFLICT);
      }
      throw new HttpException('更新用户失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.softDelete(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email, isActive: true },
    });
  }

  async findByName(name: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { name, isActive: true },
    });
  }

  async findMe(authHeader: string): Promise<User> {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('无效的授权头');
    }

    const token = authHeader.substring(7); // 移除 'Bearer ' 前缀
    
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.findOne(payload.sub);
      return user;
    } catch (error) {
      throw new UnauthorizedException('无效的令牌');
    }
  }
}
