#!/bin/bash
# Script de Instalación Completa para Linux/Mac
# Ejecutar desde la raíz del proyecto: chmod +x install-all.sh && ./install-all.sh

echo "🚀 Instalando todas las dependencias..."

# 1. Instalar dependencias de packages/common
echo ""
echo "📦 Paso 1: Instalando packages/common..."
cd packages/common
npm install || exit 1
npm run build || exit 1
cd ../..
echo "✅ packages/common instalado y compilado"

# 2. Instalar servicios nuevos
echo ""
echo "📦 Paso 2: Instalando servicios nuevos..."

echo "  - Instalando services/referees..."
cd services/referees
npm install || exit 1
cd ../..

echo "  - Instalando services/notifications..."
cd services/notifications
npm install || exit 1
cd ../..

echo "  - Instalando services/players..."
cd services/players
npm install || exit 1
cd ../..

echo "✅ Servicios nuevos instalados"

# 3. Instalar dependencias desde la raíz
echo ""
echo "📦 Paso 3: Instalando dependencias raíz..."
npm install || exit 1
echo "✅ Dependencias raíz instaladas"

echo ""
echo "✅ ¡Instalación completa! Ahora puedes ejecutar: npm run dev"

