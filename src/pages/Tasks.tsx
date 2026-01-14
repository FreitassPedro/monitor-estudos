import { Layout } from '@/components/layout/Layout';
import { Navbar } from '@/components/layout/Navbar';
import { TodoList } from '@/components/todos/TodoList';
import { TodoListSidebar } from '@/components/todos/TodoListSidebar';
import React from 'react';

const Tasks = () => {
  const [selectedProjectName, setSelectedProject] = React.useState<string | undefined>(undefined);
 
  return (
    <div>
      <Navbar />
      <div className="flex h-screen gap-8">
        <TodoListSidebar
          setSelectedProject={setSelectedProject}
        />

        <main className='flex-1 p-8 w-full mx-auto'>
          <TodoList
            selectedProjectName={selectedProjectName} />
        </main>
      </div>
    </div>
  );
};

export default Tasks;
