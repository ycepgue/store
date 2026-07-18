import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthenticatedRequest } from './jwt-auth.guard';

/**
 * Пускает дальше только пользователей с ролью admin.
 * Использовать ПОСЛЕ JwtAuthGuard (он заполняет request.user):
 *   @UseGuards(JwtAuthGuard, AdminGuard)
 */
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    if (request.user?.role !== 'admin') {
      throw new ForbiddenException('Требуются права администратора');
    }

    return true;
  }
}
