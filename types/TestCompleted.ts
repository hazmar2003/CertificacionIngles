import { Answer } from "./Answer";
import { ExamSession } from "./ExamSession";
import { Student } from "./Student";
import { Test } from "./Test";



export interface TestCompleted {
    id: string;
    test: Test;
    examSession: ExamSession;
    student: Student;
    answers: Answer[];
    writingResponse?: string;
    completedAt: string;
    status: string;
  }