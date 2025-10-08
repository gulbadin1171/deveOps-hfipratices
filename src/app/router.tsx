import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';

import { VerifyOtpForm } from '@/components/auth/verify-otp-form';
import { paths } from '@/config/paths';
import { ProtectedRoute } from '@/lib/auth';

import {
  default as AppRoot,
  ErrorBoundary as AppRootErrorBoundary,
} from './routes/app/root';

const convert = (queryClient: QueryClient) => (m: any) => {
  const { clientLoader, clientAction, default: Component, ...rest } = m;
  return {
    ...rest,
    loader: clientLoader?.(queryClient),
    action: clientAction?.(queryClient),
    Component,
  };
};

export const createAppRouter = (queryClient: QueryClient) =>
  createBrowserRouter([
    {
      path: paths.home.path,
      lazy: () => import('./routes/auth/login').then(convert(queryClient)),
    },
    {
      path: paths.auth.register.path,
      lazy: () => import('./routes/auth/register').then(convert(queryClient)),
    },
    {
      path: paths.auth.login.path,
      lazy: () => import('./routes/auth/login').then(convert(queryClient)),
    },
    {
      path: paths.auth.verifyOtp.path,
      element: <VerifyOtpForm />, // Add fallback for SSR
      hydrateFallbackElement: <div>Loading OTP Form...</div>,
    },

    {
      path: paths.app.root.path,
      // element: (
      //   <ProtectedRoute>
      //     <AppRoot />
      //   </ProtectedRoute>
      // ),
      element: <AppRoot />,
      ErrorBoundary: AppRootErrorBoundary,

      children: [
        {
          index: true,
          path: paths.app.dashboard.path,
          lazy: () =>
            import('../app/routes/app/dashboard').then(convert(queryClient)),
        },
        {
          path: paths.app.QuickEstimate.path,
          lazy: () =>
            import('./routes/app/quick-estimate').then(convert(queryClient)),
        },
        {
          path: paths.app.users.path,
          lazy: () => import('./routes/app/users').then(convert(queryClient)),
        },
        {
          path: paths.app.profile.path,
          lazy: () => import('./routes/app/profile').then(convert(queryClient)),
        },
        {
          path: paths.app.DetailedQuote.path,
          lazy: () =>
            import('./routes/app/detailed-quote/detailed-quote').then(
              convert(queryClient),
            ),
        },
        {
          path: paths.app.DetailedQuoteDetail.path,
          lazy: () =>
            import('./routes/app/detailed-quote/quote-detail').then(
              convert(queryClient),
            ),
        },
        {
          path: paths.app.ShippmentTracking.path,
          lazy: () =>
            import('./routes/app/tracking-shippments/tracking-shippment').then(
              convert(queryClient),
            ),
        },
        {
          path: paths.app.Inbox.path,
          lazy: () =>
            import('./routes/app/inbox/inbox').then(convert(queryClient)),
        },
      ],
    },
    {
      path: '*',
      lazy: () => import('./routes/not-found').then(convert(queryClient)),
    },
  ]);

export const AppRouter = () => {
  const queryClient = useQueryClient();

  const router = useMemo(() => createAppRouter(queryClient), [queryClient]);

  return <RouterProvider router={router} />;
};
