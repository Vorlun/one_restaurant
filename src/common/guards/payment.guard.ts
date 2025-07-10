import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PaymentGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (!user) throw new ForbiddenException('Unauthorized');

    const method = context.getHandler().name;

    const allowedForAdmin = [
      'create',
      'findAll',
      'findOne',
      'update',
      'remove',
    ];
    const allowedForManager = ['create','findAll', 'findOne', 'update'];
    const allowedForClient = ['create', 'findAll', 'findOne'];

    if (['admin', 'super_admin'].includes(user.role)) {
      return allowedForAdmin.includes(method);
    }

    if (user.role === 'manager') {
      if (!allowedForManager.includes(method)) {
        throw new ForbiddenException(
          'Managers are not allowed to perform this action.',
        );
      }
      return true;
    }

    if (user.role === 'client') {
      if (!allowedForClient.includes(method)) {
        throw new ForbiddenException(
          'Clients are not allowed to perform this action.',
        );
      }
      return true;
    }

    throw new ForbiddenException('Role is not allowed to access payment.');
  }
}
