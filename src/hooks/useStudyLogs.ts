import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { StudyLog, CreateStudyLogInput } from '@/types/database';
import { localDb } from '@/lib/localDb';

export function useStudyLogs() {

  return useQuery({
    queryKey: ['study_logs'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
      return localDb.getAll<StudyLog>('study_logs');
    }
  });
};


export function useStudyByLogsByDate(date: Date) {
  return useQuery({
    queryKey: ['study_logs'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
      const allLogs = localDb.getAll<StudyLog>('study_logs');
      return allLogs.filter(log => log.study_date === date.toISOString().split('T')[0]);
    }
  });
};

export function useCreateStudyLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateStudyLogInput) => {
      localDb.insert<StudyLog>('study_logs', input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study_logs'] });
    }
  });
};

export function useUpdateStudyLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<StudyLog> & { id: string }) => {
      const { data, error } = await supabase
        .from('study_logs')
        .update(input)
        .eq('id', id)
        .select('*, subjects(*)')
        .single();

      if (error) throw error;
      return data as StudyLog;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study_logs'] });
    },
  });
}

export function useDeleteStudyLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('study_logs')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study_logs'] });
    },
  });
}
