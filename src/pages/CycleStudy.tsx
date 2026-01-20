import { Layout } from "@/components/layout/Layout"
import { Progress } from "@/components/ui/progress";
import { useSubjects } from "@/hooks/useSubjects";
import { useStudyLogs } from "@/hooks/useStudyLogs";
import { Subject } from "@/types/database";
import { useMemo } from "react";
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Mock goals for subjects. In the future, this could come from a database.
const cycleGoals: { [subjectName: string]: number } = {
    "Matemática": 300,
    "Português": 240,
    "História": 180,
    "Geografia": 180,
    "Física": 200,
    "Química": 200,
};

interface CycleProgress {
    subject: Subject;
    totalMinutes: number;
    goalMinutes: number;
    progress: number;
}

export const CycleStudy = () => {
    // Mock data for testing purposes
    const subjects = useMemo(() => ([
        { id: "1", name: "Matemática", color: "#8b5cf6", created_at: new Date().toISOString() },
        { id: "2", name: "Português", color: "#06b6d4", created_at: new Date().toISOString() },
        { id: "3", name: "História", color: "#f59e0b", created_at: new Date().toISOString() },
    ]), []);

    const studyLogs = useMemo(() => ([
        { id: "sl1", subject_id: "1", content: "Algebra", study_date: "2026-01-18", start_time: "10:00", end_time: "11:00", duration_minutes: 60, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: "sl2", subject_id: "1", content: "Geometry", study_date: "2026-01-18", start_time: "11:00", end_time: "12:00", duration_minutes: 60, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: "sl3", subject_id: "2", content: "Grammar", study_date: "2026-01-18", start_time: "09:00", end_time: "09:45", duration_minutes: 45, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: "sl4", subject_id: "3", content: "World War I", study_date: "2026-01-18", start_time: "13:00", end_time: "14:00", duration_minutes: 60, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    ]), []);

    const isLoadingStudyLogs = false;
    const isLoadingSubjects = false;

    const cycleProgress = useMemo((): CycleProgress[] => {
        if (!subjects || !studyLogs) {
            return [];
        }

        return subjects.map(subject => {
            const goalMinutes = cycleGoals[subject.name] || 0;
            const totalMinutes = studyLogs
                .filter(log => log.subject_id === subject.id)
                .reduce((acc, log) => acc + log.duration_minutes, 0);

            const progress = goalMinutes > 0 ? (totalMinutes / goalMinutes) * 100 : 0;

            return {
                subject,
                totalMinutes,
                goalMinutes,
                progress: Math.min(progress, 100), // Cap progress at 100%
            };
        }).filter(item => item.goalMinutes > 0); // Only show subjects that are part of the cycle (have a goal)
    }, [subjects, studyLogs]);

    const chartData = useMemo(() => {
        return cycleProgress.map(item => ({
            materia: item.subject.name,
            Estudado: item.totalMinutes,
            Restante: Math.max(0, item.goalMinutes - item.totalMinutes),
            meta: item.goalMinutes,
            color: item.subject.color,
        }));
    }, [cycleProgress]);


    if (isLoadingStudyLogs || isLoadingSubjects) {
        return (
            <Layout>
                <h1 className="text-2xl font-bold mb-4">Ciclo de Estudos</h1>
                <p>Carregando dados...</p>
            </Layout>
        )
    }

    return (
        <Layout>
            <div className="p-4 md:p-6">
                <h1 className="text-2xl font-bold mb-4">Ciclo de Estudos</h1>
                <p className="text-muted-foreground mb-6">
                    Acompanhe seu progresso em cada matéria do ciclo de estudos.
                </p>

                <h2 className="text-xl font-semibold mb-4">Visão Geral do Ciclo</h2>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={chartData}>
                        <YAxis />
                        <XAxis dataKey="materia" />
                        <Tooltip
                            formatter={(value, name) => [`${value} min`, name]}
                            labelStyle={{ color: '#000' }}
                            cursor={{ fill: 'rgba(200, 200, 200, 0.2)' }}
                        />
                        <Legend />
                        <Bar dataKey="Estudado" stackId="a" fill="#8884d8" />
                        <Bar dataKey="Restante" stackId="a" fill="#ddd" />
                    </BarChart>
                </ResponsiveContainer>

                <h2 className="text-xl font-semibold my-6">Progresso por Matéria</h2>
                <div className="space-y-6">
                    {cycleProgress.map(({ subject, totalMinutes, goalMinutes, progress }) => (
                        <div key={subject.id} className="p-4 rounded-lg shadow-md" style={{ borderLeft: `4px solid ${subject.color}` }}>
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-lg font-semibold">{subject.name}</h2>
                                <span className="text-sm text-muted-foreground">
                                    {`${Math.floor(totalMinutes)}min / ${goalMinutes}min`}
                                </span>
                            </div>
                            <Progress value={progress} className="h-4" />
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    )
}