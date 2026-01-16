import { useProjects } from "@/hooks/useProjects";

interface TaskListSidebarProps {
    setSelectedProjectId: (projectId: string) => void;
}

export const TaskListSidebar: React.FC<TaskListSidebarProps> = ({ setSelectedProjectId }) => {
    const { data: projects, isLoading, isError } = useProjects();

    const handleChangeProject = (projectId: string) => {
        console.log("Selected project:", projectId);
        if (setSelectedProjectId) {
            setSelectedProjectId(projectId);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error fetching projects</div>;
    }

    return (
        <div className="bg-card w-[240px] h-full p-4 border-r border-border">
            {projects?.map((project) => (
                <div
                    className="flex flex-col px-2 py-2 hover:bg-background transition duration-300 cursor-pointer rounded-md"
                    onClick={() => handleChangeProject(project.id)}
                    key={project.id}
                >
                    # {project.name}
                </div>
            ))}
        </div>
    );
};
