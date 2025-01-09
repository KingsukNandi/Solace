"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { auth } from "../../firebase";
import logger from '../logger';

const authLogger = logger.child('auth-context');

export const AuthContext = createContext({});

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        authLogger.info(
          { userId: user.uid, email: user.email },
          'User authenticated'
        );
        setUser(user);
      } else {
        authLogger.info('User signed out');
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      authLogger.info('Initiating Google sign-in');
      await signInWithPopup(auth, provider);
    } catch (error) {
      authLogger.error(
        { error: error.message },
        'Google sign-in failed'
      );
      throw error;
    }
  };

  const logOut = async () => {
    try {
      authLogger.info({ userId: user?.uid }, 'Logging out user');
      await signOut(auth);
    } catch (error) {
      authLogger.error(
        { error: error.message },
        'Logout failed'
      );
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, signIn, logOut }}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}
