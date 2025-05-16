import { Student } from "./Student";
import { Test } from "./Test";

export interface ExamSession {
    id?: string;
    test?: Test | null;
    students?: Student[];
    date?: string;

}
