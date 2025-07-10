import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ReservationService } from '../../reservation/reservation.service';

@Injectable()
export class ReservationGuard implements CanActivate {
  constructor(private readonly reservationService: ReservationService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    const method = req.method;
    const { id } = req.params;
    const body = req.body;

    if (['admin', 'super_admin'].includes(user.role)) {
      return true;
    }

    if (method === 'POST' && !id) {
      if (user.role === 'manager') {
        if (!body.restaurant_id) {
          throw new ForbiddenException('Restaurant ID is required.');
        }
        const restaurant = await this.reservationService.getRestaurantById(
          body.restaurant_id,
        );
        if (!restaurant) throw new NotFoundException('Restaurant not found.');
        if (restaurant.manager_id !== user.id) {
          throw new ForbiddenException(
            'You can only create reservations for your restaurant.',
          );
        }
        return true;
      }
      if (user.role === 'client') {
        if (body.user_id !== user.id) {
          throw new ForbiddenException(
            'You can only create reservations for yourself.',
          );
        }
        return true;
      }
      throw new ForbiddenException(
        'You are not allowed to create reservations.',
      );
    }

    if (method === 'GET' && !id) {
      if (user.role === 'manager') return true;
      throw new ForbiddenException(
        'You are not allowed to view all reservations.',
      );
    }

    const reservationId = parseInt(id, 10);
    if (!reservationId) {
      throw new ForbiddenException('Reservation ID is required.');
    }

    const reservation = await this.reservationService.findOneRaw(reservationId);
    if (!reservation) throw new NotFoundException('Reservation not found.');

    if (user.role === 'manager') {
      if (
        !reservation.restaurant ||
        reservation.restaurant.manager_id !== user.id
      ) {
        throw new ForbiddenException(
          'You can only manage reservations of your restaurant.',
        );
      }
      return true;
    }

    if (user.role === 'client') {
      if (reservation.user_id !== user.id) {
        throw new ForbiddenException(
          'You can only manage your own reservations.',
        );
      }
      return true;
    }

    throw new ForbiddenException(
      'You do not have permission to perform this action.',
    );
  }
}
