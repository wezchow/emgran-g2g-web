'use client';

import { useEffect } from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
  };

  return (
    <div
      className={`animate-spin rounded-full border-blue-600 border-t-transparent ${sizeClasses[size]} ${className}`}
    />
  );
}

interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({ message = 'Loading...' }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">{message}</p>
      </div>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-500">Loading...</p>
      </div>
    </div>
  );
}

interface SkeletonProps {
  className?: string;
  count?: number;
}

export function Skeleton({ className = '', count = 1 }: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-gray-200 rounded ${className}`}
        />
      ))}
    </>
  );
}

// Card skeleton for loading states
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full" />
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-1/4" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-3/4" />
      </div>
      <div className="mt-4 h-10 bg-gray-200 rounded" />
    </div>
  );
}

// Message skeleton for chat
export function MessageSkeleton() {
  return (
    <div className="flex gap-3 p-4 animate-pulse">
      <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0" />
      <div className="flex-1">
        <div className="h-3 bg-gray-200 rounded w-24 mb-2" />
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-3/4" />
        </div>
      </div>
    </div>
  );
}

// Provider list skeleton
export function ProviderListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

// Inline loading dots
export function LoadingDots() {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </span>
  );
}