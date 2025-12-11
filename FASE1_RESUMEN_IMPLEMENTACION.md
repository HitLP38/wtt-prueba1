# ✅ FASE 1: Base Multi-Tenant - Resumen de Implementación

## 📋 **LO QUE SE HA CREADO**

### **✅ Entidades Nuevas:**

1. **`Organization`** (`services/eventos/src/entities/organization.entity.ts`)
   - Campos completos para organización/club
   - Índices optimizados (slug, organizationCode, clerkOrgId)
   - Tipos: CLUB, FEDERATION, ASSOCIATION
   - Planes de suscripción: FREE, BASIC, PREMIUM, ENTERPRISE

2. **`User`** (`services/eventos/src/entities/user.entity.ts`)
   - Roles: MASTER, ADMIN, REFEREE, COACH, VIEWER
   - Vinculado a organización (organizationId)
   - Permisos granulares (JSONB)
   - Índices optimizados para queries multi-tenant

### **✅ Entidades Actualizadas:**

1. **`Event`** (`services/eventos/src/entities/event.entity.ts`)
   - ✅ Agregado `organizationId` (campo crítico)
   - ✅ Índices agregados: `organizationId`, `(organizationId, isActive)`

### **✅ Servicios Nuevos:**

1. **`OrganizationService`** (`services/eventos/src/services/organization.service.ts`)
   - CRUD completo
   - Validaciones de unicidad (slug, organizationCode)
   - Métodos de búsqueda optimizados

2. **`UserService`** (`services/eventos/src/services/user.service.ts`)
   - CRUD completo
   - Búsqueda por Clerk ID, organización, rol
   - Actualización de último login

### **✅ Guards y Decorators:**

1. **`OrganizationGuard`** (`services/gateway/src/guards/organization.guard.ts`)
   - Extrae `organizationId` del token/usuario
   - MASTER no tiene filtro de organización
   - Valida que usuarios tengan organización asignada

2. **`RolesGuard`** (actualizado)
   - Compatible con nueva estructura de roles
   - MASTER tiene acceso total

3. **`@CurrentOrg()`** (`services/gateway/src/decorators/current-org.decorator.ts`)
   - Decorator para inyectar `organizationId` en controllers
   - `@CurrentUserRole()` para inyectar rol

### **✅ Constantes Actualizadas:**

1. **`UserRole` enum** (`packages/common/src/constants/index.ts`)
   - Actualizado con roles: MASTER, ADMIN, REFEREE, COACH, VIEWER

---

## 🔄 **PENDIENTE (Próximos Pasos):**

### **1. Actualizar Otras Entidades con `organizationId`:**

Entidades que necesitan `organizationId`:
- [ ] `Referee` (services/referees)
- [ ] `Table` (services/matches)
- [ ] `Match` (services/matches)
- [ ] `Team` (services/teams)
- [ ] `Player` (services/players)
- [ ] `EventReferee` (ya tiene eventId, pero validar)
- [ ] `EventSettings` (ya tiene eventId, pero validar)

### **2. Actualizar Servicios para Filtrar por `organizationId`:**

Servicios que necesitan actualización:
- [ ] `EventosService` - Agregar filtro en `findAll()`, `findOne()`, etc.
- [ ] `MatchesService` - Filtrar por organización
- [ ] `TeamsService` - Filtrar por organización
- [ ] `RefereesService` - Filtrar por organización

**Patrón a seguir:**
```typescript
async findAll(organizationId: string) {
  return this.repository.find({
    where: { organizationId }, // CRÍTICO: Siempre filtrar
    order: { createdAt: 'DESC' },
  });
}
```

### **3. Integrar OrganizationGuard en Controllers:**

Controllers que necesitan el guard:
- [ ] `AdminController` - Agregar `@UseGuards(OrganizationGuard)`
- [ ] `RefereeController` - Agregar `@UseGuards(OrganizationGuard)`
- [ ] `GatewayController` - Decidir si necesita filtro

**Ejemplo de uso:**
```typescript
@Controller('admin')
@UseGuards(AuthGuard, OrganizationGuard, RolesGuard)
@Roles('ADMIN', 'MASTER')
export class AdminController {
  @Get('events')
  async getEvents(@CurrentOrg() organizationId: string) {
    // organizationId ya está validado
    return this.eventsService.findAll(organizationId);
  }
}
```

### **4. Crear Índices en Base de Datos:**

Script SQL para crear índices optimizados:
```sql
-- Organizations
CREATE INDEX IF NOT EXISTS idx_organizations_slug ON organizations(slug);
CREATE INDEX IF NOT EXISTS idx_organizations_code ON organizations(organization_code);
CREATE INDEX IF NOT EXISTS idx_organizations_active ON organizations(is_active) WHERE is_active = true;

-- Users
CREATE INDEX IF NOT EXISTS idx_users_org_role ON users(organization_id, role) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);

-- Events
CREATE INDEX IF NOT EXISTS idx_events_org ON events(organization_id);
CREATE INDEX IF NOT EXISTS idx_events_org_active ON events(organization_id, is_active) WHERE is_active = true;

-- Agregar a otras tablas cuando se actualicen...
```

### **5. Actualizar EventosService:**

```typescript
// Antes
async findAll() {
  return this.repository.find();
}

// Después
async findAll(organizationId: string) {
  return this.repository.find({
    where: { organizationId, isActive: true },
    order: { createdAt: 'DESC' },
  });
}

async findOne(id: string, organizationId: string) {
  const event = await this.repository.findOne({
    where: { id, organizationId },
  });
  if (!event) {
    throw new NotFoundException('Evento no encontrado');
  }
  return event;
}
```

---

## 📊 **ESTRUCTURA DE DATOS ACTUAL:**

```
Organization (1)
  ├─ id: UUID
  ├─ slug: string (UNIQUE)
  ├─ organizationCode: string (UNIQUE)
  └─ clerkOrgId: string (UNIQUE)

User (N)
  ├─ id: UUID
  ├─ organizationId: UUID (FK, nullable si MASTER)
  ├─ clerkId: string (UNIQUE)
  └─ role: UserRole

Event (N)
  ├─ id: UUID
  ├─ organizationId: UUID (FK) ✅ AGREGADO
  └─ ...
```

---

## 🎯 **PRÓXIMOS PASOS INMEDIATOS:**

1. ✅ **Crear migración SQL** para agregar índices
2. ✅ **Actualizar EventosService** para filtrar por organización
3. ✅ **Actualizar AdminController** para usar OrganizationGuard
4. ✅ **Probar flujo completo** (crear org → crear usuario → crear evento)

---

## ⚠️ **NOTAS IMPORTANTES:**

1. **Nunca hacer queries sin filtrar por `organizationId`** (excepto MASTER)
2. **MASTER no tiene `organizationId`** (puede ver todo)
3. **Todos los servicios deben recibir `organizationId` como parámetro**
4. **Usar `@CurrentOrg()` en controllers** para obtener orgId automáticamente

---

## ✅ **CHECKLIST:**

- [x] Entidad Organization creada
- [x] Entidad User creada
- [x] Event actualizado con organizationId
- [x] OrganizationService creado
- [x] UserService creado
- [x] OrganizationGuard creado
- [x] Decorators creados
- [ ] Actualizar otras entidades con organizationId
- [ ] Actualizar servicios para filtrar
- [ ] Crear índices en BD
- [ ] Integrar guards en controllers
- [ ] Probar flujo completo

---

**¿Seguimos con la actualización de servicios y otras entidades?**

