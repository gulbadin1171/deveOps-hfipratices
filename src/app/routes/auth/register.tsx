import { AuthLayout } from '@/components/layouts/auth-layout';
import { RegisterForm } from '@/features/auth/components/register-form';

const RegisterRoute = () => {
  return (
    <AuthLayout title="Register your account">
      <RegisterForm onSuccess={() => {}} />{' '}
      {/* Navigation handled in use-register.ts */}
    </AuthLayout>
  );
};

export default RegisterRoute;
