# 🔧 Solución: Error "Cannot find module dist/main"

## Problema:

Los servicios están intentando ejecutar `dist/main.js` pero no existe porque `nest start --watch` no compila automáticamente en algunos casos.

## Solución:

Necesitamos cambiar los scripts `dev` para que compilen primero. Voy a actualizar todos los `package.json` de los servicios.



