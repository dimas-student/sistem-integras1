import { useState, useCallback } from 'react';
import client from '../api/client';
import type { Course, Lesson } from '../types/index';

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await client.get('/courses');
      setCourses(response.data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCourseById = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await client.get(`/courses/${id}`);
        return response.data.data as Course;
      } catch (err: any) {
        setError(err.message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { courses, loading, error, fetchCourses, fetchCourseById };
}

export function useLessons(courseId: string | undefined) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLessons = useCallback(async () => {
    if (!courseId) return;
    setLoading(true);
    try {
      const response = await client.get(`/lessons/course/${courseId}`);
      setLessons(response.data.data);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  return { lessons, loading, fetchLessons };
}

export function useLessonById(lessonId: string | undefined) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchLesson = useCallback(async () => {
    if (!lessonId) return;
    setLoading(true);
    try {
      const response = await client.get(`/lessons/${lessonId}`);
      setLesson(response.data.data);
    } finally {
      setLoading(false);
    }
  }, [lessonId]);

  return { lesson, loading, fetchLesson };
}
