'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { providersApi } from '@/lib/api';
import type { Provider } from '@/types';

export default function ChatIndexPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await providersApi.list({ status: 'active' });
        if (response.success && response.data) {
          setProviders(response.data.providers || []);
        }
      } catch (err) {
        console.error('Failed to fetch providers:', err);
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
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Select a Provider</h1>
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-gray-600 mb-6">
          Choose a provider to start chatting with:
        </p>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : providers.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-lg font-medium text-gray-900">No providers available</h3>
            <p className="text-gray-500 mt-2">
              <Link href="/providers" className="text-blue-600 hover:underline">
                View all providers
              </Link>
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {providers.map((provider) => (
              <Link
                key={provider.emgran_id}
                href={`/chat/${provider.emgran_id}`}
                className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                      {provider.emgran_id.charAt(8).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{provider.emgran_id}</h3>
                      {provider.capabilities && (
                        <div className="flex gap-2 mt-1">
                          {provider.capabilities.slice(0, 3).map((cap) => (
                            <span
                              key={cap}
                              className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded"
                            >
                              {cap}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      provider.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}