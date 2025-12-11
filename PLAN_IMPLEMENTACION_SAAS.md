# 🚀 Plan de Implementación - Plataforma SaaS Multi-Tenant

## 📋 **RESUMEN EJECUTIVO**

Este plan implementa una **plataforma SaaS** donde clubes de tenis de mesa pueden:
- Configurar sus eventos mediante un panel administrativo completo
- Reutilizar configuraciones mediante **plantillas versionadas con búsqueda**
- Exportar **prospectos oficiales en PDF** automáticamente
- Gestionar árbitros, mesas, participantes y partidos

---

## 🎯 **ESTRATEGIA DE DESARROLLO**

### **Recomendación: Desarrollo Local Primero** ⭐

**Flujo de trabajo:**
```
LOCAL (Windows)
  ├─ Desarrollar entidades, servicios, endpoints
  ├─ Probar con datos de prueba
  ├─ Conectar frontend y probar flujo completo
  └─ Cuando funcione → Commit → Push → VPS
```

**En VPS:**
- Solo para integración final y pruebas de producción
- Hotfixes críticos si es necesario

**Ventajas:**
- ✅ Desarrollo más rápido (hot reload)
- ✅ Debugging más fácil
- ✅ No interrumpe producción
- ✅ Puedes trabajar offline

---

## 📊 **FASES DE IMPLEMENTACIÓN**

### **🔴 FASE 1: Base Multi-Tenant** (Prioridad CRÍTICA - FUNDACIÓN)

**Objetivo:** Asegurar que cada organización (club) tenga su propio espacio aislado.

#### **1.1 Entidades Base**
- [ ] Crear `Organization` entity
- [ ] Agregar `organizationId` a:
  - [ ] `Event`
  - [ ] `Referee`
  - [ ] `Table`
  - [ ] `Match`
  - [ ] `Team`
  - [ ] `Player` (si aplica)
  - [ ] Todas las entidades nuevas

#### **1.2 Middleware de Organización**
- [ ] Crear `OrganizationGuard` (extrae orgId del token de Clerk)
- [ ] Crear decorator `@CurrentOrg()` para inyectar orgId
- [ ] Actualizar todos los servicios para filtrar por `organizationId`

#### **1.3 Migraciones**
- [ ] Crear migración para `organizations`
- [ ] Migrar datos existentes (crear org default si hay)
- [ ] Agregar índices: `organizationId` en todas las tablas

**Tiempo estimado:** 2-3 días  
**Archivos:** ~15 archivos modificados/creados

---

### **🟠 FASE 2: Sistema de Configuración de Eventos** (Prioridad ALTA)

**Objetivo:** Permitir configurar completamente un evento desde el panel.

#### **2.1 Entidades de Configuración**
- [ ] `Category` (categorías)
- [ ] `Modality` (modalidades)
- [ ] `EventBasicInfo` (información básica)
- [ ] `EventAwards` (premios)
- [ ] `EventEquipment` (equipamiento)
- [ ] `EventRegistration` (configuración de inscripciones)
- [ ] `EventSeedingRules` (reglas de siembra)
- [ ] `CompetitionSystem` (sistema de competencia)

#### **2.2 Servicios**
- [ ] `CategoryService` - CRUD categorías
- [ ] `ModalityService` - CRUD modalidades
- [ ] `EventConfigService` - Configuración completa

#### **2.3 Endpoints**
- [ ] CRUDs para todas las entidades
- [ ] Endpoints agrupados por pestaña del panel

**Tiempo estimado:** 5-7 días  
**Archivos:** ~25 archivos nuevos

---

### **🟡 FASE 3: Sistema de Plantillas** (Prioridad ALTA)

**Objetivo:** Permitir guardar y reutilizar configuraciones.

#### **3.1 Entidades**
- [ ] `ConfigurationTemplate` (plantilla)
- [ ] `TemplateVersion` (versiones)

#### **3.2 Funcionalidades**
- [ ] Guardar configuración como plantilla
- [ ] Búsqueda de plantillas (nombre, tags, categoría)
- [ ] Sistema de versionado (crear nueva versión)
- [ ] Comparar versiones
- [ ] Usar plantilla (cargar en formulario)
- [ ] Historial de uso

#### **3.3 Endpoints**
- [ ] `GET /api/admin/templates` - Listar con filtros
- [ ] `GET /api/admin/templates/search` - Búsqueda
- [ ] `POST /api/admin/templates` - Crear
- [ ] `GET /api/admin/templates/:id/versions` - Versiones
- [ ] `POST /api/admin/templates/:id/use` - Aplicar a evento

**Tiempo estimado:** 4-5 días  
**Archivos:** ~10 archivos nuevos

---

### **🟢 FASE 4: Exportación PDF** (Prioridad ALTA)

**Objetivo:** Generar prospectos oficiales en PDF.

#### **4.1 Entidades**
- [ ] `EventProspect` (PDFs generados)

#### **4.2 Librería de PDF**
- [ ] Instalar `pdfkit` o `puppeteer`
- [ ] Crear template de PDF (basado en imágenes)
- [ ] Servicio de generación de PDF

#### **4.3 Funcionalidades**
- [ ] Resumen de configuración (vista previa)
- [ ] Generar PDF con todos los datos
- [ ] Guardar PDF (S3 o filesystem)
- [ ] Descargar PDF
- [ ] Historial de PDFs generados

#### **4.4 Endpoints**
- [ ] `GET /api/admin/events/:id/config-summary`
- [ ] `POST /api/admin/events/:id/generate-prospect`
- [ ] `GET /api/admin/events/:id/prospects`
- [ ] `GET /api/admin/events/:id/prospects/:prospectId/download`

**Tiempo estimado:** 5-6 días  
**Archivos:** ~8 archivos nuevos

---

### **🔵 FASE 5: Frontend - Panel de Configuración** (Prioridad MEDIA)

**Objetivo:** Conectar el diseño del panel con el backend.

#### **5.1 Páginas**
- [ ] `/admin/events/:eventId/config` - Configuración completa (pestañas)
- [ ] `/admin/templates` - Búsqueda de plantillas
- [ ] `/admin/templates/:id` - Detalle de plantilla

#### **5.2 Componentes**
- [ ] `EventConfigTabs` - Pestañas de configuración
- [ ] `CategoryTable` - Tabla de categorías (editable)
- [ ] `TemplateSearch` - Búsqueda con filtros
- [ ] `ConfigSummary` - Resumen antes de exportar
- [ ] `PDFPreview` - Vista previa del PDF

#### **5.3 Integraciones**
- [ ] Conectar todas las pestañas con endpoints
- [ ] Guardado automático (opcional)
- [ ] Validaciones en frontend

**Tiempo estimado:** 7-10 días  
**Archivos:** ~15 archivos nuevos

---

### **🟣 FASE 6: Gestión Completa (Árbitros, Mesas, Partidos)** (Prioridad MEDIA)

**Objetivo:** Completar todas las funcionalidades de gestión.

#### **6.1 CRUDs Completos**
- [ ] Gestión de árbitros (crear, editar, historial)
- [ ] Gestión de mesas (CRUD, estados, historial)
- [ ] Gestión de partidos (reprogramar, cancelar, W.O.)
- [ ] Gestión de participantes (validar, aprobar, rechazar)

#### **6.2 Dashboard**
- [ ] Estadísticas en tiempo real
- [ ] Alertas automáticas
- [ ] Gráficos de progreso

**Tiempo estimado:** 8-10 días  
**Archivos:** ~20 archivos modificados/nuevos

---

## 📅 **CRONOGRAMA SUGERIDO**

### **Sprint 1 (Semana 1-2): Fundación**
- ✅ FASE 1: Base Multi-Tenant
- Inicio FASE 2: Entidades de configuración

### **Sprint 2 (Semana 3-4): Configuración**
- ✅ FASE 2: Sistema de configuración completo
- ✅ FASE 3: Sistema de plantillas (básico)

### **Sprint 3 (Semana 5-6): Plantillas y PDF**
- ✅ FASE 3: Sistema de plantillas (completo con búsqueda)
- ✅ FASE 4: Exportación PDF

### **Sprint 4 (Semana 7-8): Frontend**
- ✅ FASE 5: Panel de configuración completo

### **Sprint 5 (Semana 9-10): Gestión Completa**
- ✅ FASE 6: Todos los CRUDs y dashboard

---

## 🎯 **PRÓXIMOS PASOS INMEDIATOS**

### **Esta Semana:**

1. **Crear entidad `Organization`** ✅
   - Archivo: `services/eventos/src/entities/organization.entity.ts`

2. **Agregar `organizationId` a `Event`** ✅
   - Modificar: `services/eventos/src/entities/event.entity.ts`

3. **Crear servicio de organizaciones** ✅
   - Archivo: `services/eventos/src/services/organization.service.ts`

4. **Crear middleware de organización** ✅
   - Archivo: `services/gateway/src/guards/organization.guard.ts`

5. **Actualizar `AdminController` para filtrar por organización** ✅

---

## 📝 **NOTAS IMPORTANTES**

### **Multi-Tenancy:**
- **CRÍTICO:** Todos los queries deben filtrar por `organizationId`
- Nunca exponer datos de otra organización
- Validar en cada endpoint

### **Plantillas:**
- Las plantillas son por organización (privadas) o públicas
- Versionado automático al modificar
- Búsqueda full-text en nombre, descripción, tags

### **PDF:**
- Guardar en S3 o filesystem
- Template debe ser idéntico a los prospectos oficiales
- Permitir regenerar (nueva versión)

### **Desarrollo:**
- Trabajar en LOCAL primero
- Commits frecuentes
- Probar localmente antes de subir a VPS

---

## 🚀 **¿Empezamos?**

**Opción recomendada:** FASE 1 (Base Multi-Tenant)

**Comandos para empezar:**
```bash
# En LOCAL (tu Windows)
cd "C:\Users\Usuario\Desktop\Pagina Iglesia Alex\WTT"

# Crear entidad Organization
# Crear servicios
# Actualizar Event entity
# Crear guards
```

**¿Empezamos con FASE 1 ahora?**

