'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useSessionStore } from '@/store/session-store';
import type { Session } from '@/types';

export default function SessionsPage() {
  const { sessionHistory, clearHistory } = useSessionStore();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    // Sort sessions
    const sorted = [...sessionHistory].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });
    setSessions(sorted);
  }, [sessionHistory, sortBy]);

  const handleDelete = (sessionId: string) => {
    // In production, this would call the API
    // For now, just remove from local state
    const updated = sessions.filter((s) => s.session_id !== sessionId);
    setSessions(updated);
    // Also update the store
    useSessionStore.setState({ sessionHistory: updated });
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all session history?')) {
      clearHistory();
      setSessions([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Session History</h1>
            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
                className="text-sm border rounded-md px-3 py-1.5"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {sessions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="text-4xl mb-4">📜</div>
            <h3 className="text-lg font-medium text-gray-900">No session history</h3>
            <p className="text-gray-500 mt-2">
              Start a chat with a provider to create sessions.
            </p>
            <Link href="/providers">
              <Button className="mt-4">Browse Providers</Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Clear All Button */}
            <div className="flex justify-end mb-4">
              <Button variant="outline" onClick={handleClearAll}>
                Clear All History
              </Button>
            </div>

            {/* Session List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Session ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Provider
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Messages
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sessions.map((session) => (
                    <SessionRow
                      key={session.session_id}
                      session={session}
                      onDelete={handleDelete}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function SessionRow({
  session,
  onDelete,
}: {
  session: Session;
  onDelete: (id: string) => void;
}) {
  const [showConfirm, setShowConfirm] = useState(false);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm font-mono text-gray-900">
          {session.session_id.slice(0, 12)}...
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Link
          href={`/chat/${session.provider_id}`}
          className="text-sm text-blue-600 hover:underline"
        >
          {session.provider_id}
        </Link>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            session.status === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {session.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(session.created_at)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {session.message_count || 0}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex justify-end gap-2">
          <Link href={`/chat/${session.provider_id}`}>
            <Button variant="outline" size="sm">
              Resume
            </Button>
          </Link>
          {showConfirm ? (
            <div className="flex gap-1">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(session.session_id)}
              >
                Confirm
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowConfirm(true)}
            >
              Delete
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}