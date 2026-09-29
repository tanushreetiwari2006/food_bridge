import { createContext, useContext, useState, type ReactNode } from 'react';
import type { AuthUser, Role, Helper } from '@/types';

interface AuthContextValue {
  user: AuthUser | null;
  pendingRole: Role | null;
  pendingPhone: string | null;
  setPendingRole: (role: Role | null) => void;
  setPendingPhone: (phone: string | null) => void;
  login: (user: AuthUser) => void;
  logout: () => void;
  helpers: Helper[];
  addHelper: (name: string, phone: string) => void;
  removeHelper: (id: string) => void;
  isRegisteredHelper: (phone: string) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'fb-auth-user';
const HELPERS_KEY = 'fb-helpers';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  });
  const [pendingRole, setPendingRole] = useState<Role | null>(null);
  const [pendingPhone, setPendingPhone] = useState<string | null>(null);

  const [helpers, setHelpers] = useState<Helper[]>(() => {
    const saved = localStorage.getItem(HELPERS_KEY);
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'h-demo',
        name: 'Ramesh',
        phone: '9876501234',
        ownerId: 'd1',
        ownerName: 'Sharma Caterers',
        ownerRole: 'donor',
      },
    ];
  });

  const login = (newUser: AuthUser) => {
    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const addHelper = (name: string, phone: string) => {
    if (!user) return;
    const newHelper: Helper = {
      id: `h${Date.now()}`,
      name,
      phone,
      ownerId: user.id,
      ownerName: user.name,
      ownerRole: user.role as 'donor' | 'ngo',
    };
    const updated = [...helpers, newHelper];
    setHelpers(updated);
    localStorage.setItem(HELPERS_KEY, JSON.stringify(updated));
  };

  const removeHelper = (id: string) => {
    const updated = helpers.filter((h) => h.id !== id);
    setHelpers(updated);
    localStorage.setItem(HELPERS_KEY, JSON.stringify(updated));
  };

  const isRegisteredHelper = (phone: string) => {
    return helpers.some((h) => h.phone === phone);
  };

  return (
    <AuthContext.Provider value={{ user, pendingRole, pendingPhone, setPendingRole, setPendingPhone, login, logout, helpers, addHelper, removeHelper, isRegisteredHelper }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
