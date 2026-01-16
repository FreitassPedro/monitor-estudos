import { Layout } from '@/components/layout/Layout';
import { Navbar } from '@/components/layout/Navbar';
import { TaskList } from '@/components/todos/TaskList';
import { TaskListSidebar } from '@/components/todos/TaskListSidebar';
import { useProjects } from '@/hooks/useProjects';
import React, { useEffect } from 'react';

const Tasks = () => {
  const { data: projects, isLoading } = useProjects(); // Assumindo que useProjects retorna data e isLoading
  const [selectedProjectId, setSelectedProjectId] = React.useState<string | null>(null);
  console.log("Projects data in Tasks page:", projects);

  // Efeito para definir o ID inicial assim que os dados chegarem
  React.useEffect(() => {
    console.log("Projects updated in Tasks page:", projects);
    if (projects?.[0]?.id) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects]);

  // Bloqueio de renderização: Enquanto estiver carregando ou não houver projetos, mostra um loading
  if (isLoading || !projects || selectedProjectId === null) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Carregando projetos...</p>
      </div>
    );
  }

  console.log("Selected Project ID in Tasks page:", selectedProjectId);
  return (
    <div>
      <Navbar />
      <div className="flex h-screen gap-8">
        <TaskListSidebar
          setSelectedProjectId={setSelectedProjectId}
        />

        <main className='flex-1 p-8 w-full mx-auto'>
          <TaskList
            projectId={selectedProjectId} />
        </main>
      </div>
    </div>
  );
};

export default Tasks;
