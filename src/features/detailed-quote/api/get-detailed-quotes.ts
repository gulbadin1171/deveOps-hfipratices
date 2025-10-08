import { QueryClient } from '@tanstack/react-query';

import { BaseEntity } from '@/types/api';

export type DetailedQuote = BaseEntity & {
  pickupLocation: string;
  deliveryLocation: string;
  pickupDate: string;
  deliveryDate: string;
  weight: number;
  numberOfPieces: number;
  freightClass: string;
  serviceLevel: string;
  commodityDescription: string;
  hazardousMaterials: boolean;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  }[];
  insurance?: number;
  companyName: string;
  contactPerson: string;
  phoneNumber: string;
  emailAddress: string;
};

export const getDetailedQuotesQueryOptions = (page = 1) => ({
  queryKey: ['detailed-quotes', { page }],
  queryFn: async (): Promise<DetailedQuote[]> => {
    // Replace with actual API call
    return [
      {
        id: '1',
        createdAt: new Date('2025-05-20T10:00:00Z').getTime(),
        pickupLocation: 'New York, NY 10001',
        deliveryLocation: 'Los Angeles, CA 90001',
        pickupDate: '2025-05-25',
        deliveryDate: '2025-05-28',
        weight: 500,
        numberOfPieces: 2,
        freightClass: '70',
        serviceLevel: 'Standard',
        commodityDescription: 'Electronics',
        hazardousMaterials: false,
        dimensions: [{ length: 10, width: 20, height: 30 }],
        insurance: 1000,
        companyName: 'Tech Corp',
        contactPerson: 'John Doe',
        phoneNumber: '555-123-4567',
        emailAddress: 'john@techcorp.com',
      },
    ];
  },
});

export const clientLoader = (queryClient: QueryClient) => async () => {
  const query = getDetailedQuotesQueryOptions();
  return (
    queryClient.getQueryData(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  );
};
