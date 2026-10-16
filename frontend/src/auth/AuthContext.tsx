import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { api } from '../api/client';

export type CampusUser = { id: number; name: string; email: string; role: 'STUDENT' | 'FACULTY' | 'ADMIN' };
type AuthResponse = { token: string; user: CampusUser };
type AuthContextValue = {
  user: CampusUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CampusUser | null>(() => {
    const saved = localStorage.getItem('campusconnect_user');
    try { return saved ? JSON.parse(saved) as CampusUser : null; } catch { return null; }
  });
  const [loading] = useState(false);

  function save(data: AuthResponse) {
    localStorage.setItem('campusconnect_token', data.token);
    localStorage.setItem('campusconnect_user', JSON.stringify(data.user));
    setUser(data.user);
  }

  async function login(email: string, password: string) {
    const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
    save(data);
  }

  async function register(name: string, email: string, password: string) {
    const { data } = await api.post<AuthResponse>('/auth/register', { name, email, password });
    save(data);
  }

  function logout() {
    localStorage.removeItem('campusconnect_token');
    localStorage.removeItem('campusconnect_user');
    setUser(null);
  }

  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used within AuthProvider');
  return value;
}
