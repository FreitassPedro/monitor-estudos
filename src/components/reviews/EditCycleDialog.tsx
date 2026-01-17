import { Review, ReviewCycle, ReviewSuggestion } from "@/types/reviews";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { useUpdateCycle } from "@/hooks/useReviews";
import { useState } from "react";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";
import { Calendar } from '@/components/ui/calendar';
import { parseISO, startOfDay } from "date-fns";

export const EditCycleDialog = ({ review, cycle, open, setOpen }: { review: Review; cycle: ReviewCycle; open: boolean; setOpen: (open: boolean) => void }) => {
    const updateCycle = useUpdateCycle();
    const [performance, setPerformance] = useState<number>(cycle.performance ?? 75);
    const [notes, setNotes] = useState(cycle.notes ?? '');
    const [plannedDate, setPlannedDate] = useState<Date | undefined>(parseISO(cycle.plannedDate));

    const [suggestion, setSuggestion] = useState<ReviewSuggestion>(cycle.suggestion ?? 'none');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedCycle: ReviewCycle = {
            ...cycle,
            suggestion,
            notes,
            ...(cycle.isCompleted
                ? { performance }
                : { plannedDate: startOfDay(plannedDate!).toISOString() }),
        };

        updateCycle.mutate({ reviewId: review.id, updatedCycle }, {
            onSuccess: () => setOpen(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar Revisão R{cycle.cycle}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="py-4 space-y-4">
                    {cycle.isCompleted ? (
                        <div>
                            <Label>Desempenho: {performance}%</Label>
                            <Slider value={[performance]} onValueChange={(value) => setPerformance(value[0])} max={100} step={5} className="mt-2" />
                        </div>
                    ) : (
                        <div>
                            <Label>Alterar Data da Revisão</Label>
                            <Calendar mode="single" selected={plannedDate} onSelect={setPlannedDate} className="rounded-md border mt-2" />
                        </div>
                    )}

                    <div>
                        <Label>Sugestão: (opcional)</Label>
                        <Select onValueChange={(value) => setSuggestion(value as ReviewSuggestion)} value={suggestion}>
                            <SelectTrigger className="mt-2">
                                <SelectValue placeholder="Deixar em branco" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Deixar em branco</SelectItem>
                                <SelectItem value="Teoria">Teoria</SelectItem>
                                <SelectItem value="Anki">Anki</SelectItem>
                                <SelectItem value="Exercícios">Exercícios</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="notes-edit">Anotações Gerais</Label>
                        <Textarea id="notes-edit" value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-2" />
                    </div>

                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
                        <Button type='submit' disabled={updateCycle.isPending}>{updateCycle.isPending ? 'Salvando...' : 'Salvar Alterações'}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog >
    );
};