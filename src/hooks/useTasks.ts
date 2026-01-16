import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { localDb } from '@/lib/localDb';
import { Groups, Task, TaskTree } from '@/types/tasks';
import { CreateTaskDTO } from '@/types/database';

export function useTasks(project_id?: string) {
  return useQuery({
    queryKey: ['tasks', project_id],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
      const tasks: Task[] = await localDb.getAll<Task>('tasks');
      return tasks.filter(task => task.project_id === project_id);
    },
  });
}

export function usePendingTasks(limit?: number) {
  return useQuery({
    queryKey: ['tasks', 'pending', limit],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
      const tasks = await localDb.getAll<Task>('tasks');
      return tasks.filter(task => !task.completed).slice(0, limit);
    },
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTaskDTO) => {
      const newTask: Task = {
        id: crypto.randomUUID(),
        title: data.title,
        description: data.description,
        completed: false,
        project_id: data.project_id,
        group_id: data.group_id || undefined,
        parent_id: data.parent_id || null,
        created_at: new Date().toISOString(),
        due_date: data.due_date,
      };

      localDb.insert<Task>('tasks', newTask);
      return newTask;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}




export function useToggleTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      localDb.update<Task>('tasks', id, { completed });
      return { id, completed };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  })
}


export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      localDb.delete('tasks', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  })
}
/*
export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}
*/


export function useCreateTaskGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ project_id, group_name }: { project_id: string; group_name: string }) => {
      localDb.insert<Groups>('groups', { name: group_name, project_id });
      // Implement the logic to create a new todo group in your database
      console.log('Creating new todo group with name:', group_name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todoGroups'] });
    },
  });
}


export function buildTaskTree(tasks: Task[]): TaskTree[] {
  const map = new Map<string, TaskTree>();
  const roots: TaskTree[] = [];

  if (!tasks) return roots;
  // Cria o mapa inicial
  tasks.forEach(task => {
    map.set(task.id, { ...task, subTasks: [] });
  });

  // Conecta os nós filhos aos pais
  map.forEach(task => {
    const node = map.get(task.id);

    if (task.parent_id && map.has(task.parent_id)) {
      map.get(task.parent_id)!.subTasks.push(node!);
    } else {
      roots.push(node!);
    }
  })
  return roots;
}

export function buildGroupsWithTasks(tasks: TaskTree[], groups: Groups[]): Groups[] {
  if (!tasks || !groups) return [];

  return groups.map(group => {
    return {
      ...group,
      tasks: tasks.filter(task => task.group_id === group.id)
    };
  });
}