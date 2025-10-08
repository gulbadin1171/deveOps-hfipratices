import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import * as React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/form';
import { useNotifications } from '@/components/ui/notifications';
import { api } from '@/lib/api-client';
import { AuthLayout } from '../layouts/auth-layout';
import { paths } from '@/config/paths';

interface FieldError {
  type: string;
  message: string;
}

export const VerifyOtpForm = () => {
  console.log('Rendering VerifyOtpForm');
  const { addNotification } = useNotifications();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || 'your email';
  const redirectTo = paths.auth.login.path; // fallback to dashboard
  const navigate = useNavigate();

  const [otp, setOtp] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const mutation = useMutation({
    mutationFn: async (otpValue: string) => {
      const response = await api.post<string>('/auth/verify-otp', {
        otp: otpValue,
      });
      return response;
    },
    onSuccess: (data: string) => {
      console.log('OTP verification success:', data);
      addNotification({
        type: 'success',
        title: 'Success',
        message: data,
      });

      console.log('Navigating to', redirectTo);
      navigate(redirectTo, { replace: true });
    },
    onError: (axiosError: AxiosError<{ message: string }>) => {
      console.error('OTP verification failed:', axiosError);
      const errorMessage =
        axiosError.response?.data?.message || 'Verification failed';
      addNotification({
        type: 'error',
        title: 'Error',
        message: errorMessage,
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || mutation.isPending) return;
    setIsSubmitting(true);
    mutation.mutate(otp);
  };

  const error: FieldError | undefined = mutation.error
    ? {
        type: 'custom',
        message:
          (mutation.error as AxiosError<{ message: string }>)?.response?.data
            ?.message || 'Verification failed',
      }
    : undefined;

  return (
    <AuthLayout title={''}>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Verify OTP</h2>
        <p>Please enter the OTP sent to {email}</p>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            label="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            error={error}
          />
          <Button
            isLoading={mutation.isPending}
            type="submit"
            className="mt-4 w-full"
            disabled={mutation.isPending || isSubmitting}
          >
            Verify OTP
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
};
