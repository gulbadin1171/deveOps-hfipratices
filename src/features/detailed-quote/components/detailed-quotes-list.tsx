// src/features/detailed-quotes/components/DetailedQuotesList.tsx
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Table } from '@/components/ui/table';
import QuoteDetailsDialog from 'src/app/routes/app/detailed-quote/quote-detail';

import { getDetailedQuotesQueryOptions } from '../api/get-detailed-quotes';
import type { DetailedQuote } from '../api/get-detailed-quotes';

export const DetailedQuotesList = () => {
  const { data: quotes } = useQuery(getDetailedQuotesQueryOptions());
  const queryClient = useQueryClient();
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<DetailedQuote | null>(
    null,
  );
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [quoteToDelete, setQuoteToDelete] = useState<string | null>(null);

  const { mutate } = useMutation({
    mutationFn: async (id: string) => {
      return Promise.resolve(id);
    },
    onSuccess: (id) => {
      queryClient.setQueryData<DetailedQuote[]>(
        ['detailed-quotes'],
        (oldData) =>
          oldData ? oldData.filter((quote) => quote.id !== id) : [],
      );
      queryClient.invalidateQueries({ queryKey: ['detailed-quotes'] });
    },
    onError: (error) => {
      console.error('Error deleting quote:', error);
    },
  });

  const handleDelete = (id: string) => {
    setQuoteToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (quoteToDelete) {
      mutate(quoteToDelete);
    }
    setIsConfirmOpen(false);
    setQuoteToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
    setQuoteToDelete(null);
  };

  const handleView = (quote: DetailedQuote) => {
    setSelectedQuote(quote);
    setIsViewOpen(true);
  };

  const tableColumns = [
    {
      title: 'Pickup Location',
      field: 'pickupLocation' as const,
    },
    {
      title: 'Delivery Location',
      field: 'deliveryLocation' as const,
    },
    {
      title: 'Pickup Date',
      field: 'pickupDate' as const,
      Cell: ({ entry }: { entry: DetailedQuote }) => (
        <>{new Date(entry.pickupDate).toLocaleDateString()}</>
      ),
    },
    {
      title: 'Delivery Date',
      field: 'deliveryDate' as const,
      Cell: ({ entry }: { entry: DetailedQuote }) => (
        <>{new Date(entry.deliveryDate).toLocaleDateString()}</>
      ),
    },
    {
      title: 'Weight (kg)',
      field: 'weight' as const,
    },
    {
      title: 'Freight Class',
      field: 'freightClass' as const,
    },
    {
      title: 'Service Level',
      field: 'serviceLevel' as const,
    },
    {
      title: 'Actions',
      field: 'id' as const,
      Cell: ({ entry }: { entry: DetailedQuote }) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => handleView(entry)}>
            View
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(entry.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Table<DetailedQuote> data={quotes || []} columns={tableColumns} />
      <QuoteDetailsDialog
        selectedQuote={selectedQuote}
        isViewOpen={isViewOpen}
        setIsViewOpen={setIsViewOpen}
      />
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are You Sure You Want to Delete?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The quote will be permanently
              deleted.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleCancelDelete}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
