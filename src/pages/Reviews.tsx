import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useSubjects } from '@/hooks/useSubjects';
import { useReviews, useCreateReview, useUpdateReview } from '@/hooks/useReviews';
import type { Review, ReviewPriority, ReviewSuggestion, NewReviewData, ReviewCycle } from '@/types/reviews';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Layout } from '@/components/layout/Layout';

// Schema for the new review form
const reviewFormSchema = z.object({
  subjectId: z.string().min(1, 'Selecione uma matéria.'),
  topic: z.string().min(3, 'O assunto deve ter pelo menos 3 caracteres.'),
  priority: z.enum(['Baixa', 'Média', 'Alta']),
  suggestion: z.enum(['Teoria', 'Anki', 'Exercícios']),
  generalNotes: z.string().optional(),
});

type ReviewFormData = z.infer<typeof reviewFormSchema>;

const priorityVariant = {
  Baixa: 'secondary',
  Média: 'default',
  Alta: 'destructive',
} as const;

// --- NewReviewForm Component ---
const NewReviewForm = ({ setOpen }: { setOpen: (open: boolean) => void }) => {
  const { data: subjects } = useSubjects();
  const createReview = useCreateReview();

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      priority: 'Média',
      suggestion: 'Exercícios',
      generalNotes: '',
      topic: '',
    },
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
        <DialogHeader>
          <DialogTitle>Agendar Nova Revisão</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <FormField
            control={form.control}
            name="subjectId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Matéria</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a matéria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {subjects?.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assunto</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Funções de 2º grau" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prioridade</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Baixa">Baixa</SelectItem>
                      <SelectItem value="Média">Média</SelectItem>
                      <SelectItem value="Alta">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="suggestion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sugestão</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Teoria">Teoria</SelectItem>
                      <SelectItem value="Anki">Anki</SelectItem>
                      <SelectItem value="Exercícios">Exercícios</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="generalNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Anotações Gerais</FormLabel>
                <FormControl>
                  <Textarea placeholder="Detalhes importantes, pontos fracos..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" disabled={createReview.isPending}>
            {createReview.isPending ? 'Salvando...' : 'Salvar Revisão'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

// --- CompleteCycleDialog Component ---
const CompleteCycleDialog = ({
  review,
  cycle,
  open,
  setOpen
}: {
  review: Review;
  cycle: ReviewCycle;
  open: boolean;
  setOpen: (open: boolean) => void
}) => {
  const [performance, setPerformance] = useState(75);
  const updateReview = useUpdateReview();

  const handleSubmit = () => {
    const updatedCycles = review.cycles.map(c =>
      c.cycle === cycle.cycle
        ? { ...c, isCompleted: true, performance }
        : c
    );
    updateReview.mutate({ ...review, cycles: updatedCycles }, {
      onSuccess: () => setOpen(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Completar Revisão R{cycle.cycle}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Label>Desempenho: {performance}%</Label>
          <Slider
            value={[performance]}
            onValueChange={(value) => setPerformance(value[0])}
            max={100}
            step={5}
            className="mt-2"
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={updateReview.isPending}>
            {updateReview.isPending ? 'Salvando...' : 'Confirmar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


// --- ReviewsPage Component ---
const ReviewsPage: React.FC = () => {
  const { data: reviews = [] } = useReviews();
  const { data: subjects = [] } = useSubjects();
  const [isNewReviewOpen, setNewReviewOpen] = useState(false);
  const [completionState, setCompletionState] = useState<{ review: Review; cycle: ReviewCycle } | null>(null);

  const subjectsMap = new Map(subjects.map((s) => [s.id, s.name]));

  // Group reviews by subjectId
  const reviewsBySubject = reviews.reduce((acc, review) => {
    const subjectId = review.subjectId;
    if (!acc[subjectId]) {
      acc[subjectId] = [];
    }
    acc[subjectId].push(review);
    return acc;
  }, {} as Record<string, Review[]>);

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Minhas Revisões</h1>
            <p className="text-muted-foreground">
              Acompanhe o progresso das suas revisões agendadas.
            </p>
          </div>
          <Dialog open={isNewReviewOpen} onOpenChange={setNewReviewOpen}>
            <DialogTrigger asChild>
              <Button>Agendar Revisão</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <NewReviewForm setOpen={setNewReviewOpen} />
            </DialogContent>
          </Dialog>
        </div>

        {Object.keys(reviewsBySubject).length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center h-64 border-2 border-dashed rounded-lg">
              <h3 className="text-xl font-semibold">Nenhuma revisão agendada</h3>
              <p className="text-muted-foreground mt-2">Clique em "Agendar Revisão" para começar.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(reviewsBySubject).map(([subjectId, subjectReviews]) => (
              <div key={subjectId}>
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                  {subjectsMap.get(subjectId) ?? 'Matéria Desconhecida'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {subjectReviews.map((review) => (
                    <Card key={review.id}>
                      <CardHeader>
                        <CardTitle>{review.topic}</CardTitle>
                        <CardDescription>
                          Prioridade: <Badge variant={priorityVariant[review.priority]} className="mr-2">{review.priority}</Badge>
                          Sugestão: <Badge variant="outline">{review.suggestion}</Badge>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                          Agendado em: {format(parseISO(review.createdAt), 'dd/MM/yyyy')}
                        </p>
                        <div className="space-y-2">
                          {review.cycles.map(cycle => {
                            const formattedDate = format(parseISO(cycle.plannedDate), 'dd/MM');
                            return (
                              <div key={cycle.cycle} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                                <span className="font-semibold">R{cycle.cycle}</span>
                                {cycle.isCompleted ? (
                                  <Badge variant="success">
                                    ✓ {formattedDate} ({cycle.performance}%)
                                  </Badge>
                                ) : (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCompletionState({ review, cycle })}
                                  >
                                    {formattedDate}
                                  </Button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {completionState && (
          <CompleteCycleDialog
            review={completionState.review}
            cycle={completionState.cycle}
            open={!!completionState}
            setOpen={() => setCompletionState(null)}
          />
        )}
      </div>
    </Layout>
  );
};

export default ReviewsPage;