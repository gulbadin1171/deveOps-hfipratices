import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/form';
import { Table, TableColumn } from '@/components/ui/table/table';
import { BaseEntity } from '@/types/api';
import { cn } from '@/utils/cn';

// Define the shape of a Shipment entry, extending BaseEntity
interface Shipment extends BaseEntity {
  shipmentId: string;
  status: string;
  eta: string;
  originDestination: string;
}

// Define table columns for Shipment Tracking
const tableColumns: TableColumn<Shipment>[] = [
  {
    title: 'Shipment ID',
    field: 'shipmentId',
  },
  {
    title: 'Status',
    field: 'status',
    Cell: ({ entry }) => (
      <span
        className={cn(
          entry.status === 'Delivered'
            ? 'text-green-600'
            : entry.status === 'Delayed'
              ? 'text-red-600'
              : 'text-yellow-600',
        )}
      >
        {entry.status}
      </span>
    ),
  },
  {
    title: 'ETA',
    field: 'eta',
  },
  {
    title: 'Origin → Destination',
    field: 'originDestination',
  },
];

// Mock data generator
const generateMockShipment = (trackingNumber: string): Shipment[] => {
  const statuses = ['In Transit', 'Delivered', 'Delayed', 'Processing'];
  const origins = ['New York', 'Los Angeles', 'Chicago', 'Miami'];
  const destinations = ['London', 'Paris', 'Tokyo', 'Sydney'];

  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  const randomOrigin = origins[Math.floor(Math.random() * origins.length)];
  const randomDestination =
    destinations[Math.floor(Math.random() * destinations.length)];

  const today = new Date();
  const etaDate = new Date();
  etaDate.setDate(today.getDate() + Math.floor(Math.random() * 10) + 1);

  return [
    {
      id: trackingNumber,
      shipmentId: trackingNumber,
      status: randomStatus,
      eta: etaDate.toLocaleDateString(),
      originDestination: `${randomOrigin} → ${randomDestination}`,
      // BaseEntity required fields (as per error message)
      weight: Math.floor(Math.random() * 1000),
      freightClass: `CLASS_${Math.floor(Math.random() * 10)}`,
      commodityDescription: 'General Goods',
      hazardousMaterials: false,
      dimensions: '20x20x20',
      serviceLevel: 'Standard',
      insurance: 0,
      companyName: 'Demo Company',
      contactPerson: 'John Doe',
      phoneNumber: '555-123-4567',
      emailAddress: 'contact@demo.com',
      deliveryDate: etaDate.toISOString(),
      pickupDate: today.toISOString(),
      pickupLocation: randomOrigin,
      deliveryLocation: randomDestination,
      numberOfPieces: Math.floor(Math.random() * 10) + 1,
      createdAt: Date.now(),
    },
  ];
};

const TrackingShippment = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shipmentData, setShipmentData] = useState<Shipment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsError(false);
    setSearchPerformed(true);

    // Basic validation
    if (!trackingNumber.trim()) {
      setErrorMessage('Tracking number is required');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 10% chance to simulate an error
      if (Math.random() < 0.1) {
        throw new Error('Network error');
      }

      // Generate mock data
      const mockData = generateMockShipment(trackingNumber);
      setShipmentData(mockData);
    } catch (error) {
      setIsError(true);
      setShipmentData([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Shipment Tracking</h2>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex items-center gap-2">
          <Input
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="Enter tracking number (e.g. SHIP123)"
            className="h-12 w-60 max-w-sm"
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="shadow-slate-400"
          >
            {isLoading ? 'Searching...' : 'Track'}
          </Button>
        </div>
        {errorMessage && (
          <div className="mt-2 text-red-500">{errorMessage}</div>
        )}
      </form>

      {isError && (
        <div className="mb-4 text-red-500">
          Error fetching shipment data. Please try again.
        </div>
      )}

      {searchPerformed && !isLoading && !shipmentData.length && !isError && (
        <div className="mb-4 text-gray-500">
          No shipment found with this tracking number.
        </div>
      )}

      <Table data={shipmentData} columns={tableColumns} />
    </div>
  );
};

export default TrackingShippment;
