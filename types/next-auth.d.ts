import NextAuth, { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
      clientId: string
      clientSlug: string
    } & DefaultSession['user']
  }

  interface User {
    role: string
    clientId: string
    clientSlug: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string
    clientId: string
    clientSlug: string
  }
}
