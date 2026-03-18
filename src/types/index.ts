// G2G Types

export interface Provider {
  emgran_id: string;
  endpoint: string;
  capabilities?: string[];
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface Session {
  session_id: string;
  provider_id: string;
  user_id?: string;
  status: 'active' | 'closed';
  message_count: number;
  created_at: string;
  updated_at: string;
  ended_at?: string;
}

export interface Message {
  id: string;
  session_id: string;
  role: 'user' | 'provider' | 'system';
  content: string;
  timestamp: string;
}

export interface WebSocketMessage {
  type: 'ping' | 'pong' | 'auth' | 'auth_response' | 'chat' | 'system' | 'error' | 'ack';
  id?: string;
  session_id?: string;
  content?: string;
  metadata?: Record<string, unknown>;
  timestamp?: number;
}

export interface CreateSessionRequest {
  provider_id: string;
  user_id?: string;
  message?: string;
}

export interface CreateSessionResponse {
  session_id: string;
  provider_id: string;
  status: string;
  ws_channel: string;
  created_at: string;
}