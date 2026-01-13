import { Project } from "@/types/tasks";

interface mockData {
    modules: Modules[];
}
export interface Modules {
    id: string;
    name: string;
    project: Project[];
}

export const mockDataTodoList: mockData = {
    modules: [
        {
            id: 'm1',
            name: 'Módulo 1',
            project: [
                {
                    id: 'p1',
                    name: 'Física',
                    color: '#FF5733',
                    created_at: '2024-06-10',
                    groups: [
                        {
                            id: 'g1',
                            name: 'Revisão',
                            created_at: '2024-06-11',
                            tasks: [
                                {
                                    id: 'mt1',
                                    title: 'Revisar Termodinâmica',
                                    description: 'Revisar os conceitos de termodinâmica e mecânica',
                                    completed: false,
                                    created_at: '2024-06-15',
                                    updated_at: '2024-06-15',
                                    subTasks: [
                                        {
                                            id: 'st1',
                                            masterTaskId: 'mt1',
                                            title: 'R1 - Releitura',
                                            completed: false,
                                            created_at: '2024-06-15',
                                            updated_at: '2024-06-15',
                                        },
                                        {
                                            id: 'st2',
                                            masterTaskId: 'mt1',
                                            title: 'R2 - Fixação',
                                            completed: false,
                                            created_at: '2024-06-15',
                                            updated_at: '2024-06-15',
                                        },
                                    ],
                                    comments: [],
                                },
                                {
                                    id: 'mt2',
                                    title: 'Revisar Newton',
                                    description: 'Praticar exercícios de álgebra e geometria',
                                    completed: false,
                                    created_at: '2024-06-16',
                                    updated_at: '2024-06-16',
                                    subTasks: [
                                        {
                                            id: 'st3',
                                            masterTaskId: 'mt2',
                                            title: 'R1 - Releitura',
                                            completed: false,
                                            created_at: '2024-06-16',
                                            updated_at: '2024-06-16',
                                        },
                                        {
                                            id: 'st4',
                                            masterTaskId: 'mt2',
                                            title: 'R2 - Fixação',
                                            completed: false,
                                            created_at: '2024-06-16',
                                            updated_at: '2024-06-16',
                                        },
                                    ],
                                    comments: [],
                                }
                            ],
                        },
                    ],
                },
                {
                    id: 'p3',
                    name: 'Química',
                    color: '#FF33A8',
                    created_at: '2024-06-14',
                    groups: [
                        {
                            id: 'g3',
                            name: 'Leitura',
                            created_at: '2024-06-15',
                            tasks: [
                                {
                                    id: 'mt4',
                                    title: 'Ler capítulo sobre ligações químicas',
                                    description: 'Compreender os diferentes tipos de ligações químicas',
                                    completed: false,
                                    created_at: '2024-06-18',
                                    updated_at: '2024-06-18',
                                },
                            ],
                        },
                    ],
                }
            ],
        },
        {
            id: 'm2',
            name: 'Módulo 2',
            project: [{
                id: 'p2',
                name: 'Tarefas Casa',
                color: '#33FF57',
                created_at: '2024-06-12',
                groups: [
                    {
                        id: 'g2',
                        name: 'Prática',
                        created_at: '2024-06-13',
                        tasks: [
                            {
                                id: 'mt3',
                                title: 'Resolver exercícios de cálculo',
                                description: 'Focar em integrais e derivadas',
                                completed: false,
                                created_at: '2024-06-17',
                                updated_at: '2024-06-17',
                            },
                        ],
                    },
                ],
            }],
        },
        
    ]
};