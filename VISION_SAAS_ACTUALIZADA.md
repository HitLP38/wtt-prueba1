# 🏢 Visión SaaS - Plataforma Multi-Tenant para Clubes

## 🎯 **CONTEXTO Y VISIÓN**

Esta es una **plataforma SaaS** donde:
- **Clubes de tenis de mesa** pueden suscribirse y gestionar sus eventos
- Cada club tiene su propio espacio aislado (multi-tenancy)
- Pueden reutilizar configuraciones previas mediante **plantillas versionadas**
- Exportan prospectos oficiales en **PDF** (como los que me mostraste)

---

## 🏗️ **ARQUITECTURA MULTI-TENANT**

### **Nuevas Entidades Necesarias:**

#### **1. Organization (Club/Organización)**
```typescript
- id: UUID
- name: string (ej: "Club Real de Lima", "Topspin Sports SAC")
- slug: string (único, para URLs: "club-real-lima")
- organizationType: 'CLUB' | 'FEDERATION' | 'ASSOCIATION'
- ruc: string (RUC del club)
- address: string
- phone: string
- email: string
- whatsapp: string
- logoUrl?: string
- bannerUrl?: string
- subscriptionPlan: 'FREE' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE'
- subscriptionStatus: 'ACTIVE' | 'SUSPENDED' | 'CANCELLED'
- subscriptionExpiresAt?: Date
- clerkOrgId: string (ID de organización en Clerk)
- settings: JSONB (configuraciones del club)
- isActive: boolean
- createdAt: Date
- updatedAt: Date
```

#### **2. ConfigurationTemplate (Plantilla de Configuración)**
```typescript
- id: UUID
- organizationId: UUID (FK) - El club que creó la plantilla
- eventId: UUID (FK, nullable) - Evento del que se creó (si aplica)
- name: string (ej: "Torneo Topspin Cup 2025")
- description?: string
- version: number (1, 2, 3...) - Versión de la plantilla
- parentTemplateId?: UUID (FK, nullable) - Si es una versión de otra plantilla
- isPublic: boolean (si otros clubes pueden verla/usarla)
- category: 'OFFICIAL' | 'SPECIAL' | 'SCHOOL' | 'UNIVERSITY' | 'CUSTOM'
  
  // Datos de la configuración completa
  basicInfo: JSONB (EventBasicInfo)
  modalities: JSONB (Modality[])
  categories: JSONB (Category[])
  competitionSystem: JSONB (CompetitionSystem)
  awards: JSONB (EventAwards)
  seedingRules: JSONB (EventSeedingRules)
  registration: JSONB (EventRegistration)
  equipment: JSONB (EventEquipment)
  
  // Metadatos
  tags: string[] (para búsqueda)
  usageCount: number (cuántas veces se ha usado)
  lastUsedAt?: Date
  createdBy: UUID (userId)
  isActive: boolean
  createdAt: Date
  updatedAt: Date
```

#### **3. TemplateVersion (Historial de Versiones)**
```typescript
- id: UUID
- templateId: UUID (FK)
- version: number
- changes: JSONB (descripción de cambios: { field, oldValue, newValue }[])
  - Ej: [{ field: "categories", change: "Agregada categoría IV19" }]
- createdBy: UUID
- createdAt: Date
```

#### **4. EventProspect (Prospecto/PDF Generado)**
```typescript
- id: UUID
- eventId: UUID (FK)
- organizationId: UUID (FK)
- version: number (versión del prospecto - pueden regenerar)
- pdfUrl: string (URL del PDF almacenado)
- pdfData?: JSONB (datos usados para generar el PDF)
- generatedAt: Date
- generatedBy: UUID
- downloadCount: number
- isPublished: boolean
- publishedAt?: Date
```

---

## 🔍 **SISTEMA DE PLANTILLAS CON BÚSQUEDA**

### **Funcionalidades:**

1. **Crear Plantilla desde Evento:**
   - Al guardar configuración de evento, opción: "Guardar como plantilla"
   - Nombre, descripción, tags
   - Elegir si es pública o privada

2. **Búsqueda de Plantillas:**
   - Buscar por nombre, tags, categoría
   - Filtrar por: Mis plantillas / Plantillas públicas / Plantillas de mi club
   - Ver versiones de cada plantilla
   - Ver uso previo (cuántas veces se ha usado)

3. **Usar Plantilla:**
   - Seleccionar plantilla y versión
   - Cargar configuración en formulario
   - Permitir edición antes de crear evento
   - Guardar como nueva versión opcional

4. **Gestionar Versiones:**
   - Ver historial de versiones
   - Comparar versiones (diff)
   - Restaurar versión anterior
   - Eliminar versiones antiguas

---

## 📄 **SISTEMA DE EXPORTACIÓN A PDF**

### **Resumen de Configuración:**

Antes de exportar, mostrar **resumen completo** similar a los prospectos que me mostraste:

```
┌─────────────────────────────────────┐
│   RESUMEN DE CONFIGURACIÓN          │
├─────────────────────────────────────┤
│                                     │
│ 1. INFORMACIÓN BÁSICA               │
│    - Nombre del evento              │
│    - Organizador                    │
│    - Fechas                         │
│                                     │
│ 2. MODALIDADES Y CATEGORÍAS         │
│    - Individual: ✓                  │
│    - Dobles: ✓                      │
│    - Total categorías: 48           │
│                                     │
│ 3. SISTEMA DE COMPETENCIA           │
│    - Sets por defecto: 5            │
│    - Sets finales: 7                │
│    - Excepciones: Hopes, Escolares  │
│                                     │
│ 4. PREMIOS                          │
│    - Reconocimientos: ✓             │
│    - Premios económicos: ✓          │
│                                     │
│ 5. INSCRIPCIONES                    │
│    - Fecha inicio: 01/05/2025       │
│    - Fecha fin: 25/05/2025          │
│    - Métodos de pago: ✓             │
│                                     │
│ 6. EQUIPAMIENTO                     │
│    - Mesas: 18-22                   │
│    - Pelotas: XIOM 3***             │
│                                     │
└─────────────────────────────────────┘
```

### **PDF Export (Prospecto Oficial):**

El PDF debe incluir **EXACTAMENTE** lo que muestran tus imágenes:

1. **Banner/Cabecera:**
   - Logo del club
   - Nombre del torneo
   - Fechas y ubicación
   - Diseño visual atractivo

2. **Información Básica:**
   - Organizador (nombre, RUC, dirección, contacto)
   - Días de competencia
   - Director del torneo
   - Gerente de competencia
   - Juez general
   - Lugar de competencia

3. **Modalidades y Categorías:**
   - Tabla completa con todas las categorías (ANEXO 1, 2, 3)
   - Columnas: N., Evento, Modalidad, Sexo, Categoría, Edad, Costo, Adicional

4. **Sistema de Competencia:**
   - Singles (clasificatoria + final)
   - Dobles (eliminación directa)
   - Sets (por defecto y excepciones)

5. **Siembras:**
   - Criterios de siembra (Ranking ITTF, Nacional)

6. **Cronograma:**
   - Fechas importantes
   - Cierre de inscripciones
   - Sorteo
   - Etapas

7. **Equipamiento:**
   - Mesas, pelotas, piso

8. **Normativa de Inscripciones:**
   - Reglas
   - Métodos de pago
   - Información de contacto

9. **Premios:**
   - Reconocimientos
   - Premios económicos

10. **Footer:**
    - Logos de patrocinadores
    - Circuito Nacional
    - Año

---

## 🔌 **ENDPOINTS ADICIONALES NECESARIOS**

### **Organizaciones (Clubes)**
```
GET    /api/admin/organizations
GET    /api/admin/organizations/:orgId
PUT    /api/admin/organizations/:orgId
GET    /api/admin/organizations/:orgId/subscription
```

### **Plantillas**
```
GET    /api/admin/templates
POST   /api/admin/templates
GET    /api/admin/templates/search (query, filters)
GET    /api/admin/templates/:templateId
GET    /api/admin/templates/:templateId/versions
GET    /api/admin/templates/:templateId/versions/:version
POST   /api/admin/templates/:templateId/use (aplicar a evento)
PUT    /api/admin/templates/:templateId
DELETE /api/admin/templates/:templateId
```

### **Exportación**
```
GET    /api/admin/events/:eventId/config-summary (resumen)
POST   /api/admin/events/:eventId/generate-prospect (generar PDF)
GET    /api/admin/events/:eventId/prospects (lista de PDFs generados)
GET    /api/admin/events/:eventId/prospects/:prospectId/download
```

---

## 📊 **ACTUALIZACIÓN DE RELACIONES**

```
Organization (1) ──→ (N) Event
Organization (1) ──→ (N) ConfigurationTemplate
Organization (1) ──→ (N) User (miembros del club)

Event (1) ──→ (0-1) ConfigurationTemplate (plantilla usada)
Event (1) ──→ (N) EventProspect (PDFs generados)

ConfigurationTemplate (1) ──→ (N) TemplateVersion
ConfigurationTemplate (1) ──→ (0-1) ConfigurationTemplate (parent)
```

---

## 🚀 **FLUJO DE TRABAJO RECOMENDADO**

### **Opción A: Desarrollo Local Primero** ⭐ **RECOMENDADO**

**Ventajas:**
- ✅ Desarrollo más rápido (no necesita deploy cada cambio)
- ✅ Hot reload automático
- ✅ Debugging más fácil
- ✅ No consume recursos del VPS
- ✅ Puedes trabajar sin conexión

**Cuándo hacer commit al VPS:**
- Cuando una funcionalidad completa esté lista y probada
- Antes de integrar con frontend
- Para hacer pruebas de integración

**Flujo:**
```
Local (desarrollo) 
  → Commit/Test 
    → Push a repo 
      → Pull en VPS 
        → Build 
          → PM2 Restart
```

### **Opción B: Desarrollo Directo en VPS**

**Ventajas:**
- ✅ Siempre está en producción
- ✅ No necesita sincronizar

**Desventajas:**
- ❌ Más lento (deploy constante)
- ❌ Riesgo de romper producción
- ❌ Más difícil debuggear

**Recomendación: Opción A** para desarrollo, Opción B solo para hotfixes críticos.

---

## 📋 **PLAN ACTUALIZADO DE IMPLEMENTACIÓN**

### **FASE 1: Multi-Tenancy Base** (Prioridad CRÍTICA)

1. Crear entidad `Organization`
2. Agregar `organizationId` a todas las entidades existentes
3. Implementar filtrado por organización en todos los queries
4. Middleware para identificar organización del usuario (desde Clerk)

---

### **FASE 2: Sistema de Plantillas** (Prioridad ALTA)

1. Crear entidades: `ConfigurationTemplate`, `TemplateVersion`
2. Servicio de búsqueda de plantillas
3. Endpoints CRUD de plantillas
4. Lógica de versionado
5. UI para buscar y usar plantillas

---

### **FASE 3: Exportación PDF** (Prioridad ALTA)

1. Crear entidad `EventProspect`
2. Servicio de generación de PDF (usar `pdfkit` o `puppeteer`)
3. Template de PDF (basado en tus imágenes)
4. Endpoint de generación y descarga
5. UI de resumen y exportación

---

### **FASE 4: Configuraciones Completas** (Prioridad ALTA)

1. Todas las entidades de configuración
2. CRUDs completos
3. Validaciones

---

### **FASE 5: Frontend Completo** (Prioridad MEDIA)

1. Páginas de administración
2. Búsqueda de plantillas
3. Resumen y exportación
4. Dashboard multi-tenant

---

## 💡 **CONSIDERACIONES ADICIONALES**

### **Seguridad Multi-Tenant:**
- Validar que usuario pertenezca a la organización
- No permitir acceso cruzado entre organizaciones
- Roles por organización (Admin del club, Gerente, etc.)

### **Límites por Plan:**
- FREE: 1 evento activo, sin plantillas públicas
- BASIC: 5 eventos activos, 10 plantillas
- PREMIUM: Ilimitado, todas las funciones
- ENTERPRISE: Personalizado

### **Búsqueda de Plantillas:**
- Full-text search en nombre, descripción, tags
- Filtros: categoría, fecha, uso
- Ordenar por: más usadas, más recientes, alfabético

---

## 🎯 **PRÓXIMOS PASOS INMEDIATOS**

1. ✅ Actualizar entidad `Event` para incluir `organizationId`
2. ✅ Crear entidad `Organization`
3. ✅ Crear entidad `ConfigurationTemplate`
4. ✅ Implementar middleware de organización
5. ✅ Empezar con sistema de plantillas (búsqueda básica)

---

¿Empezamos con la FASE 1 (Multi-Tenancy) o prefieres otra fase primero?

