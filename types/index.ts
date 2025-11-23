export interface MahjongParlor {
  id: string;
  name: string;
  address: string;
  phoneNumber: string;
  businessHours: {
    open: string;
    close: string;
  };
  description?: string;
  currentPlayers: number;
  staffCount: number;
  maxCapacity: number;
  tables: Table[];
  waitlist: WaitlistEntry[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Table {
  id: string;
  tableNumber: number;
  isOccupied: boolean;
  currentPlayers: Player[];
  gameType: 'free' | 'tonpu' | 'hanchan';
  startedAt?: Date;
  estimatedEndTime?: Date;
}

export interface Player {
  id: string;
  name: string;
  isStaff: boolean;
  joinedAt: Date;
}

export interface WaitlistEntry {
  id: string;
  playerName: string;
  phoneNumber?: string;
  joinedAt: Date;
  estimatedWaitTime?: number;
  position: number;
}

export interface ParlorLoginRequest {
  parlorId: string;
  password: string;
}

export interface ParlorSession {
  parlorId: string;
  name: string;
  isAuthenticated: boolean;
  token: string;
  expiresAt: Date;
}

export type TableStatus = 'available' | 'occupied' | 'reserved';

export interface TableCreateRequest {
  tableNumber: number;
  gameType: 'free' | 'tonpu' | 'hanchan';
}

export interface WaitlistAddRequest {
  playerName: string;
  phoneNumber?: string;
}

export interface ParlorRegistrationRequest {
  name: string;
  address: string;
  phoneNumber: string;
  businessHours: {
    open: string;
    close: string;
  };
  description?: string;
  maxCapacity: number;
  ownerName: string;
  ownerEmail: string;
  password: string;
  confirmPassword: string;
}

export interface PasswordResetRequest {
  email?: string;
  parlorId?: string;
}