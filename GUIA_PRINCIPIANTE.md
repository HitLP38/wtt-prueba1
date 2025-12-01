# 📚 Guía Completa para Principiantes - WTT Platform

## 🗂️ ¿Dónde ejecutar los comandos?

### Ruta exacta donde debes trabajar:

```
C:\Users\Usuario\Desktop\Pagina Iglesia Alex\WTT
```

Esta es la **raíz del proyecto**. Todos los comandos de PowerShell se ejecutan aquí.

### Cómo llegar a esta ruta:

**Opción 1: Desde PowerShell**
```powershell
# Abre PowerShell y escribe:
cd "C:\Users\Usuario\Desktop\Pagina Iglesia Alex\WTT"

# Verifica que estás en el lugar correcto:
dir
# Deberías ver: package.json, services, apps, packages, etc.
```

**Opción 2: Desde el Explorador de Archivos**
1. Abre el Explorador de Windows
2. Navega a: `C:\Users\Usuario\Desktop\Pagina Iglesia Alex\WTT`
3. Haz clic derecho en la carpeta `WTT`
4. Selecciona "Abrir en Terminal" o "Abrir PowerShell aquí"

**Opción 3: Desde VS Code (Recomendado)**
1. Abre VS Code
2. File → Open Folder
3. Selecciona la carpeta `WTT`
4. Abre la terminal integrada (Ctrl + `)
5. La terminal ya estará en la ruta correcta

### Verificar que estás en la ruta correcta:

```powershell
# Este comando muestra dónde estás
pwd

# Debería mostrar:
# C:\Users\Usuario\Desktop\Pagina Iglesia Alex\WTT
```

---

## 🐳 ¿Qué es Docker y por qué lo usamos?

### ¿Qué es Docker?

Docker es una herramienta que permite ejecutar aplicaciones en "contenedores". Piensa en un contenedor como una caja que contiene:
- Una aplicación (PostgreSQL, Redis, etc.)
- Todo lo que necesita para funcionar
- Configuraciones específicas

### ¿Por qué usar Docker?

#### ✅ Ventajas:

1. **Facilidad de instalación**
   - Sin Docker: Tendrías que instalar PostgreSQL, Redis, configurarlos, crear bases de datos, etc. (complicado y propenso a errores)
   - Con Docker: Un solo comando (`npm run docker:up`) y todo está listo

2. **Consistencia**
   - Funciona igual en tu computadora, en la de tu amigo, y en el servidor
   - Mismas versiones, mismas configuraciones

3. **Aislamiento**
   - No interfiere con otras aplicaciones en tu computadora
   - Puedes tener múltiples proyectos con diferentes versiones de PostgreSQL sin conflictos

4. **Fácil de limpiar**
   - Si algo falla, solo detienes y eliminas el contenedor
   - No deja archivos residuales en tu sistema

5. **Producción = Desarrollo**
   - Lo que funciona en tu computadora funcionará en el servidor
   - Mismo entorno, menos sorpresas

#### ❌ Alternativa sin Docker:

Tendrías que:
1. Descargar PostgreSQL para Windows
2. Instalarlo manualmente
3. Configurar usuario, contraseña, base de datos
4. Descargar Redis para Windows
5. Instalarlo y configurarlo
6. Asegurarte de que ambos estén corriendo siempre
7. Configurar todo de nuevo en el servidor

**Con Docker:** Un comando y listo ✅

### ¿Es necesario Docker?

**Para desarrollo local:** No es estrictamente necesario, pero **muy recomendado** porque:
- Ahorra tiempo
- Evita problemas de configuración
- Es el estándar de la industria

**Para producción:** Depende de tu hosting. Si tu amigo te da acceso a un servidor con Docker, será muy fácil. Si no, necesitarás instalar PostgreSQL y Redis directamente en el servidor.

---

## 🚀 Proceso de Deploy a Producción

### ¿Qué es Deploy?

Deploy (despliegue) significa llevar tu aplicación desde tu computadora al servidor donde estará disponible en internet.

### Opciones de Deploy:

#### Opción 1: Servidor con Docker (Más fácil) 🐳

Si tu servidor tiene Docker instalado:

1. **Subir código al servidor:**
   ```bash
   git push origin main
   ```

2. **En el servidor:**
   ```bash
   git pull origin main
   npm install
   npm run docker:up
   npm run build
   npm run start
   ```

#### Opción 2: Servidor sin Docker (Tradicional) 🖥️

Si el servidor no tiene Docker:

1. **Instalar PostgreSQL y Redis en el servidor**
2. **Configurar variables de entorno en el servidor**
3. **Subir código:**
   ```bash
   git push origin main
   ```
4. **En el servidor:**
   ```bash
   git pull origin main
   npm install
   npm run build
   npm run start
   ```

#### Opción 3: Plataformas Cloud (Más fácil aún) ☁️

**Vercel/Netlify (para frontend):**
- Conectas tu repositorio de GitHub
- Se despliega automáticamente
- Gratis para proyectos pequeños

**Railway/Render (para backend):**
- Conectas tu repositorio
- Configuras variables de entorno
- Se despliega automáticamente
- Incluye PostgreSQL y Redis

### Pasos para Deploy:

1. **Preparar el código:**
   - Asegurarte de que todo funciona localmente
   - Configurar variables de entorno de producción
   - Hacer commit y push a GitHub

2. **En el servidor:**
   - Clonar o actualizar el repositorio
   - Instalar dependencias
   - Configurar base de datos
   - Iniciar servicios

3. **Configurar dominio:**
   - Tu amigo te dará las instrucciones
   - Generalmente es configurar DNS

### Variables de Entorno para Producción:

Necesitarás crear un archivo `.env` en el servidor con:
- URLs de producción
- Credenciales de base de datos de producción
- Keys de Clerk para producción
- Etc.

---

## 📋 Comandos que faltan ejecutar

Ya tienes Docker instalado, así que solo falta:

### 1. Iniciar PostgreSQL y Redis

```powershell
# Asegúrate de estar en la ruta correcta:
cd "C:\Users\Usuario\Desktop\Pagina Iglesia Alex\WTT"

# Iniciar Docker (PostgreSQL + Redis)
npm run docker:up
```

**¿Qué hace esto?**
- Descarga imágenes de PostgreSQL y Redis (solo la primera vez)
- Crea contenedores y los inicia
- Configura la base de datos automáticamente

**Verificar que funcionó:**
```powershell
docker ps
# Deberías ver: wtt-postgres y wtt-redis
```

### 2. Iniciar todos los servicios

```powershell
# Asegúrate de estar en la ruta correcta:
cd "C:\Users\Usuario\Desktop\Pagina Iglesia Alex\WTT"

# Iniciar todos los servicios (Gateway, Eventos, Inscriptions, Teams, Matches, Frontend)
npm run dev
```

**¿Qué hace esto?**
- Inicia el Gateway (puerto 3001)
- Inicia todos los microservicios
- Inicia el frontend (puerto 3000)

**Verificar que funcionó:**
- Abre tu navegador en: http://localhost:3000
- Deberías ver la página principal

---

## 🎯 Resumen de Rutas y Comandos

### Ruta donde trabajar:
```
C:\Users\Usuario\Desktop\Pagina Iglesia Alex\WTT
```

### Comandos en orden:

```powershell
# 1. Ir a la ruta del proyecto
cd "C:\Users\Usuario\Desktop\Pagina Iglesia Alex\WTT"

# 2. Verificar que estás en el lugar correcto
dir
# Deberías ver: package.json, services, apps, etc.

# 3. Iniciar Docker (PostgreSQL + Redis)
npm run docker:up

# 4. Verificar Docker
docker ps

# 5. Iniciar todos los servicios
npm run dev
```

---

## ❓ Preguntas Frecuentes

### ¿Puedo trabajar sin Docker?
Sí, pero tendrás que instalar PostgreSQL y Redis manualmente. Docker es más fácil.

### ¿Necesito Docker en producción?
Depende. Si tu servidor lo tiene, genial. Si no, instala PostgreSQL y Redis directamente.

### ¿Cómo sé si estoy en la ruta correcta?
Ejecuta `pwd` o `dir` y verifica que ves `package.json`.

### ¿Qué pasa si cierro PowerShell?
Los servicios se detienen. Tendrás que ejecutar `npm run dev` de nuevo.

### ¿Cómo detener todo?
- Ctrl + C en la terminal donde corre `npm run dev`
- `npm run docker:down` para detener Docker

---

## 🆘 Si algo falla

1. **Verifica la ruta:** `pwd` debe mostrar la ruta de WTT
2. **Verifica Docker:** `docker ps` debe funcionar
3. **Verifica node_modules:** `dir node_modules` debe existir
4. **Lee los errores:** Los mensajes de error suelen decir qué falta

