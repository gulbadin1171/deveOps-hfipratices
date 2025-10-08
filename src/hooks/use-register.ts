import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { paths } from '@/config/paths';
import { api } from '@/lib/api-client';

// Zod validation schema
export const registerInputSchema = z.object({
  firstName: z.string().min(1, 'First Name is required'),
  lastName: z.string().min(1, 'Last Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type RegisterInput = z.infer<typeof registerInputSchema>;

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  enabled: boolean;
  otpVerification:
    | null
    | {
        /* define OTP verification structure if needed */
      };
}

interface AuthResponse {
  user: User;
}

interface UseRegisterProps {
  onSuccess?: () => void;
}

interface UseRegisterReturn {
  isPending: boolean;
  mutate: (variables: RegisterInput) => void;
  error: string | null;
}

export const useRegister = ({
  onSuccess,
}: UseRegisterProps = {}): UseRegisterReturn => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation<
    AuthResponse,
    Error,
    RegisterInput
  >({
    mutationFn: async (values: RegisterInput) => {
      const response = await api.post('/auth/register', values);

      // Debugging logs
      console.log('Full response:', response);
      console.log('Response data:', response.data);

      if (!response.data?.user) {
        throw new Error('Registration response is missing user data');
      }

      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user'] });

      // Navigate to OTP verification with email
      navigate(paths.auth.verifyOtp.getHref(`?email=${variables.email}`));

      // Call optional success callback if provided
      onSuccess?.();
    },
    onError: (error: Error) => {
      console.error('Registration error:', error.message);
    },
  });

  return {
    isPending,
    mutate,
    error: error?.message || null,
  };
};
