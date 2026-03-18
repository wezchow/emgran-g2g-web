import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Message, Session, Provider } from '@/types';

// Connection states
export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'reconnecting';

// Session Store
interface SessionState {
  // Current session
  currentSession: Session | null;
  messages: Message[];
  
  // Connection state
  connectionStatus: ConnectionStatus;
  reconnectAttempts: number;
  
  // Actions
  setCurrentSession: (session: Session | null) => void;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  incrementReconnectAttempts: () => void;
  resetReconnectAttempts: () => void;
  
  // Session history
  sessionHistory: Session[];
  addToHistory: (session: Session) => void;
  clearHistory: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      // Initial state
      currentSession: null,
      messages: [],
      connectionStatus: 'disconnected',
      reconnectAttempts: 0,
      sessionHistory: [],
      
      // Actions
      setCurrentSession: (session) => set({ 
        currentSession: session,
        messages: [],
        connectionStatus: session ? 'connecting' : 'disconnected',
        reconnectAttempts: 0,
      }),
      
      addMessage: (message) => set((state) => ({
        messages: [...state.messages, message],
      })),
      
      clearMessages: () => set({ messages: [] }),
      
      setConnectionStatus: (status) => set({ 
        connectionStatus: status,
        reconnectAttempts: status === 'connected' ? 0 : undefined,
      }),
      
      incrementReconnectAttempts: () => set((state) => ({
        reconnectAttempts: state.reconnectAttempts + 1,
      })),
      
      resetReconnectAttempts: () => set({ reconnectAttempts: 0 }),
      
      addToHistory: (session) => set((state) => {
        const exists = state.sessionHistory.some(s => s.session_id === session.session_id);
        if (exists) return state;
        return {
          sessionHistory: [session, ...state.sessionHistory].slice(0, 50), // Keep last 50 sessions
        };
      }),
      
      clearHistory: () => set({ sessionHistory: [] }),
    }),
    {
      name: 'g2g-session-storage',
      partialize: (state) => ({
        sessionHistory: state.sessionHistory,
      }),
    }
  )
);

// Provider Store
interface ProviderState {
  providers: Provider[];
  selectedProvider: Provider | null;
  isLoading: boolean;
  error: string | null;
  
  setProviders: (providers: Provider[]) => void;
  selectProvider: (provider: Provider | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useProviderStore = create<ProviderState>()((set) => ({
  providers: [],
  selectedProvider: null,
  isLoading: false,
  error: null,
  
  setProviders: (providers) => set({ providers, isLoading: false, error: null }),
  selectProvider: (provider) => set({ selectedProvider: provider }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error, isLoading: false }),
}));

// UI Store
interface UIState {
  isSidebarOpen: boolean;
  isDarkMode: boolean;
  toggleSidebar: () => void;
  toggleDarkMode: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isSidebarOpen: true,
      isDarkMode: false,
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    }),
    {
      name: 'g2g-ui-storage',
    }
  )
);