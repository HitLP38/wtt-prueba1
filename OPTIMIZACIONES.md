# 🚀 Optimizaciones Implementadas

Este documento detalla las optimizaciones críticas y necesarias implementadas para mejorar el rendimiento, escalabilidad y estabilidad del sistema.

## ✅ Implementado

### 1. **Rate Limiting** 🛡️
- **Librería**: `@nestjs/throttler`
- **Configuración**: 100 requests por minuto por IP
- **Ubicación**: `services/gateway/src/app.module.ts`
- **Beneficio**: Protección contra abuso y DDoS, previene sobrecarga del servidor

### 2. **Logging Optimizado** 📝
- **Producción**: Solo logs `warn` y `error`
- **Desarrollo**: Todos los niveles (`log`, `debug`, `warn`, `error`)
- **Aplicado en**: Todos los servicios (Gateway, Eventos, Inscriptions, Teams, Matches)
- **Beneficio**: Reduce CPU y uso de disco en producción

### 3. **Índices PostgreSQL** 🔍
Optimización de consultas con índices estratégicos:

#### Event Entity
- `startDate`, `endDate` - Consultas por rango de fechas
- `isActive` - Filtrado de eventos activos

#### Inscription Entity
- `eventId` - Consultas por evento (muy frecuente)
- `playerId` - Consultas por jugador
- `status` - Filtrado por estado
- `eventId`, `status` - Consultas combinadas

#### Team Entity
- `eventId` - Consultas por evento
- `coachId` - Consultas por coach
- `eventId`, `coachId` - Consultas combinadas

#### Match Entity
- `eventId` - Consultas por evento
- `status` - Filtrado por estado (crítico para WebSockets)
- `tableNumber` - Búsqueda por mesa
- `eventId`, `status` - Consultas combinadas
- `round` - Consultas por ronda
- `refereeId` - Consultas por árbitro

**Beneficio**: Consultas hasta 10x más rápidas, menos carga en PostgreSQL

### 4. **Caching con Redis** 💾
- **Servicio**: `packages/common/src/cache/cache.service.ts`
- **Funcionalidades**:
  - Get/Set con TTL
  - Delete por clave o patrón
  - Verificación de existencia
- **Uso**: Implementar en servicios que consultan datos frecuentemente
- **Beneficio**: Reduce consultas a PostgreSQL, respuestas más rápidas

### 5. **PM2 Cluster Mode** ⚡
- **Configuración**: `ecosystem.config.js`
- **Modo**: Cluster (múltiples instancias)
- **Gateway**: Usa todos los cores disponibles
- **Microservicios**: 2 instancias cada uno para balanceo
- **Límite de memoria**: Auto-restart si excede límite
- **Logs**: Centralizados en carpeta `logs/`

**Beneficio**: Aprovecha todos los cores del CPU, multiplica la capacidad del servidor

## 📋 Instrucciones de Uso

### Instalar dependencias
```bash
cd services/gateway
npm install @nestjs/throttler
```

### Usar PM2 (Recomendado para Producción)

#### Iniciar todos los servicios
```bash
pm2 start ecosystem.config.js
```

#### Iniciar solo un servicio
```bash
pm2 start ecosystem.config.js --only gateway
```

#### Modo producción
```bash
pm2 start ecosystem.config.js --env production
```

#### Ver logs
```bash
pm2 logs                    # Todos los servicios
pm2 logs gateway           # Solo gateway
```

#### Monitoreo
```bash
pm2 monit                  # Monitor en tiempo real
pm2 status                 # Estado de todos los procesos
```

#### Reiniciar
```bash
pm2 restart all            # Todos
pm2 restart gateway        # Solo gateway
```

#### Detener
```bash
pm2 stop all
pm2 delete all
```

### Usar Cache Service

```typescript
// En tu servicio
import { CacheService } from '@wtt/common/cache/cache.service';

constructor(private readonly cacheService: CacheService) {}

async getEvent(eventId: string) {
  // Intentar obtener del cache
  const cached = await this.cacheService.get(`event:${eventId}`);
  if (cached) return cached;

  // Si no está en cache, consultar DB
  const event = await this.repository.findOne({ where: { id: eventId } });

  // Guardar en cache por 5 minutos
  await this.cacheService.set(`event:${eventId}`, event, 300);

  return event;
}

// Invalidar cache cuando se actualiza
async updateEvent(eventId: string, data: any) {
  await this.repository.update(eventId, data);
  await this.cacheService.delete(`event:${eventId}`);
}
```

## 📊 Mejoras de Rendimiento Esperadas

| Optimización | Mejora Esperada |
|-------------|-----------------|
| Rate Limiting | Prevención de sobrecarga |
| Logging Optimizado | -30% CPU en producción |
| Índices PostgreSQL | 5-10x más rápido en consultas |
| Caching Redis | 50-80% menos queries a DB |
| PM2 Cluster | 2-4x más capacidad (según cores) |

## 🔄 Próximos Pasos (Opcionales)

1. **BullMQ para tareas pesadas** - Cuando necesites generar PDFs masivos o procesar notificaciones
2. **Separar WebSockets** - Si el tráfico de WebSockets crece significativamente
3. **CDN para Frontend** - Exportar Next.js como estático y servir desde CDN
4. **Separar DB en otro VPS** - Cuando el VPS actual se sature

## 📝 Notas

- Los índices se crearán automáticamente al ejecutar las migraciones de TypeORM
- El rate limiting está configurado globalmente, puedes desactivarlo en rutas específicas con `@SkipThrottle()`
- PM2 mantiene los procesos vivos automáticamente (auto-restart)
- Los logs rotan automáticamente (configurar logrotate si es necesario)

