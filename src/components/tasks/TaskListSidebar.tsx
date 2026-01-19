import { useCreateProject, useProjects } from "@/hooks/useProjects";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "../ui/dialog";
import React from "react";
import { Form } from "../ui/form";
import { useForm } from "react-hook-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

interface TaskListSidebarProps {
    setSelectedProjectId: (projectId: string) => void;
}

export const TaskListSidebar: React.FC<TaskListSidebarProps> = ({ setSelectedProjectId }) => {
    const { data: projects, isLoading, isError } = useProjects();
    const createProject = useCreateProject();

    const [viewCreateProject, setViewCreateProject] = React.useState(false);

    const { register, handleSubmit } = useForm();

    const handleChangeProject = (projectId: string) => {
        console.log("Selected project:", projectId);
        if (setSelectedProjectId) {
            setSelectedProjectId(projectId);
        }
    };

    const handleNewProject = async (values: { projectName: string }) => {
        console.log("New project button clicked");
        // Implement the logic to create a new project
        try {
            await createProject.mutateAsync(values.projectName);
            setViewCreateProject(false);
        } catch (error) {
            console.error("Error creating project:", error);
        }
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error fetching projects</div>;
    }

    return (
        <>
            <div className="bg-card w-[240px] h-full p-4 border-r border-border">
                <Button
                    className="mb-4 w-full"
                    onClick={() => setViewCreateProject(true)}
                >Novo Projeto</Button>
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
            {viewCreateProject && (
                <Dialog open={viewCreateProject} onOpenChange={() => setViewCreateProject(false)}>
                    <DialogContent>
                        <DialogTitle>
                            <h2>Criar Novo Projeto</h2>
                        </DialogTitle>
                        <DialogDescription>
                            <form onSubmit={handleSubmit(handleNewProject)}>
                                <div className="grid gap-2">
                                    <Label>Nome do Projeto</Label>
                                    <Input
                                        id="project-name"
                                        {...register('projectName')}
                                        placeholder="Ex: Física, Matemática..."
                                    />
                                </div>
                                <Button type="submit" className="mt-4 w-full">Criar Projeto</Button>
                            </form>
                        </DialogDescription>
                    </DialogContent>
                </Dialog >
            )}
        </>
    );
};
