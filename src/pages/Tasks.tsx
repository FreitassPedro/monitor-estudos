import { Layout } from '@/components/layout/Layout';
import { Navbar } from '@/components/layout/Navbar';
import { TaskList } from '@/components/todos/TaskList';
import { TaskListSidebar } from '@/components/todos/TaskListSidebar';
import React from 'react';

const Tasks = () => {
  const [selectedProjectName, setSelectedProject] = React.useState<string | undefined>(undefined);
 
  return (
    <div>
      <Navbar />
      <div className="flex h-screen gap-8">
        <TaskListSidebar
          setSelectedProject={setSelectedProject}
        />

        <main className='flex-1 p-8 w-full mx-auto'>
          <TaskList
            selectedProjectName={selectedProjectName} />
        </main>
      </div>
    </div>
  );
};

export default Tasks;
