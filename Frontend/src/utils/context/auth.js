'use client';
import { createContext, useContext } from 'react';
import { useProvideAuth } from '../hooks/auth';

const authContext = createContext();

export function useAuth() {
  return useContext(authContext);
}

export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}
