import { StudyLog } from "@/types/studyLog";
import { Subject } from "@/types/subject";

const mockSubjects: Subject[] = [
    { id: '1', name: 'Matemática', color: '#8b5cf6', created_at: '2026-01-01T00:00:00' },
    { id: '2', name: 'Programação', color: '#06b6d4', created_at: '2026-01-01T00:00:00' },
    { id: '3', name: 'Inglês', color: '#10b981', created_at: '2026-01-01T00:00:00' },
    { id: '4', name: 'Física', color: '#f59e0b', created_at: '2026-01-01T00:00:00' },
];
    

export const mockStudyLogs: StudyLog[] = [
    {
        id: '1',
        subject_id: '1',
        content: 'Estudo de Cálculo I',
        study_date: '2026-01-18',
        start_time: '09:00',
        end_time: '11:00',
        duration_minutes: 120,
        notes: 'Revisão de derivadas e integrais',
        created_at: '2026-01-18T09:00:00',
        updated_at: '2026-01-18T11:00:00',
        subjects: mockSubjects[0]
    },
    {
        id: '2',
        subject_id: '2',
        content: 'React e TypeScript',
        study_date: '2026-01-18',
        start_time: '14:00',
        end_time: '16:30',
        duration_minutes: 150,
        notes: 'Hooks avançados e custom hooks',
        created_at: '2026-01-18T14:00:00',
        updated_at: '2026-01-18T16:30:00',
        subjects: mockSubjects[1]
    },
    {
        id: '3',
        subject_id: '3',
        content: 'Grammar Practice',
        study_date: '2026-01-18',
        start_time: '19:00',
        end_time: '20:30',
        duration_minutes: 90,
        notes: 'Past perfect e conditionals',
        created_at: '2026-01-18T19:00:00',
        updated_at: '2026-01-18T20:30:00',
        subjects: mockSubjects[2]
    },
    {
        id: '4',
        subject_id: '1',
        content: 'Álgebra Linear',
        study_date: '2026-01-17',
        start_time: '08:30',
        end_time: '10:30',
        duration_minutes: 120,
        created_at: '2026-01-17T08:30:00',
        updated_at: '2026-01-17T10:30:00',
        subjects: mockSubjects[0]
    },
    {
        id: '5',
        subject_id: '4',
        content: 'Mecânica Clássica',
        study_date: '2026-01-17',
        start_time: '15:00',
        end_time: '17:30',
        duration_minutes: 150,
        created_at: '2026-01-17T15:00:00',
        updated_at: '2026-01-17T17:30:00',
        subjects: mockSubjects[3]
    },
    {
        id: '6',
        subject_id: '2',
        content: 'Node.js Backend',
        study_date: '2026-01-16',
        start_time: '09:00',
        end_time: '12:00',
        duration_minutes: 180,
        created_at: '2026-01-16T09:00:00',
        updated_at: '2026-01-16T12:00:00',
        subjects: mockSubjects[1]
    },
    {
        id: '7',
        subject_id: '3',
        content: 'Vocabulary Building',
        study_date: '2026-01-16',
        start_time: '14:00',
        end_time: '15:00',
        duration_minutes: 60,
        created_at: '2026-01-16T14:00:00',
        updated_at: '2026-01-16T15:00:00',
        subjects: mockSubjects[2]
    },
    {
        id: '8',
        subject_id: '1',
        content: 'Geometria Analítica',
        study_date: '2026-01-15',
        start_time: '10:00',
        end_time: '12:00',
        duration_minutes: 120,
        created_at: '2026-01-15T10:00:00',
        updated_at: '2026-01-15T12:00:00',
        subjects: mockSubjects[0]
    },
];