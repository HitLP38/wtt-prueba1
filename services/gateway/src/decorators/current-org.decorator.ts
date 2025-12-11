import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator para extraer organizationId de la request
 * Debe usarse después de OrganizationGuard
 */
export const CurrentOrg = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string | undefined => {
    const request = ctx.switchToHttp().getRequest();
    return request.organizationId; // Inyectado por OrganizationGuard
  },
);

/**
 * Decorator para extraer userRole de la request
 */
export const CurrentUserRole = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string | undefined => {
    const request = ctx.switchToHttp().getRequest();
    return request.userRole; // Inyectado por OrganizationGuard
  },
);

