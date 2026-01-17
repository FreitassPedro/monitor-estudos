import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { localDb } from '@/lib/localDb';
import type { Project, Groups } from '@/types/tasks';

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const projects: Project[] = localDb.getAll<Project>('projects');
      return projects;
    },
  });
}

export function useProject(projectId: string) {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const projects = localDb.getAll<Project>('projects');
      return projects.find(p => p.id === projectId);
    },
    enabled: !!projectId,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectName: string) => {
      const newProject: Project = {
        id: crypto.randomUUID(),
        name: projectName,
        color: '#FFFFFF', // Default color, can be changed later
        created_at: new Date().toISOString(),
      };
      localDb.insert<Project>('projects', newProject);
      return newProject;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
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
          project_id: projectId,
        };
        localDb.insert<Groups>('groups', newGroup);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  })
}


export function useGroups(project_id: string) {
  return useQuery({
    queryKey: ['groups', project_id],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
      const groups = localDb.getAll<Groups>('groups');
      return groups.filter(group => group.project_id === project_id);
    }
  });
}
