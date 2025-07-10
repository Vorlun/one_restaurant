import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class BaseAuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateTokens(
    payload: any,
    role: 'super_admin' | 'admin' | 'manager' | 'client',
  ) {
    const accessSecret = process.env[`${role.toUpperCase()}_ACCESS_TOKEN_KEY`];
    const refreshSecret =
      process.env[`${role.toUpperCase()}_REFRESH_TOKEN_KEY`];

    if (!accessSecret || !refreshSecret) {
      throw new Error(`Token secrets not configured for role: ${role}`);
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: accessSecret,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(payload, {
        secret: refreshSecret,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
