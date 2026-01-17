import { useCreateReview } from "@/hooks/useReviews";
import { useSubjects } from "@/hooks/useSubjects";
import { ReviewFormData, reviewFormSchema } from "@/pages/Reviews";
import { NewReviewData } from "@/types/reviews";
import { useForm } from "react-hook-form";
import { DialogClose, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "../ui/textarea";


export const NewReviewForm = ({ setOpen }: { setOpen: (open: boolean) => void }) => {
    const { data: subjects } = useSubjects();
    const createReview = useCreateReview();
    const form = useForm<ReviewFormData>({
        resolver: zodResolver(reviewFormSchema),
        defaultValues: { priority: 'Média', suggestion: 'none', generalNotes: '', topic: '' },
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
                        <FormField control={form.control} name="priority" render={({ field }) => (<FormItem><FormLabel>Prioridade</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder='Média' /></SelectTrigger></FormControl><SelectContent><SelectItem value="Baixa">Baixa</SelectItem><SelectItem value="Média">Média</SelectItem><SelectItem value="Alta">Alta</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="suggestion" render={({ field }) => (<FormItem><FormLabel>Sugestão</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Deixar em branco" /></SelectTrigger></FormControl>                  <SelectContent>
                            <SelectItem value="none">Deixar em branco</SelectItem>
                            <SelectItem value="Teoria">Teoria</SelectItem>
                            <SelectItem value="Anki">Anki</SelectItem>
                            <SelectItem value="Exercícios">Exercícios</SelectItem>
                        </SelectContent></Select><FormMessage /></FormItem>)} />
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
