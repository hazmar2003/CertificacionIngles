import { Question } from "./Question";

 export interface Test {
  id: string;
  title: string;
  description: string;
  testType: 'Comprehension' | 'Listening' | 'Writing';
  audioFile?: string | null;
  questions: Question[];
  writingPrompt?: string;
  createdBy: string;
  createdAt: string;
}
