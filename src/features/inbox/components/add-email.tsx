import { useState, useEffect } from 'react';

import { ContentLayout } from '@/components/layouts/content-layout';
import { Button } from '@/components/ui/button';
import { EmailViewer } from '@/features/inbox/components/email-viewer';
import { EmailList } from '@/features/inbox/components/emails-list';

interface Email {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  date: string | null;
  read: boolean;
}

export const InboxRoute = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [gmail, setGmail] = useState('');
  const [password, setPassword] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 5;

  const API_URL = import.meta.env.VITE_API_URL;
  const APP_EMAIL = import.meta.env.VITE_APP_EMAIL;

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/emails?fromEmail=${APP_EMAIL}&page=1&pageSize=10&sortOrder=desc`,
          {
            method: 'GET',
            credentials: 'include',
          },
        );

        if (response.ok) {
          setIsAuthenticated(true);
          setShowLoginForm(false);
          fetchEmails(true);
        } else {
          setIsAuthenticated(false);
          setShowLoginForm(true);
        }
      } catch (err) {
        setIsAuthenticated(false);
        setShowLoginForm(true);
      }
    };

    checkSession();
  }, []);

  const fetchEmails = async (reset = false) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(
        `${API_URL}/api/emails?fromEmail=${APP_EMAIL}&page=1&pageSize=10&sortOrder=desc`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch emails');
      }

      const data = await response.json();
      const formattedEmails = data.map((email: any) => ({
        id: email.id,
        from: email.from || 'Unknown Sender',
        subject: email.subject || 'No Subject',
        snippet: email.snippet || '',
        date: email.date ? new Date(email.date).toISOString() : null,
        read: false,
      }));

      if (reset) {
        setEmails(formattedEmails);
        setPage(2);
      } else {
        setEmails((prevEmails) => [...prevEmails, ...formattedEmails]);
        setPage((prevPage) => prevPage + 1);
      }

      setHasMore(formattedEmails.length === pageSize);
      setIsAuthenticated(true);
      setShowLoginForm(false);
    } catch (err: any) {
      setError(err.message || 'Failed to load emails. Please try again later.');
      console.error('Error fetching emails:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: gmail, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || 'Login failed. Please check your credentials.',
        );
      }

      setIsAuthenticated(true);
      setShowLoginForm(false);
      await fetchEmails(true);
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please try again.');
      console.error('Error during login:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/api/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          // Add CSRF token here if required, e.g., 'X-CSRF-Token': csrfToken
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 403) {
          console.warn('Session may be invalid, resetting local state');
          // Reset state even if server logout fails
          setEmails([]);
          setSelectedEmail(null);
          setIsAuthenticated(false);
          setShowLoginForm(true);
          setGmail('');
          setPassword('');
          setPage(1);
          setHasMore(true);
          return;
        }
        throw new Error(errorData.message || 'Failed to logout properly');
      }

      setEmails([]);
      setSelectedEmail(null);
      setIsAuthenticated(false);
      setShowLoginForm(true);
      setGmail('');
      setPassword('');
      setPage(1);
      setHasMore(true);
    } catch (err: any) {
      setError(err.message || 'Failed to logout. Please try again.');
      console.error('Error during logout:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSelect = (email: Email) => {
    setSelectedEmail(email);
    setEmails(
      emails.map((e) => (e.id === email.id ? { ...e, read: true } : e)),
    );
  };

  const handleRefresh = async () => {
    setPage(1);
    await fetchEmails(true);
    setSelectedEmail(null);
  };

  const handleLoadMore = async () => {
    if (!loading && hasMore) {
      await fetchEmails();
    }
  };

  return (
    <ContentLayout title="Email Inbox">
      <div className="mt-6">
        {showLoginForm && !isAuthenticated ? (
          <div className="mx-auto mt-10 max-w-md rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-6 text-center text-2xl font-bold text-[hsl(var(--primary))]">
              HFI Email Access
            </h2>
            <p className="mb-4 text-sm font-bold text-[hsl(var(--primary-foreground))]">
              Enter your Gmail address and App Password to log in.
            </p>
            {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
            <div className="mb-4">
              <label
                htmlFor="gmail"
                className="block text-sm font-medium text-gray-700"
              >
                Gmail Address
              </label>
              <input
                type="email"
                id="gmail"
                value={gmail}
                onChange={(e) => setGmail(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="example@gmail.com"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                App Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Enter your App Password"
              />
            </div>
            <Button
              variant={'default'}
              onClick={handleLogin}
              className="w-full rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 disabled:opacity-50"
              disabled={loading || !gmail || !password}
            >
              {loading ? 'Connecting...' : 'Login'}
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium text-[hsl(var(--primary-foreground))]">
                HFI Emails
              </h3>
              <div className="flex gap-4">
                <button
                  onClick={handleRefresh}
                  className="text-sm text-blue-600 hover:text-blue-800"
                  disabled={loading}
                >
                  {loading ? 'Refreshing...' : 'Refresh'}
                </button>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-600 hover:text-red-800"
                  disabled={loading}
                >
                  {loading ? 'Logging out...' : 'Logout'}
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="overflow-hidden rounded-lg bg-white shadow md:col-span-1">
                {emails.length > 0 ? (
                  <>
                    <EmailList
                      emails={emails}
                      onSelectEmail={handleEmailSelect}
                      selectedEmailId={selectedEmail?.id}
                    />
                    {hasMore && (
                      <div className="p-4 text-center">
                        <button
                          onClick={handleLoadMore}
                          className="text-sm text-blue-600 hover:text-blue-800"
                          disabled={loading}
                        >
                          {loading ? 'Loading...' : 'Load More'}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    {loading
                      ? 'Loading emails...'
                      : isAuthenticated
                        ? 'No emails found'
                        : 'Please authenticate to view emails'}
                  </div>
                )}
              </div>
              <div className="overflow-hidden rounded-lg bg-white shadow md:col-span-2">
                {selectedEmail ? (
                  <EmailViewer email={selectedEmail} />
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    {emails.length > 0
                      ? 'Select an email to view its contents'
                      : 'No emails to display'}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </ContentLayout>
  );
};

export default InboxRoute;
