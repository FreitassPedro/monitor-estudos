import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, BookOpen, Target } from 'lucide-react';
import { useStudyByLogsByDate } from '@/hooks/useStudyLogs';

export function TodaySummary() {
  const { data: todayLogs = [], isLoading } = useStudyByLogsByDate(new Date());

  const totalMinutes = todayLogs.reduce((acc, log) => acc + log.duration_minutes, 0);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const sessionsCount = todayLogs.length;

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Resumo de Hoje</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/2" />
            <div className="h-4 bg-muted rounded w-1/3" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Resumo de Hoje</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {hours}h {minutes}min
              </p>
              <p className="text-sm text-muted-foreground">Tempo estudado</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary/10 rounded">
              <BookOpen className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{sessionsCount}</p>
              <p className="text-sm text-muted-foreground">Sessões</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-muted/30 rounded">
              <Target className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {todayLogs.length > 0 ? todayLogs[0].subjects?.name : '-'}
              </p>
              <p className="text-sm text-muted-foreground">Última matéria</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
