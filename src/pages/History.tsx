import { Layout } from '@/components/layout/Layout';
import StudyDashboard from '@/components/history/StudyDashboard';
import { StudyLogs } from '@/components/history/StudyLogs';
import StudyDashboardCopy from '@/components/history/StudyDashboardCopy';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SearchRange, type SearchRange as SearchRangeType } from '@/components/history/SearchRange';
import { useState } from 'react';

const History = () => {
  const [searchRange, setSearchRange] = useState<SearchRangeType>({
    startDate: new Date('2026-01-18'),
    endDate: new Date('2026-01-18'),
  });

  const [rangeType, setRangeType] = useState<'day' | 'week' | 'month' | 'custom'>('day');

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Histórico de Estudos</h1>
        {/* <StudyDashboard /> */}
        <SearchRange
          searchRange={searchRange}
          setSearchRange={setSearchRange}
          rangeType={rangeType}
          setRangeType={setRangeType}
        />
       
        <StudyDashboardCopy
          searchRange={searchRange}
          rangeType={rangeType}
        />
        <StudyLogs
          searchRange={searchRange}
        />
      </div>
    </Layout>
  );
};

export default History;
