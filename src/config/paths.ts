export const paths = {
  home:
    //  {
    //   path: '/',
    //   getHref: () => '/',
    // },

    {
      path: '/',
      getHref: (redirectTo?: string | null | undefined) =>
        `/auth/login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
    },

  auth: {
    register: {
      path: '/auth/register',
      getHref: (redirectTo?: string | null | undefined) =>
        `/auth/register${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
    },
    login: {
      path: '/auth/login',
      getHref: (redirectTo?: string | null | undefined) =>
        `/auth/login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
    },
    verifyOtp: {
      path: '/auth/otp-verify',
      getHref: (redirectTo?: string | null | undefined) =>
        `/auth/otp-verify${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
    },
  },

  app: {
    root: {
      path: '/app',
      getHref: () => '/app',
    },
    dashboard: {
      path: 'dashboard',
      getHref: () => '/app/dashboard',
    },
    discussions: {
      path: 'discussion',
      getHref: () => '/app/discussion',
    },
    discussion: {
      path: 'discussions/:discussionId',
      getHref: (id: string) => `/app/discussions/${id}`,
    },
    users: {
      path: 'users',
      getHref: () => '/app/users',
    },
    profile: {
      path: 'profile',
      getHref: () => '/app/profile',
    },
    QuickEstimate: {
      path: 'quick-estimate',
      getHref: () => '/app/quick-estimate',
    },
    DetailedQuote: {
      path: 'detailed-quote',
      getref: () => '/app/detailed-quote',
    },
    DetailedQuoteDetail: {
      path: 'detailed-quote/:id',
      getHref: (id: string) => `/app/detailed-quote/${id}`,
    },
    ShippmentTracking: {
      path: 'tracking-shippments',
      getref: () => '/app/tracking-shippments',
    },
    Inbox: {
      path: 'Inbox',
      getref: () => '/app/inbox',
    },
  },
} as const;
