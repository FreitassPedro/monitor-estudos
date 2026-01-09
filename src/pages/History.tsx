import { Layout } from '@/components/layout/Layout';
import { StudyHistory } from '@/components/study/StudyHistory';

const History = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Histórico de Estudos</h1>
        <StudyHistory />
      </div>
    </Layout>
  );
};

export default History;
