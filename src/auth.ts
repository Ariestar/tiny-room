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
	providers: [
		GitHub({
			clientId: process.env.GITHUB_ID,
			clientSecret: process.env.GITHUB_SECRET,
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
			if (token.sub && session.user) {
				session.user.id = token.sub;
			}
			return session;
		},
		async jwt({ token, user }) {
			// Add user id to the JWT token on sign-in
			if (user) {
				token.id = user.id;
			}
			return token;
		},
	},
});
