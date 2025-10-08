import { ContentLayout } from '@/components/layouts/content-layout';
import { CreateQuickEstimate } from '@/features/quick-estimate/components/create-quick-estimate';
import { QuickEstimatesList } from '@/features/quick-estimate/components/quick-estimate-list';

export const QuickEstimatesRoute = () => {
  return (
    <ContentLayout title="Quick Estimates">
      <div className="flex justify-end">
        <CreateQuickEstimate />
      </div>
      <h1 className="text-md mt-4 w-fit font-bold text-[hsl(var(--primary))]">
        Available Quick Estimates
      </h1>
      <div className="mt-4">
        <QuickEstimatesList />
      </div>
    </ContentLayout>
  );
};

export default QuickEstimatesRoute;
