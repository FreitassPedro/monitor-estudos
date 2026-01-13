export interface Subject {
  id: string;
  name: string;
  color: string;
  created_at: string;
}

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

export interface Todo {
  id: string;
  description: string;
  completed: boolean;
  study_log_id: string | null;
  created_at: string;
  updated_at: string;
  study_logs?: StudyLog;
}

export interface CreateSubjectInput {
  name: string;
  color: string;
}

export interface CreateStudyLogInput {
  id?: string;
  subject_id: string;
  content: string;
  study_date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  notes?: string;
}

export interface CreateTodoInput {
  description: string;
  study_log_id?: string;
}
