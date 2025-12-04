# 📦 Instalación de Dependencias

Después de implementar las optimizaciones, necesitas instalar las siguientes dependencias:

## 1. Rate Limiting (Crítico)

```bash
cd services/gateway
npm install @nestjs/throttler
```

## 2. Recompilar Common Package

El paquete `@wtt/common` ahora incluye Redis, necesitas recompilarlo:

```bash
cd packages/common
npm install
npm run build
```

## 3. Recompilar Servicios

Después de instalar dependencias, recompila los servicios:

```bash
# Desde la raíz del proyecto
cd services/gateway && npm run build
cd ../eventos && npm run build
cd ../inscriptions && npm run build
cd ../teams && npm run build
cd ../matches && npm run build
```

## ⚠️ Errores Resueltos

- ✅ Eliminado `cache.decorator.ts` (no era necesario ahora)
- ✅ Agregado `redis` a `packages/common`
- ✅ Logging optimizado en todos los servicios

## 🔧 Si los errores persisten

Ejecuta desde la raíz:
```bash
npm install
# Luego recompila todo
npm run build
```

