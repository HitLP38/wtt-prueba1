# Script para crear el archivo .env.local del frontend
# Ejecutar desde PowerShell en la raíz del proyecto WTT

$envFilePath = "apps\web\.env.local"
$envContent = "NEXT_PUBLIC_API_URL=http://149.33.24.31:3001"

# Verificar si el archivo ya existe
if (Test-Path $envFilePath) {
    Write-Host "⚠️  El archivo .env.local ya existe en: $envFilePath" -ForegroundColor Yellow
    Write-Host "Contenido actual:" -ForegroundColor Yellow
    Get-Content $envFilePath
    Write-Host ""
    $sobrescribir = Read-Host "¿Deseas sobrescribirlo? (s/n)"
    if ($sobrescribir -ne "s") {
        Write-Host "❌ Operación cancelada." -ForegroundColor Red
        exit
    }
}

# Crear el archivo
try {
    Set-Content -Path $envFilePath -Value $envContent -Encoding UTF8
    Write-Host "✅ Archivo .env.local creado exitosamente en:" -ForegroundColor Green
    Write-Host "   $envFilePath" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📄 Contenido:" -ForegroundColor Yellow
    Write-Host "   $envContent" -ForegroundColor White
    Write-Host ""
    Write-Host "🎉 ¡Listo! Ahora puedes ejecutar 'npm run dev:web' para iniciar el frontend." -ForegroundColor Green
} catch {
    Write-Host "❌ Error al crear el archivo: $_" -ForegroundColor Red
    exit 1
}

