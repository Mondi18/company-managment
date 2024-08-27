import { User, onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect, useMemo, PropsWithChildren } from 'react';
import { auth, loginPopup, logout } from '../firebase';
import { authContext } from './auth-context';
import { AuthContext } from './types';

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(
    () =>
      onAuthStateChanged(auth, async (newUser) => {
        setUser(newUser);
        setLoading(false);
      }),
    []
  );

  const value = useMemo<AuthContext>(
    () => ({
      user,
      loginWithGoogle: loginPopup,
      logout,
    }),
    [user]
  );
  return <authContext.Provider value={value}> {!loading && children}</authContext.Provider>;
};