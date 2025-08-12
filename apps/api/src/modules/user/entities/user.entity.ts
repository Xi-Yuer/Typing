import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    @ApiProperty({ description: '用户名' })
    name: string;
    @ApiProperty({ description: '邮箱' })
    @Column({ length: 255, unique: true })
    email: string;  
    @ApiProperty({ description: '密码' })
    @Column({ length: 255 })
    password: string;
    @ApiProperty({ description: '创建时间' })
    createTime: Date;
    @ApiProperty({ description: '更新时间' })
    updateTime: Date;
    @ApiProperty({ description: '删除时间' })
    deleteTime: Date;
}
