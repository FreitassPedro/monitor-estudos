import { useUpdateReviewDetails } from "@/hooks/useReviews";
import { ReviewFormData, reviewFormSchema } from "@/pages/Reviews";
import { Review } from "@/types/reviews";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { DialogClose, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useSubjects } from "@/hooks/useSubjects";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

export const EditReviewForm = ({ review, setOpen }: { review: Review, setOpen: (open: boolean) => void }) => {
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
                        <FormField control={form.control} name="priority" render={({ field }) => (<FormItem><FormLabel>Prioridade</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder='Média' /></SelectTrigger></FormControl><SelectContent><SelectItem value="Baixa">Baixa</SelectItem><SelectItem value="Média">Média</SelectItem><SelectItem value="Alta">Alta</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="suggestion" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Sugestão</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Deixar em branco" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="none">Deixar em branco</SelectItem>
                                        <SelectItem value="Teoria">Teoria</SelectItem>
                                        <SelectItem value="Anki">Anki</SelectItem>
                                        <SelectItem value="Exercícios">Exercícios</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>)} />
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