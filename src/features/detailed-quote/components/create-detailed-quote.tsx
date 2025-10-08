// src/features/detailed-quotes/components/create-detailed-quote.tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SubmitHandler } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { FormDrawer } from '@/components/ui/form/form-drawer';
import { Input } from '@/components/ui/form/input';

import { DetailedQuote } from '../api/get-detailed-quotes';
import { detailedFormSchema, DetailedQuoteFormValues } from '../types';

export const CreateDetailedQuote = () => {
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: async (
      data: DetailedQuoteFormValues,
    ): Promise<DetailedQuote> => {
      // Replace with actual API call
      return Promise.resolve({
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        pickupLocation: `${data.pickupLocation.city}, ${data.pickupLocation.state} ${data.pickupLocation.zip}`,
        deliveryLocation: `${data.deliveryLocation.city}, ${data.deliveryLocation.state} ${data.deliveryLocation.zip}`,
        pickupDate: data.pickupDate,
        deliveryDate: data.deliveryDate,
        weight: data.weight,
        numberOfPieces: data.numberOfPieces,
        freightClass: data.freightClass,
        serviceLevel: data.serviceLevel,
        commodityDescription: data.commodityDescription,
        hazardousMaterials: data.hazardousMaterials,
        dimensions: data.dimensions,
        insurance: data.insurance,
        companyName: data.companyName,
        contactPerson: data.contactPerson,
        phoneNumber: data.phoneNumber,
        emailAddress: data.emailAddress,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['detailed-quotes'] });
    },
  });

  const onSubmit: SubmitHandler<DetailedQuoteFormValues> = async (data) => {
    try {
      await mutateAsync(data);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <FormDrawer
      title="Add a New Detailed Quote"
      isDone={false}
      triggerButton={
        <Button className="h-8 w-fit justify-center sm:flex">
          + Add Quote
        </Button>
      }
      submitButton={
        <Button type="submit" variant="default">
          Save
        </Button>
      }
    >
      <hr className="mt-4 w-auto" />
      <Form
        schema={detailedFormSchema}
        onSubmit={onSubmit}
        className="max-h-[80vh] space-y-6 overflow-y-auto px-4 pt-4"
      >
        {() => (
          <>
            {/* Shipment Details */}
            <h3 className="text-lg font-bold text-[hsl(var(--primary))]">
              1. Shipment Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                name="pickupLocation.city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pickup City</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter city" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="pickupLocation.state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pickup State/Province</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter state/province" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="pickupLocation.zip"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pickup ZIP/Postal Code</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter ZIP/postal code" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="deliveryLocation.city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery City</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter city" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="deliveryLocation.state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery State/Province</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter state/province" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="deliveryLocation.zip"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery ZIP/Postal Code</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter ZIP/postal code" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="pickupDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pickup Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="deliveryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Freight Information */}
            <h3 className="text-lg font-bold text-[hsl(var(--primary))]">
              2. Freight Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                name="numberOfPieces"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Pieces</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                        placeholder="Enter number of pieces"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Weight (kg)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                        placeholder="Enter weight"
                        step="0.1"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="freightClass"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Freight Class</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter freight class" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="commodityDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Commodity Description</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="hazardousMaterials"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="size-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </FormControl>
                    <FormLabel>Hazardous Materials</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="dimensions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dimensions (L×W×H)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., 10×20×30;15×25×35"
                        onChange={(e) => {
                          const dims = e.target.value
                            .split(';')
                            .filter((d) => d.trim())
                            .map((d) => {
                              const [length, width, height] = d
                                .split('×')
                                .map((val) => parseFloat(val) || 0);
                              return { length, width, height };
                            });
                          field.onChange(dims);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Service Options */}
            <h3 className="text-lg font-bold text-[hsl(var(--primary))]">
              3. Service Options
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                name="serviceLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Level</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Select service level</option>
                        <option value="Standard">Standard</option>
                        <option value="Expedited">Expedited</option>
                        <option value="Guaranteed">Guaranteed</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="accessorialServices"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Accessorial Services</FormLabel>
                    <FormControl>
                      <select
                        multiple
                        {...field}
                        value={field.value || []}
                        onChange={(e) =>
                          field.onChange(
                            Array.from(
                              e.target.selectedOptions,
                              (option: HTMLOptionElement) => option.value,
                            ),
                          )
                        }
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="Liftgate">Liftgate</option>
                        <option value="Inside Delivery">Inside Delivery</option>
                        <option value="Appointment Scheduling">
                          Appointment Scheduling
                        </option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="insurance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Insurance Value ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                        placeholder="Enter insurance value"
                        step="0.01"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Contact Information */}
            <h3 className="text-lg font-bold text-[hsl(var(--primary))]">
              4. Contact Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter company name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="contactPerson"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Person</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter contact person" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter phone number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="emailAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        {...field}
                        placeholder="Enter email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
        )}
      </Form>
    </FormDrawer>
  );
};
