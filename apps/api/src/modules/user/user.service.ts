import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, AdminUpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import { PaginationResponseDto } from '@/common/dto/api-response.dto';

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

  async findPaginated(query: PaginationQueryDto): Promise<PaginationResponseDto<User>> {
    const { page = 1, pageSize = 10 } = query;
    const skip = (page - 1) * pageSize;
    
    const [list, total] = await this.userRepository.findAndCount({
      where: { isActive: true },
      skip,
      take: pageSize,
      order: { createTime: 'DESC' },
    });
    
    return new PaginationResponseDto<User>(list, total, page, pageSize);
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

  async adminUpdate(id: number, adminUpdateUserDto: AdminUpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    
    try {
      Object.assign(user, adminUpdateUserDto);
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
      select: ['id', 'name', 'email','role','status', 'password','isActive','createTime','updateTime','deleteTime'],
    });
  }

  async findByName(name: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { name, isActive: true },
    });
  }

  async findMe(user: User): Promise<User> {
    if (!user) {
      throw new UnauthorizedException('无效的授权头');
    }

    try {
      const userInfo = await this.findOne(user.id);
      return userInfo;
    } catch (error) {
      throw new UnauthorizedException('无效的令牌');
    }
  }
}
