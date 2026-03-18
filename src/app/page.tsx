import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">G2G Server</h1>
            <nav className="flex gap-4">
              <Link href="/chat" className="text-gray-600 hover:text-gray-900">
                Chat
              </Link>
              <Link href="/providers" className="text-gray-600 hover:text-gray-900">
                Providers
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to G2G Server
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A modern real-time communication platform for AI providers and users.
            Connect, chat, and build intelligent applications.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>🤖 AI Providers</CardTitle>
              <CardDescription>Connect with multiple AI providers</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Register and manage AI providers with custom capabilities and endpoints.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>💬 Real-time Chat</CardTitle>
              <CardDescription>WebSocket-powered communication</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Instant messaging with heartbeat detection and automatic reconnection.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🔒 Secure Sessions</CardTitle>
              <CardDescription>JWT-based authentication</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Secure session management with token-based authentication.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-12 text-center">
          <div className="flex gap-4 justify-center">
            <Link href="/chat">
              <Button size="lg">Start Chatting</Button>
            </Link>
            <Link href="/providers">
              <Button variant="outline" size="lg">View Providers</Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            G2G Server v2.0 • Built with Next.js, Rust, and WebSocket
          </p>
        </div>
      </footer>
    </div>
  );
}