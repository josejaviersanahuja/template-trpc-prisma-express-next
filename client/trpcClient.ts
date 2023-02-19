import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import { AppRouter } from '../server/src/routers'

// @ts-ignore
export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:4000/trpc',
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'Aún no se ha creado', // @TODO: get this from somewhere
      },
    }),
  ],
})
