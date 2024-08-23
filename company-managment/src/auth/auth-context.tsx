import React from 'react';
import { AuthContext } from './types';
import { loginPopup, logout } from '../firebase';

export const authContext = React.createContext<AuthContext>({
  loginWithGoogle: loginPopup,
  logout,
  user: null,
});