import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { QuickEstimate } from '@/types/api';

import { getQuickEstimatesQueryOptions } from './get-quick-estimates';

export const createEstimateInputSchema = z.object({
  origin: z.string().min(1, 'Origin is required'),
  destination: z.string().min(1, 'Destination is required'),
  weight: z.number().min(0.1, 'Weight must be at least 0.1kg'),
  dimensions: z.string().optional(),
  type: z.string().optional(),
  items: z.number().optional(),
});

export type CreateEstimateInput = z.infer<typeof createEstimateInputSchema>;

export const createEstimate = ({
  data,
}: {
  data: CreateEstimateInput;
}): Promise<QuickEstimate> => {
  return api.post(`/estimates`, data);
};

type UseCreateEstimateOptions = {
  mutationConfig?: MutationConfig<typeof createEstimate>;
};

// Hook to use the create estimate mutation
export const useCreateEstimate = ({
  mutationConfig,
}: UseCreateEstimateOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getQuickEstimatesQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createEstimate,
  });
};
