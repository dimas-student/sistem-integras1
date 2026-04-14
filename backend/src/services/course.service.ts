import { prisma } from '../config/database.js';

export async function createCourse(title: string, description: string, instructorId: string) {
  return prisma.course.create({
    data: {
      title,
      description,
      instructorId,
    },
  });
}

export async function getCourseById(id: string) {
  return prisma.course.findUnique({
    where: { id },
    include: {
      lessons: {
        orderBy: { order: 'asc' },
      },
      instructor: {
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

export async function getAllCourses(published?: boolean) {
  return prisma.course.findMany({
    where: published !== undefined ? { isPublished: published } : undefined,
    include: {
      instructor: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      _count: {
        select: { enrollments: true, lessons: true },
      },
    },
  });
}

export async function updateCourse(
  id: string,
  data: { title?: string; description?: string; isPublished?: boolean }
) {
  return prisma.course.update({
    where: { id },
    data,
  });
}

export async function deleteCourse(id: string) {
  return prisma.course.delete({
    where: { id },
  });
}

export async function publishCourse(id: string) {
  return prisma.course.update({
    where: { id },
    data: { isPublished: true },
  });
}
