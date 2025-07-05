"use client";

import { signIn } from "next-auth/react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Github } from "lucide-react";

export default function LoginPage() {
	return (
		<div className='flex items-center justify-center min-h-screen bg-gray-50'>
			<Card className='w-full max-w-sm'>
				<div className='p-8 text-center'>
					<h1 className='text-2xl font-bold mb-2'>Welcome Back</h1>
					<p className='text-gray-500 mb-6'>Sign in to access your dashboard.</p>
					<Button
						fullWidth
						size='lg'
						onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
					>
						<Github className='mr-2 h-5 w-5' />
						Sign In with GitHub
					</Button>
				</div>
			</Card>
		</div>
	);
}
