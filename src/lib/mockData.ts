import { localDb } from "./localDb";
import { mockDataTodoList } from "@/components/todos/mockTodolist";

export const initializeLocalStorageWithMockData = () => {
    if (!localStorage.getItem('projects')) {
        localStorage.setItem('projects', JSON.stringify(mockDataTodoList.modules[0].project));
    }
};
