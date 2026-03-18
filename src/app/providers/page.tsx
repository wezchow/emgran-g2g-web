'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { ProviderListSkeleton, PageLoader } from '@/components/ui/loading';
import { providersApi } from '@/lib/api';
import type { Provider } from '@/types';

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await providersApi.list({ status: 'active' });
      if (response.success && response.data) {
        setProviders(response.data.providers || []);
      }
    } catch (err) {
      console.error('Failed to fetch providers:', err);
      setError('Failed to load providers');
      // Show mock data for demo
      setProviders([
        {
          emgran_id: 'emgran-demo-001',
          endpoint: 'ws://localhost:8080',
          capabilities: ['chat', 'code'],
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          emgran_id: 'emgran-demo-002',
          endpoint: 'ws://localhost:8080',
          capabilities: ['chat', 'image'],
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, [retryCount]);

  const handleRetry = () => {
    setRetryCount((c) => c + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Providers</h1>
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <ErrorBoundary>
          {loading ? (
            <ProviderListSkeleton count={6} />
          ) : error ? (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <span>{error} (showing demo providers)</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleRetry}>
                Retry
              </Button>
            </div>
          ) : null}

          {!loading && providers.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-900">No providers found</h3>
              <p className="text-gray-500">Check back later or register a new provider.</p>
            </div>
          ) : !loading && providers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {providers.map((provider) => (
                <ProviderCard key={provider.emgran_id} provider={provider} />
              ))}
            </div>
          ) : null}
        </ErrorBoundary>
      </main>
    </div>
  );
}

function ProviderCard({ provider }: { provider: Provider }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
            {provider.emgran_id.charAt(8).toUpperCase()}
          </div>
          <span className={`px-2 py-1 text-xs rounded-full ${
            provider.status === 'active' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {provider.status}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {provider.emgran_id}
        </h3>

        {provider.capabilities && provider.capabilities.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {provider.capabilities.map((cap) => (
              <span
                key={cap}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
              >
                {cap}
              </span>
            ))}
          </div>
        )}

        <Link href={`/chat/${provider.emgran_id}`}>
          <Button className="w-full">
            Start Chat
          </Button>
        </Link>
      </div>
    </div>
  );
}