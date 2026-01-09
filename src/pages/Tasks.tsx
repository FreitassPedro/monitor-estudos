import { Layout } from '@/components/layout/Layout';
import { TodoList } from '@/components/todos/TodoList';

const Tasks = () => {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-6">Gerenciar Tarefas</h1>
        <TodoList />
      </div>
    </Layout>
  );
};

export default Tasks;
