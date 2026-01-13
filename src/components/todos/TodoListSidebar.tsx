import { Sidebar } from "../ui/sidebar";

interface TodoListSidebarProps {
    setSelectedProject?: (project: string) => void;
}

export const TodoListSidebar: React.FC<TodoListSidebarProps> = ({ setSelectedProject }) => {    

    return (
        <div className="bg-card w-[400px] h-full p-4 border-r border-border">
            teste
            <div className="">
                <h2 className="text-lg font-semibold">Meus Projetos</h2>
                <div className="flex flex-col gap mt-2">
                    <span onClick={() => setSelectedProject("fisica")}># Fisica</span>
                    <span onClick={() => setSelectedProject("matematica")}># Matematica</span>
                </div>
            </div>
            <div className="">
                <h2 className="text-lg font-semibold">Estudos</h2>
                <div className="flex flex-col gap mt-2">
                    <span># Fisica</span>
                    <span># Matematica</span>
                </div>
            </div>
        </div>
    );
};  