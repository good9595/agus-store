import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { verifyCredentials } from "../../../lib/userService.js"

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text", placeholder: "john.doe@example.com" },
        password: {  label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        const user = await verifyCredentials(credentials)
        if (user) {
          return user
        } else {
          return null
        }
      }
    })
  ],
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  callbacks: {
    async jwt(token, user) {
      if (user?.id) {
        token.id = user.id
      }
      return token
    },
    async session(session, token) {
      if (token?.id) {
        session.userId = token.id
      }
      return session    
    },
  },
  session: {
    maxAge: 24 * 60 * 60,
    updateAge: 6 * 60 * 60, 
  },
})
