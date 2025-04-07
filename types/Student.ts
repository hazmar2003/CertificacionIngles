import { User } from "./User";

export interface Student {
    id?: string;
    user?: User;
    phoneNumber?: string;
    address?: string;
    faculty?: string;
    group?: string;
    ColocationLevel?: string | null;
    ComprehensionLevel?: string | null;
    WritingLevel?: string | null;
    ListeningLevel?:string | null;
    SpeakingLevel?: string | null;
  
  }