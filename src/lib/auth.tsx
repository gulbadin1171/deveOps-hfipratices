import { configureAuth } from 'react-query-auth';
import { Navigate, useLocation } from 'react-router-dom';
import { z } from 'zod';
import { api } from './api-client';
import { paths } from '@/config/paths';

interface OtpVerification {
  verified: boolean;
  secret?: string;
}

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  enabled: boolean;
  password?: string;
  otpVerification?: OtpVerification;
  role: 'ADMIN';
}

interface AuthResponse {
  user: User;
  requiresOtp?: boolean;
  otpVerified?: boolean;
}

interface ErrorResponse {
  message: string;
}

interface AxiosError {
  response?: {
    status: number;
    data?: ErrorResponse | any;
  };
}

const isAxiosError = (error: unknown): error is AxiosError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as any).response === 'object' &&
    'status' in (error as any).response
  );
};

const getUser = async (): Promise<User | null> => {
  const publicPaths = ['/auth/login', '/auth/register', '/auth/otp-verify'];
  const currentPath = window.location.pathname;

  if (publicPaths.includes(currentPath)) {
    return null; // ⛔️ Skip calling /auth/me on public routes
  }

  try {
    const response = await api.get<AuthResponse>('/auth/me');
    if (!response.user) return null;

    return {
      ...response.user,
      otpVerification: {
        verified:
          response.otpVerified ??
          response.user.otpVerification?.verified ??
          false,
        secret: response.user.otpVerification?.secret,
      },
    };
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) {
      return null;
    }
    console.error('Error fetching user:', error);
    return null;
  }
};

const logout = (): Promise<void> => {
  localStorage.removeItem('user');
  return api.post('/auth/logout');
};

export const loginInputSchema = z.object({
  email: z.string().min(1, 'Required').email('Invalid email'),
  password: z.string().min(5, 'Required'),
});

export type LoginInput = z.infer<typeof loginInputSchema>;

const loginWithEmailAndPassword = async (data: LoginInput): Promise<User> => {
  const response = await api.post<AuthResponse>('/auth/login', data);

  if (!response.user) {
    throw new Error('Login failed: No user data returned');
  }

  if (!response.user.enabled) {
    throw new Error('Account not activated. Please verify your OTP.');
  }

  return {
    ...response.user,
    otpVerification: {
      verified:
        response.otpVerified ??
        response.user.otpVerification?.verified ??
        false,
      secret: response.user.otpVerification?.secret,
    },
  };
};

export const registerInputSchema = z.object({
  email: z.string().min(1, 'Required'),
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  password: z.string().min(5, 'Required'),
});

export type RegisterInput = z.infer<typeof registerInputSchema>;

const registerWithEmailAndPassword = async (
  data: RegisterInput,
): Promise<User> => {
  const response = await api.post<AuthResponse>('/auth/register', data);

  if (!response.user) {
    throw new Error('Registration failed: No user data returned');
  }

  return {
    ...response.user,
    otpVerification: {
      verified:
        response.otpVerified ??
        response.user.otpVerification?.verified ??
        false,
      secret: response.user.otpVerification?.secret,
    },
  };
};

// ✅ configureAuth without suspense
const authConfig = {
  userFn: getUser,
  loginFn: loginWithEmailAndPassword,
  registerFn: registerWithEmailAndPassword,
  logoutFn: logout,
};

export const { useUser, useLogin, useLogout, useRegister, AuthLoader } =
  configureAuth(authConfig);

// ✅ Final ProtectedRoute component
export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { data: user, isLoading } = useUser();
  const location = useLocation();

  // ✅ OTP page should not be blocked
  const isOtpPage = location.pathname === paths.auth.verifyOtp.path;

  // ✅ Don't redirect anything until loading is done
  if (isLoading) return <div>Loading...</div>;

  if (isOtpPage) return children;

  // ❌ Not logged in
  if (!user) {
    return (
      <Navigate
        to={paths.auth.login.getHref(location.pathname)}
        state={{ from: location }}
        replace
      />
    );
  }

  // ❌ Not OTP verified
  if (!user.otpVerification?.verified) {
    return (
      <Navigate
        to={paths.auth.verifyOtp.getHref(
          `?email=${encodeURIComponent(user.email)}&redirectTo=${encodeURIComponent(location.pathname)}`,
        )}
        replace
      />
    );
  }

  // ✅ All checks passed
  return children;
};
