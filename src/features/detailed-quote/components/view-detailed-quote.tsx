// src/features/detailed-quotes/components/view-detailed-quote.tsx
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

import type { DetailedQuote } from '../api/get-detailed-quotes';

interface QuoteDetailsDialogProps {
  selectedQuote: DetailedQuote | null;
  isViewOpen: boolean;
  setIsViewOpen: (open: boolean) => void;
}

const QuoteDetailsDialog = ({
  selectedQuote,
  isViewOpen,
  setIsViewOpen,
}: QuoteDetailsDialogProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!contentRef.current || !selectedQuote) return;

    setIsDownloading(true);
    try {
      // Capture the dialog content as an image
      const canvas = await html2canvas(contentRef.current, {
        scale: 2, // Increase resolution for better quality
        useCORS: true, // Handle cross-origin images if any
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Add the first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Handle multi-page PDFs if content is too long
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Save the PDF
      pdf.save(
        `Shipping_Quote_${selectedQuote.id.slice(0, 8).toUpperCase()}.pdf`,
      );
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (!selectedQuote) return null;

  return (
    <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
      <DialogContent className="max-w-4xl border-0 bg-transparent p-0 shadow-none">
        <div
          ref={contentRef}
          className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-2xl"
        >
          {/* Document-style header */}
          <div className="bg-[hsl(var(--primary))] p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">
                  SHIPPING QUOTE
                </h1>
                <p className="text-blue-200">
                  Document ID: {selectedQuote.id.slice(0, 8).toUpperCase()}
                </p>
              </div>
              <div className="text-sm text-blue-100">
                <p>
                  Created:{' '}
                  {new Date(selectedQuote.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Watermark background */}
          <div className="relative overflow-hidden">
            <div className="absolute -right-20 -top-20 size-64 rotate-12 rounded-full bg-blue-50 opacity-20"></div>
            <div className="absolute -bottom-20 -left-20 size-64 rotate-45 rounded-full bg-blue-50 opacity-20"></div>

            <div className="relative grid grid-cols-1 gap-8 p-8 md:grid-cols-2">
              {/* Shipment Details - Paper-like card */}
              <div className="space-y-8">
                <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-[hsl(var(--primary-foreground))]">
                  <h3 className="mb-4 flex items-center text-lg font-bold text-gray-800">
                    <span className="mr-2 size-2 rounded-full bg-[hsl(var(--primary-foreground))]"></span>
                    Shipment Details
                  </h3>
                  <div className="space-y-4">
                    <DetailRow
                      label="Pickup Location"
                      value={selectedQuote.pickupLocation}
                    />
                    <DetailRow
                      label="Delivery Location"
                      value={selectedQuote.deliveryLocation}
                    />
                    <DetailRow
                      label="Pickup Date"
                      value={new Date(
                        selectedQuote.pickupDate,
                      ).toLocaleDateString()}
                    />
                    <DetailRow
                      label="Delivery Date"
                      value={new Date(
                        selectedQuote.deliveryDate,
                      ).toLocaleDateString()}
                    />
                  </div>
                </div>

                {/* Freight Information */}
                <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-[hsl(var(--primary-foreground))]">
                  <h3 className="mb-4 flex items-center text-lg font-bold text-gray-800">
                    <span className="mr-2 size-2 rounded-full bg-amber-500"></span>
                    Freight Information
                  </h3>
                  <div className="space-y-4">
                    <DetailRow
                      label="Number of Pieces"
                      value={selectedQuote.numberOfPieces.toString()}
                    />
                    <DetailRow
                      label="Weight"
                      value={`${selectedQuote.weight} kg`}
                    />
                    <DetailRow
                      label="Freight Class"
                      value={selectedQuote.freightClass}
                    />
                    <DetailRow
                      label="Commodity"
                      value={selectedQuote.commodityDescription}
                    />
                    <DetailRow
                      label="Hazardous"
                      value={selectedQuote.hazardousMaterials ? 'Yes' : 'No'}
                    />
                    {selectedQuote.dimensions && (
                      <DetailRow
                        label="Dimensions (L×W×H)"
                        value={selectedQuote.dimensions
                          .map(
                            (d: {
                              length: number;
                              width: number;
                              height: number;
                            }) => `${d.length}×${d.width}×${d.height}`,
                          )
                          .join(', ')}
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                {/* Service Options */}
                <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-[hsl(var(--primary-foreground))]">
                  <h3 className="mb-4 flex items-center text-lg font-bold text-gray-800">
                    <span className="mr-2 size-2 rounded-full bg-emerald-500"></span>
                    Service Options
                  </h3>
                  <div className="space-y-4">
                    <DetailRow
                      label="Service Level"
                      value={selectedQuote.serviceLevel}
                    />
                    {selectedQuote.insurance && (
                      <DetailRow
                        label="Insurance Value"
                        value={`$${selectedQuote.insurance.toFixed(2)}`}
                      />
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-[hsl(var(--primary-foreground))]">
                  <h3 className="mb-4 flex items-center text-lg font-bold text-gray-800">
                    <span className="mr-2 size-2 rounded-full bg-purple-500"></span>
                    Contact Information
                  </h3>
                  <div className="space-y-4">
                    <DetailRow
                      label="Company"
                      value={selectedQuote.companyName}
                    />
                    <DetailRow
                      label="Contact Person"
                      value={selectedQuote.contactPerson}
                    />
                    <DetailRow
                      label="Phone"
                      value={selectedQuote.phoneNumber}
                    />
                    <DetailRow
                      label="Email"
                      value={selectedQuote.emailAddress}
                    />
                  </div>
                </div>

                {/* Status Bar */}
                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="mr-2 size-3 rounded-full bg-[hsl(var(--primary))]"></div>
                      <span className="text-sm font-medium text-gray-600">
                        Quote Active
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      Created:{' '}
                      {new Date(selectedQuote.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Download Button */}
                <div className="flex items-center justify-end">
                  <Button
                    variant="default"
                    className="flex items-center gap-2"
                    onClick={handleDownload}
                    disabled={isDownloading}
                  >
                    {isDownloading ? 'Generating PDF...' : 'Download Quote'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Reusable detail row component
const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="flex">
    <span className="w-40 shrink-0 font-medium text-gray-500">{label}:</span>
    <span className="font-semibold text-gray-800">{value}</span>
  </div>
);

export default QuoteDetailsDialog;
