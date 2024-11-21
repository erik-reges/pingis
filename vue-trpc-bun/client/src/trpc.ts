import { createTRPCProxyClient, httpLink } from '@trpc/client' // Changed from httpBatchLink
import superjson from 'superjson'
import type { AppRouter } from '../../server'

export const trpc = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [
    httpLink({
      url: 'http://localhost:3000/trpc',
      headers() {
        return {
          'Content-Type': 'application/json',
        }
      },
    }),
  ],
})
