import { createContext, useState, ReactNode, useEffect } from 'react';

export type ContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export type User = {
  id: string;
  full_name: string;
  birth: number;
  gender: 'M' | 'F';
  zip_code: string;
};

export const UserContext = createContext<ContextType | undefined>(undefined);

type UserProviderProps = {
  children: ReactNode;
};

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(() => {
    const userFromStorage = localStorage.getItem('user');
    return userFromStorage ? JSON.parse(userFromStorage) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};