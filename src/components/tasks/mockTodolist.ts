import { Module, Project, Groups, Task } from "@/types/tasks";

export const mockModules: Module[] = [
    { id: 'm1', name: 'Módulo 1', projects_id: ['p1', 'p2'] },
    { id: 'm2', name: 'Módulo 2', projects_id: ['p3'] }
];

export const mockProjects: Project[] = [
    {
        id: 'p1',
        name: 'Física',
        color: '#FF5733',
        created_at: '2024-06-10',
    },
    {
        id: 'p3',
        name: 'Química',
        color: '#FF33A8',
        created_at: '2024-06-14',
    },
    {
        id: 'p2',
        name: 'Tarefas Casa',
        color: '#33FF57',
        created_at: '2024-06-12',
    }
];

export const mockGroups: Groups[] = [
    {
        id: 'g1',
        project_id: 'p1',
        name: 'Revisão',
        created_at: '2024-06-11',
    },
    {
        id: 'g3',
        project_id: 'p3',
        name: 'Leitura',
        created_at: '2024-06-15',
    },
    {
        id: 'g2',
        project_id: 'p2',
        name: 'Prática',
        created_at: '2024-06-13',
    }
];

// MUDANÇA PRINCIPAL: Todas as tarefas estão no mesmo nível.
// O que define hierarquia é o 'parent_id'.
export const mockTasks: Task[] = [
    // --- PROJETO FÍSICA (p1) ---
    
    // Tarefa Pai 1
    {
        id: 't1', 
        project_id: 'p1',
        group_id: 'g1',
        title: 'Revisar Termodinâmica',
        description: 'Revisar os conceitos de termodinâmica e mecânica',
        completed: false,
        created_at: '2024-06-15',
        parent_id: null, // É uma raiz
    },
    // Subtarefa 1.1 (Filha de t1)
    { 
        id: 't1-1', 
        project_id: 'p1', // Herda o projeto
        group_id: 'g1',   // Herda o grupo (opcional, mas recomendado)
        title: 'R1 - Releitura', 
        completed: true, 
        created_at: '2024-06-15',
        parent_id: 't1'   // Link com o pai
    },
    // Subtarefa 1.2 (Filha de t1)
    { 
        id: 't1-2', 
        project_id: 'p1',
        group_id: 'g1',
        title: 'R2 - Fixação', 
        completed: false, 
        created_at: '2024-06-15',
        parent_id: 't1'   // Link com o pai
    },

    // Tarefa Pai 2
    {
        id: 't2',
        project_id: 'p1',
        group_id: 'g1',
        title: 'Revisar Newton',
        description: 'Praticar exercícios de álgebra e geometria',
        completed: false,
        created_at: '2024-06-16',
        parent_id: null,
    },
    // Subtarefa 2.1 (Filha de t2)
    { 
        id: 't2-1', 
        project_id: 'p1',
        group_id: 'g1', 
        title: 'R1 - Releitura', 
        completed: false, 
        created_at: '2024-06-16',
        parent_id: 't2'
    },

    // --- PROJETO QUÍMICA (p3) ---
    {
        id: 't3',
        project_id: 'p3',
        group_id: 'g3',
        title: 'Ler capítulo sobre ligações químicas',
        completed: false,
        created_at: '2024-06-18',
        parent_id: null,
    },

    // --- PROJETO CASA (p2) ---
    {
        id: 't4',
        project_id: 'p2',
        group_id: 'g2',
        title: 'Resolver exercícios de cálculo',
        completed: false,
        created_at: '2024-06-17',
        parent_id: null,
    },

    // --- TAREFA SEM GRUPO (Teste de "Sem Categoria") ---
    {
        id: 't5',
        project_id: 'p1',
        group_id: undefined, // Sem grupo
        title: 'Organizar Caderno',
        completed: false,
        created_at: '2024-06-19',
        parent_id: null,
    }
];

export const mockDataTodoList = {
    modules: mockModules,
    projects: mockProjects,
    groups: mockGroups,
    tasks: mockTasks
};