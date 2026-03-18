'use client';

import { useState, useEffect } from 'react';

interface LinkPreviewProps {
  url: string;
}

interface PreviewData {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
}

export function LinkPreview({ url }: LinkPreviewProps) {
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // For now, we'll use a simple approach without server-side fetching
    // In production, you'd want to use a server endpoint to fetch metadata
    setLoading(false);
    
    // Extract domain for display
    try {
      const urlObj = new URL(url);
      setPreview({
        title: urlObj.hostname,
        description: url,
        siteName: urlObj.hostname.replace('www.', ''),
      });
    } catch {
      setError(true);
      setLoading(false);
    }
  }, [url]);

  if (loading) {
    return (
      <div className="animate-pulse bg-gray-200 rounded-lg h-20 w-full max-w-md" />
    );
  }

  if (error || !preview) {
    return null;
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block mt-2 border rounded-lg overflow-hidden hover:bg-gray-50 transition-colors max-w-md"
    >
      <div className="p-3">
        <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
          {preview.siteName}
        </div>
        <div className="font-medium text-blue-600 line-clamp-1">
          {preview.title}
        </div>
        {preview.description && (
          <div className="text-sm text-gray-500 line-clamp-2 mt-1">
            {preview.description}
          </div>
        )}
      </div>
    </a>
  );
}

// Helper to extract URLs from text
export function extractUrls(text: string): string[] {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.match(urlRegex) || [];
}