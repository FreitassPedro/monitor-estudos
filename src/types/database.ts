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

export interface CreateTaskInput {
  id: string;
  title: string;
  description: string;
  project_id: string;
  created_at: string;
  updated_at?: string;
  due_date?: string;
  event_id?: string;
  priority?: string;
  status?: string;
  study_log_id?: string;
}

export interface CreateTaskDTO {
  title: string;
  description?: string;
  project_id: string;
  group_id?: string;
  parent_id?: string | null;
  due_date?: string;
  study_log_id?: string;
}