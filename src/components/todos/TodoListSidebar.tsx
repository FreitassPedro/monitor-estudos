import { mockDataTodoList } from "./mockTodolist";

interface TodoListSidebarProps {
    setSelectedProject?: (project: string) => void;
}

export const TodoListSidebar: React.FC<TodoListSidebarProps> = ({ setSelectedProject }) => {

    return (
        <div className="bg-card w-[240px] h-full p-4 border-r border-border">
            {mockDataTodoList.modules.map((module) => (
                <div key={module.id}>
                    <h2 className="text-lg font-semibold">{module.name}</h2>
                    {module.project.map((project) => (
                        <div
                            className="flex flex-col px-2 py-2 hover:bg-background transition duration-300 cursor-pointer rounded-md"
                            onClick={() => setSelectedProject && setSelectedProject(project.name)}
                            key={project.id}>
                            # {project.name}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

