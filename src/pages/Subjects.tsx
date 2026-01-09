import { Layout } from '@/components/layout/Layout';
import { SubjectManager } from '@/components/subjects/SubjectManager';

const Subjects = () => {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-6">Gerenciar Matérias</h1>
        <SubjectManager />
      </div>
    </Layout>
  );
};

export default Subjects;
