
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useStudyLogFormProvider } from "@/hooks/useStudySessionForm";

export function BlockerDialog() {
  const { blocker, setIsCronometerRunning, sessionFormData } = useStudyLogFormProvider();

  const handleCancel = () => {
    if (blocker && blocker.state === 'blocked') {
      blocker.reset();
    }
  }

  const handleConfirm = () => {
    if (blocker && blocker.state === 'blocked') {
      setIsCronometerRunning(false)
      blocker.proceed();
    }
  }

  const hasContent = sessionFormData && (
    sessionFormData.content?.length > 0 ||
    sessionFormData.start_time !== undefined ||
    sessionFormData.end_time !== undefined ||
    sessionFormData.subject_id !== '' || 
    sessionFormData.duration > 0
  );

  if (!blocker || blocker.state !== 'blocked' || !hasContent) return null

  return (
    <AlertDialog open={true}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Você tem um registro de estudo em andamento. Sair da página irá cancelar o registro.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            Sair
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
