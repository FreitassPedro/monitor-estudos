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
import { mockDataTodoList } from './mockTodolist';
import TaskGroups from './TaskGroups';
import ViewingTask from './ViewingTask';
import NewTaskForm from './NewTaskForm';

interface TodoListProps {
  selectedProjectName?: string;
}


export function TodoList({ selectedProjectName }: TodoListProps) {
  const { data: todos = [], isLoading } = useTodos();
  const toggleTodo = useToggleTodo();
  const deleteTodo = useDeleteTodo();

  const projects = ['todo', 'today', 'fisica', 'matematica'];

  useEffect(() => {
    setProject(
      mockDataTodoList.modules
        .map((m) => m.project)
        .flat()
        .find((p) => p.name === selectedProjectName) ||
      mockDataTodoList.modules[0].project[0]
    );
  }, [selectedProjectName]);

  const [project, setProject] = useState<Project>(mockDataTodoList.modules.map(m => m.project).flat().find(p => p.name === selectedProjectName) || mockDataTodoList.modules[0].project[0]);

  const [viewingLog, setViewingLog] = useState<StudyLog | null>(null);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);

  const [viewingForm, setViewingForm] = useState<boolean>(false);

  const pendingTodos = todos.filter((t) => !t.completed);
  const completedTodos = todos.filter((t) => t.completed);


  const handleViewTask = (taskId: string) => {
    const findTask = project.groups
      .map(g => g.tasks)
      .flat()
      .find(t => t.id === taskId);

    if (findTask) {
      setViewingTask(findTask);
    }
  };

  const handleTodoCompletion = (id: string, completed: boolean) => {
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
        onCheckedChange={() => handleTodoCompletion(todo.id, todo.completed)}
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
        <h1 className="text-2xl font-bold text-foreground mb-6">Gerenciar Tarefas tt</h1>
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
          {viewingForm && (
            <NewTaskForm
              projectName={project.name}
              projectId={project.id}
              groups={project.groups}
              viewingForm={viewingForm}
              setViewingForm={setViewingForm}
            />
          )}
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

      <Card className="mt-6" >
        <CardHeader className="cursor-pointer">
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

      {
        completedTodos.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Concluídas ({completedTodos.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {completedTodos.map((renderTodoItem))}
              </div>
            </CardContent>
          </Card>
        )
      }

      <ViewingTask task={viewingTask} setViewingTask={setViewingTask} />
    </>
  );
}
