import { Layout } from '@/components/layout/Layout';
import StudyDashboard from '@/components/history/StudyDashboard';
import { StudyHistory } from '@/components/history/StudyHistory';
import StudyDashboardCopy from '@/components/history/StudyDashboardCopy';

const History = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Histórico de Estudos</h1>
        {/* <StudyDashboard /> */}
        <StudyDashboardCopy />
        <StudyHistory />
      </div>
    </Layout>
  );
};

export default History;
