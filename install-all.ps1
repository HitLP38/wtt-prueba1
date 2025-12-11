# Script de Instalación Completa para Windows PowerShell
# Ejecutar desde la raíz del proyecto: .\install-all.ps1

Write-Host "🚀 Instalando todas las dependencias..." -ForegroundColor Cyan

# 1. Instalar dependencias de packages/common
Write-Host "`n📦 Paso 1: Instalando packages/common..." -ForegroundColor Yellow
Set-Location packages/common
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error instalando packages/common" -ForegroundColor Red
    Set-Location ../..
    exit 1
}
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error compilando packages/common" -ForegroundColor Red
    Set-Location ../..
    exit 1
}
Set-Location ../..
Write-Host "✅ packages/common instalado y compilado" -ForegroundColor Green

# 2. Instalar servicios nuevos
Write-Host "`n📦 Paso 2: Instalando servicios nuevos..." -ForegroundColor Yellow

Write-Host "  - Instalando services/referees..." -ForegroundColor Gray
Set-Location services/referees
npm install
Set-Location ../..

Write-Host "  - Instalando services/notifications..." -ForegroundColor Gray
Set-Location services/notifications
npm install
Set-Location ../..

Write-Host "  - Instalando services/players..." -ForegroundColor Gray
Set-Location services/players
npm install
Set-Location ../..

Write-Host "✅ Servicios nuevos instalados" -ForegroundColor Green

# 3. Instalar dependencias desde la raíz
Write-Host "`n📦 Paso 3: Instalando dependencias raíz..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error instalando dependencias raíz" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dependencias raíz instaladas" -ForegroundColor Green

Write-Host "`n✅ ¡Instalación completa! Ahora puedes ejecutar: npm run dev" -ForegroundColor Green

