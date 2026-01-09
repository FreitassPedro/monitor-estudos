import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useStudyLogs, useDeleteStudyLog } from '@/hooks/useStudyLogs';
import { toast } from 'sonner';
import { Clock, FileText, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { StudyLog } from '@/types/database';

interface GroupedLogs {
  [date: string]: StudyLog[];
}

export function StudyHistory() {
  const { data: logs = [], isLoading } = useStudyLogs();
  const deleteStudyLog = useDeleteStudyLog();
  
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewingLog, setViewingLog] = useState<StudyLog | null>(null);
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());

  // Group logs by date
  const groupedLogs = logs.reduce<GroupedLogs>((acc, log) => {
    const date = log.study_date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(log);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedLogs).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  // Auto-expand recent dates
  useState(() => {
    const recentDates = sortedDates.slice(0, 3);
    setExpandedDates(new Set(recentDates));
  });

  const toggleDate = (date: string) => {
    const newExpanded = new Set(expandedDates);
    if (newExpanded.has(date)) {
      newExpanded.delete(date);
    } else {
      newExpanded.add(date);
    }
    setExpandedDates(newExpanded);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteStudyLog.mutateAsync(deleteId);
      toast.success('Sessão excluída!');
    } catch (error) {
      toast.error('Erro ao excluir sessão');
    } finally {
      setDeleteId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const diff = today.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Hoje';
    if (days === 1) return 'Ontem';
    
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  const getTotalMinutes = (logs: StudyLog[]) => {
    return logs.reduce((acc, log) => acc + log.duration_minutes, 0);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="animate-pulse space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-3">
                <div className="h-8 bg-muted rounded w-1/3" />
                <div className="h-20 bg-muted rounded" />
                <div className="h-20 bg-muted rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (logs.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            Nenhuma sessão de estudo registrada ainda.
          </p>
          <Button className="mt-4" onClick={() => window.location.href = '/nova-sessao'}>
            Registrar primeira sessão
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {sortedDates.map((date) => {
          const dayLogs = groupedLogs[date];
          const totalMinutes = getTotalMinutes(dayLogs);
          const hours = Math.floor(totalMinutes / 60);
          const minutes = totalMinutes % 60;
          const isExpanded = expandedDates.has(date);

          return (
            <Card key={date}>
              <CardHeader 
                className="cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => toggleDate(date)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    )}
                    <CardTitle className="text-lg capitalize">
                      {formatDate(date)}
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{hours}h {minutes}min</span>
                    <span className="text-muted">•</span>
                    <span>{dayLogs.length} {dayLogs.length === 1 ? 'sessão' : 'sessões'}</span>
                  </div>
                </div>
              </CardHeader>
              
              {isExpanded && (
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {dayLogs.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-start gap-3 p-4 border border-border rounded"
                      >
                        <div
                          className="w-3 h-3 rounded-full mt-1.5 shrink-0"
                          style={{ backgroundColor: log.subjects?.color || '#3B82F6' }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-medium text-foreground">
                                {log.subjects?.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {log.content}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              {log.notes && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setViewingLog(log)}
                                  title="Ver anotações"
                                >
                                  <FileText className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setDeleteId(log.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>
                              {log.start_time.slice(0, 5)} - {log.end_time.slice(0, 5)}
                            </span>
                            <span className="text-muted">•</span>
                            <span>
                              {Math.floor(log.duration_minutes / 60)}h {log.duration_minutes % 60}min
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir sessão de estudo?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. As tarefas vinculadas permanecerão, 
              mas perderão o link com esta sessão.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!viewingLog} onOpenChange={() => setViewingLog(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Anotações da Sessão</DialogTitle>
          </DialogHeader>
          {viewingLog && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: viewingLog.subjects?.color }}
                />
                <span className="font-medium">{viewingLog.subjects?.name}</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">{viewingLog.content}</span>
              </div>
              <div className="p-4 bg-accent/50 rounded whitespace-pre-wrap text-foreground">
                {viewingLog.notes || 'Sem anotações'}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
