// src/features/detailed-quotes/routes/detailed-quotes.tsx
import { ContentLayout } from '@/components/layouts/content-layout';
import { CreateDetailedQuote } from '@/features/detailed-quote/components/create-detailed-quote';
import { DetailedQuotesList } from '@/features/detailed-quote/components/detailed-quotes-list';

export const DetailedQuotesRoute = () => {
  return (
    <ContentLayout title="Detailed Quotes">
      <div className="flex justify-end">
        <CreateDetailedQuote />
      </div>
      <div className="mt-4">
        <DetailedQuotesList />
      </div>
    </ContentLayout>
  );
};

export default DetailedQuotesRoute;
