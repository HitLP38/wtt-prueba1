# 🏗️ Arquitectura Multi-Tenant Optimizada + Roles Jerárquicos

## 🎯 **VISIÓN COMPLETA**

### **Roles y Jerarquía:**

```
MASTER (Super Admin)
  └─ Puede crear/habilitar organizaciones
  └─ Asigna administradores a organizaciones
  └─ Ve todo el sistema (analytics global)
  
ADMIN (Administrador de Organización)
  └─ Gestiona eventos de SU organización
  └─ Gestiona árbitros de SU organización
  └─ No puede ver datos de otras organizaciones
  
REFEREE (Árbitro)
  └─ Ve solo eventos asignados
  └─ Gestiona partidos asignados
  └─ Acceso limitado por evento
  
COACH/TEAM_REPRESENTATIVE
  └─ Ve solo sus equipos
  └─ Configura orden de jugadores
  └─ Ve partidos de sus equipos
```

---

## 🔒 **AISLAMIENTO TOTAL - MULTI-TENANT**

### **Identificador Único por Organización:**

```typescript
Organization {
  id: UUID (primary key)
  slug: string (único, ej: "club-real-lima-2025")
  organizationCode: string (único, ej: "CRL-2025-ABC123")
  
  // Este código se usa para:
  // - Separar datos en queries
  // - URLs únicas
  // - Identificación visual
}
```

### **Estrategia de Aislamiento:**

**Nivel 1: Row-Level Security (RLS)**
- Todos los queries incluyen `WHERE organizationId = :orgId`
- Nunca hacer queries sin filtrar por organización

**Nivel 2: Middleware/Guards**
- `OrganizationGuard` extrae `organizationId` del token
- Valida que el usuario pertenezca a esa organización
- Bloquea acceso si no coincide

**Nivel 3: Índices Optimizados**
- Índice compuesto: `(organizationId, id)` en todas las tablas
- Índice en `organizationId` solo para queries rápidas

---

## 👥 **SISTEMA DE ROLES Y PERMISOS**

### **Entidad: User (Usuario del Sistema)**

```typescript
@Entity('users')
@Index(['clerkId'], { unique: true })
@Index(['organizationId']) // Índice crítico para queries
@Index(['organizationId', 'role']) // Búsqueda por org y rol
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  clerkId!: string; // ID de Clerk

  @Column({ nullable: true })
  organizationId?: string; // FK a Organization (null si es MASTER)

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  role!: UserRole; // MASTER | ADMIN | REFEREE | COACH | VIEWER

  @Column()
  email!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ default: true })
  isActive!: boolean;

  // Permisos específicos (JSONB para flexibilidad)
  @Column({ type: 'jsonb', nullable: true })
  permissions?: {
    canCreateEvents?: boolean;
    canManageReferees?: boolean;
    canManageMatches?: boolean;
    canExportPDF?: boolean;
    // ... más permisos granulares
  };

  @Column({ nullable: true })
  invitedBy?: string; // ID del MASTER que lo invitó

  @Column({ nullable: true })
  lastLoginAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
```

### **Enum de Roles:**

```typescript
export enum UserRole {
  MASTER = 'MASTER',           // Super admin del sistema
  ADMIN = 'ADMIN',             // Admin de una organización
  REFEREE = 'REFEREE',         // Árbitro
  COACH = 'COACH',             // Entrenador/Representante de equipo
  VIEWER = 'VIEWER',           // Solo lectura
}
```

---

## 🛡️ **GUARDS Y MIDDLEWARE**

### **1. OrganizationGuard**

```typescript
@Injectable()
export class OrganizationGuard implements CanActivate {
  constructor(
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Del AuthGuard (Clerk)
    
    // MASTER puede acceder a todo (sin filtro de org)
    if (user.role === UserRole.MASTER) {
      request.organizationId = undefined; // Sin filtro
      return true;
    }

    // Otros roles deben tener organizationId
    const dbUser = await this.userService.findByClerkId(user.clerkId);
    
    if (!dbUser || !dbUser.organizationId) {
      throw new ForbiddenException('Usuario no asignado a organización');
    }

    // Inyectar organizationId en la request
    request.organizationId = dbUser.organizationId;
    request.userRole = dbUser.role;
    
    return true;
  }
}
```

### **2. RoleGuard (Actualizado)**

```typescript
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userRole = request.userRole;

    // MASTER tiene acceso a todo
    if (userRole === UserRole.MASTER) {
      return true;
    }

    return requiredRoles.includes(userRole);
  }
}
```

### **3. Decorator: @CurrentOrg()**

```typescript
export const CurrentOrg = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.organizationId; // Inyectado por OrganizationGuard
  },
);
```

**Uso en Controllers:**
```typescript
@Get('events')
async getEvents(@CurrentOrg() organizationId: string) {
  // organizationId ya está validado y filtrado
  return this.eventsService.findAll(organizationId);
}
```

---

## ⚡ **OPTIMIZACIONES DE RENDIMIENTO**

### **1. Índices de Base de Datos**

```sql
-- En TODAS las tablas relacionadas con organización
CREATE INDEX idx_events_organization_id ON events(organization_id);
CREATE INDEX idx_events_org_active ON events(organization_id, is_active) 
  WHERE is_active = true;

-- Índices compuestos para queries comunes
CREATE INDEX idx_referees_org_active ON referees(organization_id, is_active);
CREATE INDEX idx_tables_event_org ON tables(event_id, organization_id);
CREATE INDEX idx_matches_event_org_status ON matches(event_id, organization_id, status);

-- Índices para búsquedas frecuentes
CREATE INDEX idx_templates_org_category ON configuration_templates(organization_id, category, is_active);
CREATE INDEX idx_users_org_role ON users(organization_id, role) WHERE is_active = true;
```

### **2. Queries Optimizados**

```typescript
// ❌ MAL: Query sin índice
async findAll() {
  return this.repository.find();
}

// ✅ BIEN: Query con filtro por organización
async findAll(organizationId: string) {
  return this.repository.find({
    where: { organizationId }, // Usa índice
    relations: ['category'], // Solo si es necesario
  });
}

// ✅ MEJOR: Query con select específico (menos datos)
async findAll(organizationId: string) {
  return this.repository.find({
    where: { organizationId, isActive: true },
    select: ['id', 'name', 'startDate'], // Solo campos necesarios
    order: { createdAt: 'DESC' },
    take: 50, // Paginación
  });
}
```

### **3. Caching Estratégico**

```typescript
// Cache por organización (Redis)
@Injectable()
export class EventsService {
  async findAll(organizationId: string) {
    const cacheKey = `events:org:${organizationId}`;
    
    // Intentar cache primero
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    // Si no hay cache, query a BD
    const events = await this.repository.find({
      where: { organizationId },
    });

    // Guardar en cache (TTL: 5 minutos)
    await this.redis.setex(cacheKey, 300, JSON.stringify(events));
    
    return events;
  }

  async invalidateCache(organizationId: string) {
    await this.redis.del(`events:org:${organizationId}`);
  }
}
```

### **4. Paginación Obligatoria**

```typescript
// Siempre paginar listas grandes
@Get('events')
async getEvents(
  @CurrentOrg() organizationId: string,
  @Query('page') page: number = 1,
  @Query('limit') limit: number = 20,
) {
  return this.eventsService.findAllPaginated(
    organizationId,
    page,
    Math.min(limit, 100), // Máximo 100 por página
  );
}
```

### **5. Conexiones de BD Optimizadas**

```typescript
// TypeORM config con connection pooling
TypeOrmModule.forRoot({
  // ...
  extra: {
    max: 20, // Máximo 20 conexiones
    min: 5,  // Mínimo 5 conexiones
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  },
})
```

---

## 📊 **ESTRUCTURA DE DATOS OPTIMIZADA**

### **Relaciones con Índices:**

```
Organization (1)
  ├─ id: UUID (PRIMARY KEY)
  ├─ slug: string (UNIQUE INDEX)
  └─ organizationCode: string (UNIQUE INDEX)

User (N)
  ├─ id: UUID
  ├─ organizationId: UUID (INDEX)
  ├─ role: UserRole (INDEX compuesto: orgId + role)
  └─ clerkId: string (UNIQUE INDEX)

Event (N)
  ├─ id: UUID
  ├─ organizationId: UUID (INDEX compuesto: orgId + isActive)
  └─ ...

Referee (N)
  ├─ id: UUID
  ├─ organizationId: UUID (INDEX compuesto: orgId + isActive)
  └─ ...

Table (N)
  ├─ id: UUID
  ├─ eventId: UUID
  ├─ organizationId: UUID (INDEX, derivado de Event)
  └─ ...
```

---

## 🐳 **DOCKER - ¿SÍ O NO?**

### **Análisis Actual:**

**Estado:** No veo Docker configurado actualmente. Estás usando:
- PM2 para procesos
- Servicios ejecutándose directamente en Node.js
- PostgreSQL y Redis como servicios del sistema

### **Recomendación: Docker SÍ** ✅

**Ventajas para tu caso:**

1. **Aislamiento:**
   - Cada servicio en su propio contenedor
   - No interfiere con otros procesos del VPS
   - Fácil rollback si algo falla

2. **Escalabilidad:**
   - Escalar servicios independientemente
   - Ejemplo: Si `matches` tiene mucho tráfico, escalar solo ese servicio

3. **Consistencia:**
   - Mismo ambiente en desarrollo, staging, producción
   - No más "funciona en mi máquina"

4. **Mantenimiento:**
   - Actualizar servicios sin afectar otros
   - Reiniciar un servicio sin afectar el sistema completo

5. **Multi-Tenant:**
   - Si en el futuro quieres separar organizaciones por contenedores (enterprise), es más fácil

**Estructura sugerida:**

```
docker-compose.yml
├─ postgres (base de datos)
├─ redis (cache/message bus)
├─ gateway (API Gateway)
├─ eventos (microservicio)
├─ matches (microservicio)
├─ teams (microservicio)
├─ referees (microservicio)
└─ nginx (reverse proxy, load balancer)
```

**Migración gradual:**
1. Empezar con servicios stateless (gateway, microservicios)
2. Dejar PostgreSQL y Redis como servicios del sistema (por ahora)
3. O containerizar todo para máximo aislamiento

---

## 🚀 **PLAN DE IMPLEMENTACIÓN ACTUALIZADO**

### **FASE 1: Base Multi-Tenant + Roles** (CRÍTICA)

1. ✅ Crear entidad `Organization`
2. ✅ Crear entidad `User` (con roles)
3. ✅ Agregar `organizationId` a todas las entidades
4. ✅ Crear `OrganizationGuard`
5. ✅ Crear `RoleGuard` mejorado
6. ✅ Crear decorator `@CurrentOrg()`
7. ✅ Agregar índices a todas las tablas
8. ✅ Actualizar todos los servicios para filtrar por `organizationId`

**Optimizaciones incluidas:**
- Índices en todas las queries
- Caching estratégico (Redis)
- Paginación en todas las listas

---

## 📋 **PRÓXIMOS PASOS INMEDIATOS**

1. **Crear entidades base:**
   - `Organization`
   - `User` (con roles MASTER, ADMIN, etc.)

2. **Crear guards:**
   - `OrganizationGuard`
   - `RoleGuard` actualizado

3. **Agregar índices:**
   - Script SQL con todos los índices necesarios

4. **Docker (opcional pero recomendado):**
   - Crear `Dockerfile` para cada servicio
   - Crear `docker-compose.yml`

---

## ⚠️ **REGLAS DE ORO PARA RENDIMIENTO**

1. **Nunca hacer queries sin filtrar por `organizationId`**
2. **Siempre usar índices en queries frecuentes**
3. **Paginación obligatoria en listas (>20 items)**
4. **Cachear datos estáticos o semiestáticos (eventos, plantillas)**
5. **Limitar relaciones en queries (usar `select` específico)**
6. **Connection pooling configurado correctamente**
7. **Logs optimizados (solo warn/error en producción)**

---

¿Empezamos con la FASE 1 (Base Multi-Tenant + Roles + Optimizaciones)?

