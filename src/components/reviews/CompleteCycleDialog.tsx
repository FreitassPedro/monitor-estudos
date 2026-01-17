import { useUpdateReview } from "@/hooks/useReviews";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Slider } from "../ui/slider";
import { Textarea } from "../ui/textarea";
import { Review, ReviewCycle, ReviewSuggestion } from "@/types/reviews";
import { useState } from "react";



export const CompleteCycleDialog = ({ review, cycle, open, setOpen }: { review: Review; cycle: ReviewCycle; open: boolean; setOpen: (open: boolean) => void }) => {
    const [performance, setPerformance] = useState(cycle.performance ?? 75);
    const [comments, setComments] = useState(cycle.notes ?? '');
    const [suggestion, setSuggestion] = useState<ReviewSuggestion>(cycle.suggestion ?? 'none');
    const updateReview = useUpdateReview();

    const handleSubmit = () => {
        const completedCycleWithData = { ...cycle, comments, suggestion };
        updateReview.mutate({ review, completedCycle: completedCycleWithData, performance }, {
            onSuccess: () => setOpen(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Completar Revisão R{cycle.cycle}</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div>
                        <Label>Desempenho: {performance}%</Label>
                        <Slider value={[performance]} onValueChange={(value) => setPerformance(value[0])} max={100} step={5} className="mt-2" />
                    </div>
                    <div>
                        <Label>Sugestão: (opcional)</Label>
                        <Select onValueChange={(value) => setSuggestion(value as ReviewSuggestion)} value={suggestion}>
                            <SelectTrigger className="mt-2">
                                <SelectValue placeholder="Deixar em branco" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value=" ">Deixar em branco</SelectItem>
                                <SelectItem value="Teoria">Teoria</SelectItem>
                                <SelectItem value="Anki">Anki</SelectItem>
                                <SelectItem value="Exercícios">Exercícios</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="comments">Comentários</Label>
                        <Textarea id="comments" value={comments} onChange={(e) => setComments(e.target.value)} placeholder="Como foi essa revisão? Alguma dificuldade?" className="mt-2" />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={handleSubmit} disabled={updateReview.isPending}>{updateReview.isPending ? 'Salvando...' : 'Confirmar'}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};