"use client";

import React from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	CardFooter,
} from "@/components/ui";
import { Github } from "lucide-react";

export default function LoginPage() {
	return (
		<div className='flex items-center justify-center min-h-screen bg-gray-50'>
			<Card className='w-full max-w-md shadow-lg' variant='elevated'>
				<CardHeader className='text-center'>
					<CardTitle level={2}>登录到仪表盘</CardTitle>
					<CardDescription>使用您的 GitHub 账户进行安全登录</CardDescription>
				</CardHeader>
				<CardContent>
					<Button
						variant='primary'
						size='lg'
						className='w-full justify-start'
						onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
					>
						<Github className='mr-2 h-5 w-5' />
						<span>使用 GitHub 登录</span>
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
