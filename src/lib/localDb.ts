export const localDb = {

    getAll: <T>(table: string): T[] => {
        const data = localStorage.getItem(table);
        return data ? JSON.parse(data) : [];
    },

    insert: <T extends { id: string }>(table: string, item: Omit<T, 'id' | 'created_at' | 'updated_at'>) => {
        const data = localDb.getAll<T>(table);

        const now = new Date().toISOString();
        const newItem = {
            ...item,
            id: window.crypto.randomUUID(),
            created_at: now,
            updated_at: now,
        };
        
        const updatedData = [...data, newItem];
        localStorage.setItem(table, JSON.stringify(updatedData));
        return newItem;
    },


    update: <T extends { id: string }>(table: string, id: string, updates: Partial<T>) => {
        const data = localDb.getAll<T>(table);

        const updatedData = data.map(item => {
            if (item.id === id) {
                return ({
                    ...item,
                    ...updates,
                })
            }
            return item;
        });
        localStorage.setItem(table, JSON.stringify(updatedData));
        return updatedData.find(item => item.id === id);
    },

    // DELETAR (DELETE)
    delete: <T extends { id: string }>(table: string, id: string) => {
        const currentData = localDb.getAll<T>(table);
        const filteredData = currentData.filter((item) => item.id !== id);
        localStorage.setItem(table, JSON.stringify(filteredData));
    }
};