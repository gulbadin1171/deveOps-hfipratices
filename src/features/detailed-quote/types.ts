import { z } from 'zod';

export const detailedFormSchema = z.object({
  pickupLocation: z.object({
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State/Province is required'),
    zip: z.string().min(1, 'ZIP/Postal Code is required'),
  }),
  deliveryLocation: z.object({
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State/Province is required'),
    zip: z.string().min(1, 'ZIP/Postal Code is required'),
  }),
  pickupDate: z.string().min(1, 'Pickup date is required'),
  deliveryDate: z.string().min(1, 'Delivery date is required'),
  numberOfPieces: z.number().min(1, 'Number of pieces must be at least 1'),
  weight: z.number().min(0.1, 'Weight must be at least 0.1'),
  dimensions: z
    .array(
      z.object({
        length: z.number().min(0.1, 'Length must be at least 0.1'),
        width: z.number().min(0.1, 'Width must be at least 0.1'),
        height: z.number().min(0.1, 'Height must be at least 0.1'),
      }),
    )
    .optional(),
  freightClass: z.string().min(1, 'Freight class is required'),
  commodityDescription: z.string().min(1, 'Commodity description is required'),
  hazardousMaterials: z.boolean().default(false),
  serviceLevel: z.enum(['Standard', 'Expedited', 'Guaranteed'], {
    required_error: 'Service level is required',
  }),
  accessorialServices: z.array(z.enum(['Liftgate'])).optional(),
  insurance: z.number().min(0, 'Insurance value cannot be negative').optional(),
  companyName: z.string().min(1, 'Company name is required'),
  contactPerson: z.string().min(1, 'Contact person is required'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  emailAddress: z.string().email('Invalid email address'),
});

export type DetailedQuoteFormValues = z.infer<typeof detailedFormSchema>;
