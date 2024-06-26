import { createContext, useState, useEffect } from 'react';

export const UserContext = createContext({
  user: null,
  setUser: () => {}
});


export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
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