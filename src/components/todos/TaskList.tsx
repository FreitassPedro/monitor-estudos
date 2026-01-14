import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCreateGroup, useProjects } from '@/hooks/useProjects';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@radix-ui/react-label';
import { Groups, Project, Task } from '@/types/tasks';
import TaskGroups from './TaskGroups';
import ViewingTask from './ViewingTask';
import NewTaskForm from './NewTaskForm';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';

interface TaskListProps {
  selectedProjectName?: string;
}

const formSchemaNewGroup = z.object({
  name: z.string().min(1, 'O nome do grupo é obrigatório'),
});

type typeFormSchemaNewGroup = z.infer<typeof formSchemaNewGroup>;

export function TaskList({ selectedProjectName }: TaskListProps) {
    const { data: projects = [], isLoading, isError } = useProjects();
    const createGroup = useCreateGroup();
  
    const [project, setProject] = useState<Project | undefined>(undefined);
  
    useEffect(() => {
      if (projects.length > 0) {
        const selected = projects.find((p) => p.name === selectedProjectName);
        setProject(selected || projects[0]);
      }
    }, [selectedProjectName, projects]);
  
    const [viewingTask, setViewingTask] = useState<Task | null>(null);
    const [viewingNewGroupForm, setViewingNewGroupForm] = useState(false);
    const [viewingForm, setViewingForm] = useState<boolean>(false);
  
    const handleViewTask = (taskId: string) => {
      if (project) {
        const findTask = project.groups
          .map((g) => g.tasks)
          .flat()
          .find((t) => t.id === taskId);
  
        if (findTask) {
          setViewingTask(findTask);
        }
      }
    };
  
    const { register, handleSubmit, reset } = useForm<typeFormSchemaNewGroup>({
      resolver: zodResolver(formSchemaNewGroup),
      defaultValues: {
        name: '',
      },
    });
  
    const handleSubmitNewGroup = async (values: z.infer<typeof formSchemaNewGroup>) => {
      if (project) {
        console.log('Criando novo grupo com nome:', values.name);
        try {
          await createGroup.mutateAsync({
            projectId: project.id,
            groupName: values.name,
          });
          toast.success('Grupo criado com sucesso!');
        } catch (error) {
          toast.error('Erro ao criar grupo');
        } finally {
          reset();
          setViewingNewGroupForm(false);
        }
      }
    }
  
    if (isLoading) {
      return (
        <Card>
          <CardContent className="py-8">
            <div className="animate-pulse space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 bg-muted rounded" />
              ))}
            </div>
          </CardContent>
        </Card>
      );
    }
  
    if (isError || !project) {
      return <div>Error fetching data</div>;
    }
  
    return (
      <>
        <div className='flex justify-between items-center'>
          <h1 className="text-2xl font-bold text-foreground mb-6">Gerenciar Tarefas</h1>
        </div>
  
        <Card>
          <CardHeader>
            <CardTitle>Ações</CardTitle>
          </CardHeader>
          <CardContent className='flex gap-4'>
            <Button onClick={() => setViewingForm(true)}>Criar nova Tarefa</Button>
            <Button onClick={() => setViewingNewGroupForm(true)}>Criar novo Grupo</Button>
          </CardContent>
        </Card>
  
        <div>
          <h1 className="text-3xl font-bold text-foreground my-6">{project.name}</h1>
          {project.groups.map((group) => (
            <div key={group.id}>
              <TaskGroups group={group} setViewingTask={handleViewTask} />
            </div>
          ))}
        </div>
  
        {viewingTask && (
          <ViewingTask
            task={viewingTask}
            setViewingTask={setViewingTask}
          />
        )}
        {viewingForm && (
          <NewTaskForm
            projectName={project.name}
            projectId={project.id}
            groups={project.groups}
            viewingForm={viewingForm}
            setViewingForm={setViewingForm}
          />
        )}
        {viewingNewGroupForm && (
          <Dialog open={viewingNewGroupForm} onOpenChange={setViewingNewGroupForm}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Grupo de Tarefas</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(handleSubmitNewGroup)}>
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome do Grupo</Label>
                  <Input id="name"
                    {...register('name')}
                    placeholder="Ex: Revisão, Lista de Exercícios..." />
                </div>
                <Button className="mt-4" type="submit">Criar Grupo</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </>
    );
  }
