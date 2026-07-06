'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        setUser(currentUser);
        if (currentUser) {
          // Get ID token for API calls
          const token = await currentUser.getIdToken();
          setIdToken(token);
        } else {
          setIdToken(null);
        }
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Authentication error');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      setIdToken(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout error');
    }
  };

  return {
    user,
    loading,
    error,
    idToken,
    logout,
    isAuthenticated: !!user,
  };
}
