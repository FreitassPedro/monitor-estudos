export interface Module {
    id: string;
    name: string;
    projects_id?: string[];
}

export interface Project {
    id: string;
    name: string;
    color: string;
    created_at: string;
    updated_at?: string;
}

export interface Groups {
    id: string;
    name: string;
    created_at: string;
    updated_at?: string;
    project_id: string;
}

// 1. Entidade Pura (Como é salvo no banco de dados)
export interface Task {
    id: string;
    title: string;
    description?: string;
    completed: boolean;

    // Relacionamentos
    project_id: string; // Obrigatório para saber a qual projeto pertence
    group_id?: string;  // Opcional (Kanban columns, sections, etc)
    parent_id?: string | null; // NULL se for tarefa raiz, ID se for subtask

    // Metadados
    created_at: string;
    updated_at?: string;
    due_date?: string;
    study_log_id?: string;
    comments?: string[];
}

// 2. Entidade de Visualização (Como o React vai ler para renderizar a árvore)
// Estendemos a Entity e adicionamos o array recursivo
export interface TaskTree extends Task {
    subTasks: TaskTree[];
}

