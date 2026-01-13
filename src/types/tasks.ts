export interface Project {
    id: string;
    name: string;
    color: string;
    created_at: string;
    updated_at?: string;
    groups: Groups[];
}

export interface Groups {
    id: string;
    name: string;
    created_at: string;
    updated_at?: string;
    tasks?: MasterTask[];
}

export interface Task {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    project?: string;
    created_at: string;
    updated_at?: string;
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
    title: string;
    completed: boolean;
    created_at: string;
    updated_at?: string;
}