import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { useCreateTodo } from '@/hooks/useTodos';
import { toast } from 'sonner';
import { Clock, Plus } from 'lucide-react';

const formSchema = z.object({
  subject_id: z.string().min(1, 'Selecione uma matéria'),
  content: z.string().min(1, 'Digite o conteúdo estudado').max(200, 'Máximo 200 caracteres'),
  study_date: z.string().min(1, 'Selecione a data'),
  start_time: z.string().min(1, 'Digite a hora de início'),
  end_time: z.string().min(1, 'Digite a hora de fim'),
  notes: z.string().max(2000, 'Máximo 2000 caracteres').optional(),
});

type FormData = z.infer<typeof formSchema>;

export function StudySessionForm() {
  const navigate = useNavigate();
  const { data: subjects = [], isLoading: loadingSubjects } = useSubjects();
  const createStudyLog = useCreateStudyLog();
  const createTodo = useCreateTodo();
  const [createTodoAfter, setCreateTodoAfter] = useState(false);
  const [todoDescription, setTodoDescription] = useState('');

  const [timeRegisterType, setTimeRegisterType] = useState<'manual' | 'cronometer'>('manual');
  const [cronometerTime, setCronometerTime] = useState(0);
  const [isCronometerRunning, setIsCronometerRunning] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const now = new Date().toTimeString().slice(0, 5);



  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      study_date: today,
      start_time: '',
      end_time: '',
      content: '',
      notes: '',
    },
  });

  const startTime = watch('start_time');
  const endTime = watch('end_time');

  const formatCronometerTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    const twoDigits = (n: number) => n.toString().padStart(2, '0');
    return `${twoDigits(hrs)}:${twoDigits(mins)}:${twoDigits(secs)}`;
  };

  useEffect(() => {
    let interval: number | undefined;

    if (isCronometerRunning) {
      interval = window.setInterval(() => {
        setCronometerTime((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval !== undefined) {
        window.clearInterval(interval);
      }
    };
  }, [isCronometerRunning]);

  const calculateDuration = (start: string, end: string): number => {
    if (!start || !end) return 0;
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    return Math.max(0, endMinutes - startMinutes);
  };



  const setCurrentTime = (field: 'start_time' | 'end_time') => {
    setValue(field, now);
  };

  const startTiming = () => {
    const now = new Date();
    if (!isCronometerRunning) {
      // Starting the timer
      setValue('start_time', now.toTimeString().slice(0, 5));
      setIsCronometerRunning(true);
    } else {
      // Stopping the timer
      setIsCronometerRunning(false);
      const end = new Date(now.getTime() + cronometerTime * 1000);
      setValue('end_time', end.toTimeString().slice(0, 5));
    }
  };
  
  const duration = calculateDuration(startTime, endTime);

  const onSubmit = async (data: FormData) => {
    const durationMinutes = calculateDuration(data.start_time, data.end_time);

    if (durationMinutes <= 0) {
      toast.error('A hora de fim deve ser maior que a hora de início');
      return;
    }

    try {
      const studyLog = await createStudyLog.mutateAsync({
        subject_id: data.subject_id,
        content: data.content,
        study_date: data.study_date,
        start_time: data.start_time,
        end_time: data.end_time,
        duration_minutes: durationMinutes,
        notes: data.notes || undefined,
      });

      if (createTodoAfter && todoDescription.trim()) {
        await createTodo.mutateAsync({
          description: todoDescription.trim(),
          study_log_id: studyLog.id,
        });
      }

      toast.success('Sessão de estudo registrada!');
      navigate('/historico');
    } catch (error) {
      toast.error('Erro ao registrar sessão');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nova Sessão de Estudo</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="subject">Matéria</Label>
            <Select onValueChange={(value) => setValue('subject_id', value)}>
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
            {errors.subject_id && (
              <p className="text-sm text-destructive">{errors.subject_id.message}</p>
            )}
            {subjects.length === 0 && (
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
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Conteúdo Estudado</Label>
            <Input
              id="content"
              placeholder="Ex: Logaritmos, Sistema Nervoso, Phrasal Verbs..."
              {...register('content')}
            />
            {errors.content && (
              <p className="text-sm text-destructive">{errors.content.message}</p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="study_date">Data</Label>
              <Input
                id="study_date"
                type="date"
                {...register('study_date')}
              />
              {errors.study_date && (
                <p className="text-sm text-destructive">{errors.study_date.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Registrar Tempo de Estudo</Label>
              <div className='space-x-2'>
                <Button
                  onClick={() => setTimeRegisterType('manual')}
                >
                  Manualmente
                </Button>
                <Button
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
                      onClick={() => startTiming()}
                    >
                      {isCronometerRunning ? 'Parar' : 'Iniciar'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCronometerTime(0)}
                    >
                      Zerar
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsCronometerRunning(false);
                        setCronometerTime(0);
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
                  {...register('start_time')}
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
              {errors.start_time && (
                <p className="text-sm text-destructive">{errors.start_time.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_time">Hora Fim</Label>
              <div className="flex gap-2">
                <Input
                  id="end_time"
                  type="time"
                  disabled={timeRegisterType === 'cronometer'}
                  {...register('end_time')}
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
              {errors.end_time && (
                <p className="text-sm text-destructive">{errors.end_time.message}</p>
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
              {...register('notes')}
            />
            {errors.notes && (
              <p className="text-sm text-destructive">{errors.notes.message}</p>
            )}
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

            {createTodoAfter && (
              <Input
                placeholder="Ex: Fazer exercícios deste capítulo"
                value={todoDescription}
                onChange={(e) => setTodoDescription(e.target.value)}
              />
            )}
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
    </Card >
  );
}
