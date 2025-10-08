import { useQuery } from '@tanstack/react-query';

import { Table } from '@/components/ui/table';
import { getQuickEstimatesQueryOptions } from '@/features/quick-estimate/api/get-quick-estimates';
import type { QuickEstimate } from '@/types/api';

const tableColumns = [
  { title: 'Origin', field: 'origin' as const },
  { title: 'Destination', field: 'destination' as const },
  { title: 'Weight (kg)', field: 'weight' as const },
  { title: 'Dimensions', field: 'dimensions' as const },
];

export const QuickEstimatesList = ({ page = 1 }) => {
  const { data, isLoading, isFetching, error } = useQuery(
    getQuickEstimatesQueryOptions({ page }),
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data?.data?.length) return <div>No estimates found for page {page}</div>;

  return (
    <div>
      {isFetching && <div>Updating data...</div>}{' '}
      {/* Show subtle refetch indicator */}
      <Table<QuickEstimate> data={data.data} columns={tableColumns} />
    </div>
  );
};
