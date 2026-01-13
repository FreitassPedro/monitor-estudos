
interface Task {
    id: string;
    name: string;
    description: string;
    completed: boolean;
    project?: string;
    created_at: string;
    updated_at: string;
    due_date?: string;
    event_id?: string;
}

export interface MasterTask extends Task {
    subTasks?: SubTask[];
    comments?: string[];
}

export interface SubTask {
    id: string;
    masterTaskId: string;
    name: string;
    completed: boolean;
    created_at: string;
    updated_at: string;
}