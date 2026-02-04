const isServer = typeof window === 'undefined'

export async function request(input: RequestInfo | URL, init?: RequestInit) {
  if (isServer) {
    return fetch(input, init)
  }
  const mod = await import('@/lib/http')
  return mod.default.fetch(input, init)
}

