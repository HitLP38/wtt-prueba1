-- =====================================================
-- SCRIPT DE SEED - DATOS MÍNIMOS PARA PRUEBAS
-- =====================================================
-- Ejecutar con: psql -h localhost -U wtt_user -d wtt_db -f scripts/seeds/seed.sql

-- Habilitar extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. EVENTOS
-- =====================================================
INSERT INTO events (
  id, 
  name, 
  description, 
  "startDate", 
  "endDate", 
  venue,
  address,
  "registrationDeadline",
  "prizeMoney",
  "maxTables",
  "isActive", 
  "createdAt", 
  "updatedAt"
)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'Confraternidad UNI 2025',
  'Torneo de tenis de mesa - Confraternidad UNI 2025',
  '2025-12-20 09:30:00',
  '2025-12-20 18:00:00',
  'Antiguo gimnasio UNI',
  'Av. Tupac Amaru N° 210, Rímac - Lima, Perú',
  '2025-12-15 23:59:59',
  5000.00,
  5,
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 2. MESAS (TABLES)
-- =====================================================
INSERT INTO tables (
  id, 
  "eventId", 
  "tableNumber", 
  "isActive", 
  status,
  location,
  "createdAt", 
  "updatedAt"
)
VALUES
  (uuid_generate_v4(), '550e8400-e29b-41d4-a716-446655440000', 1, true, 'available', 'Sala Principal', NOW(), NOW()),
  (uuid_generate_v4(), '550e8400-e29b-41d4-a716-446655440000', 2, true, 'available', 'Sala Principal', NOW(), NOW()),
  (uuid_generate_v4(), '550e8400-e29b-41d4-a716-446655440000', 3, true, 'available', 'Sala Secundaria', NOW(), NOW()),
  (uuid_generate_v4(), '550e8400-e29b-41d4-a716-446655440000', 4, true, 'available', 'Sala Secundaria', NOW(), NOW()),
  (uuid_generate_v4(), '550e8400-e29b-41d4-a716-446655440000', 5, true, 'available', 'Sala Principal', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- =====================================================
-- 3. ÁRBITROS (REFEREES)
-- =====================================================
INSERT INTO referees (
  id,
  "clerkId",
  "firstName",
  "lastName",
  email,
  phone,
  "licenseNumber",
  "isActive",
  "matchesAssigned",
  "createdAt",
  "updatedAt"
)
VALUES
  (
    '660e8400-e29b-41d4-a716-446655440001',
    'referee_juan_perez',
    'Juan',
    'Pérez',
    'juan.perez@wtt.com',
    '+51 999 111 222',
    'ITTF-2024-001',
    true,
    0,
    NOW(),
    NOW()
  ),
  (
    '660e8400-e29b-41d4-a716-446655440002',
    'referee_maria_gonzalez',
    'María',
    'González',
    'maria.gonzalez@wtt.com',
    '+51 999 333 444',
    'ITTF-2024-002',
    true,
    0,
    NOW(),
    NOW()
  ),
  (
    '660e8400-e29b-41d4-a716-446655440003',
    'referee_carlos_rodriguez',
    'Carlos',
    'Rodríguez',
    'carlos.rodriguez@wtt.com',
    '+51 999 555 666',
    'ITTF-2024-003',
    true,
    0,
    NOW(),
    NOW()
  )
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 4. PERMISOS ÁRBITRO-EVENTO (EVENT_REFEREES)
-- =====================================================
INSERT INTO event_referees (
  id,
  "eventId",
  "refereeId",
  "isEnabled",
  "enabledBy",
  "enabledAt",
  "createdAt",
  "updatedAt"
)
VALUES
  (
    uuid_generate_v4(),
    '550e8400-e29b-41d4-a716-446655440000',
    '660e8400-e29b-41d4-a716-446655440001',
    true,
    'admin',
    NOW(),
    NOW(),
    NOW()
  ),
  (
    uuid_generate_v4(),
    '550e8400-e29b-41d4-a716-446655440000',
    '660e8400-e29b-41d4-a716-446655440002',
    true,
    'admin',
    NOW(),
    NOW(),
    NOW()
  ),
  (
    uuid_generate_v4(),
    '550e8400-e29b-41d4-a716-446655440000',
    '660e8400-e29b-41d4-a716-446655440003',
    true,
    'admin',
    NOW(),
    NOW(),
    NOW()
  )
ON CONFLICT DO NOTHING;

-- =====================================================
-- 5. CONFIGURACIÓN DEL EVENTO (EVENT_SETTINGS)
-- =====================================================
INSERT INTO event_settings (
  id,
  "eventId",
  "defaultSetsToWin",
  "finalSetsToWin",
  "allowTableUnfolding",
  "matchDurationEstimate",
  "tableChangeTime",
  "createdAt",
  "updatedAt"
)
VALUES (
  uuid_generate_v4(),
  '550e8400-e29b-41d4-a716-446655440000',
  5,
  7,
  true,
  30,
  15,
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;

-- =====================================================
-- 6. JUGADORES DE PRUEBA (PLAYERS)
-- =====================================================
INSERT INTO players (
  id,
  "clerkId",
  "firstName",
  "lastName",
  email,
  phone,
  whatsapp,
  "dateOfBirth",
  "licenseNumber",
  club,
  nationality,
  "currentRanking",
  "createdAt",
  "updatedAt"
)
VALUES
  (
    '770e8400-e29b-41d4-a716-446655440001',
    'player_pedro_sanchez',
    'Pedro',
    'Sánchez',
    'pedro.sanchez@example.com',
    '+51 999 777 888',
    '+51 999 777 888',
    '1995-05-15',
    'PER-2024-001',
    'Club UNI',
    'Perú',
    0,
    NOW(),
    NOW()
  ),
  (
    '770e8400-e29b-41d4-a716-446655440002',
    'player_luis_martinez',
    'Luis',
    'Martínez',
    'luis.martinez@example.com',
    '+51 999 888 999',
    '+51 999 888 999',
    '1998-08-20',
    'PER-2024-002',
    'Club UNI',
    'Perú',
    0,
    NOW(),
    NOW()
  )
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 7. EQUIPOS DE PRUEBA (TEAMS)
-- =====================================================
INSERT INTO teams (
  id,
  name,
  "coachId",
  "eventId",
  "categoryId",
  "coachWhatsApp",
  "membersCount",
  "createdAt",
  "updatedAt"
)
VALUES (
  '880e8400-e29b-41d4-a716-446655440001',
  'Equipo UNI A',
  'coach_1',
  '550e8400-e29b-41d4-a716-446655440000',
  'categoria_mixto',
  '+51 999 111 000',
  4,
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;

-- =====================================================
-- RESUMEN DE DATOS INSERTADOS
-- =====================================================
SELECT 
  'Events' as tabla,
  COUNT(*) as cantidad 
FROM events
UNION ALL
SELECT 'Tables', COUNT(*) FROM tables
UNION ALL
SELECT 'Referees', COUNT(*) FROM referees
UNION ALL
SELECT 'Event Referees', COUNT(*) FROM event_referees
UNION ALL
SELECT 'Event Settings', COUNT(*) FROM event_settings
UNION ALL
SELECT 'Players', COUNT(*) FROM players
UNION ALL
SELECT 'Teams', COUNT(*) FROM teams;

-- Mensaje de confirmación
SELECT '✅ Seed completado exitosamente!' as mensaje;

