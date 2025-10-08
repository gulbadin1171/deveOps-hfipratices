import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

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
import {
  useCreateEstimate,
  createEstimateInputSchema,
} from '@/features/quick-estimate/api/create-quick-estimate';

export const estimateFormSchema = createEstimateInputSchema;

type EstimateFormValues = z.infer<typeof estimateFormSchema>;

export const CreateQuickEstimate = () => {
  const { mutateAsync, isError, error, isSuccess, isPending, reset } =
    useCreateEstimate({
      mutationConfig: {
        onError: (error: Error) => {
          console.error('[useCreateEstimate] Error creating estimate:', error);
        },
        onSuccess: () => {
          console.log('[useCreateEstimate] Estimate created successfully');
        },
      },
    });

  const form = useForm<EstimateFormValues>({
    resolver: zodResolver(estimateFormSchema),
    defaultValues: {
      origin: '',
      destination: '',
      weight: undefined,
      dimensions: '',
      type: '',
      items: undefined,
    },
  });

  const onSubmit: SubmitHandler<EstimateFormValues> = async (data) => {
    console.log('[onSubmit] Form submitted with data:', data);
    try {
      await mutateAsync({ data });
      form.reset();
    } catch (err) {
      console.error('[onSubmit] Submission error:', err);
    }
  };

  return (
    <FormDrawer
      title="Quick Estimate"
      isDone={isSuccess}
      triggerButton={
        <Button className="h-8 w-fit justify-center sm:flex">
          + Add Quick Estimate
        </Button>
      }
      submitButton={
        <Button
          type="submit"
          form="estimate-form"
          variant="default"
          disabled={isPending}
        >
          {isPending ? 'Saving...' : 'Save'}
        </Button>
      }
    >
      <hr className="mt-4 w-auto" />
      {isError && (
        <div className="mb-4 text-red-500">
          Error:{' '}
          {error instanceof Error ? error.message : 'Failed to create estimate'}
        </div>
      )}
      {isSuccess && (
        <div className="mb-4 text-green-500">
          Estimate created successfully!
        </div>
      )}
      <Form
        schema={estimateFormSchema}
        onSubmit={onSubmit}
        className="space-y-4 pt-4"
      >
        {({ handleSubmit }) => (
          <form
            id="estimate-form"
            onSubmit={handleSubmit(onSubmit)}
            onReset={() => {
              form.reset();
              reset();
            }}
            className="space-y-4"
          >
            <FormField
              name="origin"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Origin</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter origin address"
                      value={field.value ?? ''}
                      onChange={(e) => {
                        console.log('[origin] Input change:', e.target.value);
                        field.onChange(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="destination"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destination</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter destination address"
                      value={field.value ?? ''}
                      onChange={(e) => {
                        console.log(
                          '[destination] Input change:',
                          e.target.value,
                        );
                        field.onChange(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                name="weight"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          console.log('[weight] Input change:', value);
                          field.onChange(value ? parseFloat(value) : undefined);
                        }}
                        placeholder="0.0"
                        step="0.1"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="dimensions"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dimensions</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => {
                          console.log(
                            '[dimensions] Input change:',
                            e.target.value,
                          );
                          field.onChange(e.target.value || undefined);
                        }}
                        placeholder="e.g., 10×20×30"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="type"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => {
                          console.log('[type] Input change:', e.target.value);
                          field.onChange(e.target.value || undefined);
                        }}
                        placeholder="Enter Type"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="items"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>No of Items</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          console.log('[items] Input change:', value);
                          field.onChange(
                            value ? parseInt(value, 10) : undefined,
                          );
                        }}
                        placeholder="0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        )}
      </Form>
    </FormDrawer>
  );
};
