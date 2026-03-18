'use client';

import { useState, useEffect, useCallback } from 'react';
import { MessageList } from './message-list';
import { MessageInput } from './message-input';
import { useWebSocket } from '@/hooks/use-websocket';
import { sessionsApi } from '@/lib/api';
import type { Message, WebSocketMessage } from '@/types';

interface ChatWindowProps {
  providerId: string;
  providerName?: string;
}

export function ChatWindow({ providerId, providerName = 'Provider' }: ChatWindowProps) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle incoming WebSocket messages
  const handleWebSocketMessage = useCallback((wsMessage: WebSocketMessage) => {
    if (wsMessage.type === 'chat' && wsMessage.content) {
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        session_id: wsMessage.session_id || sessionId || '',
        role: 'provider',
        content: wsMessage.content,
        timestamp: new Date(wsMessage.timestamp || Date.now()).toISOString(),
      };
      setMessages((prev) => [...prev, newMessage]);
      setIsLoading(false);
    } else if (wsMessage.type === 'system') {
      const systemMessage: Message = {
        id: `sys-${Date.now()}`,
        session_id: sessionId || '',
        role: 'system',
        content: wsMessage.content || '',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, systemMessage]);
    } else if (wsMessage.type === 'error') {
      setError(wsMessage.content || 'An error occurred');
      setIsLoading(false);
    }
  }, [sessionId]);

  // WebSocket connection
  const { connected, sendChat } = useWebSocket(sessionId, providerId);

  // Create session on mount
  useEffect(() => {
    const createSession = async () => {
      try {
        setIsLoading(true);
        const response = await sessionsApi.create({ provider_id: providerId });
        if (response.success && response.data) {
          setSessionId(response.data.session_id);
          
          // Add system message
          setMessages([{
            id: 'sys-welcome',
            session_id: response.data.session_id,
            role: 'system',
            content: `Connected to ${providerName}`,
            timestamp: new Date().toISOString(),
          }]);
        }
      } catch (err) {
        setError('Failed to create session');
        console.error('Session creation error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    createSession();
  }, [providerId, providerName]);

  // Send message handler
  const handleSend = useCallback((content: string) => {
    if (!sessionId) return;

    // Add user message immediately
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      session_id: sessionId,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Send via WebSocket
    sendChat(content);
  }, [sessionId, sendChat]);

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-2">⚠️ {error}</div>
          <button
            onClick={() => window.location.reload()}
            className="text-blue-600 hover:underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
            {providerName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="font-semibold">{providerName}</h2>
            <div className="flex items-center gap-1">
              <div
                className={`w-2 h-2 rounded-full ${
                  connected ? 'bg-green-500' : 'bg-gray-400'
                }`}
              />
              <span className="text-xs text-gray-500">
                {connected ? 'Connected' : 'Connecting...'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <MessageList messages={messages} isLoading={isLoading} />

      {/* Input */}
      <MessageInput
        onSend={handleSend}
        disabled={!connected || !sessionId}
        placeholder={connected ? 'Type a message...' : 'Connecting...'}
      />
    </div>
  );
}