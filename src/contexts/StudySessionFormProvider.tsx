import { useContext, useState } from "react";
import { useBlocker } from "react-router-dom";
import {  StudyLogFormContext } from "./StudySessionFormContext";
import { StudyLogForm } from "@/components/study/StudySessionForm";

export const StudyLogFormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isCronometerRunning, setIsCronometerRunning] = useState(false);
    const [sessionFormData, setSessionFormData] = useState<StudyLogForm | undefined>(undefined);

    const blocker = useBlocker(
        ({ currentLocation, nextLocation }) =>
            isCronometerRunning &&
            currentLocation.pathname !== nextLocation.pathname
    );

    const value = {
        isCronometerRunning,
        setIsCronometerRunning,
        blocker,
        sessionFormData,
        setSessionFormData,
    };

    return (
        <StudyLogFormContext.Provider value={value}>
            {children}
        </StudyLogFormContext.Provider>
    );
};

