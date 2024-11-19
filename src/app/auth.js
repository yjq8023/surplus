import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      // 验证提交凭证，如账号密码等
      async authorize(credentials, req) {
        const { username, password } = credentials
        // 在这里添加用户验证逻辑，例如从数据库中查找用户
        const user = { id: 1, name: username } // 示例用户
        if (username === 'admin' && password === '123456') {
          return user
        }
        return null
      }
    })
  ],
  callbacks: {
    // 登录回调，返回值决定是否允许登录
    async signIn(user, account, profile) {
      if (user) {
        return true
      }
      return false
    }
  },
  secret: 'Ys+212Eq/X3e7eYkPUmpNu8PsPFAuiklwbgRNWUKAxU=',
})
