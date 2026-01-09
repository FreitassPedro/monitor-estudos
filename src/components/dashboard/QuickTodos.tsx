import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { usePendingTodos, useToggleTodo } from '@/hooks/useTodos';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText } from 'lucide-react';

export function QuickTodos() {
  const { data: todos = [], isLoading } = usePendingTodos(3);
  const toggleTodo = useToggleTodo();

  const handleToggle = (id: string, completed: boolean) => {
    toggleTodo.mutate({ id, completed: !completed });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Próximas Tarefas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-muted rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">Próximas Tarefas</CardTitle>
        <Link 
          to="/tarefas" 
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          Ver todas
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent>
        {todos.length === 0 ? (
          <p className="text-muted-foreground text-sm py-4 text-center">
            Nenhuma tarefa pendente
          </p>
        ) : (
          <div className="space-y-3">
            {todos.map((todo) => (
              <div 
                key={todo.id} 
                className="flex items-start gap-3 p-3 bg-accent/50 rounded"
              >
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => handleToggle(todo.id, todo.completed)}
                  className="mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{todo.description}</p>
                  {todo.study_log_id && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                      <FileText className="h-3 w-3" />
                      <span>Vinculado a sessão de estudo</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
