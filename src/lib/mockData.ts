import { localDb } from "./localDb";
import { mockDataTodoList } from "@/components/todos/mockTodolist";

export const initializeLocalStorageWithMockData = () => {
    if (!localStorage.getItem('projects')) {
        localStorage.setItem('projects', JSON.stringify(mockDataTodoList.projects));
        localStorage.setItem('modules', JSON.stringify(mockDataTodoList.modules));
        localStorage.setItem('tasks', JSON.stringify(mockDataTodoList.tasks));
        localStorage.setItem('groups', JSON.stringify(mockDataTodoList.groups));
    }
};
