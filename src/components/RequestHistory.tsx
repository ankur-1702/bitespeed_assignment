import { IdentifyRequest, IdentifyResponse } from '../types/contact';

interface HistoryItem {
  id: number;
  request: IdentifyRequest;
  response: IdentifyResponse | null;
  error: string | null;
  timestamp: Date;
}

interface RequestHistoryProps {
  history: HistoryItem[];
  onReplay: (request: IdentifyRequest) => void;
}

export function RequestHistory({ history, onReplay }: RequestHistoryProps) {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="bg-gradient-to-r from-violet-50 to-fuchsia-50 dark:from-violet-900/30 dark:to-fuchsia-900/30 px-6 py-4 border-b border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <svg className="w-5 h-5 text-violet-600 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Request History
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{history.length} request{history.length !== 1 ? 's' : ''}</p>
      </div>
      
      <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-64 overflow-y-auto">
        {history.map((item) => (
          <div key={item.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${item.error ? 'bg-red-500' : 'bg-green-500'}`} />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(item.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <button
                onClick={() => onReplay(item.request)}
                className="text-xs text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300 font-medium"
              >
                Replay
              </button>
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              {item.request.email && (
                <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded text-xs">
                  📧 {item.request.email}
                </span>
              )}
              {item.request.phoneNumber && (
                <span className="bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 px-2 py-0.5 rounded text-xs">
                  📱 {item.request.phoneNumber}
                </span>
              )}
            </div>
            {item.response && (
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                → Primary: #{item.response.contact.primaryContatctId}, 
                Secondaries: [{item.response.contact.secondaryContactIds.join(', ')}]
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
