import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userRepo: typeof User) {}

  async create(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 7);
    const activation_link = uuidv4();
    const user = await this.userRepo.create({
      ...dto,
      password: hashedPassword,
      activation_link,
      is_verified: dto.role === 'admin' || dto.role === 'super_admin' ? true : false,
    });
    return user;
  }

  async findAll(user: User) {
    if (user.role === 'super_admin') {
      return this.userRepo.findAll();
    }
    if (user.role === 'admin') {
      return this.userRepo.findAll({
        where: {
          role: ['manager', 'client'],
        },
      });
    }
    throw new ForbiddenException('You are not allowed to get all users');
  }

  async findOne(id: number) {
    const user = await this.userRepo.findByPk(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findUserByEmail(email: string) {
    return this.userRepo.findOne({ where: { email } });
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.findOne(id);
    return user.update(dto);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    return user.destroy();
  }

  async activateUser(activation_link: string) {
    const user = await this.userRepo.findOne({
      where: { activation_link },
    });

    if (!user) {
      throw new NotFoundException('Activation link invalid');
    }

    user.is_verified = true;
    user.activation_link = null;
    await user.save();

    return { message: 'Account activated successfully' };
  }

  async updateRefreshToken(id: number, refreshToken: string) {
    const user = await this.findOne(id);
    user.refresh_token = refreshToken;
    await user.save();
  }

  async findUserByActivationLink(activation_link: string) {
    const user = await this.userRepo.findOne({ where: { activation_link } });
    return user;
  }
}
