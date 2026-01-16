import { localDb } from "@/lib/localDb";
import { Groups } from "@/types/tasks";
import { useQuery } from "node_modules/@tanstack/react-query/build/modern/useQuery";

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