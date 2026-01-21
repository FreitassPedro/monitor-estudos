
import { StudyLogForm } from '@/components/study/StudySessionForm';
import { Blocker } from '@remix-run/router';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useBlocker } from 'react-router-dom';

interface StudyLogFormContextType {
  isCronometerRunning: boolean;
  setIsCronometerRunning: React.Dispatch<React.SetStateAction<boolean>>;
  sessionFormData: StudyLogForm | undefined;
  setSessionFormData: React.Dispatch<React.SetStateAction<StudyLogForm | undefined>>;
  blocker: Blocker | null;
}

export const StudyLogFormContext = createContext<StudyLogFormContextType>({
  isCronometerRunning: false,
  setIsCronometerRunning: () => { },
  sessionFormData: new Object() as StudyLogForm,
  setSessionFormData: () => { },
  blocker: null,
});

