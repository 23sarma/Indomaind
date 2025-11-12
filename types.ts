// FIX: Import React to resolve 'Cannot find namespace React' error.
import React from 'react';

export interface User {
  email: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isAdmin: boolean;
}

export enum AuthView {
  LOGIN,
  REGISTER,
  ADMIN_LOGIN,
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  isImplemented: boolean;
  component: React.ComponentType<any> | null;
  enabled: boolean;
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

export interface HistoryEntry {
  id: string;
  timestamp: Date;
  role: 'user' | 'model' | 'admin' | 'system';
  text: string;
  context?: 'admin';
}
