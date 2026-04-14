import { useState, useCallback } from 'react';
import client from '../api/client';

export interface CourseProgress {
  courseId: string;
  userId: string;
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
  lessons: Array<{
    id: string;
    title: string;
    completed: boolean;
    viewedDuration: number;
  }>;
}

export function useProgress() {
  const [loading, setLoading] = useState(false);

  const updateProgress = useCallback(async (lessonId: string, viewedDuration: number, isCompleted: boolean) => {
    setLoading(true);
    try {
      const response = await client.post('/progress', { lessonId, viewedDuration, isCompleted });
      return response.data.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const getCourseProgress = useCallback(async (courseId: string) => {
    setLoading(true);
    try {
      const response = await client.get(`/progress/course/${courseId}`);
      return response.data.data as CourseProgress;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateProgress, getCourseProgress, loading };
}
