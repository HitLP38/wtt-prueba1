# Script para compilar todos los servicios antes de ejecutar dev
Write-Host "🔨 Compilando @wtt/common..." -ForegroundColor Cyan
Set-Location "packages\common"
npm run build
Set-Location "..\.."

Write-Host "🔨 Compilando servicios NestJS..." -ForegroundColor Cyan

$services = @("gateway", "eventos", "teams", "inscriptions", "matches", "referees", "notifications", "players")

foreach ($service in $services) {
    Write-Host "  📦 Compilando $service..." -ForegroundColor Yellow
    Set-Location "services\$service"
    npm run build
    Set-Location "..\.."
}

Write-Host "✅ Todos los servicios compilados!" -ForegroundColor Green

