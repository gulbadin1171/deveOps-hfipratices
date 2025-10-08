// src/features/inbox/components/email-viewer.tsx
import { Email } from '@/types/api';

interface EmailViewerProps {
  email: Email;
}

export const EmailViewer = ({ email }: EmailViewerProps) => {
  return (
    <div className="p-6">
      <h2 className="mb-4 text-xl font-bold">{email.subject}</h2>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <p className="font-medium">From: {email.from}</p>
          <p className="text-sm text-gray-500">
            Date: {email.date ? new Date(email.date).toLocaleString() : 'N/A'}
          </p>
        </div>
      </div>
      <div className="prose max-w-none whitespace-pre-wrap">
        <p>{email.snippet || 'No content available'}</p>
      </div>
    </div>
  );
};
