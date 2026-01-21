import { useEffect } from "react";

export function useTitlePage(title: string) {
    useEffect(() => {
        document.title = title;

        document.title = title + " - Monitor de Estudos";

        return () => {
            document.title = "Monitor de Estudos";
        };
    }, [title]);
}

