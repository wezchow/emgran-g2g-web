'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { G2GWebSocket, createWebSocketUrl } from '@/lib/websocket';
import type { WebSocketMessage } from '@/types';

export function useWebSocket(sessionId: string | null, providerId?: string) {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const wsRef = useRef<G2GWebSocket | null>(null);

  const handleMessage = useCallback((message: WebSocketMessage) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  useEffect(() => {
    if (!sessionId) return;

    const url = createWebSocketUrl(sessionId, providerId);
    const ws = new G2GWebSocket(url, handleMessage, setConnected);
    wsRef.current = ws;
    ws.connect();

    return () => {
      ws.disconnect();
      wsRef.current = null;
    };
  }, [sessionId, providerId, handleMessage]);

  const send = useCallback((message: WebSocketMessage) => {
    wsRef.current?.send(message);
  }, []);

  const sendChat = useCallback((content: string, sid?: string) => {
    wsRef.current?.sendChat(content, sid || sessionId || undefined);
  }, [sessionId]);

  return {
    connected,
    messages,
    send,
    sendChat,
  };
}