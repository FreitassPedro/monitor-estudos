import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, parseISO, startOfDay } from 'date-fns';
import { CalendarArrowDown, MoreHorizontal, Pencil } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Calendar } from '@/components/ui/calendar';
import { useSubjects } from '@/hooks/useSubjects';
import { useReviews, useCreateReview, useUpdateReview, useUpdateReviewDetails, useDeleteReview, useUpdateCycle } from '@/hooks/useReviews';
import type { Review, ReviewCycle, NewReviewData, ReviewSuggestion } from '@/types/reviews';
import { Layout } from '@/components/layout/Layout';
import { EditCycleDialog } from '@/components/reviews/EditCycleDialog';
import { EditReviewForm } from '@/components/reviews/EditReviewForm';
import { ReviewCard } from '@/components/reviews/ReviewCard';
import { NewReviewForm } from '@/components/reviews/NewReviewForm';
<<<<<<< HEAD
import { CompleteCycleDialog } from '@/components/reviews/CompleteCycleDialog';
=======
>>>>>>> e59fdb4929ed991674bfc2528737d2795ddc381b


// --- Form Schemas ---
export const reviewFormSchema = z.object({
  subjectId: z.string().min(1, 'Selecione uma matéria.'),
  topic: z.string().min(3, 'O assunto deve ter pelo menos 3 caracteres.'),
  priority: z.enum(['Baixa', 'Média', 'Alta']),
  suggestion: z.enum(['Teoria', 'Anki', 'Exercícios', 'none']),
  generalNotes: z.string().optional(),
});
export type ReviewFormData = z.infer<typeof reviewFormSchema>;
<<<<<<< HEAD
=======

// --- CompleteCycleDialog (No changes) ---
const CompleteCycleDialog = ({ review, cycle, open, setOpen }: { review: Review; cycle: ReviewCycle; open: boolean; setOpen: (open: boolean) => void }) => {
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
        <DialogHeader><DialogTitle>Completar Revisão R{cycle.cycle}</DialogTitle></DialogHeader>
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

>>>>>>> e59fdb4929ed991674bfc2528737d2795ddc381b

// --- ReviewsPage ---
const ReviewsPage: React.FC = () => {
  const { data: reviews = [] } = useReviews();
  const { data: subjects = [] } = useSubjects();
  const deleteReview = useDeleteReview();

  const [isNewReviewOpen, setNewReviewOpen] = useState(false);
  const [completionState, setCompletionState] = useState<{ review: Review; cycle: ReviewCycle } | null>(null);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);
  const [editingCycle, setEditingCycle] = useState<{ review: Review; cycle: ReviewCycle } | null>(null);

  const subjectsMap = new Map(subjects.map((s) => [s.id, s.name]));

  const reviewsBySubject = reviews.reduce((acc, review) => {
    (acc[review.subjectId] = acc[review.subjectId] || []).push(review);
    return acc;
  }, {} as Record<string, Review[]>);

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Minhas Revisões</h1>
            <p className="text-muted-foreground">Acompanhe, complete e edite suas revisões e ciclos.</p>
          </div>
          <Dialog open={isNewReviewOpen} onOpenChange={setNewReviewOpen}><DialogTrigger asChild><Button>Agendar Revisão</Button></DialogTrigger><DialogContent className="sm:max-w-[425px]"><NewReviewForm setOpen={setNewReviewOpen} /></DialogContent></Dialog>
        </div>

        {Object.keys(reviewsBySubject).length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center h-64 border-2 border-dashed rounded-lg"><h3 className="text-xl font-semibold">Nenhuma revisão agendada</h3><p className="text-muted-foreground mt-2">Clique em "Agendar Revisão" para começar.</p></div>
        ) : (
          <div className="space-y-8">
            {Object.entries(reviewsBySubject).map(([subjectId, subjectReviews]) => (
              <div key={subjectId}>
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">{subjectsMap.get(subjectId) ?? '...'}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {subjectReviews.map((review) => (
                    <ReviewCard
                      key={review.id}
                      review={review}
                      onCompleteCycle={(r, c) => setCompletionState({ review: r, cycle: c })}
                      onEdit={(r) => setEditingReview(r)}
                      onDelete={(id) => setDeletingReviewId(id)}
                      onEditCycle={(r, c) => setEditingCycle({ review: r, cycle: c })}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {completionState && <CompleteCycleDialog review={completionState.review} cycle={completionState.cycle} open={!!completionState} setOpen={() => setCompletionState(null)} />}
        {editingReview && <Dialog open={!!editingReview} onOpenChange={() => setEditingReview(null)}><DialogContent className="sm:max-w-[425px]"><EditReviewForm review={editingReview} setOpen={() => setEditingReview(null)} /></DialogContent></Dialog>}
        {editingCycle && <EditCycleDialog review={editingCycle.review} cycle={editingCycle.cycle} open={!!editingCycle} setOpen={() => setEditingCycle(null)} />}
        <AlertDialog open={!!deletingReviewId} onOpenChange={() => setDeletingReviewId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader><AlertDialogTitle>Você tem certeza?</AlertDialogTitle><AlertDialogDescription>Essa ação não pode ser desfeita. Isso irá deletar permanentemente a revisão e todos os seus ciclos.</AlertDialogDescription></AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={() => { if (deletingReviewId) deleteReview.mutate(deletingReviewId); }} className="bg-destructive hover:bg-destructive/90">Deletar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
};

export default ReviewsPage;