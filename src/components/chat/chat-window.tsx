'use client';

import { useState, useEffect, useCallback } from 'react';
import { MessageList } from './message-list';
import { MessageInput } from './message-input';
import { ConnectionStatus, ConnectionBanner } from './connection-status';
import { useWebSocket } from '@/hooks/use-websocket';
import { useSessionStore } from '@/store/session-store';
import { sessionsApi } from '@/lib/api';
import type { Message, WebSocketMessage } from '@/types';

interface ChatWindowProps {
  providerId: string;
  providerName?: string;
}

export function ChatWindow({ providerId, providerName = 'Provider' }: ChatWindowProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use session store
  const {
    currentSession,
    messages,
    connectionStatus,
    setCurrentSession,
    addMessage,
    setConnectionStatus,
    addToHistory,
  } = useSessionStore();

  const sessionId = currentSession?.session_id || null;

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
      addMessage(newMessage);
      setIsLoading(false);
    } else if (wsMessage.type === 'system') {
      const systemMessage: Message = {
        id: `sys-${Date.now()}`,
        session_id: sessionId || '',
        role: 'system',
        content: wsMessage.content || '',
        timestamp: new Date().toISOString(),
      };
      addMessage(systemMessage);
    } else if (wsMessage.type === 'pong') {
      // Heartbeat response
      setConnectionStatus('connected');
    } else if (wsMessage.type === 'error') {
      setError(wsMessage.content || 'An error occurred');
      setIsLoading(false);
    }
  }, [sessionId, addMessage, setConnectionStatus]);

  // WebSocket connection
  const { connected, sendChat } = useWebSocket(sessionId, providerId);

  // Sync connection status
  useEffect(() => {
    if (connected && connectionStatus !== 'connected') {
      setConnectionStatus('connected');
    } else if (!connected && connectionStatus === 'connected') {
      setConnectionStatus('disconnected');
    }
  }, [connected, connectionStatus, setConnectionStatus]);

  // Create session on mount
  useEffect(() => {
    const createSession = async () => {
      try {
        setIsLoading(true);
        setConnectionStatus('connecting');
        const response = await sessionsApi.create({ provider_id: providerId });
        if (response.success && response.data) {
          const session: Session = {
            session_id: response.data.session_id,
            provider_id: response.data.provider_id,
            status: 'active',
            message_count: 0,
            created_at: response.data.created_at,
            updated_at: response.data.created_at,
          };
          
          setCurrentSession(session);
          addToHistory(session);
          
          // Add system message
          addMessage({
            id: 'sys-welcome',
            session_id: session.session_id,
            role: 'system',
            content: `Connected to ${providerName}`,
            timestamp: new Date().toISOString(),
          });
        }
      } catch (err) {
        setError('Failed to create session');
        setConnectionStatus('disconnected');
        console.error('Session creation error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    createSession();
  }, [providerId, providerName, setCurrentSession, addMessage, addToHistory, setConnectionStatus]);

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
    addMessage(userMessage);
    setIsLoading(true);

    // Send via WebSocket
    sendChat(content);
  }, [sessionId, addMessage, sendChat]);

  // Retry connection
  const handleRetry = useCallback(() => {
    window.location.reload();
  }, []);

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-2">⚠️ {error}</div>
          <button
            onClick={handleRetry}
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
      {/* Connection Banner */}
      <ConnectionBanner onRetry={handleRetry} />
      
      {/* Header */}
      <div className="border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
            {providerName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="font-semibold">{providerName}</h2>
            <ConnectionStatus />
          </div>
        </div>
      </div>

      {/* Messages */}
      <MessageList messages={messages} isLoading={isLoading} />

      {/* Input */}
      <MessageInput
        onSend={handleSend}
        disabled={connectionStatus !== 'connected' || !sessionId}
        placeholder={connectionStatus === 'connected' ? 'Type a message...' : 'Connecting...'}
      />
    </div>
  );
}

// Add Session type import
import type { Session } from '@/types';