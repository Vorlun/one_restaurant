import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { BaseAuthService } from './base-auth.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { SigninUserDto } from '../users/dto/signin-user.dto';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { MailService } from '../mail/mail.service';

@Injectable()
export class UserAuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly baseAuthService: BaseAuthService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async signup(dto: CreateUserDto) {
    const candidate = await this.usersService.findUserByEmail(
      dto.email.toLowerCase(),
    );
    if (candidate) throw new ConflictException('User already exists');

    const user = await this.usersService.create({
      ...dto,
      email: dto.email.toLowerCase(),
    });

    try {
      if (user.role === 'manager' || user.role === 'client') {
        await this.mailService.sendActivationMail(user);
      }
    } catch (error) {
      throw new ServiceUnavailableException(
        'Verification sending failed, try again later',
      );
    }

    return {
      message: 'Registered successfully, please verify your account',
      user,
    };
  }

  async signin(dto: SigninUserDto, res: Response) {
    const user = await this.usersService.findUserByEmail(
      dto.email.toLowerCase(),
    );
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid email or password');

    if (!user.is_verified && user.role !== 'admin') {
      throw new ForbiddenException('Please verify your account before login');
    }

    const payload = { id: user.id, role: user.role, email: user.email };

    const { accessToken, refreshToken } =
      await this.baseAuthService.generateTokens(payload, user.role);

    user.refresh_token = await bcrypt.hash(refreshToken, 7);
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: +process.env.COOKIE_TIME!,
      secure: true,
      sameSite: 'strict',
    });    

    return { message: 'Signed in successfully', id: user.id, accessToken };
  }

  async refreshToken(
    userId: number,
    refreshTokenFromCookie: string,
    res: Response,
  ) {
    if (!refreshTokenFromCookie)
      throw new UnauthorizedException('Refresh token missing');

    let payload: any;
    let decoded: any;

    try {
      decoded = this.jwtService.decode(refreshTokenFromCookie);
      if (!decoded || !decoded.role)
        throw new UnauthorizedException('Invalid refresh token');

      const secret =
        process.env[`${decoded.role.toUpperCase()}_REFRESH_TOKEN_KEY`] ||
        process.env.USER_REFRESH_TOKEN_KEY;

      payload = await this.jwtService.verifyAsync(refreshTokenFromCookie, {
        secret,
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (userId !== payload.id) throw new ForbiddenException('Forbidden');

    const user = await this.usersService.findOne(userId);
    if (!user) throw new NotFoundException('User not found');

    const isMatch = await bcrypt.compare(
      refreshTokenFromCookie,
      user.refresh_token ?? '',
    );
    if (!isMatch) throw new UnauthorizedException('Invalid refresh token');

    const cleanPayload = { id: user.id, role: user.role, email: user.email };

    const { accessToken, refreshToken } =
      await this.baseAuthService.generateTokens(cleanPayload, user.role);

    user.refresh_token = await bcrypt.hash(refreshToken, 7);
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: +process.env.COOKIE_TIME!,
      secure: true,
      sameSite: 'strict',
    });    

    return { accessToken, message: 'Token refreshed successfully' };
  }

  async signout(userId: number, res: Response) {
    const user = await this.usersService.findOne(userId);
    if (!user) throw new NotFoundException('User not found');

    user.refresh_token = null;
    await user.save();

    res.clearCookie('refreshToken');

    return { message: 'Signed out successfully' };
  }

  async activate(activation_link: string) {
    return this.usersService.activateUser(activation_link);
  }
}
