import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { localDb } from '@/lib/localDb';
import type { Project, Groups } from '@/types/tasks';

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const projects = localDb.getAll<Project>('projects');
      return projects;
    },
  });
}

export function useCreateGroup() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async ({ projectId, groupName }: { projectId: string, groupName: string }) => {
        const projects = localDb.getAll<Project>('projects');
        const project = projects.find(p => p.id === projectId);
        if (project) {
          const newGroup: Groups = {
            id: crypto.randomUUID(),
            name: groupName,
            created_at: new Date().toISOString(),
            tasks: [],
          };
          const updatedProject = {
            ...project,
            groups: [...project.groups, newGroup],
          };
          localDb.update('projects', projectId, updatedProject);
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['projects'] });
      },
    })
  }
