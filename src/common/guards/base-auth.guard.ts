import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class BaseAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request & { user?: any } = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header not found');
    }

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid token format');
    }

    let decoded: any;
    try {
      decoded = this.jwtService.decode(token);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    if (!decoded || !decoded.role) {
      throw new ForbiddenException('Role not found in token');
    }

    const roleKey = decoded.role.toUpperCase();
    const secret = process.env[`${roleKey}_ACCESS_TOKEN_KEY`];

    if (!secret) {
      throw new ForbiddenException(
        `Token secret not configured for role: ${decoded.role}`,
      );
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, { secret });
      req.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
