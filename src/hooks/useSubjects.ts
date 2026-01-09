import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Subject, CreateSubjectInput } from '@/types/database';
import { localDb } from '@/lib/localDb';

export function useSubjects() {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
      return localDb.getAll<Subject>('subjects');
    },
    initialData: () => {
      return localDb.getAll<Subject>('subjects');
    },
  })
};

export function useCreateSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newSubject: { name: string; color: string }) => {
      const newSubj = localDb.insert<{ id: string; name: string; color: string }>('subjects', newSubject);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
  });
};



export function useUpdateSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<Subject> & { id: string }) => {
      const { data, error } = await supabase
        .from('subjects')
        .update(input)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Subject;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
  });
}

export function useDeleteSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
  });
}
