import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { paths } from '@/config/paths';
import { api } from '@/lib/api-client';
import { LoginInput } from '@/lib/auth';

// Define your API response structure
interface ApiResponse<T> {
  data: T;
}

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  enabled: boolean;
  otpVerification: null | {
    id: number;
    otp: string;
    expiryTime: string;
  };
}

interface AuthResponse {
  user: User;
}

interface UseLoginProps {
  onSuccess?: () => void;
}

interface UseLoginReturn {
  isPending: boolean;
  mutate: (variables: LoginInput) => void;
  error: string | null;
}

export const useLogin = ({ onSuccess }: UseLoginProps = {}): UseLoginReturn => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Check user state on mount to handle page refresh
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      queryClient.setQueryData(['user'], parsedUser);
      if (parsedUser.otpVerified) {
        navigate(paths.app.dashboard.getHref());
      }
    }
  }, [navigate, queryClient]);

  const { mutate, isPending, error } = useMutation<
    ApiResponse<AuthResponse>,
    Error,
    LoginInput
  >({
    mutationFn: async (values) => {
      const response = await api.post('/auth/login', values);
      if (!response.data?.data?.user) {
        throw new Error('Invalid credentials');
      }
      return response.data;
    },
    onSuccess: (response) => {
      const userData = {
        id: response.data.user.id,
        email: response.data.user.email,
        enabled: response.data.user.enabled,
        otpVerified: !response.data.user.otpVerification,
      };

      localStorage.setItem('user', JSON.stringify(userData));
      queryClient.setQueryData(['user'], userData);

      if (!response.data.user.otpVerification) {
        navigate(paths.app.dashboard.getHref());
      } else {
        navigate(paths.auth.verifyOtp.getHref());
      }
      onSuccess?.();
    },
  });

  return { isPending, mutate, error: error?.message || null };
};
