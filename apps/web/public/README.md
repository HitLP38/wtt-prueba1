# 📁 Carpeta Public - Archivos Estáticos

Esta carpeta contiene todos los archivos estáticos de la aplicación Next.js.

## 🎨 Logos Requeridos

Coloca los siguientes archivos en esta carpeta para que se visualicen correctamente:

### Logos Principales:
- **`logo-wtt.svg`** - Logo principal de Doyi Sports (usado en Header, Footer y Banner de evento)
  - Dimensiones recomendadas: 180x72px o proporción similar
  - Formato: SVG, PNG o JPG
- **`logo_tuni.avif`** - Logo de UNI (usado en el banner de evento junto a las fechas)
  - Dimensiones recomendadas: 40x40px o proporción similar
  - Formato: AVIF, PNG, JPG o SVG

### Logos de Partners (opcionales):
- **`logo-ittf.svg`** - Logo de ITTF (usado en Footer)
  - Dimensiones recomendadas: 96x48px
- **`logo-foundation.svg`** - Logo de Foundation (usado en Footer)
  - Dimensiones recomendadas: 96x48px

### Logos de Apps (opcionales):
- **`appstore.svg`** - Botón de descarga App Store (usado en Footer)
  - Dimensiones recomendadas: 240x72px
- **`googleplay.svg`** - Botón de descarga Google Play (usado en Footer)
  - Dimensiones recomendadas: 240x72px

### Documentos:
- **`Bases_confraternidad2025.pdf`** - Bases del evento (abre desde botón INFORMACIÓN)
  - Formato: PDF
  - Se abre en nueva ventana

## 📝 Notas Importantes:

1. **Rutas en el código**: Las imágenes se referencian como `/logo-wtt.svg` (con `/` al inicio)
2. **Formato recomendado**: SVG para mejor calidad y escalabilidad
3. **Si no tienes los logos**: Los componentes mostrarán el `alt` text mientras no existan los archivos
4. **Actualizar logo principal**: Solo reemplaza el archivo `logo-wtt.svg` con tu logo

## 🖼️ Para usar tu logo de Doyi Sports:

Si tienes el logo de Doyi Sports:
1. Renómbralo a `logo-wtt.svg` (o `logo-wtt.png` si es PNG)
2. Colócalo en esta carpeta `public/`
3. El logo se mostrará automáticamente en Header y Footer

