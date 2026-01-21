import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Clock, BookOpen, Calendar, TrendingUp, Award, Target, Zap, Brain, Coffee, Moon, Sun, CalendarDays, ChevronLeft, ChevronRight, Activity } from 'lucide-react';
import { StudyBarChart } from './StudyBarChart';
import { mockStudyLogs, mockSubjects } from './mockStudyLog';
import { StudyLog } from '@/types/studyLog';
import { Subject } from '@/types/subject';

import {
    type SearchRange

} from './SearchRange';
const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

interface StudyDashboardCopyProps {
    searchRange: SearchRange;
    rangeType: 'day' | 'week' | 'month' | 'custom';
}

const StudyDashboardCopy: React.FC<StudyDashboardCopyProps> = ({ searchRange, rangeType }) => {
    const filterLogsByPeriod = (logs: StudyLog[], period: SearchRange) => {
        return logs.filter(log => {
            const logDate = new Date(log.study_date);
            const diffTime = period.startDate.getTime() - logDate.getTime();
            const diffDays = diffTime / (1000 * 60 * 60 * 24);

            if (period.startDate.getDay() === period.endDate.getDay()) {
                return logDate.toDateString() === period.startDate.toDateString();
            }
            if (period.startDate.getTime() !== period.endDate.getTime()) {
                const diffDays = (period.endDate.getTime() - period.startDate.getTime()) / (1000 * 60 * 60 * 24);
                return diffDays >= 0 && diffDays < 30;
            }
            return true;
        });
    };

    const findSubjectById = (id: string): Subject => {
        return mockSubjects.find(subject => subject.id === id)!;
    }
    const filteredLogs = useMemo(
        () => filterLogsByPeriod(mockStudyLogs, searchRange),
        [searchRange]
    );


    const dailyLogs = useMemo(
        () => mockStudyLogs.filter(log => new Date(log.study_date).toDateString() === searchRange.startDate?.toDateString()),
        [searchRange]
    );

    const totalMinutes = useMemo(
        () => filteredLogs.reduce((sum, log) => sum + log.duration_minutes, 0),
        [filteredLogs]
    );

    const totalSessions = filteredLogs.length;
    const averageSessionTime = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0;

    const studiesBySubject = useMemo(() => {
        const grouped: Record<string, { name: string; minutes: number; sessions: number; color: string }> = {};

        filteredLogs.forEach(log => {
            const subjectName = findSubjectById(log.subject_id)?.name || 'Sem matéria';
            const subjectColor = findSubjectById(log.subject_id)?.color || '#94a3b8';

            if (!grouped[subjectName]) {
                grouped[subjectName] = { name: subjectName, minutes: 0, sessions: 0, color: subjectColor };
            }
            grouped[subjectName].minutes += log.duration_minutes;
            grouped[subjectName].sessions += 1;
        });

        return Object.values(grouped).map(item => ({
            name: item.name,
            value: item.minutes,
            sessions: item.sessions,
            color: item.color
        }));
    }, [filteredLogs]);

    const productivityByPeriod = useMemo(() => {
        const periods = { morning: 0, afternoon: 0, evening: 0, night: 0 };

        filteredLogs.forEach(log => {
            const hour = parseInt(log.start_time.split(':')[0]);
            if (hour >= 6 && hour < 12) periods.morning += log.duration_minutes;
            else if (hour >= 12 && hour < 18) periods.afternoon += log.duration_minutes;
            else if (hour >= 18 && hour < 22) periods.evening += log.duration_minutes;
            else periods.night += log.duration_minutes;
        });

        return [
            { period: 'Manhã', minutes: periods.morning, icon: Sun },
            { period: 'Tarde', minutes: periods.afternoon, icon: Coffee },
            { period: 'Noite', minutes: periods.evening, icon: Moon },
            { period: 'Madrugada', minutes: periods.night, icon: Moon },
        ];
    }, [filteredLogs]);

    const weeklyTrend = useMemo(() => {
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(searchRange.startDate!);
            date.setDate(date.getDate() - (6 - i));
            return date;
        });

        return last7Days.map(date => {
            const logs = mockStudyLogs.filter(log =>
                new Date(log.study_date).toDateString() === date.toDateString()
            );
            const totalMins = logs.reduce((sum, log) => sum + log.duration_minutes, 0);

            return {
                date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
                minutes: totalMins,
                sessions: logs.length
            };
        });
    }, []);

    const consistencyScore = useMemo(() => {
        /*
        const daysWithStudy = new Set(filteredLogs.map(log => log.study_date)).size;
        const totalDays = selectedPeriod === 'day' ? 1 : selectedPeriod === 'week' ? 7 : 30;
        return Math.round((daysWithStudy / totalDays) * 100);
        */
        return 75;
    }, [filteredLogs]);


    const focusScore = useMemo(() => {
        if (totalSessions === 0) return 0;
        const avgDuration = totalMinutes / totalSessions;
        return Math.min(Math.round((avgDuration / 120) * 100), 100);
    }, [totalMinutes, totalSessions]);

    const formatTime = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };

    const timeToPosition = (time: string) => {
        const [hours, minutes] = time.split(':').map(Number);
        const totalMinutes = hours * 60 + minutes;
        const dayStart = 6 * 60;
        const dayEnd = 24 * 60;
        return ((totalMinutes - dayStart) / (dayEnd - dayStart)) * 100;
    };

    const getHeatmapColor = (minutes: number) => {
        if (minutes === 0) return 'bg-slate-100';
        if (minutes < 60) return 'bg-emerald-200';
        if (minutes < 120) return 'bg-emerald-400';
        if (minutes < 180) return 'bg-emerald-600';
        return 'bg-emerald-800';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-cyan-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold">
                            Dashboard de Estudos
                        </h1>
                        <p className="text-slate-600 mt-2">Análise completa do seu desempenho e evolução</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-slate-200">
                        <Calendar className="w-5 h-5 text-violet-500" />
                        <span className="font-semibold text-slate-700">
                            {searchRange.startDate?.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </span>
                    </div>
                </div>

                <Tabs value={rangeType} className="w-full">
                    <TabsContent value={rangeType} className="space-y-6 mt-6">
                        {/* 
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            <Card className="bg-gradient-to-br from-violet-500 to-violet-600 text-white border-0 shadow-lg">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium">Tempo Total</CardTitle>
                                    <Clock className="w-4 h-4 opacity-80" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">{formatTime(totalMinutes)}</div>
                                    <p className="text-xs opacity-80 mt-1">
                                        {totalMinutes > 0 ? `+${Math.round((totalMinutes / (selectedPeriod === 'day' ? 240 : selectedPeriod === 'week' ? 1680 : 7200)) * 100)}% da meta` : 'Comece a estudar!'}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white border-0 shadow-lg">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium">Sessões</CardTitle>
                                    <BookOpen className="w-4 h-4 opacity-80" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">{totalSessions}</div>
                                    <p className="text-xs opacity-80 mt-1">
                                        {totalSessions > 0 ? `Média: ${formatTime(averageSessionTime)}` : 'Nenhuma sessão'}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-lg">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium">Consistência</CardTitle>
                                    <Target className="w-4 h-4 opacity-80" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">{consistencyScore}%</div>
                                    <p className="text-xs opacity-80 mt-1">
                                        {consistencyScore >= 70 ? 'Excelente!' : consistencyScore >= 40 ? 'Bom ritmo' : 'Pode melhorar'}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0 shadow-lg">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium">Foco</CardTitle>
                                    <Brain className="w-4 h-4 opacity-80" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">{focusScore}%</div>
                                    <p className="text-xs opacity-80 mt-1">
                                        {focusScore >= 80 ? 'Alto foco' : focusScore >= 50 ? 'Foco médio' : 'Sessões curtas'}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                        */}

                        <div className="grid gap-6 lg:grid-cols-3">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Activity className="w-5 h-5 text-cyan-500" />
                                        Produtividade
                                    </CardTitle>
                                    <CardDescription>Por período do dia</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {productivityByPeriod.map((period) => {
                                            const Icon = period.icon;
                                            const percentage = totalMinutes > 0 ? (period.minutes / totalMinutes) * 100 : 0;

                                            return (
                                                <div key={period.period} className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <Icon className="w-4 h-4 text-slate-500" />
                                                            <span className="text-sm font-medium">{period.period}</span>
                                                        </div>
                                                        <span className="text-sm text-slate-600">{formatTime(period.minutes)}</span>
                                                    </div>
                                                    <div className="w-full bg-slate-200 rounded-full h-2">
                                                        <div
                                                            className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all"
                                                            style={{ width: `${percentage}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Tendência Semanal</CardTitle>
                                    <CardDescription>Evolução dos últimos 7 dias</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <AreaChart data={weeklyTrend}>
                                            <defs>
                                                <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" />
                                            <YAxis />
                                            <Tooltip formatter={(value: number) => formatTime(value)} />
                                            <Area type="monotone" dataKey="minutes" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorMinutes)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Distribuição por Matéria</CardTitle>
                                    <CardDescription>Tempo dedicado a cada área</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <PieChart>
                                            <Pie
                                                data={studiesBySubject}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {studiesBySubject.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value: number) => formatTime(value)} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div>
                                        {studiesBySubject.map((subject, index) => (
                                            <div key={index} className="flex items-center justify-between gap-2 text-sm mt-2">
                                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: subject.color || COLORS[index % COLORS.length] }}></span>
                                                <span>{subject.name}</span>
                                                <h3 className={`h-1 w-full`} style={{ backgroundColor: subject.color || COLORS[index % COLORS.length] }}></h3>
                                                <span className="text-slate-600">{formatTime(subject.value)} em {subject.sessions} sessões</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <StudyBarChart />



                        {/* Daily Timeline Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-violet-500" />
                                    Timeline do Dia - {searchRange.startDate?.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
                                </CardTitle>
                                <CardDescription>
                                    {dailyLogs.length > 0
                                        ? `${dailyLogs.length} sessões • ${formatTime(dailyLogs.reduce((sum, log) => sum + log.duration_minutes, 0))} total`
                                        : 'Nenhuma sessão de estudo registrada neste dia'
                                    }
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {dailyLogs.length > 0 ? (
                                    <div className="flex flex-row">
                                        {/* Hour markers */}
                                        <div className="flex flex-col text-xs text-slate-500 space-y-0" style={{ height: '36rem' }}>
                                            {Array.from({ length: 19 }, (_, i) => 6 + i).map(hour => (
                                                <div key={hour} className="flex-1 text-right pr-2 border-r border-slate-200">
                                                    {hour > 23 ? '' : `${hour.toString().padStart(2, '0')}:00`}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Timeline container */}
                                        <div className="relative h-[36rem] w-full bg-slate-50 rounded-lg overflow-hidden">
                                            {/* Background lines */}
                                            {Array.from({ length: 18 }, (_, i) => 6 + i + 1).map(hour => (
                                                <div
                                                    key={hour}
                                                    className="absolute left-0 right-0 border-t border-slate-200"
                                                    style={{ top: `${((hour - 6) / 18) * 100}%` }}
                                                />
                                            ))}

                                            {/* Study session blocks */}
                                            {dailyLogs.map((log) => {
                                                const top = timeToPosition(log.start_time);
                                                const height = (log.duration_minutes / (18 * 60)) * 100;

                                                // Prevent card from overflowing container
                                                const finalHeight = Math.min(height, 100 - top);

                                                return (
                                                    <div
                                                        key={log.id}
                                                        className="absolute z-10 left-2 right-2 rounded-lg p-2 border-l-4 overflow-hidden cursor-pointer hover:scale-[1.01] hover:z-20 transition-all duration-200"
                                                        style={{
                                                            top: `${top}%`,
                                                            height: `${finalHeight}%`,
                                                            backgroundColor: findSubjectById(log.subject_id)?.color ? `${findSubjectById(log.subject_id).color}50` : '#a1a1aa33',
                                                            borderLeftColor: findSubjectById(log.subject_id)?.color || '#a1a1aa',
                                                        }}
                                                        title={`${log.content} (${formatTime(log.duration_minutes)})`}
                                                    >
                                                        <div className="flex justify-between h-full">
                                                            <div>
                                                                <h4 className="font-semibold text-xs text-slate-900 truncate">{log.content}</h4>
                                                                <p className="text-xs text-slate-600 truncate">{findSubjectById(log.subject_id)?.name}</p>
                                                            </div>
                                                            <div className="text-xs text-slate-600 flex items-center gap-1 flex-col justify-between">
                                                                <div className='flex flex-row items-center gap-1'>
                                                                    <Clock className="w-3 h-3" />
                                                                    {log.start_time}
                                                                </div>
                                                                <div className='flex flex-row items-center gap-1'>
                                                                    <Clock className="w-3 h-3" />
                                                                    {log.end_time}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-slate-500">
                                        <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                        <p>Selecione um dia no calendário para ver as sessões de estudo</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div >
    );

};

export default StudyDashboardCopy;