import AnalyticsDashboard from '@/components/charts/chart-1';
import RecentShippments from '@/components/dashboard/recent-shippments';
import { ContentLayout } from '@/components/layouts';

const DashboardRoute = () => {
  return (
    <ContentLayout title="">
      <AnalyticsDashboard />
      <RecentShippments />
    </ContentLayout>
  );
};

export default DashboardRoute;
