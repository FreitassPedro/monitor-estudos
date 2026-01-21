import { StudyLogFormContext } from "@/contexts/StudySessionFormContext";
import { useContext } from "react";

export const useStudyLogFormProvider = () => {
    const context = useContext(StudyLogFormContext);
    if (!context) {
        throw new Error("useStudySession must be used within a StudySessionFormProvider");
    }
    return context;
}