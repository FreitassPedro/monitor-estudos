import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStudyByLogsByDate } from '@/hooks/useStudyLogs';
import { Clock } from 'lucide-react';

export function RecentSessions() {
  const { data: todayLogs = [], isLoading } = useStudyByLogsByDate();

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Sessões de Hoje</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-16 bg-muted rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Sessões de Hoje</CardTitle>
      </CardHeader>
      <CardContent>
        {todayLogs.length === 0 ? (
          <p className="text-muted-foreground text-sm py-4 text-center">
            Nenhuma sessão registrada hoje
          </p>
        ) : (
          <div className="space-y-3">
            {todayLogs.slice(0, 4).map((log) => (
              <div 
                key={log.id} 
                className="flex items-start gap-3 p-3 border border-border rounded"
              >
                <div 
                  className="w-3 h-3 rounded-full mt-1.5 shrink-0"
                  style={{ backgroundColor: log.subjects?.color || '#3B82F6' }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm">
                    {log.subjects?.name}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {log.content}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>
                      {log.start_time.slice(0, 5)} - {log.end_time.slice(0, 5)} 
                      ({Math.floor(log.duration_minutes / 60)}h {log.duration_minutes % 60}min)
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
