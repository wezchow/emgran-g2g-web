'use client';

import { useParams } from 'next/navigation';
import { ChatWindow } from '@/components/chat/chat-window';
import Link from 'next/link';

export default function ChatPage() {
  const params = useParams();
  const providerId = params.providerId as string;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/providers" className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
              </Link>
              <h1 className="text-xl font-bold text-gray-900">G2G Chat</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Window */}
      <main className="flex-1 max-w-4xl mx-auto w-full">
        <ChatWindow 
          providerId={providerId} 
          providerName={`Provider ${providerId.slice(-6)}`}
        />
      </main>
    </div>
  );
}