import { useState, useCallback } from 'react';
import client from '../api/client';
import type { User } from '../types/index';
import { useAuth } from '../context/AuthContext';

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const loginUser = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await client.post('/auth/login', { email, password });
        const { user, accessToken } = response.data.data;
        login(user, accessToken);
        return { success: true };
      } catch (err: any) {
        const errorMsg = err.response?.data?.error || 'Login failed';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [login]
  );

  return { loginUser, loading, error };
}

export function useSignup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const signupUser = useCallback(
    async (email: string, password: string, firstName: string, lastName: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await client.post('/auth/signup', {
          email,
          password,
          firstName,
          lastName,
        });
        const { user, accessToken } = response.data.data;
        login(user, accessToken);
        return { success: true };
      } catch (err: any) {
        const errorMsg = err.response?.data?.error || 'Signup failed';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [login]
  );

  return { signupUser, loading, error };
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const response = await client.get('/auth/me');
      setUser(response.data.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return { user, loading, fetchUser };
}
