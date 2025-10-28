import { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'admin' | 'procurement' | 'sales' | 'inventory' | 'pharmacy';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('pharmacy_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email: string, password: string) => {
    // Mock login - in real app, this would call an API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock user based on email
    let role: UserRole = 'admin';
    if (email.includes('procurement')) role = 'procurement';
    else if (email.includes('sales')) role = 'sales';
    else if (email.includes('inventory')) role = 'inventory';
    else if (email.includes('pharmacy')) role = 'pharmacy';
    
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0],
      email,
      role,
    };
    
    setUser(newUser);
    localStorage.setItem('pharmacy_user', JSON.stringify(newUser));
  };

  const signup = async (name: string, email: string, password: string, role: UserRole) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role,
    };
    
    setUser(newUser);
    localStorage.setItem('pharmacy_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pharmacy_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
