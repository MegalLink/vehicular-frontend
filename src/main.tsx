import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider, createStandaloneToast } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import App from './App.tsx'
import theme from './theme'
import './index.css'

const { ToastContainer } = createStandaloneToast()

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 600000, // determines how long data is considered fresh before refetching.
      gcTime: 900000, //controls how long inactive queries are kept in the cache.
      // other config option to avoid refetch if data dont change frequently
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
})

const container = document.getElementById('root')
if (!container) throw new Error('Failed to find the root element')
const root = createRoot(container)

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <App />
        <ToastContainer />
      </ChakraProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
)
