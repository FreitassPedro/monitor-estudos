import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoutesFromElements, createBrowserRouter, Route, RouterProvider, Outlet } from "react-router-dom";
import Index from "./pages/Index";
import NewSession from "./pages/NewSession";
import History from "./pages/History";
import Subjects from "./pages/Subjects";
import Tasks from "./pages/Tasks";
import NotFound from "./pages/NotFound";
import ReviewsPage from "./pages/Reviews";
import { CycleStudy } from "./pages/CycleStudy";
import { StudyLogFormProvider } from "./contexts/StudySessionFormProvider";

const queryClient = new QueryClient();

const Root = () => {
  return (
    <StudyLogFormProvider>
      <Outlet />
    </StudyLogFormProvider>
  )
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route index element={<Index />} />
      <Route path="nova-sessao" element={<NewSession />} />
      <Route path="historico" element={<History />} />
      <Route path="materias" element={<Subjects />} />
      <Route path="tarefas" element={<Tasks />} />
      <Route path="reviews" element={<ReviewsPage />} />
      <Route path="cycle-study" element={<CycleStudy />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
)

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <RouterProvider router={router} />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
