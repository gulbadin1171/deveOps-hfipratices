import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { QuickEstimate, Meta } from '@/types/api';
import { AxiosHeaders } from 'axios';

type QuickEstimateResponse = {
  data: QuickEstimate[];
  meta: Meta;
};

/**
 * Fetch paginated quick estimates from the server.
 */
export const getQuickEstimates = (page = 1): Promise<QuickEstimateResponse> => {
  return api.get(`/estimates`, {
    params: { page },
    headers: new AxiosHeaders(), // ✅ Required to satisfy InternalAxiosRequestConfig
  });
};

/**
 * Creates a reusable queryOptions object for react-query.
 */
export const getQuickEstimatesQueryOptions = ({
  page,
}: { page?: number } = {}) => {
  return queryOptions({
    queryKey: page ? ['quick-estimates', { page }] : ['quick-estimates'],
    queryFn: () => getQuickEstimates(page),
  });
};

type UseQuickEstimatesOptions = {
  page?: number;
  queryConfig?: QueryConfig<typeof getQuickEstimatesQueryOptions>;
};

/**
 * React-query hook to fetch paginated quick estimates.
 */
export const useQuickEstimates = ({
  queryConfig,
  page,
}: UseQuickEstimatesOptions) => {
  return useQuery({
    ...getQuickEstimatesQueryOptions({ page }),
    ...queryConfig,
  });
};
