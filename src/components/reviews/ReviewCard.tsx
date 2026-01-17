import { format, parseISO, startOfDay } from 'date-fns';

import { CalendarArrowDown, MoreHorizontal, Pencil } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "../ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Review, ReviewCycle } from '@/types/reviews';

const priorityVariant = { Baixa: 'secondary', Média: 'default', Alta: 'destructive' } as const;

export const ReviewCard = ({ review, onCompleteCycle, onEdit, onDelete, onEditCycle }: { review: Review; onCompleteCycle: (review: Review, cycle: ReviewCycle) => void; onEdit: (review: Review) => void; onDelete: (reviewId: string) => void; onEditCycle: (review: Review, cycle: ReviewCycle) => void; }) => {

    const remainingTime = (plannedDateISO: string) => {
        const now = new Date();
        const plannedDate = parseISO(plannedDateISO);
        const diffTime = plannedDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 1) return ` - ${diffDays}d`;
        if (diffDays === 1) return ` - Amanhã`;
        if (diffDays === 0) return ` - Hoje`;
        return ` - ${-diffDays}d`;
    };

    const remainingColor = (plannedDateISO: string) => {
        const now = new Date();
        const plannedDate = parseISO(plannedDateISO);
        const diffTime = plannedDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 15) return '';
        if (diffDays > 7) return 'text-yellow-700';
        return 'text-red-500';
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <CardTitle>{review.topic}</CardTitle>
                        <CardDescription>
                            <span>
                                Prioridade:
                                <Badge variant={priorityVariant[review.priority]} className="mr-2">{review.priority}</Badge>
                            </span>
                            {review.suggestion && review.suggestion !== 'none' && (
                                <span className="flex items-center">
                                    Sugestão:
                                    <Badge variant="outline" className="ml-2">{review.suggestion}</Badge>
                                </span>
                            )}
                        </CardDescription>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEdit(review)}>Editar Revisão</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDelete(review.id)} className="text-red-600">Deletar</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">Agendado em: {format(parseISO(review.createdAt), 'dd/MM/yyyy')}</p>
                <div className="space-y-2">
                    {review.cycles.map(cycle => (
                        <div key={cycle.cycle} className={`flex items-center justify-between p-2 rounded-md 
            ${cycle.isCompleted ? "bg-muted/50" : "bg-zinc-300/50"}`}>
                            <div className="flex-1 flex-col">
                                <span className="font-semibold">R{cycle.cycle}</span>
                                {cycle.notes && <p className="text-xs text-muted-foreground mt-1 truncate">{cycle.notes}</p>}
                            </div>
                            <div className="flex items-center gap-2">
                                {cycle.suggestion && <Badge variant="secondary">{cycle.suggestion}</Badge>}
                                {cycle.isCompleted ? (
                                    <Badge variant="success">✓ {format(parseISO(cycle.plannedDate), 'dd/MM')} ({cycle.performance}%)</Badge>
                                ) : (
                                    <Button variant="outline" className={`rounded-xl text-sm ${remainingColor(cycle.plannedDate)}`} size="sm" onClick={() => onCompleteCycle(review, cycle)}>
                                        <CalendarArrowDown className="mr-1 h-3 w-3" />
                                        {format(parseISO(cycle.plannedDate), 'dd/MM')}
                                        <span className={`text-sm ${remainingColor(cycle.plannedDate)}`}>{remainingTime(cycle.plannedDate)}</span>
                                    </Button>
                                )}
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onEditCycle(review, cycle)}>
                                    <Pencil className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};