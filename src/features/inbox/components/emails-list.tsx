// src/features/inbox/components/emails-list.tsx
import { Email } from '@/types/api';

interface EmailListProps {
  emails: Email[];
  onSelectEmail: (email: Email) => void;
  selectedEmailId: string | undefined;
}

export const EmailList = ({
  emails,
  onSelectEmail,
  selectedEmailId,
}: EmailListProps) => {
  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    email: Email,
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault(); // Prevent scrolling on Space key
      onSelectEmail(email);
    }
  };

  return (
    <div className="divide-y divide-gray-200">
      {emails.map((email) => (
        <button
          key={email.id}
          onClick={() => onSelectEmail(email)}
          onKeyDown={(event) => handleKeyDown(event, email)}
          className={`w-full cursor-pointer p-4 text-left hover:bg-gray-100 ${selectedEmailId === email.id ? 'bg-gray-200' : ''}`}
          type="button" // Explicitly set type to avoid form submission
        >
          <h3 className="font-medium">{email.subject || 'No Subject'}</h3>
          <p className="text-sm text-gray-600">From: {email.from}</p>
          <p className="text-sm text-gray-500">
            {email.date ? new Date(email.date).toLocaleString() : 'N/A'}
          </p>
          {email.snippet && (
            <p className="mt-1 line-clamp-2 text-sm text-gray-600">
              {email.snippet}
            </p>
          )}
        </button>
      ))}
    </div>
  );
};
