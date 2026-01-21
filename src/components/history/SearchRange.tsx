import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { useState } from "react";
import { mockStudyLogs } from "./mockStudyLog";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

export interface SearchRange {
    startDate: Date | null;
    endDate: Date | null;
    rangeType?: 'day' | 'week' | 'month' | 'custom';
}

interface SearchRangeProps {
    searchRange: SearchRange;
    setSearchRange: (range: SearchRange) => void;
    setRangeType?: (type: 'day' | 'week' | 'month' | 'custom') => void;
    rangeType?: 'day' | 'week' | 'month' | 'custom';
}

export const SearchRange = ({ searchRange, setSearchRange }: SearchRangeProps) => {
    const [selectedRange, setSelectedRange] = useState<'day' | 'week' | 'month'>('day');
    const [currentMonth, setCurrentMonth] = useState(new Date('2026-01-18'));

    const changeMonth = (direction: number) => {
        const newDate = new Date(currentMonth);
        newDate.setMonth(newDate.getMonth() + direction);
        setCurrentMonth(newDate);
    };

    const handleSelectRange = (range: string) => {
        let newStartDate: Date;
        let newEndDate: Date;

        const today = new Date();
        if (range === 'day') {
            newStartDate = new Date(today);
            newEndDate = new Date(today);

            setSelectedRange('day');
        }
        if (range === 'week') {
            newStartDate = new Date(today);
            newStartDate.setDate(newStartDate.getDate() - newStartDate.getDay());
            newEndDate = new Date(newStartDate);
            newEndDate.setDate(newEndDate.getDate() + 6
            );
            setSelectedRange('week');
        }
        if (range === 'month') {
            newStartDate = new Date(today.getFullYear(), today.getMonth(), 1);
            newEndDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

            setSelectedRange('month');
        }

        setSearchRange({ startDate: newStartDate, endDate: newEndDate });
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

    const getHeatmapColor = (minutes: number) => {
        if (minutes === 0) return 'bg-slate-100';
        if (minutes < 60) return 'bg-emerald-200';
        if (minutes < 120) return 'bg-emerald-400';
        if (minutes < 180) return 'bg-emerald-600';
        return 'bg-emerald-800';
    };
    return (
        <>
            <Tabs value={selectedRange} onValueChange={handleSelectRange} className="w-full mb-4">
                <TabsList className="grid w-full max-w-md grid-cols-3 bg-white shadow-sm">
                    <TabsTrigger value="day">Dia</TabsTrigger>
                    <TabsTrigger value="week">Semana</TabsTrigger>
                    <TabsTrigger value="month">Mês</TabsTrigger>
                </TabsList>
            </Tabs>
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
                                const isSelected = date && date.toDateString() === searchRange.startDate?.toDateString();

                                return (
                                    <button
                                        key={index}
                                        onClick={() => date && setSearchRange({ startDate: date, endDate: date })}
                                        disabled={!date}
                                        className={`
                                                            aspect-square rounded-lg transition-all
                                                            ${date ? getHeatmapColor(minutes) : 'bg-transparent'}
                                                            ${searchRange.startDate <= (date) && searchRange.endDate >= (date) ? ' ring-violet-500 ring-2' : ''}
                                                            ${isSelected ? 'ring-2 ring-orange-700 scale-110' : ''}
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
        </>

    )
}