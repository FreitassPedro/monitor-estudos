import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Todo, CreateTaskInput } from '@/types/database';
import { localDb } from '@/lib/localDb';

export function useTasks() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
      return localDb.getAll<Todo>('tasks');
    },
  });
}

export function usePendingTasks(limit?: number) {
  return useQuery({
    queryKey: ['tasks', 'pending', limit],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
      const tasks = await localDb.getAll<Todo>('tasks');
      return tasks.filter(task => !task.completed).slice(0, limit);
    },
  });
}



export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateTaskInput) => {
      localDb.insert<CreateTaskInput>('tasks', input);

      return input;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  })
}


export function useToggleTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      localDb.update<Todo>('tasks', id, { completed });
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
      // Implement the logic to create a new todo group in your database
      console.log('Creating new todo group with name:', group_name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todoGroups'] });
    },
  });
}