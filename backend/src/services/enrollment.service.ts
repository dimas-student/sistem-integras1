import { prisma } from '../config/database.js';

export async function enrollUserInCourse(userId: string, courseId: string) {
  const existingEnrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });

  if (existingEnrollment) {
    throw new Error('User already enrolled in this course');
  }

  return prisma.enrollment.create({
    data: { userId, courseId, status: 'ACTIVE' },
    include: {
      course: true,
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });
}

export async function getUserEnrollments(userId: string) {
  return prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          lessons: { orderBy: { order: 'asc' } },
          instructor: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
      },
    },
  });
}

export async function getCourseEnrollments(courseId: string) {
  return prisma.enrollment.findMany({
    where: { courseId },
    include: {
      user: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
    },
  });
}

export async function updateEnrollmentStatus(
  enrollmentId: string,
  status: 'ACTIVE' | 'COMPLETED' | 'DROPPED'
) {
  return prisma.enrollment.update({
    where: { id: enrollmentId },
    data: { status, completedAt: status === 'COMPLETED' ? new Date() : null },
  });
}

export async function unenrollUser(userId: string, courseId: string) {
  return prisma.enrollment.delete({
    where: { userId_courseId: { userId, courseId } },
  });
}
