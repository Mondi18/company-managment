import { User } from 'firebase/auth';
import { UserRole } from '../data/type';

export type AuthContext = {
  user: User | null;
  role: UserRole | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};
