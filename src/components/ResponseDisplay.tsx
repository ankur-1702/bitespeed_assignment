import { IdentifyResponse } from '../types/contact';

interface ResponseDisplayProps {
  response: IdentifyResponse | null;
  error: string | null;
}

export function ResponseDisplay({ response, error }: ResponseDisplayProps) {
  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-red-100 dark:bg-red-800/50 rounded-full p-2">
            <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-semibold text-red-800 dark:text-red-300">Error</h3>
        </div>
        <p className="text-red-700 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 text-center">
        <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <p className="text-gray-500 dark:text-gray-400">Submit a request to see the response here</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 px-6 py-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="bg-green-100 dark:bg-green-800/50 rounded-full p-1">
            <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">HTTP 200 Response</h3>
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-xl p-4">
            <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wide mb-2">Primary Contact ID</p>
            <p className="text-3xl font-bold text-indigo-700 dark:text-indigo-300">#{response.contact.primaryContatctId}</p>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/30 rounded-xl p-4">
            <p className="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wide mb-2">Secondary Contact IDs</p>
            {response.contact.secondaryContactIds.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {response.contact.secondaryContactIds.map((id) => (
                  <span key={id} className="bg-purple-200 dark:bg-purple-800/50 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-sm font-medium">
                    #{id}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-purple-400 dark:text-purple-500 text-sm">None</p>
            )}
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4">
          <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-2">Emails</p>
          {response.contact.emails.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {response.contact.emails.map((email, idx) => (
                <span
                  key={email}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    idx === 0
                      ? 'bg-blue-200 dark:bg-blue-800/50 text-blue-800 dark:text-blue-200'
                      : 'bg-blue-100 dark:bg-blue-800/30 text-blue-700 dark:text-blue-300'
                  }`}
                >
                  {idx === 0 && <span className="mr-1">★</span>}
                  {email}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-blue-400 dark:text-blue-500 text-sm">None</p>
          )}
        </div>

        <div className="bg-teal-50 dark:bg-teal-900/30 rounded-xl p-4">
          <p className="text-xs font-medium text-teal-600 dark:text-teal-400 uppercase tracking-wide mb-2">Phone Numbers</p>
          {response.contact.phoneNumbers.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {response.contact.phoneNumbers.map((phone, idx) => (
                <span
                  key={phone}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    idx === 0
                      ? 'bg-teal-200 dark:bg-teal-800/50 text-teal-800 dark:text-teal-200'
                      : 'bg-teal-100 dark:bg-teal-800/30 text-teal-700 dark:text-teal-300'
                  }`}
                >
                  {idx === 0 && <span className="mr-1">★</span>}
                  {phone}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-teal-400 dark:text-teal-500 text-sm">None</p>
          )}
        </div>

        <div className="bg-gray-900 dark:bg-gray-950 rounded-xl p-4 overflow-x-auto">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Raw JSON Response</p>
          <pre className="text-green-400 text-sm font-mono">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
