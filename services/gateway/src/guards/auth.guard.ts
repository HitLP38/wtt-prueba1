import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  private clerkClient: any;

  constructor() {
    // const clerkSecretKey = process.env.CLERK_SECRET_KEY;
    
    // Por ahora, deshabilitar Clerk para que el gateway pueda iniciar
    // TODO: Configurar Clerk correctamente después
    // Por ahora, deshabilitar Clerk para que el gateway pueda iniciar (modo desarrollo)
    console.warn(
      '⚠️ Autenticación con Clerk deshabilitada temporalmente (modo desarrollo).',
    );
    this.clerkClient = null;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Si Clerk no está configurado, permitir acceso (modo desarrollo)
    if (!this.clerkClient) {
      console.warn('⚠️ Modo desarrollo: Autenticación deshabilitada');
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token de autenticación requerido');
    }

    const token = authHeader.substring(7); // Remover "Bearer "

    try {
      // Verificar token con Clerk
      const payload = await this.clerkClient.verifyToken(token);
      
      // Agregar información del usuario a la request
      request.user = {
        userId: payload.sub,
        sessionId: payload.sid,
        orgId: payload.org_id,
      };

      return true;
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}

