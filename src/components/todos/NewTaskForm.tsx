import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCreateTask } from "@/hooks/useTodos";
import { toast } from "sonner";
import { Groups } from "@/types/tasks";

interface NewTaskFormProps {
    projectName: string;
    projectId: string;
    groups?: Groups[];
    viewingForm: boolean;
    setViewingForm: (open: boolean) => void;
}

const priorities = ["Baixa", "Média", "Alta", "Urgente"];
const status = ["Pendente", "Em andamento", "Concluído"];

const formSchema = z.object({
    title: z.string({ required_error: "O titulo é obrigatório" }),
    description: z.string().optional(),
    project_id: z.string(),
    group_id: z.string().optional(),
    due_date: z.string().optional(),
    priority: z.string().optional(),
    status: z.string().optional(),
});

const NewTaskForm: React.FC<NewTaskFormProps> = ({
    projectName,
    projectId,
    groups,
    viewingForm,
    setViewingForm,
}) => {
    const createTask = useCreateTask();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            project_id: projectId,
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log("Creating todo:", values);

        try {
            await createTask.mutateAsync({
                id: crypto.randomUUID(),
                title: values.title,
                description: values.description,
                created_at: new Date().toISOString(),
                project_id: values.project_id,
                due_date: values.due_date,
                priority: values.priority,
                status: values.status,
            });
            toast.success("Tarefa criada!");
            setViewingForm(false)
        } catch (error) {
            toast.error("Erro ao criar tarefa");
        }
    };

    return (
        <Dialog open={viewingForm} onOpenChange={setViewingForm}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Adicionar Tarefa</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col gap-4"
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Título da Tarefa</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Digite o titulo da tarefa" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descrição</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Digite a descrição da tarefa"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="project_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Projeto</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={projectName} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value={projectId}>{projectName}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="group_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Grupo</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione um grupo" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {groups?.map((group) => (
                                                    <SelectItem key={group.id} value={group.id}>
                                                        {group.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="due_date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Data de Vencimento</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="priority"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Prioridade</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione a prioridade" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {priorities.map((priority) => (
                                                    <SelectItem key={priority} value={priority}>
                                                        {priority}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione o status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {status.map((status) => (
                                                <SelectItem key={status} value={status}>
                                                    {status}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setViewingForm(false)}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit">Adicionar</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default NewTaskForm;