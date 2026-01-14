import { MasterTask, Task } from "@/types/tasks";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";

interface ViewingTaskProps {
  task: Task;
  setViewingTask: (task: Task | null) => void;
}

const ViewingTask: React.FC<ViewingTaskProps> = ({ task, setViewingTask }) => {

  return (
    <Dialog open={!!task} onOpenChange={() => setViewingTask(null)}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Contexto da Sessão de Estudo</DialogTitle>
        </DialogHeader>
        {task && (
          <div className='flex flex-row gap-6'>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: '#000' }}
                />
                <span className="font-medium">{task.title}</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Titulo</p>
                <p className="text-foreground">{task.title}</p>
              </div>

              {task.description && (
                <div>
                  <p className="text-sm text-muted-foreground">Descrição</p>
                  <p className="text-foreground whitespace-pre-wrap">{task.description}</p>
                </div>
              )}
              <div>
                <p>Evento vinculado</p>
                <div className="p-2 bg-accent/50 border-t border-b rounded whitespace-pre-wrap text-foreground text-sm mt-2">
                  Sessão de estudo em 20/06/2024, das 14:00 às 16:00
                </div>
              </div>
              <div>
                <p>Sub-tarefas:</p>
                <div className="px-4 text-sm py bg-accent/50 border-t border-b rounded whitespace-pre-wrap text-foreground justify-center items-center flex">
                  <Checkbox className="mr-2" />
                  R1 - Releitura: Rever os conceitos de energia e trabalho
                </div>
                <div className="px-4 text-sm py bg-accent/50 border-t border-b rounded whitespace-pre-wrap text-foreground justify-center items-center flex">
                  <Checkbox className="mr-2" />
                  R1 - Releitura: Rever os conceitos de energia e trabalho
                </div>
              </div>
              <div>
                <p>Comentar:</p>
                <Input type="text" />
              </div>
            </div>
            <div className='bg-zinc-200/40 space-y-4 p-2'>
              <div>
                <p className="text-sm text-muted-foreground">Projeto:</p>
                <p className="text-foreground text-sm">
                  #Fisica/Revisao
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Criado:</p>
                <p className="text-foreground text-sm">
                  {new Date(task.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tags:</p>
                <p className="text-foreground text-sm">
                  #revisao
                </p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog >
  );
};


export default ViewingTask;