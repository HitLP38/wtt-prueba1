# 🔍 Cómo Encontrar la IP de tu VPS

## 📋 Opción 1: Si ya tienes acceso SSH

**Si normalmente te conectas así:**
```bash
ssh root@a474420503
```

**O así:**
```bash
ssh root@192.168.1.100
```

Usa la **misma dirección** para `scp`.

---

## 📋 Opción 2: Verificar desde el VPS

**Si ya estás conectado al VPS, ejecuta:**

```bash
# Ver IP pública
curl ifconfig.me

# O ver todas las IPs
ip addr show

# O más simple
hostname -I
```

Luego usa esa IP en los comandos `scp`.

---

## 📋 Opción 3: Verificar desde tu máquina local

**En PowerShell, intenta:**

```powershell
# Ver si tienes un archivo de configuración SSH
cat $env:USERPROFILE\.ssh\config
```

---

## 💡 Ejemplo de comandos corregidos

**Si tu IP es, por ejemplo, `123.45.67.89`:**

```powershell
scp -r "WTT\services\gateway\src\guards" root@123.45.67.89:/var/www/WTT/services/gateway/src/
```

**O si usas un dominio:**

```powershell
scp -r "WTT\services\gateway\src\guards" root@tu-servidor.com:/var/www/WTT/services/gateway/src/
```

---

## 🔧 Alternativa: Usar la misma conexión que SSH

**Si normalmente te conectas con:**

```bash
ssh -p 22 root@a474420503
```

**Entonces usa en `scp`:**

```powershell
scp -P 22 -r "WTT\services\gateway\src\guards" root@a474420503:/var/www/WTT/services/gateway/src/
```

---

## ❓ ¿Cómo te conectas normalmente?

Dime cómo te conectas al VPS normalmente y te ayudo a corregir los comandos `scp`.

