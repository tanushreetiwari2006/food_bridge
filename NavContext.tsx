import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Role } from '@/types';

export type Page = 'home' | 'board' | 'donor' | 'ngo' | 'volunteer' | 'admin' | 'login';

interface NavContextValue {
  page: Page;
  role: Role | null;
  setPage: (page: Page) => void;
  setRole: (role: Role | null) => void;
  navigate: (page: Page, role?: Role) => void;
}

const NavContext = createContext<NavContextValue | undefined>(undefined);

export function NavProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<Page>('home');
  const [role, setRole] = useState<Role | null>(null);

  const navigate = (newPage: Page, newRole?: Role) => {
    if (newRole !== undefined) setRole(newRole);
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <NavContext.Provider value={{ page, role, setPage, setRole, navigate }}>
      {children}
    </NavContext.Provider>
  );
}

export function useNav() {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error('useNav must be used within NavProvider');
  return ctx;
}
