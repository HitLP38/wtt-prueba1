import { MatchStatus, InscriptionStatus, UserRole, MatchType } from '../constants';

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User extends BaseEntity {
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
}

export interface Event extends BaseEntity {
  name: string;
  description: string;
  bannerUrl?: string;
  startDate: Date;
  endDate: Date;
  basesUrl?: string; // PDF de las bases
  isActive: boolean;
}

export interface Inscription extends BaseEntity {
  eventId: string;
  playerId: string;
  category: string;
  division: 'masculino' | 'femenino' | 'mixto';
  club: string;
  paymentReceiptUrl?: string;
  status: InscriptionStatus;
  validatedBy?: string;
  validatedAt?: Date;
  rejectionReason?: string;
}

export interface Team extends BaseEntity {
  name: string;
  coachId: string;
  eventId: string;
  players: TeamPlayer[];
}

export interface TeamPlayer extends BaseEntity {
  teamId: string;
  playerId: string;
  position: string;
  isReserve: boolean;
}

export interface TeamLineup extends BaseEntity {
  teamId: string;
  matchId: string;
  s1PlayerId: string;
  s2PlayerId: string;
  dPlayer1Id: string;
  dPlayer2Id: string;
  s3PlayerId: string;
  s4PlayerId: string;
  isValid: boolean;
  validationErrors?: string[];
}

export interface Match extends BaseEntity {
  eventId: string;
  matchType: MatchType;
  tableNumber?: number;
  round: string;
  player1Id?: string;
  player2Id?: string;
  team1Id?: string;
  team2Id?: string;
  status: MatchStatus;
  refereeId?: string;
  startedAt?: Date;
  completedAt?: Date;
}

export interface Set extends BaseEntity {
  matchId: string;
  setNumber: number;
  player1Score: number;
  player2Score: number;
  isCompleted: boolean;
}

export interface MatchIncident extends BaseEntity {
  matchId: string;
  type: 'yellow_card' | 'red_card' | 'timeout' | 'side_change' | 'other';
  description?: string;
  timestamp: Date;
}


