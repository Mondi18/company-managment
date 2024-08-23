import { User } from 'firebase/auth';

export type AuthContext = {
  user: User | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};
