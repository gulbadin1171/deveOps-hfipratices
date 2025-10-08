import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldError } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/form';
import { api } from '@/lib/api-client';

// ✅ Validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const redirectTo = searchParams.get('redirectTo') || '/app/dashboard';
  const emailPrefill = searchParams.get('email') || '';

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: emailPrefill,
      password: '',
    },
  });

  const handleSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await api.post('/auth/login', values);
      const user = response?.user || response?.data?.user;

      if (!user || !user.enabled) {
        throw new Error('Account not activated or user not found.');
      }

      // ✅ Success — redirect
      console.log('Login successful, navigating to dashboard...');
      navigate(redirectTo, { replace: true });
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        'Login failed. Please try again.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
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
        {errorMessage && (
          <p className="text-sm text-red-500 mb-2">{errorMessage}</p>
        )}
        <Button isLoading={isSubmitting} type="submit" className="w-full">
          Log in
        </Button>
      </form>

      <div className="mt-2 flex justify-end text-sm">
        <Link
          to={`/auth/register?redirectTo=${encodeURIComponent(redirectTo)}`}
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          Register
        </Link>
      </div>
    </div>
  );
};
