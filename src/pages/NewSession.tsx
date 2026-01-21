import { Layout } from '@/components/layout/Layout';
import { StudySessionForm } from '@/components/history/StudySessionForm';

const NewSession = () => {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <StudySessionForm />
      </div>
    </Layout>
  );
};

export default NewSession;
