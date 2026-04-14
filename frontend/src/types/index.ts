export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'INSTRUCTOR' | 'LEARNER';
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: {
    id: string;
    firstName: string;
    lastName: string;
  };
  isPublished: boolean;
  lessons?: Lesson[];
  _count?: {
    enrollments: number;
    lessons: number;
  };
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  contentUrl?: string;
  duration: number;
  order: number;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  status: 'ACTIVE' | 'COMPLETED' | 'DROPPED';
  enrolledAt: string;
  completedAt?: string;
  course: Course;
}

export interface LessonProgress {
  id: string;
  userId: string;
  lessonId: string;
  viewedDuration: number;
  isCompleted: boolean;
  completedAt?: string;
}

export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  passingScore: number;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  quizId: string;
  type: 'MULTIPLE_CHOICE' | 'SHORT_ANSWER' | 'ESSAY';
  prompt: string;
  options?: Record<string, string>;
  correctAnswer: string;
  order: number;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  score: number;
  passed: boolean;
  responses: Record<string, { answer: string; correct: boolean }>;
  submittedAt: string;
}

export interface Submission {
  id: string;
  userId: string;
  courseId: string;
  assignmentTitle: string;
  fileUrl: string;
  submittedAt: string;
  feedback?: string;
  grade?: number;
}
