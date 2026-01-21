import { Subject } from "./subject";

export interface StudyLog {
  id: string;
  subject_id: string;
  content: string;
  study_date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  subjects?: Subject;
}

