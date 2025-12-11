import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { UserRole } from '@wtt/common';

@Injectable()
export class OrganizationGuard implements CanActivate {
  constructor(
    // TODO: Inyectar UserService desde microservicio o servicio compartido
    // Por ahora, necesitaremos crear un servicio en gateway que llame al microservicio
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Del AuthGuard (Clerk)

    if (!user) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    // MASTER puede acceder a todo (sin filtro de org)
    if (user.role === UserRole.MASTER) {
      request.organizationId = undefined; // Sin filtro
      request.userRole = UserRole.MASTER;
      return true;
    }

    // Otros roles deben tener organizationId
    // TODO: Obtener usuario de la BD (llamar a microservicio eventos)
    // Por ahora, asumimos que viene en el token
    // En producción, esto debería venir de la BD

    if (!user.organizationId) {
      throw new ForbiddenException(
        'Usuario no asignado a organización. Contacte al administrador.',
      );
    }

    // Inyectar organizationId en la request
    request.organizationId = user.organizationId;
    request.userRole = user.role;

    return true;
  }
}

