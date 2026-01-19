import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Clock, BookOpen, Calendar, TrendingUp, Award, Target, Zap, Brain, Coffee, Moon, Sun, CalendarDays, ChevronLeft, ChevronRight, Activity } from 'lucide-react';
import { StudyBarChart } from './StudyBarChart';
import { mockStudyLogs, StudyLog } from './mockStudyLog';
import { sub } from 'date-fns';



const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];


const StudyDashboard: React.FC = () => {
    const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('week');
    const [selectedDate, setSelectedDate] = useState(new Date('2026-01-18'));
    const [currentMonth, setCurrentMonth] = useState(new Date('2026-01-18'));



    const filterLogsByPeriod = (logs: StudyLog[], period: 'day' | 'week' | 'month', referenceDate: Date = selectedDate) => {
        return logs.filter(log => {
            const logDate = new Date(log.study_date);
            const diffTime = referenceDate.getTime() - logDate.getTime();
            const diffDays = diffTime / (1000 * 60 * 60 * 24);

            if (period === 'day') {
                return logDate.toDateString() === referenceDate.toDateString();
            }
            if (period === 'week') return diffDays >= 0 && diffDays < 7;
            if (period === 'month') return diffDays >= 0 && diffDays < 30;
            return true;
        });
    };

    const filteredLogs = useMemo(
        () => filterLogsByPeriod(mockStudyLogs, selectedPeriod, selectedDate),
        [selectedPeriod, selectedDate]
    );

    const dailyLogs = useMemo(
        () => mockStudyLogs.filter(log => new Date(log.study_date).toDateString() === selectedDate.toDateString()),
        [selectedDate]
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
            const subjectName = log.subjects?.name || 'Sem matéria';
            const subjectColor = log.subjects?.color || '#94a3b8';

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
            const date = new Date(selectedDate);
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
    }, [selectedDate]);

    const consistencyScore = useMemo(() => {
        const daysWithStudy = new Set(filteredLogs.map(log => log.study_date)).size;
        const totalDays = selectedPeriod === 'day' ? 1 : selectedPeriod === 'week' ? 7 : 30;
        return Math.round((daysWithStudy / totalDays) * 100);
    }, [filteredLogs, selectedPeriod]);

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

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }
        return days;
    };

    const getStudyMinutesForDate = (date: Date | null) => {
        if (!date) return 0;
        const logs = mockStudyLogs.filter(log =>
            new Date(log.study_date).toDateString() === date.toDateString()
        );
        return logs.reduce((sum, log) => sum + log.duration_minutes, 0);
    };

    const changeMonth = (direction: number) => {
        const newDate = new Date(currentMonth);
        newDate.setMonth(newDate.getMonth() + direction);
        setCurrentMonth(newDate);
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
                            {selectedDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </span>
                    </div>
                </div>

                <Tabs value={selectedPeriod} onValueChange={(v) => setSelectedPeriod(v as any)} className="w-full">
                    <TabsList className="grid w-full max-w-md grid-cols-3 bg-white shadow-sm">
                        <TabsTrigger value="day">Dia</TabsTrigger>
                        <TabsTrigger value="week">Semana</TabsTrigger>
                        <TabsTrigger value="month">Mês</TabsTrigger>
                    </TabsList>

                    <TabsContent value={selectedPeriod} className="space-y-6 mt-6">
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

                        <div className="grid gap-6 lg:grid-cols-3">
                            <Card className="lg:col-span-1">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CalendarDays className="w-5 h-5 text-violet-500" />
                                        Calendário de Atividades
                                    </CardTitle>
                                    <CardDescription>Heatmap de intensidade de estudos</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <button
                                                onClick={() => changeMonth(-1)}
                                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                            >
                                                <ChevronLeft className="w-5 h-5" />
                                            </button>
                                            <h3 className="font-semibold text-lg">
                                                {currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                                            </h3>
                                            <button
                                                onClick={() => changeMonth(1)}
                                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                            >
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-7 gap-2">
                                            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                                                <div key={day} className="text-center text-xs font-medium text-slate-500 pb-2">
                                                    {day}
                                                </div>
                                            ))}
                                            {getDaysInMonth(currentMonth).map((date, index) => {
                                                const minutes = getStudyMinutesForDate(date);
                                                const isSelected = date && date.toDateString() === selectedDate.toDateString();

                                                return (
                                                    <button
                                                        key={index}
                                                        onClick={() => date && setSelectedDate(date)}
                                                        disabled={!date}
                                                        className={`
                                                            aspect-square rounded-lg transition-all
                                                            ${date ? getHeatmapColor(minutes) : 'bg-transparent'}
                                                            ${isSelected ? 'ring-2 ring-violet-500 scale-110' : ''}
                                                            ${date ? 'hover:scale-105 cursor-pointer' : ''}
                                                            flex items-center justify-center
                                                            `}
                                                    >
                                                        {date && (
                                                            <span className={`text-xs font-medium ${minutes > 120 ? 'text-white' : 'text-slate-700'}`}>
                                                                {date.getDate()}
                                                            </span>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <div className="flex items-center gap-4 pt-4 border-t">
                                            <span className="text-xs text-slate-600">Menos</span>
                                            <div className="flex gap-1">
                                                {[0, 60, 120, 180, 240].map((mins, i) => (
                                                    <div key={i} className={`w-4 h-4 rounded ${getHeatmapColor(mins)}`} />
                                                ))}
                                            </div>
                                            <span className="text-xs text-slate-600">Mais</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

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
                                                <h3 className={`h-1 w-full`} style={{backgroundColor: subject.color || COLORS[index % COLORS.length]}}></h3>
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
                                    Timeline do Dia - {selectedDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
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
                                                            backgroundColor: log.subjects?.color ? `${log.subjects.color}50` : '#a1a1aa33',
                                                            borderLeftColor: log.subjects?.color || '#a1a1aa',
                                                        }}
                                                        title={`${log.content} (${formatTime(log.duration_minutes)})`}
                                                    >
                                                        <div className="flex justify-between h-full">
                                                            <div>
                                                                <h4 className="font-semibold text-xs text-slate-900 truncate">{log.content}</h4>
                                                                <p className="text-xs text-slate-600 truncate">{log.subjects?.name}</p>
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

export default StudyDashboard;