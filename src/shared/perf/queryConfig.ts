import { QueryClient } from '@tanstack/react-query';

/**
 * Optimized QueryClient configuration for better performance
 */
export const queryClientConfig = {
  defaultOptions: {
    queries: {
      // Cache for 5 minutes, refetch on window focus
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
      retry: (failureCount: number, error: any) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    },
  },
};

/**
 * Create optimized QueryClient instance
 */
export function createOptimizedQueryClient(): QueryClient {
  return new QueryClient(queryClientConfig);
}