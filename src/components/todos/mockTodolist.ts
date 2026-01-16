import { Module, Project, Groups, MasterTask } from "@/types/tasks";


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

export const mockTasks: MasterTask[] = [
    {
        id: 'mt1',
        project_id: 'p1',
        group_id: 'g1',
        title: 'Revisar Termodinâmica',
        description: 'Revisar os conceitos de termodinâmica e mecânica',
        completed: false,
        created_at: '2024-06-15',
        subTasks: [
            { id: 'st1', masterTaskId: 'mt1', title: 'R1 - Releitura', completed: false, created_at: '2024-06-15' },
            { id: 'st2', masterTaskId: 'mt1', title: 'R2 - Fixação', completed: false, created_at: '2024-06-15' },
        ],
    },
    {
        id: 'mt2',
        project_id: 'p1',
        group_id: 'g1',
        title: 'Revisar Newton',
        description: 'Praticar exercícios de álgebra e geometria',
        completed: false,
        created_at: '2024-06-16',
        subTasks: [
            { id: 'st3', masterTaskId: 'mt2', title: 'R1 - Releitura', completed: false, created_at: '2024-06-16' },
        ],
    },
    {
        id: 'mt4',
        project_id: 'p3',
        group_id: 'g3',
        title: 'Ler capítulo sobre ligações químicas',
        completed: false,
        created_at: '2024-06-18',
    },
    {
        id: 'mt3',
        project_id: 'p2',
        group_id: 'g2',
        title: 'Resolver exercícios de cálculo',
        completed: false,
        created_at: '2024-06-17',
    }
];

// Objeto para manter compatibilidade se necessário, mas prefira usar os arrays acima
export const mockDataTodoList = {
    modules: mockModules,
    projects: mockProjects,
    groups: mockGroups,
    tasks: mockTasks
};
