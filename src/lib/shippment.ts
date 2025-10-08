import { BaseEntity } from '@/types/api';

export const fetchRecentShipments = async (): Promise<BaseEntity[]> => {
  const response = await fetch('/api/shipments/recent');
  if (!response.ok) throw new Error('Failed to fetch shipments');
  return response.json();
};
