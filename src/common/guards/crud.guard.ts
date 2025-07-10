import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from '../../users/users.service';

@Injectable()
export class CrudGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: any = context.switchToHttp().getRequest();
    const user = req.user;
    const method = req.method;
    const paramId = req.params.id ? +req.params.id : null;
    const bodyRole = req.body?.role?.toLowerCase();

    if (user?.role === 'super_admin') return true;

    if (method === 'POST') {
      if (['admin', 'super_admin'].includes(bodyRole)) {
        throw new ForbiddenException(
          'You are not allowed to create admin or super_admin users.',
        );
      }
      return true;
    }

    if (method === 'GET' && !paramId) {
      if (user?.role === 'admin') return true;
      throw new ForbiddenException('You are not allowed to view all users.');
    }

    if (paramId && ['GET', 'PATCH'].includes(method)) {
      if (!user) throw new ForbiddenException('Authentication required.');

      const targetUser = await this.usersService.findOne(paramId);
      if (!targetUser) throw new ForbiddenException('User not found.');

      if (user.role === 'admin') {
        if (user.id === targetUser.id) return true;
        if (['manager', 'client'].includes(targetUser.role)) return true;
        throw new ForbiddenException('Access denied.');
      }

      if (['manager', 'client'].includes(user.role)) {
        if (user.id === targetUser.id) return true;
        throw new ForbiddenException('You can only access your own data.');
      }

      throw new ForbiddenException('Access denied.');
    }

    if (method === 'DELETE' && paramId) {
      const targetUser = await this.usersService.findOne(paramId);
      if (!targetUser) {
        throw new ForbiddenException('User not found.');
      }
      if (targetUser.role === 'admin') {
        throw new ForbiddenException('Admin users cannot be deleted.');
      }
      if (['manager', 'client'].includes(user?.role)) {
        if (user.id !== paramId) {
          throw new ForbiddenException('You can only delete your own account.');
        }
        return true;
      }
      throw new ForbiddenException('Access denied.');
    }
      

    throw new ForbiddenException('Access denied.');
  }
}
