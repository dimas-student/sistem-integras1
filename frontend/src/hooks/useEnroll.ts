import { useState, useCallback } from 'react';
import client from '../api/client';
import type { Enrollment } from '../types/index';

export function useEnrollment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enrollCourse = useCallback(async (courseId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await client.post('/enrollments', { courseId });
      return { success: true, data: response.data.data as Enrollment };
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Enrollment failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserEnrollments = useCallback(async (userId: string) => {
    setLoading(true);
    try {
      const response = await client.get(`/enrollments/user/${userId}`);
      return response.data.data as Enrollment[];
    } catch {
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return { enrollCourse, getUserEnrollments, loading, error };
}
