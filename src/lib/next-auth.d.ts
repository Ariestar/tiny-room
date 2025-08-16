import "next-auth";

declare module "next-auth" {
	/**
	 * 扩展默认的 Session 类型
	 * 可根据需要添加自定义字段
	 */
	interface Session {
		user: {
			id?: string;
			name?: string | null;
			email?: string | null;
			image?: string | null;
			// 后续可添加自定义字段，如：
			// role?: string;
			// permissions?: string[];
		} & DefaultSession["user"];
	}

	/**
	 * 扩展默认的 User 类型
	 * 用于数据库模型
	 */
	interface User {
		// 默认字段
		id: string;
		name?: string | null;
		email?: string | null;
		image?: string | null;
		// 后续可添加自定义字段，如：
		// role?: string;
		// createdAt?: Date;
	}
}

declare module "next-auth/jwt" {
	/**
	 * 扩展默认的 JWT 类型
	 * 可添加自定义字段到 token 中
	 */
	interface JWT {
		id?: string;
		githubAccessToken?: string;
		// 后续可添加自定义字段，如：
		// role?: string;
	}
}
