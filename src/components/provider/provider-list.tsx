'use client';

import Link from 'next/link';
import type { Provider } from '@/types';
import { Button } from '@/components/ui/button';

interface ProviderListProps {
  providers: Provider[];
  onSelect?: (provider: Provider) => void;
}

export function ProviderList({ providers, onSelect }: ProviderListProps) {
  if (providers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">🔍</div>
        <h3 className="text-lg font-medium text-gray-900">No providers found</h3>
        <p className="text-gray-500">Check back later or register a new provider.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {providers.map((provider) => (
        <ProviderCard 
          key={provider.emgran_id} 
          provider={provider}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

function ProviderCard({ 
  provider, 
  onSelect 
}: { 
  provider: Provider;
  onSelect?: (provider: Provider) => void;
}) {
  const handleClick = () => {
    if (onSelect) {
      onSelect(provider);
    }
  };

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

        {onSelect ? (
          <Button onClick={handleClick} className="w-full">
            Start Chat
          </Button>
        ) : (
          <Link href={`/chat/${provider.emgran_id}`}>
            <Button className="w-full">
              Start Chat
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}