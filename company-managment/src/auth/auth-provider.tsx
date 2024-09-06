import { User, onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect, useMemo, PropsWithChildren } from 'react';
import { auth, loginPopup, logout } from '../firebase';
import { authContext } from './auth-context';
import { AuthContext } from './types';
import { CustomerUser, UserRole } from '../data/type';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (newUser) => {
      if (newUser) {
        const userDoc = await getDoc(doc(db, 'users', newUser.uid));

        if (userDoc.exists()) {
          const userData = userDoc.data() as CustomerUser;
          setUser(newUser);
          setRole(userData.role);
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
      console.log("Auth state changed:", newUser);
    });

    return () => unsubscribe();
  }, []);
  const value = useMemo<AuthContext>(
    () => ({
      user,
      role,
      loginWithGoogle: loginPopup,
      logout,
    }),
    [user, role]
  );
  return <authContext.Provider value={value}> {!loading && children}</authContext.Provider>;
};