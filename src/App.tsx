import { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { IdentifyForm } from './components/IdentifyForm';
import { ResponseDisplay } from './components/ResponseDisplay';
import { DatabaseView } from './components/DatabaseView';
import { InfoSection } from './components/InfoSection';
import { RequestHistory } from './components/RequestHistory';
import { VisualDiagram } from './components/VisualDiagram';
import { IdentifyRequest, IdentifyResponse } from './types/contact';
import { identify, getContacts, resetDatabase, seedDatabase } from './services/contactService';

interface HistoryItem {
  id: number;
  request: IdentifyRequest;
  response: IdentifyResponse | null;
  error: string | null;
  timestamp: Date;
}

export function App() {
  const [response, setResponse] = useState<IdentifyResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [contacts, setContacts] = useState(getContacts());
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyId, setHistoryId] = useState(1);

  const handleSubmit = useCallback(async (request: IdentifyRequest) => {
    setIsLoading(true);
    setError(null);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      const result = identify(request);
      setResponse(result);
      setContacts(getContacts());
      setHistory(prev => [{
        id: historyId,
        request,
        response: result,
        error: null,
        timestamp: new Date(),
      }, ...prev].slice(0, 10));
      setHistoryId(prev => prev + 1);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      setResponse(null);
      setHistory(prev => [{
        id: historyId,
        request,
        response: null,
        error: errorMessage,
        timestamp: new Date(),
      }, ...prev].slice(0, 10));
      setHistoryId(prev => prev + 1);
    } finally {
      setIsLoading(false);
    }
  }, [historyId]);

  const handleReset = useCallback(() => {
    resetDatabase();
    setContacts(getContacts());
    setResponse(null);
    setError(null);
    setHistory([]);
  }, []);

  const handleSeed = useCallback(() => {
    seedDatabase();
    setContacts(getContacts());
  }, []);

  const handleReplay = useCallback((request: IdentifyRequest) => {
    handleSubmit(request);
  }, [handleSubmit]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-zinc-100 dark:from-gray-900 dark:via-slate-900 dark:to-zinc-900 transition-colors duration-300">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <InfoSection />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="space-y-6">
            <IdentifyForm onSubmit={handleSubmit} isLoading={isLoading} />
            <RequestHistory history={history} onReplay={handleReplay} />
          </div>
          <div>
            <ResponseDisplay response={response} error={error} />
          </div>
        </div>

        <div>
          <DatabaseView 
            contacts={contacts} 
            onReset={handleReset}
            onSeed={handleSeed}
          />
          <VisualDiagram contacts={contacts} />
        </div>

        <footer className="mt-12 text-center pb-8">
          <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-sm border border-gray-100 dark:border-gray-700">
            <span className="text-2xl">⚡</span>
            <span className="text-gray-600 dark:text-gray-300 text-sm">
              Great Scott! Identity Reconciliation for FluxKart.com
            </span>
            <span className="text-2xl">🚗</span>
          </div>
          <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
            Built for Bitespeed Backend Task • Simulated in-browser database
          </p>
        </footer>
      </main>
    </div>
  );
}
