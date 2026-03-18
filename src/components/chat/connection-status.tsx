'use client';

import { useSessionStore, type ConnectionStatus } from '@/store/session-store';

const statusConfig: Record<ConnectionStatus, { color: string; text: string; animate?: boolean }> = {
  connecting: { color: 'bg-yellow-500', text: 'Connecting...', animate: true },
  connected: { color: 'bg-green-500', text: 'Connected' },
  disconnected: { color: 'bg-gray-400', text: 'Disconnected' },
  reconnecting: { color: 'bg-orange-500', text: 'Reconnecting...', animate: true },
};

export function ConnectionStatus() {
  const { connectionStatus, reconnectAttempts } = useSessionStore();
  const config = statusConfig[connectionStatus];

  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-2 h-2 rounded-full ${config.color} ${
          config.animate ? 'animate-pulse' : ''
        }`}
      />
      <span className="text-xs text-gray-500">
        {config.text}
        {connectionStatus === 'reconnecting' && reconnectAttempts > 0 && (
          <span className="ml-1">({reconnectAttempts})</span>
        )}
      </span>
    </div>
  );
}

interface ConnectionBannerProps {
  onRetry?: () => void;
}

export function ConnectionBanner({ onRetry }: ConnectionBannerProps) {
  const { connectionStatus } = useSessionStore();

  if (connectionStatus !== 'disconnected') {
    return null;
  }

  return (
    <div className="bg-red-50 border-b border-red-200 px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-2 text-red-700">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
        <span className="text-sm">Connection lost</span>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm text-red-700 hover:text-red-900 underline"
        >
          Retry
        </button>
      )}
    </div>
  );
}