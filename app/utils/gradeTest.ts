import { TestCompleted } from '@/types/TestCompleted';

export const gradeTest = (testCompleted: TestCompleted) => {
  if (testCompleted.test.testType === 'Writing') {
    return {
      score: 0,
      level: 'Pending teacher evaluation',
      correctAnswers: 0,
      totalQuestions: 0
    };
  }

  const totalQuestions = testCompleted.test.questions.length;
  if (totalQuestions === 0) return {
    score: 0,
    level: 'No questions',
    correctAnswers: 0,
    totalQuestions: 0
  };

  const pointsPerQuestion = 140 / totalQuestions;
  let totalScore = 0;
  let correctAnswers = 0;

  testCompleted.test.questions.forEach(question => {
    const studentAnswer = testCompleted.answers.find(a => a.questionId === question.id);
    const correctOption = question.options.find(opt => opt.isCorrect);

    if (studentAnswer?.selectedOptionId === correctOption?.id) {
      totalScore += pointsPerQuestion;
      correctAnswers++;
    }
  });

  return {
    score: Math.round(totalScore),
    level: determineEnglishLevel(totalScore),
    correctAnswers,
    totalQuestions
  };
};
const determineEnglishLevel = (score: number): string => {
    // Escala con mayor separación entre niveles
    if (score === 140) return 'C2';
    if (score >= 130) return 'C1';  // +10 desde B2
    if (score >= 115) return 'B2';  // +15 desde B1
    if (score >= 95) return 'B1';   // +20 desde A2
    if (score >= 65) return 'A2';   // +30 desde A1
    if (score >= 40) return 'A1';   // +25 desde Below A1
    return 'Below A1';
  };
