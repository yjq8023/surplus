import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const users = [
  {
    username: 'admin',
    password: 'admin123',
    name: '管理员'
  },
  {
    username: 'u01',
    password: 'abc123',
    name: '用户1'
  },
  {
    username: 'u02',
    password: 'abc123',
    name: '用户2'
  }
]
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      // 验证提交凭证，如账号密码等
      async authorize(credentials, req) {
        const { username, password } = credentials
        // 在这里添加用户验证逻辑，例如从数据库中查找用户
        const user = users.find((item) => {
          return item.username === username && item.password === password
        })
        if (user) {
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
    },
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl
      const isPublicRoutes = pathname.startsWith('/api/auth')
      console.log(pathname)
      if(isPublicRoutes) {
        return true
      }
      return !!auth
    },
  },
  secret: 'Ys+212Eq/X3e7eYkPUmpNu8PsPFAuiklwbgRNWUKAxU=',
})
