import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../config/firebase';
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';

type User = FirebaseAuthTypes.User;

interface UserContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      console.error('Firebase Auth is not initialized');
      return;
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signOut = async () => {
    try {
      if (!auth) {
        throw new Error('Firebase Auth is not initialized');
      }
      await auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, signOut }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext); 