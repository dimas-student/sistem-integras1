import { prisma } from '../config/database.js';

export async function updateLessonProgress(
  userId: string,
  lessonId: string,
  viewedDuration: number,
  isCompleted: boolean
) {
  const existing = await prisma.lessonProgress.findUnique({
    where: { userId_lessonId: { userId, lessonId } },
  });

  if (existing) {
    return prisma.lessonProgress.update({
      where: { userId_lessonId: { userId, lessonId } },
      data: {
        viewedDuration: Math.max(existing.viewedDuration, viewedDuration),
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
      },
    });
  }

  return prisma.lessonProgress.create({
    data: {
      userId,
      lessonId,
      viewedDuration,
      isCompleted,
      completedAt: isCompleted ? new Date() : null,
    },
  });
}

export async function getUserCourseProgress(userId: string, courseId: string) {
  const enrollments = await prisma.enrollment.findFirst({
    where: { userId, courseId },
  });

  if (!enrollments) {
    throw new Error('User not enrolled in this course');
  }

  const lessons = await prisma.lesson.findMany({
    where: { courseId },
    include: {
      progressTracking: {
        where: { userId },
      },
    },
  });

  const totalLessons = lessons.length;
  const completedLessons = lessons.filter((l: any) => l.progressTracking[0]?.isCompleted).length;

  return {
    courseId,
    userId,
    totalLessons,
    completedLessons,
    progressPercentage: totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0,
    lessons: lessons.map((l: any) => ({
      id: l.id,
      title: l.title,
      completed: l.progressTracking[0]?.isCompleted || false,
      viewedDuration: l.progressTracking[0]?.viewedDuration || 0,
    })),
  };
}

export async function getLessonProgress(userId: string, lessonId: string) {
  return prisma.lessonProgress.findUnique({
    where: { userId_lessonId: { userId, lessonId } },
  });
}
