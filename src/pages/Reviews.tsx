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
import type { Review, ReviewCycle, NewReviewData } from '@/types/reviews';

const priorityVariant = { Baixa: 'secondary', Média: 'default', Alta: 'destructive' } as const;

// --- Form Schemas ---
const reviewFormSchema = z.object({
  subjectId: z.string().min(1, 'Selecione uma matéria.'),
  topic: z.string().min(3, 'O assunto deve ter pelo menos 3 caracteres.'),
  priority: z.enum(['Baixa', 'Média', 'Alta']),
  suggestion: z.enum(['Teoria', 'Anki', 'Exercícios']),
  generalNotes: z.string().optional(),
});
type ReviewFormData = z.infer<typeof reviewFormSchema>;

// --- NewReviewForm (No changes) ---
const NewReviewForm = ({ setOpen }: { setOpen: (open: boolean) => void }) => {
  const { data: subjects } = useSubjects();
  const createReview = useCreateReview();
  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: { priority: 'Média', suggestion: 'Exercícios', generalNotes: '', topic: '' },
  });

  const onSubmit = (data: ReviewFormData) => {
    createReview.mutate(data as NewReviewData, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <DialogHeader><DialogTitle>Agendar Nova Revisão</DialogTitle></DialogHeader>
        <div className="grid gap-4 py-4">
          <FormField control={form.control} name="subjectId" render={({ field }) => (<FormItem><FormLabel>Matéria</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecione a matéria" /></SelectTrigger></FormControl><SelectContent>{subjects?.map((subject) => (<SelectItem key={subject.id} value={subject.id}>{subject.name}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="topic" render={({ field }) => (<FormItem><FormLabel>Assunto</FormLabel><FormControl><Input placeholder="Ex: Funções de 2º grau" {...field} /></FormControl><FormMessage /></FormItem>)} />
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="priority" render={({ field }) => (<FormItem><FormLabel>Prioridade</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Baixa">Baixa</SelectItem><SelectItem value="Média">Média</SelectItem><SelectItem value="Alta">Alta</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="suggestion" render={({ field }) => (<FormItem><FormLabel>Sugestão</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Teoria">Teoria</SelectItem><SelectItem value="Anki">Anki</SelectItem><SelectItem value="Exercícios">Exercícios</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
          </div>
          <FormField control={form.control} name="generalNotes" render={({ field }) => (<FormItem><FormLabel>Anotações Gerais</FormLabel><FormControl><Textarea placeholder="Detalhes importantes, pontos fracos..." {...field} /></FormControl><FormMessage /></FormItem>)} />
        </div>
        <DialogFooter>
          <DialogClose asChild><Button type="button" variant="secondary">Cancelar</Button></DialogClose>
          <Button type="submit" disabled={createReview.isPending}>{createReview.isPending ? 'Salvando...' : 'Salvar'}</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

// --- EditReviewForm (No changes) ---
const EditReviewForm = ({ review, setOpen }: { review: Review, setOpen: (open: boolean) => void }) => {
  const updateReviewDetails = useUpdateReviewDetails();
  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      subjectId: review.subjectId,
      topic: review.topic,
      priority: review.priority,
      suggestion: review.suggestion,
      generalNotes: review.generalNotes,
    },
  });

  const onSubmit = (data: ReviewFormData) => {
    updateReviewDetails.mutate({ id: review.id, ...data }, {
      onSuccess: () => setOpen(false),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <DialogHeader><DialogTitle>Editar Revisão</DialogTitle></DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <FormLabel>Matéria</FormLabel>
            <p className="text-sm font-medium p-2">{useSubjects().data?.find(s => s.id === review.subjectId)?.name}</p>
          </div>
          <FormField control={form.control} name="topic" render={({ field }) => (<FormItem><FormLabel>Assunto</FormLabel><FormControl><Input placeholder="Ex: Funções de 2º grau" {...field} /></FormControl><FormMessage /></FormItem>)} />
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="priority" render={({ field }) => (<FormItem><FormLabel>Prioridade</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Baixa">Baixa</SelectItem><SelectItem value="Média">Média</SelectItem><SelectItem value="Alta">Alta</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="suggestion" render={({ field }) => (<FormItem><FormLabel>Sugestão</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Teoria">Teoria</SelectItem><SelectItem value="Anki">Anki</SelectItem><SelectItem value="Exercícios">Exercícios</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
          </div>
          <FormField control={form.control} name="generalNotes" render={({ field }) => (<FormItem><FormLabel>Anotações Gerais</FormLabel><FormControl><Textarea placeholder="Detalhes importantes, pontos fracos..." {...field} /></FormControl><FormMessage /></FormItem>)} />
        </div>
        <DialogFooter>
          <DialogClose asChild><Button type="button" variant="secondary">Cancelar</Button></DialogClose>
          <Button type="submit" disabled={updateReviewDetails.isPending}>{updateReviewDetails.isPending ? 'Salvando...' : 'Salvar Alterações'}</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};


// --- CompleteCycleDialog (No changes) ---
const CompleteCycleDialog = ({ review, cycle, open, setOpen }: { review: Review; cycle: ReviewCycle; open: boolean; setOpen: (open: boolean) => void }) => {
  const [performance, setPerformance] = useState(cycle.performance ?? 75);
  const [comments, setComments] = useState(cycle.comments ?? '');
  const updateReview = useUpdateReview();

  const handleSubmit = () => {
    const completedCycleWithData = { ...cycle, comments };
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

// --- EditCycleDialog ---
const EditCycleDialog = ({ review, cycle, open, setOpen }: { review: Review; cycle: ReviewCycle; open: boolean; setOpen: (open: boolean) => void }) => {
  const updateCycle = useUpdateCycle();
  const [performance, setPerformance] = useState(cycle.performance ?? 75);
  const [comments, setComments] = useState(cycle.comments ?? '');
  const [plannedDate, setPlannedDate] = useState<Date | undefined>(parseISO(cycle.plannedDate));

  const handleSubmit = () => {
    let updatedCycle: ReviewCycle;
    if (cycle.isCompleted) {
      updatedCycle = { ...cycle, performance, comments };
    } else {
      updatedCycle = { ...cycle, plannedDate: startOfDay(plannedDate!).toISOString() };
    }

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
        <div className="py-4 space-y-4">
          {cycle.isCompleted ? (
            <>
              <div>
                <Label>Desempenho: {performance}%</Label>
                <Slider value={[performance]} onValueChange={(value) => setPerformance(value[0])} max={100} step={5} className="mt-2" />
              </div>
              <div>
                <Label htmlFor="comments-edit">Comentários</Label>
                <Textarea id="comments-edit" value={comments} onChange={(e) => setComments(e.target.value)} className="mt-2" />
              </div>
            </>
          ) : (
            <div className=''>
              <div>
                <Label>Alterar Data da Revisão</Label>
                <Calendar mode="single" selected={plannedDate} onSelect={setPlannedDate} className="rounded-md border mt-2" />
              </div>
              <div>
                <Label htmlFor="comments-edit">Comentários</Label>
                <Textarea id="comments-edit" value={comments} onChange={(e) => setComments(e.target.value)} className="mt-2" />
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={updateCycle.isPending}>{updateCycle.isPending ? 'Salvando...' : 'Salvar Alterações'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


// --- ReviewCard ---
const ReviewCard = ({ review, onCompleteCycle, onEdit, onDelete, onEditCycle }: { review: Review; onCompleteCycle: (review: Review, cycle: ReviewCycle) => void; onEdit: (review: Review) => void; onDelete: (reviewId: string) => void; onEditCycle: (review: Review, cycle: ReviewCycle) => void; }) => {

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
              <div>
                Prioridade:
                <Badge variant={priorityVariant[review.priority]} className="mr-2">{review.priority}</Badge>
              </div>
              <div>
                Sugestão:
                <Badge variant="outline">{review.suggestion}</Badge>
              </div>
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
            <div key={cycle.cycle} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
              <div className="flex-1 flex-col">
                <span className="font-semibold">R{cycle.cycle}</span>
                {cycle.comments && <p className="text-xs text-muted-foreground mt-1 truncate">{cycle.comments}</p>}
              </div>
              <div className="flex items-center gap-2">
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
  );
};

export default ReviewsPage;