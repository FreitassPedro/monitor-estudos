import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useTodos, useCreateTodo, useToggleTodo, useDeleteTodo } from '@/hooks/useTodos';
import { toast } from 'sonner';
import { Plus, Trash2, FileText, ExternalLink } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { StudyLog } from '@/types/database';

export function TodoList() {
  const { data: todos = [], isLoading } = useTodos();
  const createTodo = useCreateTodo();
  const toggleTodo = useToggleTodo();
  const deleteTodo = useDeleteTodo();

  const [newDescription, setNewDescription] = useState('');
  const [viewingLog, setViewingLog] = useState<StudyLog | null>(null);

  const pendingTodos = todos.filter((t) => !t.completed);
  const completedTodos = todos.filter((t) => t.completed);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newDescription.trim()) {
      toast.error('Digite a descrição da tarefa');
      return;
    }

    try {
      await createTodo.mutateAsync({
        description: newDescription.trim(),
      });
      setNewDescription('');
      toast.success('Tarefa criada!');
    } catch (error) {
      toast.error('Erro ao criar tarefa');
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
      <Card>
        <CardHeader>
          <CardTitle>Nova Tarefa</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="flex gap-2">
            <Input
              placeholder="O que você precisa fazer?"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              maxLength={200}
              className="flex-1"
            />
            <Button type="submit" disabled={createTodo.isPending}>
              <Plus className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Pendentes ({pendingTodos.length})</CardTitle>
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

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Grupo 1</CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col gap-4'>
          <div className='border border-green-500 p-4'>
            <div className='text-xl'>Física</div>
            <div>
              <div className='text-lg'>- Resolver lista de exercícios</div>
              <div className='text-lg'>- Revisar capítulo 3 do livro</div>
            </div>
          </div>
          <div className='border border-blue-500 p-4'>
            <div className='text-xl'>Geografia</div>
            <div>
              <div className='text-lg'>
                <Checkbox checked={true} className="mr-2" />
                Resolver lista de exercícios</div>
              <div className='text-lg'>- Revisar capítulo 3 do livro</div>
            </div>
          </div>
        </CardContent >
      </Card >

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

      < Dialog open={!!viewingLog
      } onOpenChange={() => setViewingLog(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Contexto da Sessão de Estudo</DialogTitle>
          </DialogHeader>
          {viewingLog && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: viewingLog.subjects?.color }}
                />
                <span className="font-medium">{viewingLog.subjects?.name}</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Conteúdo</p>
                <p className="text-foreground">{viewingLog.content}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Data</p>
                <p className="text-foreground">
                  {new Date(viewingLog.study_date).toLocaleDateString('pt-BR')}
                </p>
              </div>
              {viewingLog.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Anotações</p>
                  <p className="text-foreground whitespace-pre-wrap">{viewingLog.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog >
    </>
  );
}
