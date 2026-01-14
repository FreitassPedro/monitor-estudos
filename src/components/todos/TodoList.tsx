import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useTodos, useToggleTodo, useDeleteTodo, useCreateTask } from '@/hooks/useTodos';
import { toast } from 'sonner';
import { Plus, Trash2, FileText, ExternalLink, ArrowDown } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { StudyLog } from '@/types/database';
import { Label } from '@radix-ui/react-label';
import { Select, SelectContent, SelectValue, SelectTrigger, SelectItem } from '../ui/select';
import { Groups, MasterTask, Project, SubTask, Task } from '@/types/tasks';
import { useForm } from 'react-hook-form';
import { mock } from 'node:test';
import { mockDataTodoList } from './mockTodolist';
import { Arrow } from '@radix-ui/react-tooltip';




interface TodoListProps {
  selectedProject?: string;
}

interface formData {
  title: string;
  description: string;
  project: string;
}

export function TodoList({ selectedProject }: TodoListProps) {
  const { data: todos = [], isLoading } = useTodos();
  const createTask = useCreateTask();
  const toggleTodo = useToggleTodo();
  const deleteTodo = useDeleteTodo();

  const projects = ['todo', 'today', 'fisica', 'matematica'];
  const [project, setProject] = useState<Project>(mockDataTodoList.modules[0].project[0]);

  const [groupsOpen, setGroupsOpen] = useState<string[]>([]);

  const [viewingLog, setViewingLog] = useState<StudyLog | null>(null);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);

  const [viewingForm, setViewingForm] = useState<boolean>(false);

  const pendingTodos = todos.filter((t) => !t.completed);
  const completedTodos = todos.filter((t) => t.completed);

  const { handleSubmit } = useForm<formData>();

  const onSubmit = async (data: formData) => {
    console.log('Creating todo:', data);

    if (!data.description.trim()) {
      toast.error('Digite a descrição da tarefa');
      return;
    }

    try {
      await createTask.mutateAsync({
        id: crypto.randomUUID(),
        title: data.title,
        description: data.description,
        event_id: undefined,
      });
      toast.success('Tarefa criada!');
    } catch (error) {
      toast.error('Erro ao criar tarefa');
    }
  };

  const onGroupClick = (groupName: string) => {
    if (groupsOpen.includes(groupName)) {
      setGroupsOpen(groupsOpen.filter((g) => g !== groupName));
    } else {
      setGroupsOpen([...groupsOpen, groupName]);
    }
  };

  const handleToggle = (id: string, completed: boolean) => {
    toggleTodo.mutate({ id, completed: !completed });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTodo.mutateAsync(id);
      toast.success('Tarefa excluída!');
    } catch (error) {
      toast.error('Erro ao excluir tarefa');
    }
  };

  const renderTodoItem = (todo: typeof todos[0]) => (
    <div
      key={todo.id}
      className={`flex items-start gap-3 p-3 border border-border rounded ${todo.completed ? 'opacity-60' : ''
        }`}
    >
      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => handleToggle(todo.id, todo.completed)}
        className="mt-0.5"
      />
      <div className="flex-1 min-w-0">
        <p className={`text-sm text-foreground ${todo.completed ? 'line-through' : ''}`}>
          {todo.description}
        </p>
        {todo.study_log_id && todo.study_logs && (
          <button
            onClick={() => setViewingLog(todo.study_logs as StudyLog)}
            className="flex items-center gap-1 mt-1 text-xs text-primary hover:underline"
          >
            <FileText className="h-3 w-3" />
            Ver contexto
            <ExternalLink className="h-3 w-3" />
          </button>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleDelete(todo.id)}
        className="shrink-0"
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );

  const renderTaskGroups = (group: Groups) => (
    <Card className="mt-6">
      <CardHeader onClick={() => onGroupClick(group.name)} className="cursor-pointer flex-row items-center">
        <ArrowDown className={`transform transition-transform ${groupsOpen.includes(group.name) ? '-rotate-90' : ''}`} />
        <CardTitle>{group.name}</CardTitle>
      </CardHeader>
      {groupsOpen.includes(group.name) && (
        <CardContent className='flex flex-col gap-4'>
          {group.tasks.map((masterTask) => (
            <div className='border p-4'>
              <div
                onClick={() => setViewingTask(masterTask)}
                className='py-1 text-lg flex flex-row items-center gap-2 border-t border-b'>
                <Checkbox />
                <div className='flex justify-between w-full'>
                  <div className=''>
                    <h3>{masterTask.title}</h3>
                    <p className='text-sm text-zinc-600'>{masterTask.description}</p>
                  </div>
                  <div>
                    <FileText className="h-3 w-3" />
                    Ver contexto
                  </div>
                </div>
              </div>
              {masterTask.subTasks && masterTask.subTasks.map((subTask) => (
                <div className='px-4'>
                  <div className='py-1 text-md flex items-center gap-2 border-t border-b'>
                    <Checkbox />
                    <div>
                      <h3>{subTask.title}</h3>
                      <span className='text-zinc-700'>descrição Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vitae veritatis tempore hic.</span>
                    </div>
                  </div>
                  <div className='py-1 text-md flex items-center gap-2 border-t border-b'>
                    <Checkbox />
                    <h3>{subTask.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </CardContent >
      )}
    </Card >
  );

  const renderTaskDialog = (masterTask: MasterTask) => (
    <Dialog open={!!viewingTask} onOpenChange={() => setViewingTask(null)}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Contexto da Sessão de Estudo</DialogTitle>
        </DialogHeader>
        {masterTask && (
          <div className='flex flex-row gap-6'>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: '#000' }}
                />
                <span className="font-medium">{masterTask.title}</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Titulo</p>
                <p className="text-foreground">{masterTask.title}</p>
              </div>

              {masterTask.description && (
                <div>
                  <p className="text-sm text-muted-foreground">Descrição</p>
                  <p className="text-foreground whitespace-pre-wrap">{masterTask.description}</p>
                </div>
              )}
              <div>
                <p>Evento vinculado</p>
                <div className="p-2 bg-accent/50 border-t border-b rounded whitespace-pre-wrap text-foreground text-sm mt-2">
                  Sessão de estudo em 20/06/2024, das 14:00 às 16:00
                </div>
              </div>
              <div>
                <p>Sub-tarefas:</p>
                <div className="px-4 text-sm py bg-accent/50 border-t border-b rounded whitespace-pre-wrap text-foreground justify-center items-center flex">
                  <Checkbox className="mr-2" />
                  R1 - Releitura: Rever os conceitos de energia e trabalho
                </div>
                <div className="px-4 text-sm py bg-accent/50 border-t border-b rounded whitespace-pre-wrap text-foreground justify-center items-center flex">
                  <Checkbox className="mr-2" />
                  R1 - Releitura: Rever os conceitos de energia e trabalho
                </div>
              </div>
              <div>
                <p>Comentar:</p>
                <Input type="text" />
              </div>
            </div>
            <div className='bg-zinc-200/40 space-y-4 p-2'>
              <div>
                <p className="text-sm text-muted-foreground">Projeto:</p>
                <p className="text-foreground text-sm">
                  #Fisica/Revisao
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Criado:</p>
                <p className="text-foreground text-sm">
                  {new Date(masterTask.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tags:</p>
                <p className="text-foreground text-sm">
                  #revisao
                </p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog >
  );


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

  return (
    <>
      <div className='flex justify-between items-center'>
        <h1 className="text-2xl font-bold text-foreground mb-6">Gerenciar Tarefas</h1>
        <div>
          <Label htmlFor="">Selecionar projeto</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um projeto" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project} value={project}>
                  {project}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nova Tarefa (teste)</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setViewingForm(true)}>Criar nova Tarefa</Button>
        </CardContent>
      </Card>

      <Card className="mt-6" >
        <CardHeader onClick={() => onGroupClick("pending")} className="cursor-pointer">
          <ArrowDown />
          <CardTitle> Pendentes ({pendingTodos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {pendingTodos.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Nenhuma tarefa pendente 🎉
            </p>
          ) : (
            <div className="space-y-2">
              {pendingTodos.map(renderTodoItem)}
            </div>
          )}
        </CardContent>
      </Card>

      <div>
        <h1 className="text-3xl font-bold text-foreground my-6">{project.name}</h1>
        {project.groups.map((group) => (
          <div key={group.id}>
            {renderTaskGroups(group)}
          </div>
        ))}
      </div>

      {
        completedTodos.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Concluídas ({completedTodos.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {completedTodos.map(renderTodoItem)}
              </div>
            </CardContent>
          </Card>
        )
      }

      {
        viewingTask && renderTaskDialog(viewingTask as MasterTask)
      }

      <Dialog open={viewingForm} onOpenChange={() => setViewingForm(false)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Adicionar Tarefa</DialogTitle>
          </DialogHeader>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Label htmlFor="subtask-name">Nome da Tarefa</Label>
              <Input id="subtask-name" type="text" placeholder="Digite o nome da tarefa" />
            </div>
            <div>
              <Label htmlFor="subtask-description">Descrição</Label>
              <Input id="subtask-description" type="text" placeholder="Digite a descrição da tarefa" />
            </div>
            <div>
              <Label htmlFor="subtask-project">Grupo:</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um projeto" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project} value={project}>
                      {project}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setViewingForm(false)}>Cancelar</Button>
              <Button type="submit">Adicionar</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
