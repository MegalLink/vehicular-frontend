import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 600000, // determines how long data is considered fresh before refetching.
      gcTime: 900000, //controls how long inactive queries are kept in the cache.
      // other config option to avoid refetch if data dont change frequently
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1, // reintentar una vez en caso de error
    },
  },
})
