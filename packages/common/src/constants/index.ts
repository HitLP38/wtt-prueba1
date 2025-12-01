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

// User roles
export enum UserRole {
  ADMIN = 'admin',
  REFEREE = 'referee',
  COACH = 'coach',
  PLAYER = 'player',
  VIEWER = 'viewer',
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


