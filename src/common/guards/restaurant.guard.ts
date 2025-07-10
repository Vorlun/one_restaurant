import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RestaurantsService } from '../../restaurant/restaurant.service';

@Injectable()
export class RestaurantGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly restaurantService: RestaurantsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: any = context.switchToHttp().getRequest();
    const user = req.user;
    const method = req.method;
    const paramId = req.params.id ? +req.params.id : null;
    const body = req.body;

    if (user?.role === 'super_admin') return true;

    if (method === 'GET') {
      return true;
    }

    if (['POST', 'PATCH', 'DELETE'].includes(method)) {
      if (!['admin', 'manager'].includes(user?.role)) {
        throw new ForbiddenException(
          'Only admin or manager can perform this action on restaurants.',
        );
      }

      if (user.role === 'admin') return true;

      if (user.role === 'manager') {
        if (method === 'POST' && !paramId) {
          return true;
        }

        const restaurantId =
          method === 'DELETE' ? paramId : (body.restaurant_id ?? paramId);
        if (!restaurantId) {
          throw new ForbiddenException(
            'Restaurant ID is required for this action.',
          );
        }

        const restaurant =
          await this.restaurantService.findOneRaw(restaurantId);
        if (!restaurant) {
          throw new NotFoundException('Restaurant not found.');
        }

        if (restaurant.manager_id !== user.id) {
          throw new ForbiddenException(
            'You can only manage your own restaurants.',
          );
        }

        return true;
      }
    }

    throw new ForbiddenException('Access denied.');
  }
}
