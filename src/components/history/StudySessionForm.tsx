import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useSubjects } from '@/hooks/useSubjects';
import { useCreateStudyLog } from '@/hooks/useStudyLogs';
import { toast } from 'sonner';
import { Clock, Plus } from 'lucide-react';
import NewTaskForm from '../tasks/NewTaskForm';
import { useProjects } from '@/hooks/useProjects';
import { StudyLog } from '@/types/database';
import { BlockerDialog } from './BlockerDialog';
import { useTitlePage } from '@/hooks/useTitlePage';
import { useStudyLogFormProvider } from '@/hooks/useStudySessionForm';



export interface StudyLogForm {
  subject_id: string;
  content: string;
  study_date: Date;
  start_time: Date;
  end_time: Date;
  notes?: string;
  taskId?: string | null;
  duration: number;
}

export function StudySessionForm() {
  const navigate = useNavigate();
  useTitlePage('Nova sessão de estudo');
  const { data: subjects = [], isLoading: loadingSubjects } = useSubjects();
  const { data: projects = [], isLoading: loadingProjects } = useProjects();
  const createStudyLog = useCreateStudyLog();
  const [createTodoAfter, setCreateTodoAfter] = useState(false);

  const [timeRegisterType, setTimeRegisterType] = useState<'manual' | 'cronometer'>('manual');
  const [cronometerTime, setCronometerTime] = useState(0);
  const { isCronometerRunning, setIsCronometerRunning, setSessionFormData } = useStudyLogFormProvider();
  const [cronometerStartTime, setCronometerStartTime] = useState<number | null>(null);

  const [viewingNewTaskForm, setViewingNewTaskForm] = useState(false);
  const [createdStudyLog, setCreatedStudyLog] = useState<StudyLog | null>(null);

  const today = new Date();
  const now = new Date().toTimeString().slice(0, 5);

  const [formData, setFormData] = useState<StudyLogForm>({
    subject_id: '',
    content: '',
    study_date: undefined,
    start_time: undefined,
    end_time: undefined,
    notes: '',
    duration: 0,
  });

  useEffect(() => {
    setSessionFormData(formData);
  }, [formData, setSessionFormData]);

  const [formErrors, setFormErrors] = useState<z.ZodError['formErrors']['fieldErrors'] | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, subject_id: value }));
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatCronometerTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    const twoDigits = (n: number) => n.toString().padStart(2, '0');
    return `${twoDigits(hrs)}:${twoDigits(mins)}:${twoDigits(secs)}`;
  };

  useEffect(() => {
    let interval: number | undefined;

    if (isCronometerRunning && cronometerStartTime) {
      interval = window.setInterval(() => {
        const elapsed = Math.floor((Date.now() - cronometerStartTime) / 1000);
        setCronometerTime(elapsed);
      }, 1000);
    }

    return () => {
      if (interval !== undefined) {
        window.clearInterval(interval);
      }
    };
  }, [isCronometerRunning, cronometerStartTime]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const hasContent =
        (formData.content && formData.content.trim() !== '') ||
        (formData.notes && formData.notes.trim() !== '') ||
        (formData.start_time && formData.start_time !== undefined) ||
        (formData.end_time && formData.end_time !== undefined) ||
        (formData.subject_id && formData.subject_id.trim() !== '') ||
        isCronometerRunning;


      if (hasContent) {
        e.preventDefault();
        e.returnValue = 'Você tem uma sessão de estudo em andamento. Deseja realmente sair?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isCronometerRunning, formData]);

  const calculateDuration = (start: Date, end: Date): number => {
    if (!start || !end) return 0;

    return Math.floor((end.getTime() - start.getTime()) / 60000); // duration in minutes
  };



  const setCurrentTime = (field: 'start_time' | 'end_time') => {
    setFormData(prev => ({ ...prev, [field]: now }));
  };

  const startTiming = () => {
    const now = new Date();
    if (!isCronometerRunning) {
      // Starting the timer
      setCronometerStartTime(now.getTime());
      setFormData(prev => ({
        ...prev,
        start_time: now,
        end_time: undefined,
      }));
      setCronometerTime(0); // Reset timer display
      setIsCronometerRunning(true);
    } else {
      // Stopping the timer
      setIsCronometerRunning(false);
      setFormData(prev => ({ ...prev, end_time: now }));
    }
  };

  const duration = calculateDuration(formData.start_time, formData.end_time);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors(null);


    if (formData.start_time === undefined || formData.end_time === undefined) {
      toast.error('Por favor, corrija os erros no formulário.');
      return;
    }

    const durationMinutes = calculateDuration(formData.start_time, formData.end_time);

    if (durationMinutes <= 0) {
      toast.error('A hora de fim deve ser maior que a hora de início');
      setFormErrors(prev => ({ ...prev, end_time: ['A hora de fim deve ser maior que a hora de início'] }));
      return;
    }

    try {
      const studyLog = await createStudyLog.mutateAsync({
        ...formData,
        duration_minutes: durationMinutes,
        subject_id: formData.subject_id,
        content: formData.content,
        study_date: formData.study_date.toISOString().split('T')[0],
        start_time: formData.start_time.toISOString(),
        end_time: formData.end_time.toISOString(),
      });

      setCreatedStudyLog(studyLog);
      toast.success('Sessão de estudo registrada!');

      // Reset form state
      setFormData({
        subject_id: '',
        content: '',
        study_date: today,
        start_time: undefined,
        end_time: undefined,
        notes: '',
        duration: 0,
      });
      setCreateTodoAfter(false);
      if (isCronometerRunning) {
        setIsCronometerRunning(false);
        setCronometerTime(0);
        setCronometerStartTime(null);
      }

      if (createTodoAfter) {
        setViewingNewTaskForm(true);
      } else {
        navigate('/historico');
      }
    } catch (error) {
      toast.error('Erro ao registrar sessão');
      console.error(error);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Nova Sessão de Estudo</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="subject">Matéria</Label>
              <Select value={formData.subject_id} onValueChange={handleSelectChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma matéria" />
                </SelectTrigger>
                <SelectContent>
                  {loadingSubjects ? (
                    <SelectItem value="loading" disabled>Carregando...</SelectItem>
                  ) : subjects.length === 0 ? (
                    <SelectItem value="empty" disabled>Nenhuma matéria cadastrada</SelectItem>
                  ) : (
                    subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: subject.color }}
                          />
                          {subject.name}
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {formErrors?.subject_id && (
                <p className="text-sm text-destructive">{formErrors.subject_id[0]}</p>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => navigate('/materias')}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-1" />
                Cadastrar matéria
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Conteúdo Estudado</Label>
              <Input
                id="content"
                placeholder="Ex: Logaritmos, Sistema Nervoso, Phrasal Verbs..."
                value={formData.content}
                onChange={handleInputChange}
              />
              {formErrors?.content && (
                <p className="text-sm text-destructive">{formErrors.content[0]}</p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="study_date">Data</Label>
                <Input
                  id="study_date"
                  type="date"
                  value={formData.study_date ? formatDate(formData.study_date) : ''}
                  onChange={handleInputChange}
                />
                {formErrors?.study_date && (
                  <p className="text-sm text-destructive">{formErrors.study_date[0]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Registrar Tempo de Estudo</Label>
                <div className='space-x-2'>
                  <Button
                    type='button'
                    variant={timeRegisterType === 'manual' ? 'default' : 'outline'}
                    onClick={() => setTimeRegisterType('manual')}
                  >
                    Manualmente
                  </Button>
                  <Button
                    type='button'
                    variant={timeRegisterType === 'cronometer' ? 'default' : 'outline'}
                    onClick={() => setTimeRegisterType('cronometer')}
                  >
                    Cronometrar
                  </Button>
                </div>
              </div>
            </div>

            {timeRegisterType === 'cronometer' && (
              < Card >
                <CardHeader>
                  <CardTitle>Cronômetro de Estudo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center gap-4">
                    <div className="text-3xl font-mono">
                      {formatCronometerTime(cronometerTime)}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={isCronometerRunning ? 'outline' : 'default'}
                        onClick={startTiming}
                      >
                        {isCronometerRunning ? 'Parar' : 'Iniciar'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsCronometerRunning(false);
                          setCronometerTime(0);
                          setCronometerStartTime(null);
                        }}
                      >
                        Fechar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card >
            )}
            <div className='grid grid-cols-2 gap-4'>
              <div className="space-y-2" >
                <Label htmlFor="start_time">Hora Início</Label>
                <div className="flex gap-2">
                  <Input
                    id="start_time"
                    type="time"
                    disabled={timeRegisterType === 'cronometer'}
                    value={formData.start_time ? formatDate(formData.start_time) : ''}
                    onChange={handleInputChange}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentTime('start_time')}
                    title="Agora"
                  >
                    <Clock className="h-4 w-4" />
                  </Button>
                </div>
                {formErrors?.start_time && (
                  <p className="text-sm text-destructive">{formErrors.start_time[0]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_time">Hora Fim</Label>
                <div className="flex gap-2">
                  <Input
                    id="end_time"
                    type="time"
                    disabled={timeRegisterType === 'cronometer'}
                    value={formData.end_time ? formatDate(formData.end_time) : ''}
                    onChange={handleInputChange}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentTime('end_time')}
                    title="Agora"
                  >
                    <Clock className="h-4 w-4" />
                  </Button>
                </div>
                {formErrors?.end_time && (
                  <p className="text-sm text-destructive">{formErrors.end_time[0]}</p>
                )}
              </div>
            </div>


            {duration > 0 && (
              <div className="p-3 bg-accent/50 rounded text-sm">
                <span className="text-muted-foreground">Duração: </span>
                <span className="font-medium text-foreground">
                  {Math.floor(duration / 60)}h {duration % 60}min
                </span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes">Anotações (opcional)</Label>
              <Textarea
                id="notes"
                placeholder="Resumo, pontos-chave, dúvidas..."
                rows={4}
                value={formData.notes}
                onChange={handleInputChange}
              />
              {formErrors?.notes && (
                <p className="text-sm text-destructive">{formErrors.notes[0]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Tags</Label>
              <Input
                placeholder="Ex: Prova, Revisão, Exercícios..."

              >
              </Input>
            </div>

            <div className="space-y-3 p-4 border border-border rounded">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="createTodo"
                  checked={createTodoAfter}
                  onCheckedChange={(checked) => setCreateTodoAfter(checked as boolean)}
                />
                <Label htmlFor="createTodo" className="cursor-pointer">
                  Criar tarefa vinculada a esta sessão
                </Label>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createStudyLog.isPending}
                className="flex-1"
              >
                {createStudyLog.isPending ? 'Salvando...' : 'Registrar Sessão'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      {viewingNewTaskForm && projects.length > 0 && (
        <NewTaskForm
          projectName={projects[0].name}
          projectId={projects[0].id}
          groups={[]}
          viewingForm={viewingNewTaskForm}
          setViewingForm={setViewingNewTaskForm}
          study_log_id={createdStudyLog?.id}
        />
      )}
      <BlockerDialog />
    </>
  );
}