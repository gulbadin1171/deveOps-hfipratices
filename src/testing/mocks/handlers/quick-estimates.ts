import { HttpResponse, http } from 'msw';

import { env } from '@/config/env';
import {
  CreateEstimateInput,
  createEstimateInputSchema,
} from '@/features/quick-estimate/api/create-quick-estimate';

import { networkDelay } from '../utils';

// Mock data store for quick estimates
const mockEstimates: Array<
  CreateEstimateInput & { id: number; createdAt: string }
> = [
  {
    id: 1,
    origin: 'New York, NY',
    destination: 'Los Angeles, CA',
    weight: 10.5,
    dimensions: '20x30x40',
    type: 'Package',
    items: 2,
    createdAt: '2025-05-26T09:00:00Z',
  },
  {
    id: 2,
    origin: 'Chicago, IL',
    destination: 'Miami, FL',
    weight: 5.0,
    dimensions: '15x15x15',
    type: 'Box',
    items: 1,
    createdAt: '2025-05-26T09:30:00Z',
  },
];

// Quick estimate handlers
export const quickEstimatesHandlers = [
  // Mock GET /app/quick-estimate to suppress MSW warning
  http.get('*/app/quick-estimate', async ({ request }) => {
    await networkDelay();
    console.log(
      '[MSW] GET /app/quick-estimate: Mocked response for URL',
      request.url,
    );
    return HttpResponse.json({ success: true });
  }),
  // GET /estimates - Fetch quick estimates with pagination
  http.get(`${env.API_URL}/estimates`, async ({ request }) => {
    await networkDelay();
    console.log('[MSW] GET /estimates: Handling request', request.url);
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const pageSize = 10;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedEstimates = mockEstimates.slice(start, end);

    console.log(
      '[MSW] GET /estimates: Returning page',
      page,
      'with',
      paginatedEstimates.length,
      'items',
    );
    return HttpResponse.json({
      data: paginatedEstimates,
      meta: {
        currentPage: page,
        totalPages: Math.ceil(mockEstimates.length / pageSize),
        totalItems: mockEstimates.length,
        pageSize,
      },
    });
  }),
  // POST /estimates - Create a new quick estimate
  http.post(`${env.API_URL}/estimates`, async ({ request }) => {
    await networkDelay();
    const data = await request.json();
    console.log('[MSW] POST /estimates: Received data', data);

    // Validate input using zod schema
    const result = createEstimateInputSchema.safeParse(data);
    if (!result.success) {
      console.log(
        '[MSW] POST /estimates: Validation failed',
        result.error.errors,
      );
      return HttpResponse.json(
        { error: 'Invalid input', details: result.error.errors },
        { status: 400 },
      );
    }

    const newEstimate = {
      id: mockEstimates.length + 1,
      ...result.data,
      createdAt: new Date().toISOString(),
    };
    mockEstimates.push(newEstimate);

    console.log('[MSW] POST /estimates: Created estimate', newEstimate);
    return HttpResponse.json(newEstimate, { status: 201 });
  }),
];
