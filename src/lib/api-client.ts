// src/lib/api-client.ts
import Axios, {
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  AxiosInstance,
} from 'axios';

import { useNotifications } from '@/components/ui/notifications';
import { env } from '@/config/env';
import { paths } from '@/config/paths';

interface ErrorResponse {
  message: string;
}

// Define a custom Axios instance that returns response.data (T) directly
interface TypedAxiosInstance extends AxiosInstance {
  get<T = any>(url: string, config?: InternalAxiosRequestConfig): Promise<T>;
  post<T = any>(
    url: string,
    data?: any,
    config?: InternalAxiosRequestConfig,
  ): Promise<T>;
  put<T = any>(
    url: string,
    data?: any,
    config?: InternalAxiosRequestConfig,
  ): Promise<T>;
  delete<T = any>(url: string, config?: InternalAxiosRequestConfig): Promise<T>;
}

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  if (config.headers) {
    config.headers.Accept = 'application/json';
  }
  config.withCredentials = true;
  return config;
}

export const api: TypedAxiosInstance = Axios.create({
  baseURL: env.API_URL,
}) as TypedAxiosInstance;

api.interceptors.request.use(authRequestInterceptor);

api.interceptors.response.use(
  (response: AxiosResponse) => response.data, // Return response.data
  (error: AxiosError<ErrorResponse>) => {
    const message = error.response?.data?.message || error.message;
    useNotifications.getState().addNotification({
      type: 'error',
      title: 'Error',
      message,
    });

    if (error.response?.status === 401) {
      const searchParams = new URLSearchParams(window.location.search);
      const redirectTo =
        searchParams.get('redirectTo') || window.location.pathname;
      window.location.href = paths.auth.verifyOtp.getHref(redirectTo);
    } else if (error.response?.status === 400) {
      return Promise.resolve(error.response.data);
    }

    return Promise.reject(error);
  },
);
