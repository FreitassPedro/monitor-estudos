import { ArrowDown, FileText } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Groups } from "@/types/tasks";
import React from "react";

interface TaskGroupsProps {
    group: Groups;
    setViewingTask: (taskId: string) => void;
}

const TaskGroups: React.FC<TaskGroupsProps> = ({ group, setViewingTask }) => {

    const [isOpen, setIsOpen] = React.useState<boolean>(true);

    return (
        <Card className="mt-6">
            <CardHeader onClick={() => setIsOpen(!isOpen)} className="cursor-pointer flex-row items-center">
                <ArrowDown className={`transform transition-transform ${isOpen ? '' : '-rotate-90'}`} />
                <CardTitle>{group.name}</CardTitle>
            </CardHeader>
            {isOpen && (
                <CardContent className='flex flex-col gap-4'>
                    {group.tasks.map((masterTask) => (
                        <div className='border p-4' key={masterTask.id}>
                            <div
                                onClick={() => setViewingTask(masterTask.id)}
                                className='py-1 text-lg flex flex-row items-center gap-2 border-t border-b'>
                                <Checkbox />
                                <div className='flex justify-between w-full'>
                                    <div className=''>
                                        <h3>{masterTask.title}</h3>
                                        <p className='text-sm text-zinc-600'>{masterTask.description}</p>
                                    </div>
                                    <div>
                                        <FileText className="h-3 w-3" />
                                        Ver contexto
                                    </div>
                                </div>
                            </div>
                            {masterTask.subTasks && masterTask.subTasks.map((subTask) => (
                                <div className='px-4' key={subTask.id}>
                                    <div className='py-1 text-md flex items-center gap-2 border-t border-b'>
                                        <Checkbox />
                                        <div>
                                            <h3>{subTask.title}</h3>
                                            <span className='text-zinc-700'>descrição Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vitae veritatis tempore hic.</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </CardContent >
            )}
        </Card >
    );
};

export default TaskGroups;