import { Injectable, ExecutionContext } from '@nestjs/common';
import { RolesGuard } from './roles.guard';

/**
 * Guard que verifica que el usuario tenga rol ADMIN
 * Es un alias de RolesGuard con rol 'ADMIN'
 */
@Injectable()
export class AdminGuard extends RolesGuard {
  canActivate(context: ExecutionContext) {
    // Usar el decorator @Roles('ADMIN') automáticamente
    // Para usar este guard, necesitas aplicar @Roles('ADMIN') también
    return super.canActivate(context);
  }
}

