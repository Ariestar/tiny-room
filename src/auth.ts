import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const { handlers, auth, signIn, signOut } = NextAuth({
	// adapter: PrismaAdapter(prisma), // Using JWT strategy, no adapter needed for session management
	session: { strategy: "jwt" },
	pages: {
		signIn: "/dashboard/login",
	},
	// 确保在生产环境中使用正确的 URL
	trustHost: true,
	providers: [
		GitHub({
			clientId: process.env.GITHUB_ID,
			clientSecret: process.env.GITHUB_SECRET,
			authorization: {
				params: {
					scope: "repo user:email", // repo 权限用于访问私有仓库，user:email 用于获取用户信息
				},
			},
		}),
	],
	callbacks: {
		authorized({ auth, request: { nextUrl } }) {
			const isLoggedIn = !!auth?.user;
			const isOnDashboardArea = nextUrl.pathname.startsWith("/dashboard");
			const isOnLoginPage = nextUrl.pathname.startsWith("/dashboard/login");

			if (isOnDashboardArea && !isOnLoginPage) {
				// This is a protected route.
				// If the user is not logged in, redirect them to the login page.
				if (!isLoggedIn) {
					return false; // Redirects to login page
				}
			} else if (isLoggedIn && isOnLoginPage) {
				// If the user is logged in and tries to access the login page,
				// redirect them to the dashboard.
				return Response.redirect(new URL("/dashboard", nextUrl));
			}

			// For all other cases (e.g., public pages, or unauthenticated user on login page),
			// allow access.
			return true;
		},
		async session({ session, token }) {
			// Add user id and other token fields to the session
			if (token.id && session.user) {
				session.user.id = token.id;
			}
			// 如需在客户端显示连接状态，可选择性暴露（不用于前端直接调用 GitHub）
			// @ts-expect-error custom field
			session.githubAccessToken = token.githubAccessToken as string | undefined;
			return session;
		},
		async jwt({ token, user, account }) {
			// 首次登录时，使用 GitHub 的稳定 ID
			if (account?.provider === "github" && account.providerAccountId) {
				const githubUserId = `github_${account.providerAccountId}`;
				token.id = githubUserId;

				// 检查数据库中是否已存在该 GitHub 用户
				try {
					const existingUser = await prisma.user.findUnique({
						where: { id: githubUserId },
					});

					if (!existingUser) {
						// 创建新用户记录
						await prisma.user.create({
							data: {
								id: githubUserId,
								name: user?.name,
								email: user?.email,
								image: user?.image,
							},
						});
						console.log("Created new GitHub user in database:", githubUserId);
					} else {
						console.log("Found existing GitHub user in database:", githubUserId);
					}
				} catch (error) {
					console.error("Failed to create/find GitHub user in database:", error);
				}
			}

			// 写入 OAuth 令牌到 JWT
			if (account?.provider === "github" && account.access_token) {
				token.githubAccessToken = account.access_token as string;
			}

			return token;
		},
	},
});
