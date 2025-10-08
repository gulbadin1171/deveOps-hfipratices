import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldError, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/form';
import { paths } from '@/config/paths';
import { api } from '@/lib/api-client';
import { registerInputSchema, RegisterInput } from '@/lib/auth';

type RegisterFormProps = {
  onSuccess: () => void;
};

export const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const redirectTo = searchParams.get('redirectTo') || '/';

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerInputSchema),
  });

  const handleSubmit = async (values: RegisterInput) => {
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const response = await api.post('/auth/register', values);
      const user = response?.user;

      if (!user || !user.enabled) {
        const email = user?.email ?? '';
        navigate(
          paths.auth.verifyOtp.getHref(
            `?email=${encodeURIComponent(email)}&redirectTo=${encodeURIComponent(redirectTo)}`,
          ),
          { replace: true },
        );
      } else {
        onSuccess();
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Registration failed. Please try again.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Input
          type="text"
          label="First Name"
          error={form.formState.errors.firstName as FieldError}
          registration={form.register('firstName')}
        />
        <Input
          type="text"
          label="Last Name"
          error={form.formState.errors.lastName as FieldError}
          registration={form.register('lastName')}
        />
        <Input
          type="email"
          label="Email Address"
          error={form.formState.errors.email as FieldError}
          registration={form.register('email')}
        />
        <Input
          type="password"
          label="Password"
          error={form.formState.errors.password as FieldError}
          registration={form.register('password')}
        />
        {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
        <Button isLoading={isSubmitting} type="submit" className="w-full">
          Register
        </Button>
      </form>

      <div className="mt-2 flex items-center justify-end text-sm">
        <Link
          to={paths.auth.login.getHref(redirectTo)}
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          Log In
        </Link>
      </div>
    </div>
  );
};
