# 🚀 Plan de Implementación Completa

## 📋 Checklist de Implementación

### **FASE 1: Entidades y Base de Datos** ✅ (En progreso)

- [ ] Crear servicio `referees` con entidad Referee
- [ ] Crear entidad Table en servicio `matches`
- [ ] Crear servicio `players` con entidad Player (con WhatsApp)
- [ ] Crear entidad TeamPlayer en servicio `teams`
- [ ] Crear entidad EventReferee en servicio `events`
- [ ] Crear entidad TableLock en servicio `matches`
- [ ] Crear entidad EventSettings en servicio `events`
- [ ] Crear entidad Notification en nuevo servicio `notifications`
- [ ] Crear entidad Set en servicio `matches`
- [ ] Actualizar entidad Match (agregar callStatus, categoryId, etc.)
- [ ] Actualizar entidad Event (agregar campos nuevos)
- [ ] Actualizar entidad Team (agregar WhatsApp entrenador, categoryId)
- [ ] Actualizar entidad TeamLineup (mejorar estructura)

### **FASE 2: Servicios Backend**

- [ ] EventAccessService (permisos árbitro-evento)
- [ ] TableLockService (bloqueo de mesas)
- [ ] TableStatusService (estados con colores)
- [ ] NotificationService (WhatsApp)
- [ ] ScoringService (marcador en vivo)
- [ ] MatchDistributionService (distribución automática)
- [ ] UnfoldingService (desdoblamiento)
- [ ] LineupService (alineaciones A,X,B,Y,D)

### **FASE 3: Endpoints y Controllers**

- [ ] AdminController (panel admin completo)
- [ ] RefereesController (panel árbitro completo)
- [ ] TablesController (gestión de mesas)
- [ ] PlayersController (gestión jugadores)
- [ ] ScoringController (marcador en vivo)
- [ ] NotificationsController (notificaciones)

### **FASE 4: Frontend - Rutas Privadas**

- [ ] Página `/admin` (protegida)
- [ ] Página `/referee` (protegida)
- [ ] Guards de autenticación (Clerk)
- [ ] Middleware de roles

### **FASE 5: Frontend - Paneles**

- [ ] Panel Admin Dashboard
- [ ] Panel Admin - Gestión de Árbitros
- [ ] Panel Admin - Configuración de Eventos
- [ ] Panel Admin - Grid de Mesas con colores
- [ ] Panel Referee - Lista de eventos accesibles
- [ ] Panel Referee - Lista de partidos
- [ ] Panel Referee - Vista de marcador en vivo
- [ ] Panel Referee - Bloqueo de mesas

### **FASE 6: Formularios y Alineaciones**

- [ ] Actualizar formulario de inscripción (WhatsApp)
- [ ] Formulario de alineación de equipos (A,X,B,Y,D)
- [ ] Sistema de bloqueo de alineaciones

### **FASE 7: Sistema de Notificaciones**

- [ ] Integración WhatsApp (Twilio/Meta API)
- [ ] Notificaciones de llamados (1º, 2º, 3º)
- [ ] Notificaciones de partidos programados
- [ ] Notificaciones de resultados

### **FASE 8: Marcador en Vivo**

- [ ] Componente de marcador (diseño ITTF)
- [ ] WebSockets para tiempo real
- [ ] Controles de puntos (+/-)
- [ ] Gestión de sets
- [ ] Botones especiales (Swap Sides, Expedite, Cards)

---

## 🔄 Orden de Implementación

**Semana 1**: Entidades + Servicios Core
**Semana 2**: Endpoints + Panel Admin
**Semana 3**: Panel Referee + Marcador
**Semana 4**: Notificaciones + Alineaciones
**Semana 5**: Integración completa + Testing

---

Empezando implementación...

