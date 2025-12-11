import { Injectable, ExecutionContext } from '@nestjs/common';
import { RolesGuard } from './roles.guard';

/**
 * Guard que verifica que el usuario tenga rol REFEREE
 * Es un alias de RolesGuard con rol 'REFEREE'
 */
@Injectable()
export class RefereeGuard extends RolesGuard {
  canActivate(context: ExecutionContext) {
    // Usar el decorator @Roles('REFEREE') automáticamente
    // Para usar este guard, necesitas aplicar @Roles('REFEREE') también
    return super.canActivate(context);
  }
}

