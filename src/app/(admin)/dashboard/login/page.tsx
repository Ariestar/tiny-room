"use client";

import { signIn } from "next-auth/react";
import Button from "@/components/ui/Button";
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Github } from "lucide-react";

export default function LoginPage() {
	return (
		<div className='flex items-center justify-center min-h-screen bg-background'>
			<Card className='w-full max-w-sm'>
				<CardHeader className='text-center'>
					<CardTitle>欢迎回来</CardTitle>
					<CardDescription>登录以访问您的仪表盘。</CardDescription>
				</CardHeader>
				<CardContent>
					<Button
						className='w-full'
						size='lg'
						onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
					>
						<Github className='mr-2 h-5 w-5' />
						使用 GitHub 登录
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
