import { Layout } from '@/components/layout/Layout';
import { TodaySummary } from '@/components/dashboard/TodaySummary';
import { QuickTodos } from '@/components/dashboard/QuickTodos';
import { RecentSessions } from '@/components/dashboard/RecentSessions';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FutureReview } from '@/components/dashboard/FutureReview';

const Index = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <Button asChild>
            <Link to="/nova-sessao">
              <Plus className="h-4 w-4 mr-2" />
              Nova Sessão
            </Link>
          </Button>
        </div>

        <TodaySummary />

        <div className="grid gap-6 md:grid-cols-2">
          <QuickTodos />
          <RecentSessions />
        </div>
        <div>
          <FutureReview />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
