import { Student } from "./Student";
import { Test } from "./Test";

export interface ExamSession {
    id?: string,
    test?: Test,
    students?: Student[],
    date?: Date,

}
