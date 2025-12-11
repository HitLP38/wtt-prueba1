-- =====================================================
-- Script de Migración: Índices Multi-Tenant
-- =====================================================
-- Este script agrega índices optimizados para multi-tenancy
-- Ejecutar con: psql -h localhost -U wtt_user -d wtt_db -f scripts/migrations/add-organization-indexes.sql

-- =====================================================
-- 1. ORGANIZATIONS
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_organizations_slug ON organizations(slug);
CREATE INDEX IF NOT EXISTS idx_organizations_code ON organizations(organization_code);
CREATE INDEX IF NOT EXISTS idx_organizations_clerk_org_id ON organizations(clerk_org_id);
CREATE INDEX IF NOT EXISTS idx_organizations_active ON organizations(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_organizations_subscription_status ON organizations(subscription_status);

-- =====================================================
-- 2. USERS
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);
CREATE INDEX IF NOT EXISTS idx_users_organization_id ON users(organization_id);
CREATE INDEX IF NOT EXISTS idx_users_org_role ON users(organization_id, role) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_users_org_active ON users(organization_id, is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- =====================================================
-- 3. EVENTS
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_events_organization_id ON events(organization_id);
CREATE INDEX IF NOT EXISTS idx_events_org_active ON events(organization_id, is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_events_org_dates ON events(organization_id, start_date, end_date);

-- =====================================================
-- 4. REFEREES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_referees_organization_id ON referees(organization_id);
CREATE INDEX IF NOT EXISTS idx_referees_org_active ON referees(organization_id, is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_referees_clerk_id ON referees(clerk_id);

-- =====================================================
-- 5. TABLES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_tables_organization_id ON tables(organization_id);
CREATE INDEX IF NOT EXISTS idx_tables_org_event ON tables(organization_id, event_id);
CREATE INDEX IF NOT EXISTS idx_tables_org_status ON tables(organization_id, status) WHERE is_active = true;

-- =====================================================
-- 6. MATCHES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_matches_organization_id ON matches(organization_id);
CREATE INDEX IF NOT EXISTS idx_matches_org_event ON matches(organization_id, event_id);
CREATE INDEX IF NOT EXISTS idx_matches_org_status ON matches(organization_id, status);
CREATE INDEX IF NOT EXISTS idx_matches_org_event_status ON matches(organization_id, event_id, status);

-- =====================================================
-- 7. TEAMS
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_teams_organization_id ON teams(organization_id);
CREATE INDEX IF NOT EXISTS idx_teams_org_event ON teams(organization_id, event_id);

-- =====================================================
-- 8. CATEGORIES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_categories_organization_id ON categories(organization_id);
CREATE INDEX IF NOT EXISTS idx_categories_org_event ON categories(organization_id, event_id);
CREATE INDEX IF NOT EXISTS idx_categories_modality_gender ON categories(modality, gender) WHERE is_active = true;

-- =====================================================
-- 9. MODALITIES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_modalities_organization_id ON modalities(organization_id);
CREATE INDEX IF NOT EXISTS idx_modalities_org_event ON modalities(organization_id, event_id);

-- =====================================================
-- 10. EVENT_BASIC_INFO
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_event_basic_info_organization_id ON event_basic_info(organization_id);

-- =====================================================
-- 11. EVENT_AWARDS
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_event_awards_organization_id ON event_awards(organization_id);

-- =====================================================
-- 12. EVENT_EQUIPMENT
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_event_equipment_organization_id ON event_equipment(organization_id);

-- =====================================================
-- 13. EVENT_REGISTRATION
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_event_registration_organization_id ON event_registration(organization_id);
CREATE INDEX IF NOT EXISTS idx_event_registration_dates ON event_registration(registration_start_date, registration_end_date);

-- =====================================================
-- 14. EVENT_SEEDING_RULES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_event_seeding_rules_organization_id ON event_seeding_rules(organization_id);

-- =====================================================
-- 15. COMPETITION_SYSTEMS
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_competition_systems_organization_id ON competition_systems(organization_id);

-- =====================================================
-- 16. CONFIGURATION_TEMPLATES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_config_templates_organization_id ON configuration_templates(organization_id);
CREATE INDEX IF NOT EXISTS idx_config_templates_org_active ON configuration_templates(organization_id, is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_config_templates_public ON configuration_templates(is_public) WHERE is_public = true AND is_active = true;
CREATE INDEX IF NOT EXISTS idx_config_templates_category ON configuration_templates(category);
CREATE INDEX IF NOT EXISTS idx_config_templates_name ON configuration_templates(name);
-- Índice GIN para búsqueda en array de tags
CREATE INDEX IF NOT EXISTS idx_config_templates_tags_gin ON configuration_templates USING GIN(tags);

-- =====================================================
-- 17. TEMPLATE_VERSIONS
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_template_versions_template_id ON template_versions(template_id);
CREATE INDEX IF NOT EXISTS idx_template_versions_created_by ON template_versions(created_by);

-- =====================================================
-- Verificar índices creados
-- =====================================================
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM 
    pg_indexes
WHERE 
    tablename IN (
        'organizations', 'users', 'events', 'referees', 'tables', 'matches', 'teams',
        'categories', 'modalities', 'event_basic_info', 'event_awards', 
        'event_equipment', 'event_registration', 'event_seeding_rules', 'competition_systems'
    )
    AND indexname LIKE 'idx_%'
ORDER BY 
    tablename, indexname;

-- =====================================================
-- ✅ Migración completada
-- =====================================================

