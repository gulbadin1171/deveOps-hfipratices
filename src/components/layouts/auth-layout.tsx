import * as React from 'react';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import authBg from '@/assets/bg/auth-img-1.jpg';
import redLogo from '@/assets/logo-11.png';
import logo from '@/assets/logo-white.png';
import { Head } from '@/components/seo';
import { paths } from '@/config/paths';
import { useUser } from '@/lib/auth';

type LayoutProps = {
  children: React.ReactNode;
  title: string;
};

export const AuthLayout = ({ children, title }: LayoutProps) => {
  const user = useUser();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');

  const navigate = useNavigate();

  useEffect(() => {
    if (user.data) {
      navigate(redirectTo ? redirectTo : paths.app.dashboard.getHref(), {
        replace: true,
      });
    }
  }, [user.data, navigate, redirectTo]);

  return (
    <>
      <Head title={title} />
      <div className="flex min-h-screen">
        {/* Left side - Form */}
        <div className="flex w-full flex-col justify-center bg-gray-50 p-8 md:w-1/2">
          <div className="mx-auto w-full max-w-md">
            {/* Logo Section */}
            <div className="mb-8 flex justify-center">
              <img
                className="h-20 max-md:h-16"
                src={redLogo}
                alt="Hot Freight Logo"
              />
            </div>
            {/* Form Container */}
            <div className="rounded-lg bg-white p-8 shadow-lg max-md:p-6">
              <h2 className="mb-6 text-center text-3xl font-bold text-gray-800 max-md:text-2xl">
                {title}
              </h2>
              <div className="space-y-4">{children}</div>
            </div>
          </div>
        </div>

        {/* Right side - Image with overlay text */}
        <div
          className="hidden bg-[hsl(var(--primary))] md:flex md:w-1/2 md:items-center md:justify-center"
          style={{
            backgroundImage: `url(${authBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'overlay',
          }}
        >
          Benson
          <div className="px-12 text-center text-white">
            <div className="flex justify-center">
              <img
                className="mb-10 size-32"
                src={logo}
                alt="Hot Freight Logo"
              />
            </div>
            <h1 className="text-7xl font-bold">Hot Freight International</h1>
            <p className="mt-10 text-xl">
              Smart Logistics for a Faster Tomorrow.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
