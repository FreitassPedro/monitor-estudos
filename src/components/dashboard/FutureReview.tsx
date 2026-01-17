import { useState } from 'react';
import { useReviews } from '@/hooks/useReviews';
import { useSubjects } from '@/hooks/useSubjects';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Slider } from '@/components/ui/slider';
import { addDays, format, isAfter, isBefore, parseISO, startOfToday } from 'date-fns';
import { Badge } from '../ui/badge';

export const FutureReview = () => {
  const { data: reviews = [] } = useReviews();
  const { data: subjects = [] } = useSubjects();
  const [daysAhead, setDaysAhead] = useState(7);

  const subjectsMap = new Map(subjects.map((s) => [s.id, s.name]));

  const today = startOfToday();
  const futureDate = addDays(today, daysAhead);

  const upcomingReviews = reviews.flatMap(review =>
    review.cycles
      .filter(cycle => !cycle.isCompleted)
      .map(cycle => ({ ...cycle, review }))
  ).filter(cycle => {
    const plannedDate = parseISO(cycle.plannedDate);
    return isAfter(plannedDate, today) && isBefore(plannedDate, futureDate);
  });

  const reviewsBySubject = upcomingReviews.reduce((acc, cycle) => {
    const subjectId = cycle.review.subjectId;
    if (!acc[subjectId]) {
      acc[subjectId] = [];
    }
    acc[subjectId].push(cycle);
    return acc;
  }, {} as Record<string, typeof upcomingReviews>);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Próximas Revisões</CardTitle>
        <CardDescription>
          Revisões agendadas para os próximos {daysAhead} dias.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <label htmlFor="days-slider" className="mb-2 block text-sm font-medium">Dias à frente: {daysAhead}</label>
          <Slider
            id="days-slider"
            min={1}
            max={90}
            step={1}
            value={[daysAhead]}
            onValueChange={(value) => setDaysAhead(value[0])}
          />
        </div>
        <Accordion type="multiple" className="w-full space-y-2 ">
          {Object.entries(reviewsBySubject).map(([subjectId, subjectCycles]) => {
            const subject = subjects.find(s => s.id === subjectId);
            return (
            <AccordionItem value={subjectId} key={subjectId}>
              <AccordionTrigger 
                className="rounded-b-xl border-2 px-2"
                style={{ borderColor: subject?.color }}
              >{subjectsMap.get(subjectId) ?? 'Matéria desconhecida'}</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-2 mx-2">
                  {subjectCycles.map(cycle => (
                    <div key={`${cycle.review.id}-${cycle.cycle}`} className="flex justify-between items-center p-2 rounded-md bg-muted/50">
                      <div>
                        <p className="font-semibold">{cycle.review.topic}</p>
                        <p className="text-sm text-muted-foreground">Revisão R{cycle.cycle}</p>
                      </div>
                      <Badge variant="outline">{format(parseISO(cycle.plannedDate), 'dd/MM')}</Badge>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            );
          })}
        </Accordion>
        {Object.keys(reviewsBySubject).length === 0 && (
          <p className="text-center text-muted-foreground mt-4">Nenhuma revisão nos próximos {daysAhead} dias.</p>
        )}
      </CardContent>
    </Card>
  );
};
