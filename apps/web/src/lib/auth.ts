import { auth, currentUser } from '@clerk/nextjs/server';
import { UserRole } from '@wtt/common';

/**
 * Obtiene el usuario actual desde Clerk
 */
export async function getCurrentUser() {
  const user = await currentUser();
  return user;
}

/**
 * Obtiene la sesión actual
 */
export async function getSession() {
  const session = await auth();
  return session;
}

/**
 * Verifica si el usuario tiene un rol específico
 * Los roles vienen de los metadata públicos de Clerk
 */
export async function hasRole(requiredRole: UserRole): Promise<boolean> {
  const user = await getCurrentUser();
  
  if (!user) return false;

  // Obtener el rol del usuario desde los metadata públicos de Clerk
  const userRole = user.publicMetadata?.role as UserRole | undefined;
  
  // MASTER tiene acceso a todo
  if (userRole === UserRole.MASTER) return true;

  return userRole === requiredRole;
}

/**
 * Verifica si el usuario tiene alguno de los roles requeridos
 */
export async function hasAnyRole(requiredRoles: UserRole[]): Promise<boolean> {
  const user = await getCurrentUser();
  
  if (!user) return false;

  const userRole = user.publicMetadata?.role as UserRole | undefined;
  
  if (userRole === UserRole.MASTER) return true;

  return requiredRoles.includes(userRole as UserRole);
}

/**
 * Verifica si el usuario es ADMIN o MASTER
 * Los ADMINs deben estar habilitados por un MASTER en el backend
 */
export async function isAdminOrMaster(): Promise<boolean> {
  return hasAnyRole([UserRole.ADMIN, UserRole.MASTER]);
}

/**
 * Obtiene el organizationId del usuario desde Clerk
 */
export async function getUserOrganizationId(): Promise<string | null> {
  const user = await getCurrentUser();
  
  if (!user) return null;

  // Obtener organizationId desde los metadata públicos o privados
  const orgId = 
    (user.publicMetadata?.organizationId as string) ||
    (user.privateMetadata?.organizationId as string) ||
    null;

  return orgId;
}

