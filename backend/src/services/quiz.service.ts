import { prisma } from '../config/database.js';

export async function createQuiz(courseId: string, title: string, description?: string) {
  return prisma.quiz.create({
    data: {
      courseId,
      title,
      description,
    },
  });
}

export async function getQuizById(id: string) {
  return prisma.quiz.findUnique({
    where: { id },
    include: {
      questions: {
        orderBy: { order: 'asc' },
      },
    },
  });
}

export async function getCourseQuizzes(courseId: string) {
  return prisma.quiz.findMany({
    where: { courseId },
    include: {
      questions: true,
      _count: { select: { attempts: true } },
    },
  });
}

export async function addQuestionToQuiz(
  quizId: string,
  type: string,
  prompt: string,
  options: any,
  correctAnswer: string
) {
  const questionsCount = await prisma.quizQuestion.count({
    where: { quizId },
  });

  return prisma.quizQuestion.create({
    data: {
      quizId,
      type,
      prompt,
      options,
      correctAnswer,
      order: questionsCount + 1,
    },
  });
}

export async function submitQuizAttempt(
  userId: string,
  quizId: string,
  responses: Record<string, string>
) {
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: { questions: true },
  });

  if (!quiz) {
    throw new Error('Quiz not found');
  }

  let correctCount = 0;
  const gradedResponses: Record<string, { answer: string; correct: boolean }> = {};

  for (const question of quiz.questions) {
    const userAnswer = responses[question.id];
    const isCorrect = userAnswer === question.correctAnswer;

    if (isCorrect) correctCount++;

    gradedResponses[question.id] = {
      answer: userAnswer || '',
      correct: isCorrect,
    };
  }

  const score = Math.round((correctCount / quiz.questions.length) * 100);
  const passed = score >= quiz.passingScore;

  return prisma.quizAttempt.create({
    data: {
      userId,
      quizId,
      score,
      passed,
      responses: gradedResponses,
    },
  });
}

export async function getUserQuizAttempts(userId: string, quizId: string) {
  return prisma.quizAttempt.findMany({
    where: { userId, quizId },
    orderBy: { submittedAt: 'desc' },
  });
}
