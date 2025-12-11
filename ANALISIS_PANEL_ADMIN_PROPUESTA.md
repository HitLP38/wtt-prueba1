# 📊 Análisis del Panel de Administrador + Propuesta Completa

## 🎨 **FEEDBACK SOBRE EL DISEÑO**

### ✅ **Lo que está BIEN:**

1. **Estructura clara con pestañas** - Facilita la navegación
2. **Secciones bien organizadas** - Información lógica agrupada
3. **Diseño limpio** - Interfaz profesional y moderna
4. **Campos relevantes** - Captura información importante del evento

### 💡 **SUGERENCIAS DE MEJORA:**

1. **Validación en tiempo real:**
   - Validar que fechas de inscripción sean antes del evento
   - Validar que costos sean positivos
   - Validar formato de WhatsApp/email/teléfono

2. **Feedback visual:**
   - Indicadores de campos guardados (check verde)
   - Mensajes de éxito al guardar
   - Prevención de pérdida de datos (confirmar al salir si hay cambios sin guardar)

3. **Funcionalidades adicionales:**
   - Vista previa de cómo se verá el evento publicado
   - Copiar configuración de otro evento (plantilla)
   - Exportar/importar configuración (JSON)

4. **UX mejorado:**
   - Autoguardado cada X segundos
   - Historial de cambios
   - Botones de ayuda/tooltips en campos complejos

---

## 🏗️ **ESTRUCTURA DE BACKEND PROPUESTA**

### **📋 Entidades Faltantes que Necesitas:**

#### **1. Category (Categoría)**
```typescript
- id: UUID
- eventId: UUID (FK a Event)
- name: string (ej: "IV19", "IIIA", etc.)
- gender: 'MALE' | 'FEMALE' | 'MIXED' | 'ALL'
- ageRange: { min: number, max: number } | null (si es "Todas" = null)
- modality: 'INDIVIDUAL' | 'DOUBLES' | 'TEAM'
- cost: decimal
- additionalCost: decimal (adicional)
- currency: 'PEN' | 'USD'
- ageRule: string (regla de edad personalizada)
- maxParticipants?: number
- isActive: boolean
```

#### **2. Modality (Modalidad)**
```typescript
- id: UUID
- eventId: UUID (FK)
- type: 'INDIVIDUAL' | 'DOUBLES'
- isEnabled: boolean
```

#### **3. EventBasicInfo (Información Básica)**
```typescript
- id: UUID
- eventId: UUID (FK, UNIQUE)
- eventName: string
- organizationName: string (Razón social)
- organizationRUC: string
- organizationWhatsApp: string
- organizationPhone: string
- competitionManager: { name, contact, email }
- generalJudge: { name, contact, email }
- competitionVenue: { name, contact, email }
```

#### **4. EventAwards (Premios)**
```typescript
- id: UUID
- eventId: UUID (FK)
- recognitionFirst: string (ej: "Copa y Medalla de Oro")
- recognitionSecond: string (ej: "Medalla de Plata")
- recognitionThird: string (ej: "Medalla de Bronce")
- prizeFirst: decimal
- prizeSecond: decimal
- prizeThird: decimal
- currency: 'PEN' | 'USD'
```

#### **5. EventEquipment (Equipamiento)**
```typescript
- id: UUID
- eventId: UUID (FK)
- tablesCount: number
- tableBrand: string
- floorType: string
- ballBrand: string
- otherEquipment: text
```

#### **6. EventRegistration (Configuración de Inscripciones)**
```typescript
- id: UUID
- eventId: UUID (FK)
- registrationStartDate: Date
- registrationEndDate: Date
- eventWhatsApp: string
- eventEmail1: string
- eventEmail2: string
- eventPhone: string
- paymentAccountHolder: string
- paymentAccountNumber: string
- paymentBank: string
- paymentCCI: string
- paymentNotes: text
```

#### **7. EventSeedingRules (Reglas de Siembra)**
```typescript
- id: UUID
- eventId: UUID (FK)
- useInternationalRanking: boolean
- useNationalRanking: boolean
- rankingSource?: string (URL o referencia)
- observations: text
```

#### **8. CompetitionSystem (Sistema de Competencia)**
```typescript
- id: UUID
- eventId: UUID (FK)
- defaultSets: number (ej: 5)
- finalSets: number (ej: 7)
- categoryOverrides: JSONB { categoryId: { sets: number, finalSets: number } }
- roundType: 'ROUND_ROBIN' | 'KNOCKOUT' | 'MIXED'
- warmupTimeMinutes: number
- breakBetweenSetsMinutes: number
```

#### **9. RefereeRecord (Registro de Árbitro - Historial)**
```typescript
- id: UUID
- refereeId: UUID (FK)
- eventId: UUID (FK)
- matchId: UUID (FK, nullable)
- actionType: 'ASSIGNED' | 'REPLACED' | 'INCIDENT' | 'LATE_ARRIVAL' | 'ERROR'
- description: text
- reportedBy: UUID (adminId)
- timestamp: Date
```

#### **10. TableStatusHistory (Historial de Estados de Mesa)**
```typescript
- id: UUID
- tableId: UUID (FK)
- previousStatus: TableStatus
- newStatus: TableStatus
- reason?: string
- changedBy: UUID (adminId o refereeId)
- timestamp: Date
```

---

## 🔌 **ENDPOINTS NECESARIOS (CRUD Completo)**

### **📁 Información Básica del Evento**
```
GET    /api/admin/events/:eventId/basic-info
PUT    /api/admin/events/:eventId/basic-info
POST   /api/admin/events/:eventId/basic-info
```

### **📁 Modalidades y Categorías**
```
GET    /api/admin/events/:eventId/modalities
POST   /api/admin/events/:eventId/modalities
PATCH  /api/admin/events/:eventId/modalities/:modalityId

GET    /api/admin/events/:eventId/categories
POST   /api/admin/events/:eventId/categories
PUT    /api/admin/events/:eventId/categories/:categoryId
DELETE /api/admin/events/:eventId/categories/:categoryId
```

### **📁 Sistema de Competencia**
```
GET    /api/admin/events/:eventId/competition-system
PUT    /api/admin/events/:eventId/competition-system

GET    /api/admin/events/:eventId/awards
PUT    /api/admin/events/:eventId/awards
```

### **📁 Normativas**
```
GET    /api/admin/events/:eventId/seeding-rules
PUT    /api/admin/events/:eventId/seeding-rules
```

### **📁 Inscripciones**
```
GET    /api/admin/events/:eventId/registration-config
PUT    /api/admin/events/:eventId/registration-config
```

### **📁 Equipamiento**
```
GET    /api/admin/events/:eventId/equipment
PUT    /api/admin/events/:eventId/equipment
```

### **📁 Gestión de Árbitros (CRUD Completo)**
```
GET    /api/admin/referees
POST   /api/admin/referees
GET    /api/admin/referees/:refereeId
PUT    /api/admin/referees/:refereeId
DELETE /api/admin/referees/:refereeId

GET    /api/admin/referees/:refereeId/history
POST   /api/admin/referees/:refereeId/incidents
GET    /api/admin/referees/:refereeId/stats (partidos arbitrados, tiempo promedio, etc.)
```

### **📁 Gestión de Mesas (CRUD Completo)**
```
GET    /api/admin/events/:eventId/tables
POST   /api/admin/events/:eventId/tables
GET    /api/admin/tables/:tableId
PUT    /api/admin/tables/:tableId
DELETE /api/admin/tables/:tableId

POST   /api/admin/tables/:tableId/block (bloquear por reparación)
POST   /api/admin/tables/:tableId/unblock
GET    /api/admin/tables/:tableId/history (historial de estados)
GET    /api/admin/tables/:tableId/current-match (partido actual)
```

### **📁 Gestión de Participantes**
```
GET    /api/admin/events/:eventId/participants
GET    /api/admin/events/:eventId/participants/by-category
GET    /api/admin/events/:eventId/participants/:participantId
POST   /api/admin/events/:eventId/participants/:participantId/approve
POST   /api/admin/events/:eventId/participants/:participantId/reject
GET    /api/admin/events/:eventId/participants/validate (validar ranking, categoría, etc.)
```

### **📁 Gestión de Partidos**
```
GET    /api/admin/events/:eventId/matches
GET    /api/admin/events/:eventId/matches/in-progress
GET    /api/admin/events/:eventId/matches/pending
GET    /api/admin/events/:eventId/matches/completed

PUT    /api/admin/matches/:matchId/reschedule (cambiar hora, mesa, árbitro)
POST   /api/admin/matches/:matchId/cancel
POST   /api/admin/matches/:matchId/wo (Walk Over)
POST   /api/admin/matches/:matchId/call (1er, 2do, 3er llamado)
GET    /api/admin/matches/:matchId/status
```

### **📁 Dashboard y Estadísticas**
```
GET    /api/admin/events/:eventId/dashboard
GET    /api/admin/events/:eventId/stats (estadísticas generales)
GET    /api/admin/events/:eventId/stats/referees (estadísticas por árbitro)
GET    /api/admin/events/:eventId/stats/tables (estadísticas por mesa)
GET    /api/admin/events/:eventId/stats/matches (estadísticas de partidos)
```

---

## 📐 **ESTRUCTURA DE DATOS SUGERIDA**

### **Relaciones:**

```
Event (1) ──→ (N) EventBasicInfo
Event (1) ──→ (N) Modality
Event (1) ──→ (N) Category
Event (1) ──→ (1) EventAwards
Event (1) ──→ (1) EventEquipment
Event (1) ──→ (1) EventRegistration
Event (1) ──→ (1) EventSeedingRules
Event (1) ──→ (1) CompetitionSystem
Event (1) ──→ (N) Table
Event (1) ──→ (N) Match
Event (1) ──→ (N) EventReferee

Category (1) ──→ (N) Match
Category (1) ──→ (N) Team

Referee (1) ──→ (N) EventReferee
Referee (1) ──→ (N) RefereeRecord
Referee (1) ──→ (N) MatchAssignment

Table (1) ──→ (N) MatchAssignment
Table (1) ──→ (N) TableStatusHistory
Table (1) ──→ (N) TableLock
```

---

## 🚀 **PLAN DE IMPLEMENTACIÓN SUGERIDO**

### **FASE 1: Entidades y Base de Datos** (Prioridad ALTA)

1. ✅ Crear entidades faltantes:
   - `Category`
   - `Modality`
   - `EventBasicInfo`
   - `EventAwards`
   - `EventEquipment`
   - `EventRegistration`
   - `EventSeedingRules`
   - `CompetitionSystem`
   - `RefereeRecord`
   - `TableStatusHistory`

2. ✅ Actualizar `EventSettings` para incluir nueva estructura

3. ✅ Crear migraciones y sincronizar BD

---

### **FASE 2: Servicios Backend** (Prioridad ALTA)

**Eventos Service:**
- `CategoryService` - CRUD de categorías
- `ModalityService` - Gestión de modalidades
- `EventConfigService` - Configuración completa del evento

**Matches Service:**
- `MatchManagementService` - Reprogramar, cancelar, W.O.
- `MatchCallService` - Sistema de llamados
- `TableManagementService` - CRUD y gestión de mesas

**Referees Service:**
- `RefereeManagementService` - CRUD completo
- `RefereeHistoryService` - Historial y estadísticas

**Teams/Inscriptions Service:**
- `ParticipantValidationService` - Validación de participantes
- `ParticipantManagementService` - Aprobar/rechazar

---

### **FASE 3: Controllers y Endpoints** (Prioridad ALTA)

**Admin Controller - Expandir:**
- Agregar todos los endpoints mencionados arriba
- Validaciones con class-validator
- Manejo de errores adecuado

---

### **FASE 4: Frontend - Conectar Vistas** (Prioridad MEDIA)

**Crear páginas:**
- `/admin/events/:eventId/config` - Configuración completa (con pestañas)
- `/admin/referees` - Gestión de árbitros
- `/admin/tables` - Gestión de mesas
- `/admin/matches` - Gestión de partidos
- `/admin/participants` - Gestión de participantes

**Componentes necesarios:**
- `EventConfigTabs` - Componente de pestañas
- `CategoryTable` - Tabla de categorías
- `RefereeList` - Lista de árbitros
- `TableGrid` - Grid de mesas con estados en tiempo real
- `MatchList` - Lista de partidos

---

### **FASE 5: Dashboard en Tiempo Real** (Prioridad MEDIA)

- WebSockets para actualización en tiempo real
- Estadísticas en vivo
- Alertas automáticas
- Cronómetros por partido

---

### **FASE 6: Notificaciones** (Prioridad MEDIA)

- Integración WhatsApp completa
- Sistema de llamados (1er, 2do, 3er)
- Notificaciones de cambios

---

## 💡 **IDEAS ADICIONALES**

### **1. Sistema de Plantillas** (SaaS Multi-Tenant)
- Guardar configuración como plantilla reutilizable **con versiones**
- Búsqueda de plantillas (lupa) - filtrar por nombre, tags, categoría
- Plantillas por organización (clubes pueden reutilizar sus propias configuraciones)
- Plantillas públicas (otros clubes pueden usar)
- Historial de versiones - comparar y restaurar
- Ver uso previo (cuántas veces se ha usado cada plantilla)

**Ejemplo:** Club Real de Lima puede guardar "Torneo Anual 2025" como plantilla y reutilizarla en 2026 con ajustes

### **2. Validaciones Inteligentes**
- Verificar que no haya conflictos de horarios
- Validar que árbitros estén disponibles
- Validar capacidad de mesas

### **3. Automatización**
- Asignación automática de partidos a mesas
- Distribución equilibrada de partidos por árbitro
- Sugerencias de reprogramación

### **4. Reportes**
- Reporte de árbitros (partidos, tiempo, incidentes)
- Reporte de mesas (uso, retrasos)
- Reporte de participantes por categoría

### **5. Exportación a PDF (Prospecto Oficial)**
- **Resumen completo de configuración** antes de exportar (para revisar)
- **Generar PDF del prospecto oficial** (igual a las imágenes que mostraste)
  - Banner con logo del club
  - Información básica completa
  - Tablas de modalidades y categorías (ANEXO 1, 2, 3)
  - Sistema de competencia
  - Premios y normativas
  - Logos de patrocinadores
- Historial de PDFs generados (versiones)
- Descargar PDFs anteriores

---

## 📋 **PRÓXIMOS PASOS INMEDIATOS**

1. **Crear entidades faltantes** (empezar con las más importantes)
2. **Implementar CRUDs básicos** (Category, Modality, EventConfig)
3. **Conectar frontend con backend** (empezar con una pestaña)
4. **Agregar validaciones** (tanto frontend como backend)

---

¿Empezamos con la implementación? Te sugiero empezar con:
- **Opción A:** Crear entidades y CRUDs para "Información Básica" y "Modalidades/Categorías"
- **Opción B:** Expandir el dashboard con más estadísticas
- **Opción C:** Implementar gestión completa de árbitros (CRUD + historial)

¿Qué prefieres?

