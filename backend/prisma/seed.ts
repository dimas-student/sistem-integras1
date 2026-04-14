import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create users
  const instructor = await prisma.user.upsert({
    where: { email: 'instructor@example.com' },
    update: {},
    create: {
      email: 'instructor@example.com',
      passwordHash: await bcryptjs.hash('password123', 10),
      firstName: 'John',
      lastName: 'Instructor',
      role: 'INSTRUCTOR',
    },
  });

  const learner = await prisma.user.upsert({
    where: { email: 'learner@example.com' },
    update: {},
    create: {
      email: 'learner@example.com',
      passwordHash: await bcryptjs.hash('password123', 10),
      firstName: 'Jane',
      lastName: 'Learner',
      role: 'LEARNER',
    },
  });

  console.log('✅ Users created:', { instructor: instructor.email, learner: learner.email });

  // Create courses
  const course1 = await prisma.course.upsert({
    where: { id: 'course-001' },
    update: {},
    create: {
      id: 'course-001',
      title: 'Introduction to Web Development',
      description: 'Learn the fundamentals of HTML, CSS, and JavaScript to build modern web applications.',
      instructorId: instructor.id,
      isPublished: true,
    },
  });

  const course2 = await prisma.course.upsert({
    where: { id: 'course-002' },
    update: {},
    create: {
      id: 'course-002',
      title: 'Advanced React Patterns',
      description: 'Master advanced React concepts including hooks, context API, and performance optimization.',
      instructorId: instructor.id,
      isPublished: true,
    },
  });

  const course3 = await prisma.course.upsert({
    where: { id: 'course-003' },
    update: {},
    create: {
      id: 'course-003',
      title: 'Backend Development with Node.js',
      description: 'Build scalable backend applications using Node.js, Express, and databases.',
      instructorId: instructor.id,
      isPublished: true,
    },
  });

  console.log('✅ Courses created:', [course1.title, course2.title, course3.title]);

  // Create lessons
  const lesson1 = await prisma.lesson.create({
    data: {
      courseId: course1.id,
      title: 'HTML Basics',
      description: 'Learn the structure and syntax of HTML',
      duration: 45,
      order: 1,
    },
  });

  const lesson2 = await prisma.lesson.create({
    data: {
      courseId: course1.id,
      title: 'CSS Styling',
      description: 'Master CSS for beautiful web designs',
      duration: 60,
      order: 2,
    },
  });

  const lesson3 = await prisma.lesson.create({
    data: {
      courseId: course2.id,
      title: 'React Hooks Deep Dive',
      description: 'Understand useState, useEffect, and custom hooks',
      duration: 90,
      order: 1,
    },
  });

  console.log('✅ Lessons created:', [lesson1.title, lesson2.title, lesson3.title]);

  // Enroll learner in courses
  await prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId: learner.id,
        courseId: course1.id,
      },
    },
    update: {},
    create: {
      userId: learner.id,
      courseId: course1.id,
      status: 'ACTIVE',
    },
  });

  await prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId: learner.id,
        courseId: course2.id,
      },
    },
    update: {},
    create: {
      userId: learner.id,
      courseId: course2.id,
      status: 'ACTIVE',
    },
  });

  console.log('✅ Enrollments created');

  // Create quizzes
  const quiz1 = await prisma.quiz.create({
    data: {
      courseId: course1.id,
      title: 'HTML Basics Quiz',
      description: 'Test your HTML knowledge',
    },
  });

  console.log('✅ Quizzes created:', quiz1.title);

  console.log('🎉 Database seed completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
