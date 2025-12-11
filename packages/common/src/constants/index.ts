// Match constants
export const MAX_SETS = 7;
export const DEFAULT_TIMEOUT = 60; // seconds
export const SET_POINTS_TO_WIN = 11;
export const MIN_POINT_DIFFERENCE = 2;

// Match status
export enum MatchStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  WALKOVER = 'walkover',
  CANCELLED = 'cancelled',
}

// Inscription status
export enum InscriptionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

// User roles (actualizado para multi-tenant)
export enum UserRole {
  MASTER = 'MASTER', // Super admin del sistema
  ADMIN = 'ADMIN', // Admin de una organización
  REFEREE = 'REFEREE', // Árbitro
  COACH = 'COACH', // Entrenador/Representante de equipo
  PLAYER = 'PLAYER', // Jugador
  VIEWER = 'VIEWER', // Solo lectura
}

// Match types
export enum MatchType {
  SINGLES = 'singles',
  DOUBLES = 'doubles',
  TEAM = 'team',
}

// Team lineup order
export const TEAM_LINEUP_ORDER = {
  S1: 'S1', // Singles 1
  S2: 'S2', // Singles 2
  D: 'D',   // Doubles
  S3: 'S3', // Singles 3
  S4: 'S4', // Singles 4
} as const;

// Table status
export enum TableStatus {
  AVAILABLE = 'available',      // 🟢 Disponible
  IN_PROGRESS = 'in_progress',  // 🟡 En progreso
  DELAYED = 'delayed',          // 🔴 Atrasada
  LOCKED = 'locked',            // ⚪ Bloqueada
  MAINTENANCE = 'maintenance',  // ⚫ En mantenimiento
}

// Table status colors
export enum TableStatusColor {
  AVAILABLE = '#4CAF50',        // Verde
  IN_PROGRESS = '#FFC107',      // Amarillo
  DELAYED = '#F44336',          // Rojo
  LOCKED = '#9E9E9E',           // Gris
  MAINTENANCE = '#424242',      // Negro
}

// Match call status
export enum MatchCallStatus {
  NONE = 'none',
  FIRST_CALL = 'first_call',
  SECOND_CALL = 'second_call',
  THIRD_CALL = 'third_call',
  NO_SHOW = 'no_show',
}

// Notification types
export enum NotificationType {
  MATCH_CALL = 'match_call',
  MATCH_SCHEDULED = 'match_scheduled',
  MATCH_STARTED = 'match_started',
  MATCH_RESULT = 'match_result',
  LINEUP_REQUIRED = 'lineup_required',
  LINEUP_CONFIRMED = 'lineup_confirmed',
}

// Notification status
export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed',
}


